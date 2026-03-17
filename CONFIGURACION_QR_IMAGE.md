# Configuración del Campo QR_Image en Airtable

## 📋 Instrucciones para agregar el campo Attachment

Para que el sistema funcione correctamente con las nuevas URLs de imágenes QR, debes agregar un nuevo campo en tu tabla de Airtable:

### 1. Acceder a tu Base de Airtable

- Ve a: https://airtable.com
- Abre tu base: `app5u1brgBJqoxDXr`
- Abre la tabla: **Boletas**

### 2. Agregar el Campo QR_Image

1. **Haz clic en el botón "+"** a la derecha de la última columna
2. **Nombre del campo:** `QR_Image`
3. **Tipo de campo:** Selecciona **"Attachment"** (Adjunto)
4. **Haz clic en "Create field"**

### 3. Verificar la Configuración

El campo debe aparecer como una columna nueva con el ícono de clip 📎. Este campo almacenará:

- La imagen QR en formato PNG
- URL pública generada automáticamente por Airtable
- Nombre del archivo: `QR-{TipoBoleta}-{CodigoReferencia}.png`

## 🔄 Cómo Funciona

### Proceso de Creación de Boletas

1. **Generar QR Code:**
   - Se crea un QR con URL: `http://localhost:3000/verificar/{CodigoReferencia}`
   - Formato: PNG 200x200 pixels
   - Error correction: Medium (M)

2. **Guardar en Airtable:**
   - **Campo `QR_Code`** (Long text): Data URL completa en base64 para backup
   - **Campo `QR_Image`** (Attachment): Imagen PNG con URL pública de Airtable

3. **Envío de Email:**
   - Se obtiene la URL pública del attachment: `boleta.fields.QR_Image[0].url`
   - Se usa directamente en el template del email (no más attachments Content-ID)
   - Si no existe QR_Image, fallback a QR_Code

### Ventajas de este Enfoque

✅ **URLs Públicas:** Las imágenes QR son accesibles desde cualquier lugar
✅ **Sin Attachments:** El email es más liviano (solo enlaces a imágenes)
✅ **Mejor Rendimiento:** Airtable sirve las imágenes desde su CDN
✅ **Fácil Compartir:** URLs pueden usarse en WhatsApp, redes sociales, etc.
✅ **Visualización en Airtable:** Puedes ver las imágenes QR directamente en la tabla

## 📊 Estructura Actual de la Tabla Boletas

Después de agregar el campo, tu tabla tendrá **16 columnas**:

1. CodigoBoleta (Text)
2. CodigoReferencia (Text)
3. UUID_Compra (Text)
4. TipoBoleta (Text)
5. PrecioUnitario (Text)
6. NombreCompleto (Text)
7. Cedula (Text)
8. Email (Email)
9. Telefono (Phone)
10. FechaCompra (Text)
11. HoraCompra (Text)
12. EstadoPago (Single Select)
13. QR_Activo (Checkbox)
14. CorreoEnviado (Checkbox)
15. QR_Code (Long text) - Data URL base64 (backup)
16. **QR_Image (Attachment)** - ✨ NUEVO ✨

## 🧪 Probar el Sistema

### 1. Crear una Compra de Prueba

1. Abre: http://localhost:3000
2. Selecciona algunas boletas (ej: 2 Reserva)
3. Completa el formulario de comprador
4. Confirma la compra

### 2. Verificar en Airtable

1. Ve a tu tabla Boletas
2. Encuentra los registros recién creados
3. Verifica que la columna **QR_Image** tenga un archivo PNG
4. Haz clic en el archivo para ver la imagen QR
5. Haz clic derecho → "Copy link" para obtener la URL pública

### 3. Verificar el Email

1. Revisa el email enviado
2. Las imágenes QR deberían verse directamente (no como attachments)
3. Haz clic derecho en la imagen → "Copiar dirección de imagen"
4. Deberías ver una URL de Airtable (dl.airtable.com)

## 🔍 Ejemplo de URL de Airtable

Las URLs de las imágenes tendrán este formato:

```
https://dl.airtable.com/.attachments/XXXXX/YYYYY/QR-Reserva-A3X9K2L7.png
```

Estas URLs son:

- **Públicas:** Accesibles sin autenticación
- **Permanentes:** No expiran
- **CDN:** Servidas desde el CDN de Airtable para velocidad

## ⚠️ Importante

- **No borres el campo `QR_Code`:** Se mantiene como backup en base64
- **El campo debe llamarse exactamente:** `QR_Image` (sensible a mayúsculas)
- **Tipo debe ser:** Attachment (no Text, Long text ni otro tipo)

## 🆘 Troubleshooting

### Las imágenes no aparecen en los emails

1. Verifica que el campo `QR_Image` existe en Airtable
2. Verifica que el tipo sea "Attachment"
3. Revisa los logs del servidor al crear boletas
4. Verifica que los registros en Airtable tengan archivos en QR_Image

### Error al crear boletas

1. Verifica que el nombre del campo sea exactamente `QR_Image`
2. Verifica que el tipo sea "Attachment"
3. Revisa la consola del servidor para ver el error específico

## 📝 Notas Técnicas

### Código Actualizado

**`src/lib/airtable.ts`:**

- Agregado campo `QR_Image` a interfaz `BoletaData`
- Modificado `crearBoletas()` para subir attachment con data URL
- Airtable convierte automáticamente el data URL a archivo PNG

**`src/pages/api/enviar-email.ts`:**

- Eliminados attachments de Content-ID
- Ahora usa directamente: `boleta.fields.QR_Image[0].url`
- Fallback a `QR_Code` si no existe `QR_Image`

**`src/lib/email/templates/boletas-email.tsx`:**

- Sin cambios necesarios
- Las URLs se pasan directamente en `boleta.qrCode`
- El template ya maneja URLs externas correctamente
