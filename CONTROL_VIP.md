# 🎫 Sistema de Control de Palcos VIP

## Configuración Implementada

### Límite de Palcos VIP

- **Total disponible**: 10 Palcos VIP
- **Control automático**: El sistema valida disponibilidad antes de crear boletas
- **Conteo**: Solo cuenta los Palcos VIP con estado "Pagado"

---

## Cómo Funciona

### 1. Al Generar Boletas

Cuando un cliente selecciona Palcos VIP:

- ✅ El sistema consulta cuántos VIP tienen estado "Pagado" en Airtable
- ✅ Calcula: `Disponibles = 10 - VIP_Pagados`
- ✅ Si hay disponibilidad, crea las boletas con estado "Pendiente"
- ❌ Si no hay suficientes, muestra error: _"Solo quedan X Palcos VIP disponibles"_

### 2. Boletas Pendientes (Reservadas pero no contadas)

- Las boletas VIP con estado **"Pendiente"** NO cuentan para el límite
- Esto permite que varios clientes reserven mientras completan el pago
- El cliente tiene 24 horas para pagar

### 3. Cuando Confirmas el Pago

**Pasos en Airtable:**

1. Busca las boletas del cliente por:
   - Cédula
   - Email
   - Código de Referencia
   - UUID de Compra

2. **Cambia el estado** de las boletas:
   - Selecciona el registro (o registros si son varios)
   - En la columna `EstadoPago`, cambia de "Pendiente" a **"Pagado"**

3. **Automáticamente**:
   - El sistema contará ese VIP como vendido
   - Se reducirá la disponibilidad para futuras compras

---

## Ejemplo Práctico

### Escenario 1: Primera Venta

```
Estado inicial:
- VIP Pagados: 0
- VIP Disponibles: 10

Cliente A compra 1 VIP:
- Sistema crea boleta con estado "Pendiente"
- VIP Pagados: 0 (aún no cuenta)
- VIP Disponibles: 10 (todavía)

Cliente A paga (cambias en Airtable a "Pagado"):
- VIP Pagados: 1 ✅
- VIP Disponibles: 9
```

### Escenario 2: Múltiples Reservas

```
Cliente A: 1 VIP "Pendiente"
Cliente B: 2 VIP "Pendiente"
Cliente C: 1 VIP "Pendiente"

VIP Disponibles: 10 (ninguno cuenta aún)

Cliente A paga → cambias a "Pagado"
- VIP Pagados: 1
- VIP Disponibles: 9

Cliente B NO paga (pasan 24h)
- Tú cambias manualmente a "Cancelado" o "Expirado"
- VIP Pagados: 1
- VIP Disponibles: 9

Cliente C paga → cambias a "Pagado"
- VIP Pagados: 2
- VIP Disponibles: 8
```

### Escenario 3: Límite Alcanzado

```
VIP Pagados: 10
VIP Disponibles: 0

Nuevo cliente intenta comprar VIP:
❌ "Solo quedan 0 Palcos VIP disponibles. Por favor ajusta tu selección."
```

---

## Campos en Airtable

### Campo `EstadoPago` (opciones)

- **Pendiente** (por defecto) - Boleta creada pero no pagada
- **Pagado** ✅ - Cliente completó el pago (CUENTA para el límite)
- **Cancelado** - Cliente canceló o no pagó a tiempo
- **Expirado** - Pasaron 24 horas sin pago

### Campo `TipoBoleta` (opciones)

- Reserva
- Normal
- **Palco VIP** ← Este se cuenta para el límite

---

## Gestión Manual en Airtable

### Para Confirmar un Pago

1. Ve a tu base de Airtable
2. Abre la tabla **"Boletas"**
3. Filtra por:
   - Email del cliente
   - O Cédula
   - O Código de Referencia
4. Encuentra las boletas con `EstadoPago = "Pendiente"`
5. **Cambia a "Pagado"**
6. ✅ Listo - El sistema contará automáticamente

### Para Cancelar Boletas Expiradas

1. Filtra boletas con:
   - `EstadoPago = "Pendiente"`
   - `FechaCompra` > 24 horas atrás
2. Cambia a **"Expirado"** o **"Cancelado"**
3. El QR queda desactivado automáticamente

### Vista Recomendada en Airtable

Crea una vista filtrada:

```
Nombre: "VIP - Control de Inventario"
Filtro: TipoBoleta = "Palco VIP"
Agrupar por: EstadoPago
Ordenar por: FechaCompra (más reciente primero)
```

Esto te permite ver rápidamente:

- ✅ Cuántos VIP están **Pagados** (vendidos)
- ⏳ Cuántos están **Pendientes** (reservados)
- ❌ Cuántos se **Cancelaron/Expiraron**

---

## Logs del Sistema

Cuando generas boletas, verás en la consola:

```
🎫 VIP Pagados: 3 / 10
✅ VIP Disponibles: 7
```

Si intentan comprar más de los disponibles:

```
❌ Error: Solo quedan 2 Palcos VIP disponibles. Por favor ajusta tu selección.
```

---

## Automatizaciones Opcionales (Airtable Automation)

### 1. Recordatorio de Pago Pendiente

```
Trigger: Cuando FechaCompra + 20 horas
Condición: Si EstadoPago = "Pendiente"
Acción: Enviar email recordatorio al cliente
```

### 2. Expiración Automática

```
Trigger: Cuando FechaCompra + 24 horas
Condición: Si EstadoPago = "Pendiente"
Acción: Cambiar EstadoPago a "Expirado" y QR_Activo a false
```

### 3. Notificación de Agotamiento

```
Trigger: Cuando cambia EstadoPago a "Pagado"
Condición: Si TipoBoleta = "Palco VIP" Y cuenta de Pagados >= 9
Acción: Enviarte email "¡Quedan solo X VIP disponibles!"
```

---

## Preguntas Frecuentes

**P: ¿Qué pasa si dos personas reservan el último VIP al mismo tiempo?**
R: El sistema valida en tiempo real. Solo el primero en completar la reserva lo obtiene.

**P: ¿Puedo aumentar el límite de 10 VIP?**
R: Sí, cambia la constante `MAX_VIP = 10` en el código (`src/lib/airtable.ts` línea ~97) al número que desees.

**P: ¿Los VIP cancelados vuelven a estar disponibles?**
R: Sí, automáticamente. Solo cuentan los que tienen estado "Pagado".

**P: ¿Cómo veo el inventario actual?**
R: En la consola del navegador al generar boletas, o creando una vista en Airtable que cuente los registros.

---

## Resumen Rápido

✅ **Sistema Configurado**

- Solo 10 Palcos VIP disponibles
- Validación automática antes de crear boletas
- Solo cuenta VIP con estado "Pagado"

📝 **Tu Trabajo**

- Cambiar `EstadoPago` a "Pagado" cuando confirmes el pago
- Cambiar a "Expirado" las pendientes después de 24h

🔄 **Flujo Automático**

1. Cliente reserva → Boleta "Pendiente" (NO cuenta)
2. Tú confirmas pago → Cambias a "Pagado" (SÍ cuenta)
3. Sistema reduce disponibilidad automáticamente

---

¿Necesitas ayuda? Revisa los logs en la consola del navegador o busca por mensajes que empiecen con 🎫 o ❌.
