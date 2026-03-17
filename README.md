# Detector de Drones

Demo visual y funcional construida con React + Next.js para simular detección y seguimiento de drones.

## Stack

- Next.js (pages router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## Ejecutar en local

```bash
npm install
npm run dev
```

App en: http://localhost:3000

## Estado actual

- Rebranding aplicado a Detector de Drones.
- Legado de gift cards, QR y Airtable removido del flujo principal.
- Home con estados de misión simulados: idle, scanning, tracking y lost.

## Siguiente fase

1. Integrar mapa real con Leaflet + OpenStreetMap.
2. Agregar Socket.IO para eventos en tiempo real.
3. Crear simulador móvil LAN para enviar posiciones.
