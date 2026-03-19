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
};

export type LocationUpdate = {
  deviceId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type LocationContextType = {
  devices: Map<string, Device>;
  addOrUpdateDevice: (update: LocationUpdate) => void;
  removeDevice: (deviceId: string) => void;
  setSignalStatus: (deviceId: string, status: Device["signalStatus"]) => void;
};
