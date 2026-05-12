const crypto = require("crypto");

const droneCatalog = [
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Mini 4 Pro",
    category: "Consumo",
    description:
      "Dron ultraligero (menos de 250g) con detección de obstáculos omnidireccional y grabación de video en 4K HDR.",
    estimatedBatteryMinutes: 34,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Mavic 3 Pro",
    category: "Profesional",
    description:
      "Equipo de gama alta equipado con un sistema de triple cámara de la marca Hasselblad y grabación en resolución 5.1K.",
    estimatedBatteryMinutes: 43,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Air 3",
    category: "Consumo",
    description:
      "Dron de gama media con doble cámara (gran angular y teleobjetivo) y hasta 46 minutos de tiempo de vuelo.",
    estimatedBatteryMinutes: 46,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Avata 2",
    category: "FPV (First Person View)",
    description:
      "Dron cinemático para vuelos inmersivos con gafas de realidad virtual, cuenta con protectores de hélices integrados.",
    estimatedBatteryMinutes: 23,
  },
  {
    brand: "Autel",
    marketName: "Autel",
    model: "EVO Nano+",
    category: "Consumo",
    description:
      "Competidor directo del Mini de DJI, pesa menos de 250g y destaca por su excelente sensor para grabar con poca luz.",
    estimatedBatteryMinutes: 28,
  },
  {
    brand: "Autel",
    marketName: "Autel",
    model: "EVO Lite+",
    category: "Prosumidor",
    description:
      "Dron con un gran sensor de 1 pulgada, apertura ajustable y capacidad de grabar videos impresionantes en resolución 6k.",
    estimatedBatteryMinutes: 40,
  },
  {
    brand: "Skydio",
    marketName: "Skydio",
    model: "2+",
    category: "Acción / Deportes",
    description:
      "Famoso por tener la mejor inteligencia artificial de seguimiento automático y evasión de obstáculos del mercado.",
    estimatedBatteryMinutes: 27,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Inspire 3",
    category: "Cine Profesional",
    description:
      "Dron cinematográfico de gama ultra alta, graba en 8K y permite que una persona vuele mientras otra opera la cámara.",
    estimatedBatteryMinutes: 28,
  },
  {
    brand: "Parrot",
    marketName: "Parrot",
    model: "Anafi USA",
    category: "Empresarial / Seguridad",
    description:
      "Dron táctico diseñado para primeros auxilios e inspección, equipado con una potente cámara térmica y un zoom de 32x.",
    estimatedBatteryMinutes: 32,
  },
  {
    brand: "Ryze",
    marketName: "Ryze",
    model: "Tello",
    category: "Juguete / Educación",
    description:
      "Minidron económico ideal para aprender, fabricado con tecnología DJI y programable fácilmente con Python o Scratch.",
    estimatedBatteryMinutes: 13,
  },
  {
    brand: "BetaFPV",
    marketName: "BetaFPV",
    model: "Cetus Pro",
    category: "FPV Principiantes",
    description:
      "Un pequeño dron de carreras ideal para aprender a volar en modo manual (Acro), muy resistente a los choques en interiores.",
    estimatedBatteryMinutes: 5,
  },
  {
    brand: "Holy Stone",
    marketName: "Holy Stone",
    model: "HS720E",
    category: "Principiantes",
    description:
      "Dron asequible con GPS y cámara 4K estabilizada electrónicamente, perfecto para quienes compran su primer dron grande.",
    estimatedBatteryMinutes: 23,
  },
  {
    brand: "Potensic",
    marketName: "Potensic",
    model: "Atom",
    category: "Consumo",
    description:
      "Alternativa económica en la categoría sub-250g, incluye un estabilizador mecánico de 3 ejes y seguimiento inteligente.",
    estimatedBatteryMinutes: 32,
  },
  {
    brand: "FIMI",
    marketName: "FIMI",
    model: "X8 Mini V2",
    category: "Consumo",
    description:
      "Dron ultraligero del ecosistema Xiaomi, destaca por tener baterías de carga rápida directa mediante cable USB-C.",
    estimatedBatteryMinutes: 31,
  },
  {
    brand: "Hubsan",
    marketName: "Hubsan",
    model: "Zino Mini Pro",
    category: "Consumo",
    description:
      "Un pionero en los drones pequeños, ofreciendo memoria interna integrada y una excelente resistencia al viento.",
    estimatedBatteryMinutes: 40,
  },
  {
    brand: "PowerVision",
    marketName: "PowerVision",
    model: "PowerEgg X",
    category: "Híbrido",
    description:
      "Dron único en forma de huevo que puede aterrizar sobre el agua y también usarse como una videocámara de mano estabilizada.",
    estimatedBatteryMinutes: 30,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Mini 2 SE",
    category: "Principiantes",
    description:
      "La puerta de entrada actual al ecosistema DJI. Graba en 2.7K y ofrece la misma fiabilidad de vuelo que modelos más caros.",
    estimatedBatteryMinutes: 31,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "FPV",
    category: "FPV Híbrido",
    description:
      "Un puente entre los drones de cámara tradicionales y los de carreras. Es capaz de alcanzar los 140 km/h en segundos.",
    estimatedBatteryMinutes: 20,
  },
  {
    brand: "Autel",
    marketName: "Autel",
    model: "EVO II Pro V3",
    category: "Profesional",
    description:
      "Dron robusto diseñado para mapeo y fotografía profesional, soporta fuertes vientos y no tiene restricciones geográficas (No-Fly Zones).",
    estimatedBatteryMinutes: 40,
  },
  {
    brand: "DJI",
    marketName: "DJI",
    model: "Matrice 350 RTK",
    category: "Empresarial Pesado",
    description:
      "Plataforma industrial para cargas pesadas. Se usa en fotogrametría, rescate y operaciones nocturnas avanzadas.",
    estimatedBatteryMinutes: 55,
  },
];

const registry = new Map();

function stableHash(input) {
  return crypto
    .createHash("sha256")
    .update(String(input ?? ""))
    .digest("hex");
}

function clampBatteryLevel(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function buildDroneSpecs(profile) {
  return [
    `Categoría: ${profile.category}`,
    `Autonomía estimada: ${profile.estimatedBatteryMinutes} min`,
    `Perfil: ${profile.description}`,
  ];
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function selectDroneProfile(deviceId) {
  const hash = stableHash(deviceId);
  const index = parseInt(hash.slice(0, 8), 16) % droneCatalog.length;
  const profile = droneCatalog[index];
  return {
    ...profile,
    specs: buildDroneSpecs(profile),
  };
}

function buildAssignedName(profile, deviceId) {
  const suffix = stableHash(`${profile.model}|${deviceId}`)
    .slice(0, 4)
    .toUpperCase();
  return `${profile.marketName} ${suffix}`;
}

function resolveDeviceId(deviceId, metadata) {
  const explicitId = normalizeText(deviceId);
  if (explicitId) {
    return explicitId;
  }

  const seed = [
    metadata.userAgent || "",
    metadata.platform || "",
    metadata.language || "",
    metadata.ip || "",
    Date.now(),
  ].join("|");
  return `device_${stableHash(seed).slice(0, 12)}`;
}

function cloneRecord(record) {
  return {
    ...record,
    drone: {
      ...record.drone,
      specs: Array.isArray(record.drone.specs) ? [...record.drone.specs] : [],
    },
  };
}

function upsertDevice(input = {}) {
  const metadata = {
    userAgent: normalizeText(input.userAgent),
    platform: normalizeText(input.platform),
    language: normalizeText(input.language),
    ip: normalizeText(input.ip),
    batteryLevel: clampBatteryLevel(input.batteryLevel),
    batteryCharging:
      typeof input.batteryCharging === "boolean" ? input.batteryCharging : null,
  };
  const deviceId = resolveDeviceId(input.deviceId, metadata);
  const now = Date.now();
  const existing = registry.get(deviceId);
  const profile = existing?.drone || selectDroneProfile(deviceId);

  const record = {
    deviceId,
    assignedName:
      existing?.assignedName || buildAssignedName(profile, deviceId),
    drone: profile,
    status: "connected",
    createdAt: existing?.createdAt || now,
    lastSeenAt: now,
    userAgent: metadata.userAgent || existing?.userAgent || null,
    platform: metadata.platform || existing?.platform || null,
    language: metadata.language || existing?.language || null,
    ip: metadata.ip || existing?.ip || null,
    batteryLevel: metadata.batteryLevel ?? existing?.batteryLevel ?? null,
    batteryCharging:
      metadata.batteryCharging ?? existing?.batteryCharging ?? null,
  };

  registry.set(deviceId, record);
  return cloneRecord(record);
}

function touchDevice(deviceId, metadata = {}) {
  const key = normalizeText(deviceId);
  if (!key) {
    return null;
  }

  return upsertDevice({
    deviceId: key,
    ...metadata,
  });
}

function setDeviceStatus(deviceId, status) {
  const key = normalizeText(deviceId);
  if (!key) {
    return null;
  }

  const existing = registry.get(key);
  if (!existing) {
    return null;
  }

  const record = {
    ...existing,
    status,
    lastSeenAt: Date.now(),
  };

  registry.set(key, record);
  return cloneRecord(record);
}

function markDeviceDisconnected(deviceId) {
  return setDeviceStatus(deviceId, "lost");
}

function markDeviceReconnecting(deviceId) {
  return setDeviceStatus(deviceId, "reconnecting");
}

function markDeviceConnected(deviceId, metadata = {}) {
  const record = touchDevice(deviceId, metadata);
  if (!record) {
    return null;
  }

  const stored = registry.get(record.deviceId);
  if (!stored) {
    return record;
  }

  stored.status = "connected";
  stored.lastSeenAt = Date.now();
  registry.set(record.deviceId, stored);
  return cloneRecord(stored);
}

function getDevice(deviceId) {
  const key = normalizeText(deviceId);
  if (!key) {
    return null;
  }

  const record = registry.get(key);
  return record ? cloneRecord(record) : null;
}

function listDevices() {
  return Array.from(registry.values()).map(cloneRecord);
}

function clearDevice(deviceId) {
  const key = normalizeText(deviceId);
  if (!key) {
    return false;
  }

  return registry.delete(key);
}

module.exports = {
  droneCatalog,
  registerDevice: upsertDevice,
  touchDevice,
  setDeviceStatus,
  markDeviceConnected,
  markDeviceDisconnected,
  markDeviceReconnecting,
  getDevice,
  listDevices,
  clearDevice,
};
