export type PositionPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type Device = {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  signalStatus: "connected" | "lost" | "reconnecting";
  positionHistory: PositionPoint[]; // Últimas 20 posiciones
  detectionTime: number; // Cuándo fue detectado primero
  // Información adicional proporcionada por el dispositivo / registro
  assignedName?: string | null;
  drone?: {
    brand?: string;
    marketName?: string;
    model?: string;
    category?: string;
    description?: string;
    estimatedBatteryMinutes?: number;
    specs?: string[];
    color?: string | null;
  } | null;
  batteryLevel?: number | null; // porcentaje 0..100
  batteryCharging?: boolean | null;
};

export type LocationUpdate = {
  deviceId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  assignedName?: string | null;
  drone?: Device["drone"];
  batteryLevel?: number | null;
  batteryCharging?: boolean | null;
};

export type LocationContextType = {
  devices: Map<string, Device>;
  addOrUpdateDevice: (update: LocationUpdate) => void;
  removeDevice: (deviceId: string) => void;
  setSignalStatus: (deviceId: string, status: Device["signalStatus"]) => void;
};
