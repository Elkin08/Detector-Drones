import type { NextApiRequest, NextApiResponse } from "next";
import { listDevices, registerDevice } from "../../../../device-registry";

type RegisterResponse =
  | {
      ok: true;
      device: ReturnType<typeof registerDevice>;
    }
  | {
      ok: true;
      devices: ReturnType<typeof listDevices>;
    }
  | {
      ok: false;
      error: string;
    };

function getClientIp(req: NextApiRequest) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.socket.remoteAddress || "";
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method === "POST") {
    const {
      deviceId,
      userAgent,
      platform,
      language,
      batteryLevel,
      batteryCharging,
    } = req.body ?? {};
    const device = registerDevice({
      deviceId,
      userAgent: userAgent || req.headers["user-agent"] || "",
      platform: platform || req.headers["sec-ch-ua-platform"] || "",
      language: language || req.headers["accept-language"] || "",
      ip: getClientIp(req),
      batteryLevel,
      batteryCharging,
    });

    return res.status(200).json({ ok: true, device });
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, devices: listDevices() });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
