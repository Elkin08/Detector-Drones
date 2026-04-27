# Documentacion del Proyecto Detector de Drones

## 1. Introduccion

El proyecto Detector de Drones nace como una solucion de demostracion tecnica para observar, en tiempo real, el comportamiento de dispositivos moviles en un entorno de monitoreo tactico. Su diseno responde a una necesidad actual: contar con herramientas que permitan detectar, ubicar y seguir objetivos aereos o emisores moviles de forma clara, rapida y visual.

En contextos de seguridad, vigilancia perimetral y analisis operacional, no basta con saber que un objetivo existe; tambien es necesario conocer su posicion, su desplazamiento y su estado de conectividad. Este proyecto aborda esa necesidad mediante una plataforma web que integra visualizacion geoespacial, eventos en tiempo real y simulacion movil.

## 2. Contexto Teorico

### 2.1 Que es un dron

Un dron (Vehiculo Aereo No Tripulado, o UAV) es una aeronave que opera sin piloto a bordo. Puede ser controlado de forma remota o funcionar con cierto grado de autonomia. Los drones se emplean en fotografia, agricultura, inspeccion industrial, seguridad, cartografia y logistica.

Desde la perspectiva de monitoreo, un dron es un objetivo dinamico: cambia de posicion continuamente, puede entrar y salir de cobertura, y requiere mecanismos de seguimiento que combinen deteccion, localizacion y trazabilidad temporal.

### 2.2 Problema que se busca resolver

La problematica principal es la falta de visibilidad en tiempo real sobre objetivos moviles en operacion. Sin un sistema de seguimiento, es dificil responder preguntas clave:

1. Donde se encuentra el objetivo en este momento.
2. Cual ha sido su ruta de desplazamiento.
3. Si su senal sigue activa o se perdio.
4. Si se reconecto despues de una interrupcion.

El proyecto propone una solucion que centraliza esta informacion en una interfaz de mision, permitiendo interpretacion operacional inmediata.

## 3. Justificacion del Proyecto

La implementacion se realizo para validar una arquitectura ligera, moderna y extensible para monitoreo en tiempo real. En lugar de iniciar con infraestructura compleja, se priorizo un prototipo funcional que demuestre:

- Adquisicion de datos de posicion desde un cliente movil.
- Transmision de eventos en tiempo real.
- Representacion visual del estado de los objetivos.
- Flujo de trabajo reproducible en red local.

Este enfoque permite iterar rapidamente, reducir riesgo tecnico y establecer una base solida para futuras integraciones con hardware o fuentes de datos reales.

## 4. Objetivo General

Desarrollar una plataforma web de demostracion para deteccion y seguimiento de objetivos moviles en tiempo real, integrando visualizacion cartografica, manejo de estados de conectividad y comunicacion por eventos.

## 5. Objetivos Especificos

1. Construir una interfaz de control que permita observar deteccion, seguimiento y perdida de senal de forma comprensible.
2. Incorporar visualizacion en mapa para ubicar objetivos y mostrar su trayectoria reciente.
3. Implementar un emisor movil de coordenadas con identificacion estable del dispositivo.
4. Gestionar eventos de conexion, actualizacion, reconexion y desconexion en tiempo real.
5. Consolidar el estado de los objetivos en una capa centralizada para mantener consistencia en la interfaz.
6. Operar en entorno local seguro para pruebas en red LAN mediante HTTPS.
7. Mantener una estructura modular que facilite mantenimiento y evolucion del sistema.

## 6. Enfoque por Capas del Sistema

El sistema se concibe por capas para separar responsabilidades y mejorar mantenibilidad:

1. Capa de Presentacion: expone la experiencia de mision, el radar visual y el mapa de seguimiento.
2. Capa de Estado en Cliente: centraliza dispositivos detectados, estados de senal e historial reciente.
3. Capa de Comunicacion en Tiempo Real: sincroniza eventos entre emisor movil y panel de control.
4. Capa de Servidor: coordina sesiones, valida actividad periodica y difunde actualizaciones.
5. Capa de Configuracion y Entorno: soporta ejecucion, compilacion y seguridad local.

Este modelo permite desacoplar interfaz, logica y transporte de datos, facilitando pruebas y escalabilidad.

## 7. Fundamento Tecnico: Radiofrecuencia vs Redes WiFi

### 7.1 Relacion entre radiofrecuencia y WiFi

WiFi es, tecnicamente, una tecnologia que opera sobre radiofrecuencia (principalmente en 2.4 GHz y 5 GHz). Sin embargo, en monitoreo de drones, la expresion "usar radiofrecuencia" suele referirse a un enfoque mas amplio: analizar emisiones de control/telemetria en el espectro, no solo trafico de una red WiFi convencional.

### 7.2 Por que un enfoque de radiofrecuencia puede ser preferible

1. Cobertura operacional mas flexible: la deteccion por RF no depende exclusivamente de que el objetivo este asociado a una red WiFi local.
2. Deteccion pasiva: puede identificar actividad de enlaces inalambricos sin requerir autenticacion en infraestructura de red.
3. Menor dependencia de topologia de red: no exige que el escenario tenga WiFi corporativa estable o preconfigurada.
4. Mejor alineacion con escenarios tacticos: muchos drones usan enlaces propietarios o canales que no se comportan como clientes WiFi tradicionales.

### 7.3 Limites practicos

El uso de RF exige consideraciones regulatorias, calibracion de hardware y tecnicas de filtrado de ruido. Por ello, este proyecto se plantea como plataforma de software para visualizacion y seguimiento, dejando abierta la integracion futura con sensores RF especializados.

## 8. Herramientas Tecnologicas Empleadas

El proyecto utiliza un conjunto de tecnologias orientadas a tiempo real y visualizacion:

- Next.js y React para la construccion de la aplicacion web.
- TypeScript para tipado estatico y robustez del codigo.
- Socket.IO para comunicacion bidireccional en tiempo real.
- Leaflet/OpenStreetMap para representacion cartografica.
- Tailwind CSS y Framer Motion para interfaz y dinamica visual.
- Node.js para el servidor de integracion y coordinacion de eventos.
- Certificados locales para habilitar pruebas HTTPS en LAN.

La seleccion tecnologica prioriza rapidez de prototipado sin perder estructura de ingenieria.

## 9. Aporte y Solucion que Entrega el Proyecto

La solucion aporta una vista operacional unificada para monitoreo de objetivos moviles. En terminos practicos, permite:

1. Detectar y registrar objetivos activos.
2. Visualizar su ubicacion y trayectoria en un mapa.
3. Identificar estados de conectividad (activo, reconectando, perdido).
4. Mantener trazabilidad temporal para analisis de eventos.

Con ello, el proyecto transforma datos de posicion dispersos en informacion accionable para supervision tecnica.

## 10. Referencias Tecnicas Clave del Repositorio

Para soporte y mantenimiento, los artefactos mas relevantes son:

- `README.md`: resumen general del proyecto.
- `package.json`: dependencias y comandos de ejecucion.
- `server.js`: orquestacion principal de servidor y tiempo real.
- `src/pages/index.tsx`: entrada de la interfaz principal.
- `src/pages/mobile-tracker.tsx`: simulador movil de posicion.
- `src/context/LocationContext.tsx`: estado global de ubicaciones.

Estas referencias se incluyen solo como guia de orientacion tecnica, manteniendo el enfoque documental en la logica y el valor del sistema.

## 11. Conclusiones

Detector de Drones constituye una base funcional para sistemas de seguimiento en tiempo real, con enfoque modular y capacidad de evolucion. Su principal fortaleza es convertir eventos de movimiento y conectividad en una lectura visual clara para toma de decisiones operativas.

Desde una perspectiva academica y tecnica, el proyecto valida una arquitectura viable para monitoreo, y establece un punto de partida para futuras extensiones en analitica avanzada, integracion de sensores RF y despliegues productivos de mayor escala.
