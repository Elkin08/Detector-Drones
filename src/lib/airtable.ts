import Airtable from "airtable";
import QRCode from "qrcode";

// Validar que las variables de entorno estén configuradas
if (!process.env.NEXT_PUBLIC_AIRTABLE_API_KEY) {
  console.error("❌ NEXT_PUBLIC_AIRTABLE_API_KEY no está configurada");
}
if (!process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID) {
  console.error("❌ NEXT_PUBLIC_AIRTABLE_BASE_ID no está configurada");
}

// Configurar Airtable para GlowFinder
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || "");

// Nombre de la tabla (usar Table ID directo)
const GIFT_CARDS_TABLE = "tblkByOqYfZi1yy6A"; // ===============================================
// GIFT CARDS - SISTEMA PARA GLOWFINDER
// ===============================================

export interface GiftCardPurchase {
  // Datos del comprador
  cc: string;
  nombre: string;
  email: string;
  telefono: string;

  // Items de la compra
  items: Array<{
    id: string;
    clinicName: string;
    treatment: string;
    location: string;
    price: number;
    quantity: number;
  }>;

  // Total
  total: number;
}

// Generar código único de gift card
const generarCodigoCard = (): string => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `GC-${año}${mes}${dia}-${random}`;
};

// Generar UUID único para agrupar todas las gift cards de una misma compra
const generarUUID = (): string => {
  return `UUID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generar código de referencia único (alfanumérico corto)
const generarCodigoReferencia = (): string => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 8; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
};

// Generar código QR
const generarQR = async (data: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "M",
      type: "image/png",
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error("Error generando QR:", error);
    return "";
  }
};

/**
 * Crear registros de gift cards en Airtable
 * Cada gift card individual tendrá su propio registro
 */
export const crearGiftCards = async (
  purchaseData: GiftCardPurchase
): Promise<{ success: boolean; giftCards?: any[]; error?: string }> => {
  try {
    // Validar credenciales
    if (
      !process.env.NEXT_PUBLIC_AIRTABLE_API_KEY ||
      !process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
    ) {
      console.error("❌ Credenciales de Airtable no configuradas");
      return {
        success: false,
        error:
          "Configuración de Airtable incompleta. Por favor configura las credenciales.",
      };
    }

    console.log("🔍 Conectando con Airtable...");
    console.log("📊 Base ID:", process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);
    console.log("📋 Tabla:", GIFT_CARDS_TABLE);

    // UUID único para toda la compra
    const uuid_compra = generarUUID();

    // Fecha y hora
    const ahora = new Date();
    const fechaCompra = ahora.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const horaCompra = ahora.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const giftCards: any[] = [];

    // Crear UN REGISTRO por cada gift card individual
    for (const item of purchaseData.items) {
      for (let i = 0; i < item.quantity; i++) {
        const codigoGiftCard = `GC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const codigoReferencia = generarCodigoReferencia();

        // Generar QR code para la gift card
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const qrUrl = `${baseUrl}/verificar/${codigoReferencia}`;
        const qrCode = await generarQR(qrUrl);

        // Crear registro en Airtable
        const record = await base(GIFT_CARDS_TABLE).create([
          {
            fields: {
              CodigoCard: codigoGiftCard,
              CodigoReferencia: codigoReferencia,
              UUID_Compra: uuid_compra,

              // Datos de la gift card
              NombreClinica: item.clinicName,
              Tratamiento: item.treatment,
              PrecioUnitario: `$${item.price.toLocaleString("es-CO")}`,

              // Datos del comprador
              NombreCompleto: purchaseData.nombre,
              Cedula: purchaseData.cc,
              Email: purchaseData.email,
              Telefono: purchaseData.telefono,

              // Fecha y hora
              FechaCompra: fechaCompra,
              HoraCompra: horaCompra,

              // Estado
              EstadoPago: "Pendiente",
              QR_Activo: true,
              CorreoEnviado: false,

              // QR Code
              QR_Code: qrCode,
            },
          },
        ]);

        giftCards.push(record[0]);
        console.log(
          `✅ Gift Card ${giftCards.length} creada: ${codigoGiftCard} - ${item.clinicName}`
        );
      }
    }

    console.log(`🎉 Total de gift cards creadas: ${giftCards.length}`);
    console.log(`🔗 UUID de compra: ${uuid_compra}`);

    return {
      success: true,
      giftCards: giftCards,
    };
  } catch (error: any) {
    console.error("❌ Error al crear gift cards en Airtable:", error);

    // Mensajes de error específicos
    let errorMessage = "Error al crear las gift cards";

    if (error.statusCode === 404 || error.error === "NOT_FOUND") {
      errorMessage = `No se encontró la tabla 'GiftCards' en Airtable. Verifica que:\n1. La tabla 'GiftCards' existe en tu base\n2. El Base ID es correcto\n3. Tienes permisos de escritura`;
    } else if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = "Credenciales de Airtable inválidas. Verifica tu API Key";
    } else if (error.statusCode === 422) {
      errorMessage =
        "Error en la estructura de datos. Verifica que todas las columnas existen en Airtable";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// ===============================================
// MARCAR CORREO ENVIADO
// ===============================================
export const marcarCorreoEnviado = async (
  recordIds: string[]
): Promise<void> => {
  try {
    console.log(
      `📧 Marcando correo enviado para ${recordIds.length} registros...`
    );

    const updates = recordIds.map((id) => ({
      id: id,
      fields: {
        CorreoEnviado: true,
      },
    }));

    await base(GIFT_CARDS_TABLE).update(updates);
    console.log("✅ Registros actualizados - Correo marcado como enviado");
  } catch (error: any) {
    console.error("❌ Error al marcar correo enviado:", error);
    throw new Error(`Error al actualizar estado de correo: ${error.message}`);
  }
};

export default base;
