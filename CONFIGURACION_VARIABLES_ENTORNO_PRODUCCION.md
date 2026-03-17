# 🔧 Configuración de Variables de Entorno en Producción

## ⚠️ PROBLEMA ACTUAL

Las boletas se crean correctamente pero el email no se envía porque faltan las variables de entorno en producción.

## 📋 Variables Requeridas en Producción

Debes configurar estas variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.):

### 1. RESEND_API_KEY

```
RESEND_API_KEY=re_VNy4mPQz_2pxo6MsKtYLSqxpyrJD514tx
```

**Descripción:** API Key de Resend para envío de emails
**Cómo obtenerla:** https://resend.com/api-keys

### 2. EMAIL_FROM

```
EMAIL_FROM=ticketscompra@nirvannaeventos.shop
```

**Descripción:** Email remitente verificado en Resend
**Nota:** Debes verificar tu dominio en Resend primero

### 3. NEXT_PUBLIC_AIRTABLE_API_KEY

```
NEXT_PUBLIC_AIRTABLE_API_KEY=patYjxo0j7ZMGZAqc.7532e5d9adee553aed33483ccc138ca952786edc7bee08c2312860d40455c32d
```

**Descripción:** API Key de Airtable
**Cómo obtenerla:** https://airtable.com/account

### 4. NEXT_PUBLIC_AIRTABLE_BASE_ID

```
NEXT_PUBLIC_AIRTABLE_BASE_ID=app5u1brgBJqoxDXr
```

**Descripción:** ID de tu base de Airtable

### 5. NEXT_PUBLIC_BASE_URL

```
NEXT_PUBLIC_BASE_URL=https://www.nirvannaeventos.shop
```

**Descripción:** URL base de tu sitio en producción

### 6. NEXT_PUBLIC_WHATSAPP_NUMBER

```
NEXT_PUBLIC_WHATSAPP_NUMBER=573106138120
```

**Descripción:** Número de WhatsApp para confirmaciones

---

## 🚀 Cómo Configurar en VERCEL

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto "sistema-boletas"
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable:
   - **Key:** Nombre de la variable (ejemplo: `RESEND_API_KEY`)
   - **Value:** Valor de la variable
   - **Environment:** Selecciona **Production**, **Preview**, y **Development**
5. Haz clic en **Save**
6. **IMPORTANTE:** Después de agregar todas las variables, debes hacer un **nuevo deploy**:
   - Ve a **Deployments**
   - Haz clic en los 3 puntos del último deployment
   - Selecciona **Redeploy**

---

## 🚀 Cómo Configurar en NETLIFY

1. Ve a tu sitio en Netlify: https://app.netlify.com/
2. Selecciona tu sitio
3. Ve a **Site settings** → **Environment variables**
4. Haz clic en **Add a variable**
5. Agrega cada variable con su valor
6. Guarda los cambios
7. **IMPORTANTE:** Ve a **Deploys** y haz clic en **Trigger deploy** → **Deploy site**

---

## 🚀 Cómo Configurar en OTRO HOSTING

Si usas otro servicio (Railway, Render, DigitalOcean, etc.):

1. Busca la sección de "Environment Variables" o "Secrets"
2. Agrega las 6 variables mencionadas arriba
3. Reinicia o redeploya tu aplicación

---

## ✅ Verificar que Funciona

Después de configurar las variables:

1. Espera 2-3 minutos para que el deploy termine
2. Haz una compra de prueba en tu sitio
3. Deberías recibir el email con las boletas
4. Si sigue fallando, revisa los logs:
   - **Vercel:** Ve a tu proyecto → Functions → Ver logs
   - **Netlify:** Ve a Deploys → Function logs

---

## 🔍 Logs para Debugging

Si el email sigue sin enviarse, revisa los logs de producción:

### En Vercel:

1. Ve a tu proyecto
2. Clic en **Functions** (menú lateral)
3. Busca la función `enviar-email`
4. Verás los logs de cada intento de envío

### En Netlify:

1. Ve a **Functions**
2. Busca `enviar-email`
3. Revisa los logs recientes

Los logs mostrarán exactamente qué variable falta o qué error está ocurriendo.

---

## 🆘 Troubleshooting

### Error: "RESEND_API_KEY no configurada"

- **Solución:** Agrega la variable `RESEND_API_KEY` en tu hosting
- **Redeploya** después de agregarla

### Error: "Email not verified"

- **Solución:** Verifica tu dominio en Resend
- Ve a https://resend.com/domains
- Sigue las instrucciones para verificar `nirvannaeventos.shop`

### Error: "Airtable base not found"

- **Solución:** Verifica que `NEXT_PUBLIC_AIRTABLE_BASE_ID` sea correcta
- Debe empezar con `app` (ejemplo: `app5u1brgBJqoxDXr`)

---

## 📞 Soporte

Si después de configurar todo sigue sin funcionar:

1. Revisa los logs de producción
2. Verifica que TODAS las variables estén configuradas
3. Asegúrate de haber redeployado después de agregar las variables
4. Contacta al soporte de tu hosting si el problema persiste

---

**IMPORTANTE:** NUNCA compartas tus API Keys públicamente. Las variables de entorno son privadas y solo deben estar en tu servidor de producción y en tu archivo `.env.local` local.
