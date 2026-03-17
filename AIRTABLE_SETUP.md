# Configuración de Airtable para Sistema de Boletas

## 📋 Estructura: UN REGISTRO POR CADA BOLETA

La tabla **"Boletas"** almacena un registro individual por cada boleta comprada.

### Columnas necesarias (15 columnas):

| #   | Nombre de Columna | Tipo de Campo    | Descripción                               |
| --- | ----------------- | ---------------- | ----------------------------------------- |
| 1   | CodigoBoleta      | Single line text | Código único (BOL-20241120-1234)          |
| 2   | CodigoReferencia  | Single line text | Código corto alfanumérico (A3X9K2L7)      |
| 3   | UUID_Compra       | Single line text | Agrupa boletas de la misma transacción    |
| 4   | TipoBoleta        | Single line text | Reserva / Normal / Palco VIP              |
| 5   | PrecioUnitario    | Single line text | $30,000 / $60,000 / $1,000,000            |
| 6   | NombreCompleto    | Single line text | Nombre completo del comprador             |
| 7   | Cedula            | Single line text | Número de cédula                          |
| 8   | Email             | Email            | Correo electrónico                        |
| 9   | Telefono          | Phone number     | Teléfono de contacto                      |
| 10  | FechaCompra       | Single line text | Fecha de compra (DD/MM/YYYY)              |
| 11  | HoraCompra        | Single line text | Hora de compra (HH:MM AM/PM)              |
| 12  | EstadoPago        | Single select    | Pendiente / Pagado / Cancelado / Expirado |
| 13  | QR_Activo         | Checkbox         | Si la boleta está activa para usar        |
| 14  | CorreoEnviado     | Checkbox         | Si se envió el correo con la boleta       |
| 15  | QR_Code           | Long text        | Código QR en formato data URL (base64)    |

## 🚀 Configuración Paso a Paso

### Paso 1: Crear Base en Airtable

1. Ve a https://airtable.com
2. Crea una nueva base: **"Sistema Boletas"**
3. Crea una tabla: **"Boletas"** (exacto, con mayúscula)

### Paso 2: Crear las 15 Columnas

**IMPORTANTE:** Los nombres deben ser exactos, respetando mayúsculas y minúsculas.

#### EstadoPago (Single Select) - Configurar opciones:

- `Pendiente` (amarillo) - Default
- `Pagado` (verde)
- `Cancelado` (rojo)
- `Expirado` (gris)

### Paso 3: Obtener Credenciales

**API Key:**

1. https://airtable.com/account
2. Sección "API" → Copia tu API key
3. Formato: `keyABC123XYZ789`

**Base ID:**

1. Abre tu base en el navegador
2. URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. Copia lo que empieza con `app`

### Paso 4: Configurar `.env.local`

Edita el archivo en la raíz del proyecto:

```env
NEXT_PUBLIC_AIRTABLE_API_KEY=keyABC123XYZ789
NEXT_PUBLIC_AIRTABLE_BASE_ID=appDEF456UVW012
```

### Paso 5: Reiniciar Servidor

```bash
npm run dev
```

## 📊 Ejemplo: Compra de 3 Boletas

**Cliente compra:** 2 Reserva + 1 Normal

**Resultado:** Se crean 3 registros en Airtable:

### Registro 1:

```
CodigoBoleta: BOL-20241120-5432
CodigoReferencia: A3X9K2L7
UUID_Compra: UUID-1700512345-abc123
TipoBoleta: Reserva
PrecioUnitario: $30,000
NombreCompleto: Juan Pérez
Cedula: 1234567890
Email: juan@example.com
Telefono: +573001234567
FechaCompra: 20/11/2024
HoraCompra: 03:45 PM
EstadoPago: Pendiente
QR_Activo: ✓
CorreoEnviado: ☐
QR_Code: data:image/png;base64,iVBOR...
```

### Registro 2:

```
CodigoBoleta: BOL-20241120-5433
CodigoReferencia: B7Y2M4K9
UUID_Compra: UUID-1700512345-abc123  ← Mismo UUID
TipoBoleta: Reserva
PrecioUnitario: $30,000
(Mismos datos del comprador)
```

### Registro 3:

```
CodigoBoleta: BOL-20241120-5434
CodigoReferencia: C5Z8N3P1
UUID_Compra: UUID-1700512345-abc123  ← Mismo UUID
TipoBoleta: Normal
PrecioUnitario: $60,000
(Mismos datos del comprador)
```

## 🎯 Ventajas

✅ **1 Boleta = 1 QR único** - Escaneo individual
✅ **Control granular** - Activar/desactivar cada boleta
✅ **Fácil validación** - Escanear QR en la entrada
✅ **Agrupar por UUID_Compra** - Ver compras completas
✅ **Filtros flexibles** - Por tipo, comprador, fecha, etc.
✅ **Prevención de fraude** - Cada QR es único

## 📈 Vistas Recomendadas

### Vista "Todas las Boletas"

- Sin filtros
- Ordenar: FechaCompra (↓)
- Agrupar por: TipoBoleta

### Vista "Activas y Pagadas"

```
EstadoPago = "Pagado" AND QR_Activo = TRUE
```

### Vista "Pendientes de Pago"

```
EstadoPago = "Pendiente"
```

Ordenar: FechaCompra (↓)

### Vista "Por Comprador"

- Agrupar por: Cedula
- Ver cuántas boletas compró cada persona

### Vista "Por Compra"

- Agrupar por: UUID_Compra
- Ver todas las boletas de cada transacción

## 📱 Contenido del QR Code

Cada QR contiene (en JSON):

```json
{
  "codigo": "BOL-20241120-5432",
  "referencia": "A3X9K2L7",
  "tipo": "Reserva",
  "precio": "$30,000",
  "comprador": "Juan Pérez",
  "cedula": "1234567890",
  "email": "juan@example.com",
  "uuid_compra": "UUID-1700512345-abc123",
  "fecha": "20/11/2024",
  "hora": "03:45 PM"
}
```

## ⚠️ Importante

- **Nombres de columnas exactos** - Si cambias nombres, la integración falla
- **QR_Code debe ser "Long text"** - El código base64 es muy largo
- **UUID_Compra agrupa boletas** - Todas las boletas de una compra comparten el mismo UUID
- **CodigoBoleta único** - Cada boleta tiene su propio código y QR

## 🔧 Troubleshooting

**Error: NOT_FOUND**

- ✓ Tabla se llama exactamente "Boletas"
- ✓ Base ID correcto en `.env.local`

**Error: 422**

- ✓ Las 15 columnas existen
- ✓ Nombres de columnas exactos
- ✓ Tipos de campos correctos

**Error: 401/403**

- ✓ API Key correcta
- ✓ Permisos de escritura en la base

## 💡 Tips

1. **Exportar ventas:** Filtra por fecha y exporta a Excel
2. **Control de entrada:** Vista "Activas y Pagadas" en tablet
3. **Marcar como usada:** Desmarca `QR_Activo` al escanear
4. **Enviar boletas:** Marca `CorreoEnviado` después de enviar email
5. **Reportes:** Usa fórmulas de Airtable para contar por tipo
