import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "@/context/LocationContext";

// Arreglar iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MarkerRef {
  deviceId: string;
  marker: L.Marker;
}

export const MapViewer = () => {
  const { devices } = useLocation();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const circlesRef = useRef<Map<string, L.Circle>>(new Map());
  const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian los dispositivos
  useEffect(() => {
    if (!mapRef.current) return;

    const deviceIds = new Set(devices.keys());
    const markerIds = new Set(markersRef.current.keys());

    // Remover marcadores, círculos y polilíneas de dispositivos desconectados
    markerIds.forEach((markerId) => {
      if (!deviceIds.has(markerId)) {
        // Remover marcador
        const marker = markersRef.current.get(markerId);
        if (marker) {
          mapRef.current?.removeLayer(marker);
          markersRef.current.delete(markerId);
        }

        // Remover círculo
        const circle = circlesRef.current.get(markerId);
        if (circle) {
          mapRef.current?.removeLayer(circle);
          circlesRef.current.delete(markerId);
        }

        // Remover polilínea
        const polyline = polylinesRef.current.get(markerId);
        if (polyline) {
          mapRef.current?.removeLayer(polyline);
          polylinesRef.current.delete(markerId);
        }
      }
    });

    // Agregar o actualizar marcadores, círculos y recorridos
    devices.forEach((device) => {
      const existingMarker = markersRef.current.get(device.id);

      // Color basado en estado de señal
      const color =
        device.signalStatus === "connected"
          ? "#06b6d4" // cyan para conectado
          : device.signalStatus === "lost"
            ? "#ef4444" // rojo para pérdida de señal
            : "#f59e0b"; // ámbar para reconectando

      const icon = L.divIcon({
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px ${color}40;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        className: "custom-marker",
      });

      if (existingMarker) {
        // Actualizar posición
        existingMarker.setLatLng([device.latitude, device.longitude]);
        existingMarker.setIcon(icon);
      } else {
        // Crear nuevo marcador
        const marker = L.marker([device.latitude, device.longitude], {
          icon,
        })
          .bindPopup(
            `<div style="font-family: monospace;">
              <strong>Dron ${device.id.slice(0, 8)}</strong><br/>
              Lat: ${device.latitude.toFixed(6)}<br/>
              Lng: ${device.longitude.toFixed(6)}<br/>
              Estado: <span style="color: ${color}; font-weight: bold;">${device.signalStatus}</span>
            </div>`
          )
          .addTo(mapRef.current!);

        markersRef.current.set(device.id, marker);
      }

      // Agregar o actualizar círculo de ubicación (área aproximada - 50 metros)
      const existingCircle = circlesRef.current.get(device.id);
      if (existingCircle) {
        existingCircle.setLatLng([device.latitude, device.longitude]);
      } else {
        const circle = L.circle([device.latitude, device.longitude], {
          radius: 50, // 50 metros de radio
          color: color,
          fillColor: color,
          fillOpacity: 0.1,
          weight: 2,
          dashArray: "5, 5",
        }).addTo(mapRef.current!);

        circlesRef.current.set(device.id, circle);
      }

      // Agregar o actualizar polilínea con el recorrido
      if (device.positionHistory && device.positionHistory.length > 1) {
        const latlngs = device.positionHistory.map((p) => [
          p.latitude,
          p.longitude,
        ]) as [number, number][];

        const existingPolyline = polylinesRef.current.get(device.id);
        if (existingPolyline) {
          existingPolyline.setLatLngs(latlngs);
        } else {
          const polyline = L.polyline(latlngs, {
            color: color,
            weight: 2,
            opacity: 0.6,
            smoothFactor: 1,
          }).addTo(mapRef.current!);

          polylinesRef.current.set(device.id, polyline);
        }
      }
    });

    // Ajustar vista del mapa si hay dispositivos
    if (devices.size > 0 && mapRef.current) {
      const bounds = L.latLngBounds(
        Array.from(devices.values()).map((d) => [d.latitude, d.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [devices]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cyan-500/30">
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      />
      {devices.size === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur">
          <p className="text-center text-sm text-zinc-400">
            Esperando conexión de dispositivos...
          </p>
        </div>
      )}
    </div>
  );
};
