const { createSecureServer } = require("http2");
const { createServer } = require("https");
const { readFileSync } = require("fs");
const { join } = require("path");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Cargar certificados SSL
const sslOptions = {
  key: readFileSync(join(__dirname, "certs", "key.pem")),
  cert: readFileSync(join(__dirname, "certs", "cert.pem")),
};

// Mapeo de dispositivos conectados
const connectedDevices = new Map();

// Timeout para detectar pérdida de señal (15 segundos - más tolerante)
const SIGNAL_TIMEOUT = 15000;
const signalTimeouts = new Map();

app.prepare().then(() => {
  const httpsServer = createServer(sslOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpsServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[WS] Nuevo cliente conectado: ${socket.id}`);

    // Evento: dispositivo móvil se conecta como dron
    socket.on("device:register", (data) => {
      const { deviceId } = data;
      console.log(`[WS] Dispositivo registrado: ${deviceId}`);

      connectedDevices.set(deviceId, {
        socketId: socket.id,
        lastUpdate: Date.now(),
      });

      // Broadcast: nuevo dispositivo conectado
      io.emit("device:connected", deviceId);

      // Limpiar timeout anterior si existe
      if (signalTimeouts.has(deviceId)) {
        clearTimeout(signalTimeouts.get(deviceId));
      }
    });

    // Evento: recibir ubicación del dispositivo
    socket.on("device:location", (data) => {
      const { deviceId, latitude, longitude } = data;
      const timestamp = Date.now();

      // Actualizar último tiempo conocido
      const devInfo = connectedDevices.get(deviceId);
      if (devInfo) {
        devInfo.lastUpdate = timestamp;
      }

      // Limpiar timeout anterior
      if (signalTimeouts.has(deviceId)) {
        clearTimeout(signalTimeouts.get(deviceId));
      }

      // Broadcast ubicación a todos los clientes
      io.emit("location:update", {
        deviceId,
        latitude,
        longitude,
        timestamp,
      });

      // Configurar nuevo timeout para detectar pérdida de señal
      const timeout = setTimeout(() => {
        console.log(`[WS] Pérdida de señal detectada: ${deviceId}`);
        io.emit("device:signal_lost", deviceId);

        // Intentar reconexión automática después de 30s
        const reconnectTimeout = setTimeout(() => {
          console.log(`[WS] Intento de reconexión: ${deviceId}`);
          io.emit("device:signal_reconnecting", deviceId);
        }, 30000);

        signalTimeouts.set(`${deviceId}_reconnect`, reconnectTimeout);
      }, SIGNAL_TIMEOUT);

      signalTimeouts.set(deviceId, timeout);
    });

    // Evento: dispositivo se desconecta
    socket.on("device:disconnect_request", (data) => {
      const { deviceId } = data;
      console.log(`[WS] Dispositivo desconectado: ${deviceId}`);

      connectedDevices.delete(deviceId);

      if (signalTimeouts.has(deviceId)) {
        clearTimeout(signalTimeouts.get(deviceId));
        signalTimeouts.delete(deviceId);
      }

      io.emit("device:disconnected", deviceId);
    });

    socket.on("disconnect", () => {
      console.log(`[WS] Cliente desconectado: ${socket.id}`);

      // Buscar y limpiar dispositivo asociado
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

  httpsServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`✓ Servidor HTTPS corriendo en https://localhost:${PORT}`);
    console.log(`✓ WebSocket Socket.IO escuchando conexiones...`);
    console.log(`⚠️  Acceso desde red: https://<TU_IP>:${PORT}`);
    console.log(
      `⚠️  Certificado autofirmado: accede y acepta la advertencia del navegador`
    );
  });
});
