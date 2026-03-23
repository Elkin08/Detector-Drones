const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Socket.IO para rastreo en tiempo real
const { Server } = require("socket.io");

// Mapeo de dispositivos
const connectedDevices = new Map();
const SIGNAL_TIMEOUT = 15000;
const signalTimeouts = new Map();

nextApp
  .prepare()
  .then(() => {
    // Crear servidor HTTP simple
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    // Configurar Socket.IO
    const io = new Server(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log(`[WS] Nuevo cliente: ${socket.id}`);

      socket.on("device:register", (data) => {
        const { deviceId } = data;
        console.log(`[WS] Dispositivo registrado: ${deviceId}`);

        connectedDevices.set(deviceId, {
          socketId: socket.id,
          lastUpdate: Date.now(),
        });

        io.emit("device:connected", deviceId);

        if (signalTimeouts.has(deviceId)) {
          clearTimeout(signalTimeouts.get(deviceId));
        }
      });

      socket.on("device:location", (data) => {
        const { deviceId, latitude, longitude } = data;
        const timestamp = Date.now();

        const devInfo = connectedDevices.get(deviceId);
        if (devInfo) {
          devInfo.lastUpdate = timestamp;
        }

        if (signalTimeouts.has(deviceId)) {
          clearTimeout(signalTimeouts.get(deviceId));
        }

        io.emit("location:update", {
          deviceId,
          latitude,
          longitude,
          timestamp,
        });

        const timeout = setTimeout(() => {
          console.log(`[WS] Pérdida de señal: ${deviceId}`);
          io.emit("device:signal_lost", deviceId);
        }, SIGNAL_TIMEOUT);

        signalTimeouts.set(deviceId, timeout);
      });

      socket.on("device:disconnect_request", (data) => {
        const { deviceId } = data;
        connectedDevices.delete(deviceId);
        if (signalTimeouts.has(deviceId)) {
          clearTimeout(signalTimeouts.get(deviceId));
          signalTimeouts.delete(deviceId);
        }
        io.emit("device:disconnected", deviceId);
      });

      socket.on("disconnect", () => {
        console.log(`[WS] Cliente desconectado: ${socket.id}`);
        for (const [deviceId, devInfo] of connectedDevices.entries()) {
          if (devInfo.socketId === socket.id) {
            connectedDevices.delete(deviceId);
            io.emit("device:disconnected", deviceId);
            if (signalTimeouts.has(deviceId)) {
              clearTimeout(signalTimeouts.get(deviceId));
              signalTimeouts.delete(deviceId);
            }
            break;
          }
        }
      });
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`\n✓ SERVIDOR HTTP EJECUTÁNDOSE`);
      console.log(`✓ PC: http://localhost:${PORT}`);
      console.log(`✓ CELULAR: http://192.168.20.76:${PORT}/mobile-tracker`);
      console.log(`✓ Escuchando en TODAS las redes (0.0.0.0:${PORT})`);
      console.log(`✓ WebSocket escuchando...\n`);
    });

    server.on("error", (err) => {
      console.error("Error del servidor:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Error al preparar Next.js:", err);
    process.exit(1);
  });
