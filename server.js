const fs = require("fs");
const https = require("https");
const os = require("os");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const BASE_PORT = parseInt(process.env.PORT || "3000", 10);
const MAX_PORT_RETRIES = 20;

// Socket.IO para rastreo en tiempo real
const { Server } = require("socket.io");

// Mapeo de dispositivos
const connectedDevices = new Map();
const SIGNAL_TIMEOUT = 45000;
const DISCONNECT_GRACE_MS = 20000;
const signalTimeouts = new Map();
const disconnectGraceTimeouts = new Map();

function refreshSignalTimeout(io, deviceId) {
  if (signalTimeouts.has(deviceId)) {
    clearTimeout(signalTimeouts.get(deviceId));
  }

  const timeout = setTimeout(() => {
    console.log(`[WS] Pérdida de señal: ${deviceId}`);
    io.emit("device:signal_lost", deviceId);
  }, SIGNAL_TIMEOUT);

  signalTimeouts.set(deviceId, timeout);
}

function clearDeviceTimeouts(deviceId) {
  if (signalTimeouts.has(deviceId)) {
    clearTimeout(signalTimeouts.get(deviceId));
    signalTimeouts.delete(deviceId);
  }

  if (disconnectGraceTimeouts.has(deviceId)) {
    clearTimeout(disconnectGraceTimeouts.get(deviceId));
    disconnectGraceTimeouts.delete(deviceId);
  }
}

function getLocalIPv4Addresses() {
  const nets = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses;
}

nextApp
  .prepare()
  .then(() => {
    // Leer certificados SSL
    let httpsOptions = null;
    try {
      httpsOptions = {
        key: fs.readFileSync("./certs/key.pem", "utf8"),
        cert: fs.readFileSync("./certs/cert.pem", "utf8"),
      };
      console.log("✓ Certificados SSL cargados correctamente");
    } catch (err) {
      console.error("⚠ Error al leer certificados SSL:", err.message);
      process.exit(1);
    }

    // Crear servidor HTTPS
    const server = https.createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    let currentPort = BASE_PORT;

    // Configurar Socket.IO
    const io = new Server(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log(`[WS] Nuevo cliente: ${socket.id}`);

      socket.on("device:register", (data) => {
        const { deviceId } = data;
        if (!deviceId) return;

        console.log(`[WS] Dispositivo registrado: ${deviceId}`);

        if (disconnectGraceTimeouts.has(deviceId)) {
          clearTimeout(disconnectGraceTimeouts.get(deviceId));
          disconnectGraceTimeouts.delete(deviceId);
        }

        connectedDevices.set(deviceId, {
          socketId: socket.id,
          lastUpdate: Date.now(),
        });

        io.emit("device:connected", deviceId);
        refreshSignalTimeout(io, deviceId);
      });

      socket.on("device:heartbeat", (data) => {
        const { deviceId } = data || {};
        if (!deviceId) return;

        const devInfo = connectedDevices.get(deviceId);
        if (devInfo) {
          devInfo.lastUpdate = Date.now();
        }

        refreshSignalTimeout(io, deviceId);
      });

      socket.on("device:location", (data) => {
        const { deviceId, latitude, longitude } = data;
        if (!deviceId) return;

        const timestamp = Date.now();

        const devInfo = connectedDevices.get(deviceId);
        if (devInfo) {
          devInfo.socketId = socket.id;
          devInfo.lastUpdate = timestamp;
        } else {
          connectedDevices.set(deviceId, {
            socketId: socket.id,
            lastUpdate: timestamp,
          });
        }

        io.emit("location:update", {
          deviceId,
          latitude,
          longitude,
          timestamp,
        });

        refreshSignalTimeout(io, deviceId);
      });

      socket.on("device:disconnect_request", (data) => {
        const { deviceId } = data;
        if (!deviceId) return;

        connectedDevices.delete(deviceId);
        clearDeviceTimeouts(deviceId);
        io.emit("device:disconnected", deviceId);
      });

      socket.on("disconnect", () => {
        console.log(`[WS] Cliente desconectado: ${socket.id}`);
        for (const [deviceId, devInfo] of connectedDevices.entries()) {
          if (devInfo.socketId === socket.id) {
            io.emit("device:signal_reconnecting", deviceId);

            if (disconnectGraceTimeouts.has(deviceId)) {
              clearTimeout(disconnectGraceTimeouts.get(deviceId));
            }

            const timeout = setTimeout(() => {
              const current = connectedDevices.get(deviceId);
              if (current && current.socketId === socket.id) {
                connectedDevices.delete(deviceId);
                clearDeviceTimeouts(deviceId);
                io.emit("device:disconnected", deviceId);
              }
            }, DISCONNECT_GRACE_MS);

            disconnectGraceTimeouts.set(deviceId, timeout);
            break;
          }
        }
      });
    });

    const startServer = () => {
      server.listen(currentPort, "0.0.0.0", () => {
        const localIPs = getLocalIPv4Addresses();

        console.log(`\n✓ SERVIDOR HTTPS EJECUTÁNDOSE`);
        console.log(`✓ PC: https://localhost:${currentPort}`);
        if (localIPs.length > 0) {
          for (const ip of localIPs) {
            console.log(
              `✓ CELULAR (${ip}): https://${ip}:${currentPort}/mobile-tracker`
            );
          }
        } else {
          console.log(`⚠ No se detectaron IPs de red local automáticamente`);
        }
        console.log(`✓ Escuchando en TODAS las redes (0.0.0.0:${currentPort})`);
        console.log(`✓ WebSocket escuchando...`);
        console.log(`⚠ Acepta el certificado autofirmado en el navegador\n`);
      });
    };

    startServer();

    server.on("error", (err) => {
      if (
        err &&
        err.code === "EADDRINUSE" &&
        currentPort < BASE_PORT + MAX_PORT_RETRIES
      ) {
        currentPort += 1;
        console.warn(
          `⚠ Puerto ocupado, reintentando en https://localhost:${currentPort}`
        );
        startServer();
        return;
      }
      console.error("Error del servidor:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Error al preparar Next.js:", err);
    process.exit(1);
  });
