# Detector de Drones

Plataforma web de monitoreo en tiempo real para deteccion y seguimiento de objetivos moviles (simulacion de drones) con mapa, estados de senal y cliente movil emisor de ubicacion.

## Resumen de como funciona el sistema

El sistema tiene dos vistas principales que trabajan sobre el mismo servidor:

1. Panel de control: muestra detecciones, seguimiento y mapa en tiempo real.
2. Tracker movil: envia coordenadas GPS periodicamente como un dispositivo objetivo.

Flujo resumido:

1. El tracker movil se conecta por WebSocket y registra un `deviceId` estable.
2. El tracker envia ubicacion y heartbeat al servidor.
3. El servidor difunde eventos de estado y posicion al panel.
4. El panel actualiza mapa, historial de posiciones y estado de conectividad.

## Tecnologias principales

- Next.js + React + TypeScript
- Socket.IO (tiempo real)
- Leaflet + OpenStreetMap (mapa)
- Tailwind CSS + Framer Motion (interfaz)
- Node.js (servidor custom)

## Requisitos

- Node.js 18 o superior
- npm

## Uso local (misma red WiFi/LAN)

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar servidor principal:

```bash
npm run dev
```

3. Abrir panel en PC:

```text
https://localhost:3000
```

4. Abrir tracker movil en celular (misma red local):

```text
https://<IP_LOCAL_PC>:3000/mobile-tracker
```

Nota: como se usan certificados locales autofirmados, el navegador puede pedir aceptar la advertencia de seguridad.

## Uso con datos moviles usando Cloudflare Tunnel

Este modo permite usar el tracker desde internet movil (4G/5G), sin depender de estar en la misma WiFi que el PC.

### Opcion recomendada (sin certificados locales)

1. Levantar servidor HTTP simple (mantiene Socket.IO y mapa):

```bash
node server-simple.js
```

2. Instalar e iniciar Cloudflared (si no lo tienes):

```bash
winget install Cloudflare.cloudflared
```

3. Crear tunnel temporal al puerto local 3000:

```bash
cloudflared tunnel --url http://localhost:3000
```

4. Copiar la URL publica que entrega Cloudflare (ejemplo `https://abc123.trycloudflare.com`).

5. Usar esas rutas:

- Panel: `https://abc123.trycloudflare.com`
- Tracker movil: `https://abc123.trycloudflare.com/mobile-tracker`

Importante:

- Usa exactamente el mismo dominio del tunnel para panel y tracker.
- Mantener abiertos ambos procesos en el PC: servidor + cloudflared.
- WebSocket funciona por el mismo dominio del tunnel, por eso el tiempo real sigue operativo.

### Opcion alternativa (manteniendo HTTPS local)

Si deseas mantener `npm run dev` (HTTPS local), puedes exponerlo con Cloudflare, pero suele requerir configuracion adicional por certificado autofirmado. Para pruebas rapidas, la opcion recomendada es `server-simple.js`.

## Scripts utiles

- `npm run dev`: inicia servidor HTTPS principal.
- `npm run dev:next`: inicia solo Next.js (sin servidor custom de Socket.IO).
- `npm run build`: compila para produccion.
- `npm run start`: ejecuta servidor principal.
- `npm run lint`: analisis estatico.

## Archivos clave

- `server.js`: servidor HTTPS + Socket.IO.
- `server-simple.js`: servidor HTTP para pruebas simples/tunnel.
- `src/pages/index.tsx`: panel principal.
- `src/pages/mobile-tracker.tsx`: emisor movil GPS.
- `src/context/LocationContext.tsx`: estado global de ubicaciones.

## Solucion de problemas rapida

- No aparecen datos en el panel:
  Verifica que panel y tracker usen el mismo dominio y mismo puerto.

- En movil no conecta por LAN:
  Asegura que el celular y el PC esten en la misma red, o usa Cloudflare Tunnel.

- Error de certificado en movil:
  Acepta el certificado autofirmado o usa `server-simple.js` con Cloudflare Tunnel.
