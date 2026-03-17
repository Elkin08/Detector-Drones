# Configuración de Airtable para Gift Cards - GlowFinder

## ✅ TABLA DUPLICADA "GiftCards"

Tienes una tabla **"GiftCards"** duplicada de "Boletas" con el campo `CodigoCard` en lugar de `CodigoBoleta`.

## 📝 Estructura de la tabla GiftCards:

Debe tener las mismas columnas que "Boletas" pero con este cambio:

| Campo en Airtable | Qué se guarda para Gift Cards                                            |
| ----------------- | ------------------------------------------------------------------------ |
| **CodigoCard**    | Código único de la gift card (GC-1732000000-ABC123)                      |
| CodigoReferencia  | Código corto alfanumérico (A3X9K2L7)                                     |
| UUID_Compra       | Agrupa todas las gift cards de la misma compra                           |
| **TipoBoleta**    | **Nombre de la clínica + ubicación** (ej: "Radiant Glow Spa - Medellín") |
| PrecioUnitario    | Valor de la gift card ($150,000 - $225,000)                              |
| NombreCompleto    | Nombre del comprador                                                     |
| Cedula            | Cédula del comprador                                                     |
| Email             | Email del comprador                                                      |
| Telefono          | Teléfono del comprador                                                   |
| FechaCompra       | Fecha de la compra                                                       |
| HoraCompra        | Hora de la compra                                                        |
| **EstadoPago**    | **"Pagado"** (las gift cards se marcan como pagadas automáticamente)     |
| QR_Activo         | true (la gift card está activa)                                          |
| CorreoEnviado     | false (se marca true cuando se envía el email)                           |
| QR_Code           | Código QR en formato data URL                                            |

## ✅ YA ESTÁ LISTA

Si ya duplicaste la tabla y cambiaste `CodigoBoleta` por `CodigoCard`, el sistema funcionará automáticamente.

**Importante:** Asegúrate que la tabla se llame exactamente **"GiftCards"** (con mayúsculas G y C).

## 📊 Ejemplo: Compra de 2 Gift Cards

**Cliente compra:**

- 1x Gift Card de "Radiant Glow Spa" en Medellín ($180,000)
- 1x Gift Card de "Crystal Clear Aesthetics" en Bogotá ($150,000)

**Resultado en Airtable:**

### Registro 1:

```
CodigoCard: GC-1732000000-ABC123
CodigoReferencia: A3X9K2L7
UUID_Compra: UUID-1732000000-xyz789
TipoBoleta: Radiant Glow Spa - Medellín
PrecioUnitario: $180,000
NombreCompleto: María García
Cedula: 1234567890
Email: maria@example.com
Telefono: +573001234567
FechaCompra: 27/11/2025
HoraCompra: 03:45 PM
EstadoPago: Pagado
QR_Activo: ✓
CorreoEnviado: ☐
QR_Code: data:image/png;base64,iVBOR...
```

### Registro 2:

```
CodigoCard: GC-1732000001-DEF456
CodigoReferencia: B7Y4M9N2
UUID_Compra: UUID-1732000000-xyz789 (mismo UUID)
TipoBoleta: Crystal Clear Aesthetics - Bogotá
PrecioUnitario: $150,000
NombreCompleto: María García
Cedula: 1234567890
Email: maria@example.com
Telefono: +573001234567
FechaCompra: 27/11/2025
HoraCompra: 03:45 PM
EstadoPago: Pagado
QR_Activo: ✓
CorreoEnviado: ☐
QR_Code: data:image/png;base64,iVBOR...
```

## 🔍 Separación de tablas:

- **Tabla "Boletas"** → Para eventos (campo: CodigoBoleta, prefijo "BOL-")
- **Tabla "GiftCards"** → Para gift cards (campo: CodigoCard, prefijo "GC-")

Cada tabla mantiene sus propios registros completamente separados.

## ✅ LISTO PARA PROBAR

Ya puedes probar el sistema:

1. Abre la aplicación
2. Agrega gift cards al carrito
3. Completa el formulario
4. Confirma el email
5. **Revisa tu tabla "GiftCards" en Airtable** - verás los registros creados

## 🔧 Si algo no funciona:

Abre la consola del navegador (F12) y revisa los logs. El sistema te dirá exactamente qué está pasando:

- ✅ "Gift Card creada: GC-xxx"
- ✅ "Total de gift cards creadas: X"
- ❌ Cualquier error con descripción detallada

---

**Última actualización:** 27 de noviembre de 2025
