# 🎯 Configuración de Airtable para GlowFinder

## ⚠️ IMPORTANTE: CREAR NUEVA BASE SEPARADA

**NO uses la misma base de Nirvanna Eventos.** GlowFinder necesita su propia base completamente separada.

## 📋 Paso 1: Crear Nueva Base

1. Ve a https://airtable.com/create
2. Haz clic en "Create a base"
3. Selecciona "Start from scratch"
4. Nombra la base: **"GlowFinder Gift Cards"**
5. Crea la base

## 📊 Paso 2: Configurar Tabla "GiftCards"

1. Renombra la tabla por defecto a: **"GiftCards"** (exactamente así)
2. Elimina todas las columnas existentes
3. Crea estas columnas en este orden exacto:

### Estructura de Columnas Requerida:

| Nombre Campo         | Tipo de Campo    | Configuración                                |
| -------------------- | ---------------- | -------------------------------------------- |
| **CodigoCard**       | Single line text | Primary field                                |
| **CodigoReferencia** | Single line text | -                                            |
| **UUID_Compra**      | Single line text | -                                            |
| **NombreClinica**    | Single line text | -                                            |
| **Tratamiento**      | Single line text | -                                            |
| **PrecioUnitario**   | Single line text | -                                            |
| **NombreCompleto**   | Single line text | -                                            |
| **Cedula**           | Single line text | -                                            |
| **Email**            | Email            | -                                            |
| **Telefono**         | Phone number     | -                                            |
| **FechaCompra**      | Date             | Format: MM/DD/YYYY                           |
| **HoraCompra**       | Single line text | -                                            |
| **EstadoPago**       | Single select    | Opciones: "Pendiente", "Pagado", "Cancelado" |
| **QR_Code**          | Long text        | -                                            |

## 🔑 Paso 3: Crear Personal Access Token

1. Ve a https://airtable.com/create/tokens
2. Haz clic en "Create new token"
3. Nombre del token: **"GlowFinder API"**
4. Selecciona estos permisos:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Scopes: Selecciona tu nueva base "GlowFinder Gift Cards"
6. Haz clic en "Create token"
7. **COPIA EL TOKEN** (solo se muestra una vez)

## 📋 Paso 4: Obtener Base ID

1. Ve a tu nueva base "GlowFinder Gift Cards"
2. En la URL verás algo como: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. **Copia la parte `appXXXXXXXXXXXXXX`** (eso es tu Base ID)

## ⚙️ Paso 5: Actualizar .env

Reemplaza en tu archivo `.env`:

```env
# Reemplaza con tu nuevo token
NEXT_PUBLIC_AIRTABLE_API_KEY=pat_TU_NUEVO_TOKEN_AQUI

# Reemplaza con tu nueva base ID
NEXT_PUBLIC_AIRTABLE_BASE_ID=app_TU_NUEVA_BASE_ID_AQUI
```

## ✅ Paso 6: Verificar Configuración

1. Guarda el archivo `.env`
2. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Haz una prueba de compra en http://localhost:3000

## 🚨 Errores Comunes

### Error: "Table not found"

- ✅ Verifica que la tabla se llame exactamente **"GiftCards"**
- ✅ Verifica el Base ID en el .env

### Error: "Authentication failed"

- ✅ Verifica que el token tenga los permisos correctos
- ✅ Verifica que el token no haya expirado

### Error: "Field not found"

- ✅ Verifica que todas las columnas existan con los nombres exactos
- ✅ Verifica que "CodigoCard" sea el campo primario

## 📞 Soporte

Si tienes problemas:

1. Verifica que la estructura de la tabla sea exacta
2. Asegúrate de usar una base nueva (no la de Nirvanna)
3. Verifica que el token tenga los permisos correctos

---

**💡 Recuerda:** Esta es una configuración completamente nueva y separada del sistema de eventos de Nirvanna.
