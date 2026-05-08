import type { NextApiRequest, NextApiResponse } from "next";
import {
  getDevice,
  markDeviceDisconnected,
  markDeviceReconnecting,
} from "../../../../device-registry";

type DeviceResponse =
  | {
      ok: true;
      device: ReturnType<typeof getDevice>;
    }
  | {
      ok: true;
      device: ReturnType<typeof getDevice>;
      updated: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeviceResponse>
) {
  const { deviceId } = req.query;

  if (typeof deviceId !== "string" || !deviceId.trim()) {
    return res.status(400).json({ ok: false, error: "deviceId inválido" });
  }

  if (req.method === "GET") {
    const device = getDevice(deviceId);
    if (!device) {
      return res
        .status(404)
        .json({ ok: false, error: "Dispositivo no encontrado" });
    }

    return res.status(200).json({ ok: true, device });
  }

  if (req.method === "POST") {
    const { action } = req.body ?? {};

    if (action === "disconnect") {
      const device = markDeviceDisconnected(deviceId);
      if (!device) {
        return res
          .status(404)
          .json({ ok: false, error: "Dispositivo no encontrado" });
      }

      return res.status(200).json({ ok: true, device, updated: true });
    }

    if (action === "reconnecting") {
      const device = markDeviceReconnecting(deviceId);
      if (!device) {
        return res
          .status(404)
          .json({ ok: false, error: "Dispositivo no encontrado" });
      }

      return res.status(200).json({ ok: true, device, updated: true });
    }

    return res.status(400).json({ ok: false, error: "Acción no soportada" });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
