import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/components";
import { resend, EMAIL_FROM } from "@/lib/email/client";
import { marcarCorreoEnviado } from "@/lib/airtable";
import TarjetasEmail from "@/lib/email/templates/tarjetas-email";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

type GiftCardData = {
  id: string;
  fields: {
    CodigoCard: string;
    CodigoReferencia: string;
    NombreClinica: string;
    Tratamiento: string;
    PrecioUnitario: string;
    QR_Code: string;
  };
};

type RequestBody = {
  email: string;
  nombreCliente: string;
  giftCards: GiftCardData[];
  totalCompra: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método no permitido",
    });
  }

  try {
    const { email, nombreCliente, giftCards, totalCompra } =
      req.body as RequestBody;

    // Validar datos requeridos
    if (!email || !nombreCliente || !giftCards || giftCards.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "Datos incompletos. Se requiere email, nombreCliente y giftCards",
      });
    }

    // Validar que tenemos la API key de Resend
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY no configurada");
      return res.status(500).json({
        success: false,
        error: "Servicio de email no configurado",
      });
    }

    console.log(`📧 Preparando envío de email a: ${email}`);
    console.log(`👤 Cliente: ${nombreCliente}`);
    console.log(`💳 Número de gift cards: ${giftCards.length}`);

    // Construir mensaje de WhatsApp
    const resumenGiftCards = giftCards
      .map((gc) => `${gc.fields.Tratamiento} en ${gc.fields.NombreClinica}`)
      .join(", ");

    const mensajeWhatsApp = `CONFIRMAR PAGO - Gift Cards GlowFinder

Cliente: ${nombreCliente}
Gift Cards: ${resumenGiftCards}
Total a Pagar: ${totalCompra}

IMPORTANTE: Tengo 24 horas para confirmar este pago o los codigos QR se desactivaran automaticamente.

Ya recibi el email con los codigos QR.

Podrias confirmar mi pago y activar definitivamente mis gift cards? Gracias!`;

    const numeroWhatsApp =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";
    const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Preparar attachments con los QR codes
    const attachments = giftCards.map((giftCard, idx) => {
      const base64Data = giftCard.fields.QR_Code.replace(
        /^data:image\/png;base64,/,
        ""
      );
      const clinicaName = giftCard.fields.NombreClinica.replace(/\s+/g, "-");
      return {
        filename: `GiftCard-${clinicaName}-${giftCard.fields.CodigoReferencia}.png`,
        content: base64Data,
        content_id: `qr_${idx}`,
      };
    });

    console.log(`📎 Preparando ${attachments.length} adjuntos QR...`);

    // Preparar datos para el template de tarjetas
    const giftCardsParaEmail = giftCards.map((giftCard, idx) => ({
      codigoTarjeta: giftCard.fields.CodigoCard,
      codigoReferencia: giftCard.fields.CodigoReferencia,
      tipoTarjeta: `${giftCard.fields.Tratamiento} - ${giftCard.fields.NombreClinica}`,
      precioUnitario: giftCard.fields.PrecioUnitario,
      qrCode: `cid:qr_${idx}`,
    }));

    // Renderizar template de tarjetas
    const emailHtml = await render(
      TarjetasEmail({
        nombreCliente,
        tarjetas: giftCardsParaEmail,
        totalCompra,
        whatsappUrl,
      })
    );

    // Texto plano para el email
    const emailText = `
Confirmación de Compra - GlowFinder Gift Cards

Hola ${nombreCliente},

¡Gracias por tu compra! Has adquirido ${giftCards.length} gift card(s) por un total de ${totalCompra}.

IMPORTANTE:
- Tus gift cards están listas para usar
- Presenta el código QR en la clínica correspondiente
- Cada gift card es única e intransferible
- Válida para el tratamiento específico indicado

Para coordinar tu cita, contacta por WhatsApp: ${numeroWhatsApp}

Detalles de tus gift cards:
${giftCards.map((gc, i) => `\n${i + 1}. ${gc.fields.Tratamiento} en ${gc.fields.NombreClinica} - Código: ${gc.fields.CodigoReferencia}`).join("")}

¡Disfruta tu experiencia de belleza!

GlowFinder
Tu directorio de clínicas estéticas
`;

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: `GlowFinder <${EMAIL_FROM}>`,
      to: [email],
      subject: `Gift Cards Confirmadas - ${giftCards.length} Tarjeta(s) - GlowFinder`,
      html: emailHtml,
      text: emailText,
      attachments: attachments,
      headers: {
        "X-Entity-Ref-ID": `giftcards-${Date.now()}`,
      },
      tags: [
        {
          name: "category",
          value: "confirmacion_giftcard",
        },
      ],
    });

    if (error) {
      console.error("❌ Error al enviar email:", error);
      return res.status(500).json({
        success: false,
        error: `Error al enviar email: ${error.message}`,
      });
    }

    console.log(`✅ Email enviado exitosamente. ID: ${data?.id}`);

    // Marcar en Airtable que el correo fue enviado
    try {
      const recordIds = giftCards.map((gc) => gc.id);
      await marcarCorreoEnviado(recordIds);
      console.log(
        `✅ Marcado CorreoEnviado en Airtable para ${recordIds.length} registros`
      );
    } catch (error: any) {
      console.error("⚠️ Error al marcar correo enviado en Airtable:", error);
      // No fallar la respuesta por este error, el email ya se envió
    }

    return res.status(200).json({
      success: true,
      message: `Email enviado exitosamente a ${email}`,
    });
  } catch (error: any) {
    console.error("❌ Error en API de envío de email:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error interno del servidor",
    });
  }
}
