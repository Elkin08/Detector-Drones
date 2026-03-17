# 📧 Configuración Anti-Spam para Emails

## Cambios Implementados en el Código

✅ **Asunto del Email**: Removidos emojis y texto más profesional

- Antes: `🎉 Tu compra de X boleta(s) - Confirmación`
- Ahora: `Confirmacion de Compra - X Boleta(s) - Nirvanna Eventos`

✅ **Formato del Remitente**: Nombre + Email

- Antes: `ticketscompra@nirvannaeventos.shop`
- Ahora: `Nirvanna Eventos <ticketscompra@nirvannaeventos.shop>`

✅ **Texto Plano**: Se agregó versión texto plano del email (requerido por proveedores)

✅ **Headers Anti-Spam**: Se agregaron tags y referencias únicas

---

## ⚠️ CONFIGURACIÓN CRÍTICA REQUERIDA EN RESEND

Para que los emails NO vayan a spam, **DEBES configurar los registros DNS** en tu dominio. Este es el paso más importante:

### 1. Verificar tu Dominio en Resend

1. Ve a tu cuenta de Resend: https://resend.com/domains
2. Haz clic en "Add Domain"
3. Ingresa: `nirvannaeventos.shop` (sin www)
4. Resend te dará 3 registros DNS que debes agregar:

#### Registros DNS Requeridos:

**SPF (Sender Policy Framework)**

```
Tipo: TXT
Nombre: @
Valor: v=spf1 include:resend.com ~all
```

**DKIM (DomainKeys Identified Mail)**

```
Tipo: TXT
Nombre: resend._domainkey
Valor: [Resend te dará este valor único]
```

**DMARC (Domain-based Message Authentication)**

```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:ticketscompra@nirvannaeventos.shop
```

### 2. Agregar los Registros en tu Proveedor de DNS

Según dónde hayas comprado tu dominio (GoDaddy, Namecheap, Cloudflare, etc.):

1. Inicia sesión en tu proveedor de dominio
2. Ve a la sección de DNS / Administración de DNS
3. Agrega los 3 registros TXT que Resend te proporcionó
4. Guarda los cambios

⏱️ **Tiempo de propagación**: 15 minutos a 48 horas (usualmente 30 min)

### 3. Verificar en Resend

1. Espera unos 15-30 minutos después de agregar los registros
2. En Resend, haz clic en "Verify" en tu dominio
3. Si aparece como "Verified" ✅, estás listo

---

## 📊 Mejoras Adicionales Recomendadas

### A. Evitar Palabras que Activan Filtros de Spam

❌ **Evita usar en el asunto o contenido:**

- Palabras con MAYÚSCULAS excesivas
- Múltiples signos de exclamación (!!!)
- Palabras como: GRATIS, URGENTE, GANADOR, PREMIO, DINERO

✅ **Usa lenguaje profesional:**

- "Confirmación de Compra"
- "Detalles de tu Pedido"
- "Información de tu Boleta"

### B. Ratio de Texto vs Imágenes

✅ El email debe tener más texto que imágenes (actualmente cumple esto)

### C. Links y URLs

✅ Asegúrate de que tu dominio www.nirvannaeventos.shop tenga certificado SSL (https://)
✅ Usa links con tu dominio, no acortadores de URLs

---

## 🧪 Pruebas de Spam

Después de configurar DNS, prueba tu email con estas herramientas:

1. **Mail Tester**: https://www.mail-tester.com/
   - Envía un email a la dirección que te dan
   - Te calificará de 0-10 (ideal: 9-10)

2. **GlockApps**: https://glockapps.com/
   - Prueba de deliverability

3. **MXToolbox**: https://mxtoolbox.com/SuperTool.aspx
   - Verifica registros SPF, DKIM, DMARC

---

## 📋 Checklist de Configuración

- [ ] Dominio verificado en Resend
- [ ] Registro SPF agregado al DNS
- [ ] Registro DKIM agregado al DNS
- [ ] Registro DMARC agregado al DNS
- [ ] Esperado 30 min para propagación
- [ ] Verificado con Mail Tester (score 8+)
- [ ] Probado enviando email de prueba
- [ ] Email llegó a bandeja de entrada (no spam)

---

## 🆘 Si Aún Va a Spam

1. **Warming del Dominio**: Envía emails gradualmente
   - Día 1-2: 10-20 emails
   - Día 3-7: 50-100 emails
   - Después: Volumen normal

2. **Pide a los Usuarios**:
   - Que marquen "No es Spam" si llega a spam
   - Que agreguen tu email a contactos
   - Que respondan el email (mejora reputación)

3. **Revisa Listas Negras**:
   - https://mxtoolbox.com/blacklists.aspx
   - Asegúrate de que tu IP no esté en blacklist

---

## 📞 Contacto Resend Support

Si tienes problemas, contacta a Resend:

- Email: support@resend.com
- Discord: https://resend.com/discord
- Docs: https://resend.com/docs

---

## 🔄 Después de Configurar

1. Reinicia el servidor de desarrollo
2. Haz una compra de prueba
3. Revisa que el email llegue a **Bandeja de Entrada** (no spam)
4. Verifica que aparezca: "Enviado por: nirvannaeventos.shop"

¡Con estos cambios, tus emails ya no deberían ir a spam! 🎉
