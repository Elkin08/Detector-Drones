"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Device, LocationUpdate } from "@/types/location";
import io, { Socket } from "socket.io-client";

type LocationContextType = {
  devices: Map<string, Device>;
  connected: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [devices, setDevices] = useState<Map<string, Device>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Usar la misma URL que la página actual para conectar al WebSocket
    // Esto permite que funcione tanto en localhost como en red
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    const host = window.location.hostname;
    const port = window.location.port;
    const socketUrl = port
      ? `${protocol}//${host}:${port}`
      : `${protocol}//${host}`;

    const socket: Socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
    });

    socket.on("connect", () => {
      console.log(`✓ Conectado al servidor WebSocket en ${socketUrl}`);
      setConnected(true);
    });

    socket.on("location:update", (data: LocationUpdate) => {
      setDevices((prev) => {
        const updated = new Map(prev);
        const existingDevice = updated.get(data.deviceId);

        // Crear o actualizar historial de posiciones (máximo 20 últimas)
        const positionHistory = existingDevice?.positionHistory || [];
        positionHistory.push({
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp,
        });
        if (positionHistory.length > 20) {
          positionHistory.shift();
        }

        updated.set(data.deviceId, {
          id: data.deviceId,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp,
          signalStatus: "connected",
          positionHistory,
          detectionTime: existingDevice?.detectionTime || data.timestamp,
        });
        return updated;
      });
    });

    socket.on("device:signal_lost", (deviceId: string) => {
      setDevices((prev) => {
        const updated = new Map(prev);
        const device = updated.get(deviceId);
        if (device) {
          updated.set(deviceId, {
            ...device,
            signalStatus: "lost",
          });
        }
        return updated;
      });
    });

    socket.on("device:signal_reconnecting", (deviceId: string) => {
      setDevices((prev) => {
        const updated = new Map(prev);
        const device = updated.get(deviceId);
        if (device) {
          updated.set(deviceId, {
            ...device,
            signalStatus: "reconnecting",
          });
        }
        return updated;
      });
    });

    socket.on("device:connected", (deviceId: string) => {
      setDevices((prev) => {
        const updated = new Map(prev);
        const device = updated.get(deviceId);
        if (device) {
          updated.set(deviceId, {
            ...device,
            signalStatus: "connected",
          });
        }
        return updated;
      });
    });

    socket.on("device:disconnected", (deviceId: string) => {
      setDevices((prev) => {
        const updated = new Map(prev);
        const device = updated.get(deviceId);
        if (device) {
          // Conservamos última ubicación para historial y visualización de pérdida.
          updated.set(deviceId, {
            ...device,
            signalStatus: "lost",
          });
        }
        return updated;
      });
    });

    socket.on("disconnect", () => {
      console.log("✗ Desconectado del servidor WebSocket");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <LocationContext.Provider value={{ devices, connected }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation debe ser usado dentro de LocationProvider");
  }
  return context;
};
