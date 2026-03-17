import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

// Configurar Airtable
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);
const tabla = base("tblkByOqYfZi1yy6A"); // Tabla de Gift Cards

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Método no permitido" });
  }

  const { codigo } = req.body;

  if (!codigo) {
    return res
      .status(400)
      .json({ success: false, message: "Código requerido" });
  }

  try {
    // Buscar el código en Airtable
    const records = await tabla
      .select({
        filterByFormula: `{CodigoReferencia} = '${codigo}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "QR inválido o eliminado. Este código ya no es válido.",
      });
    }

    const record = records[0];
    const fields = record.fields;

    // Formatear la información de la gift card (sin importar el estado)
    const giftCardInfo = {
      codigoCard: fields.CodigoCard,
      codigoReferencia: fields.CodigoReferencia,
      nombreClinica: fields.NombreClinica,
      tratamiento: fields.Tratamiento,
      precioUnitario: `$${String(fields.PrecioUnitario).replace(/^\$+/, "")}`,
      nombreCompleto: fields.NombreCompleto,
      cedula: fields.Cedula,
      email: fields.Email,
      telefono: fields.Telefono,
      fechaCompra: fields.FechaCompra,
      horaCompra: fields.HoraCompra,
      estadoPago: fields.EstadoPago,
      qrActivo: fields.QR_Activo,
    };

    // Mensaje dinámico basado en el estado
    let message = "Gift card verificada exitosamente";
    if (!fields.QR_Activo) {
      message = "Gift card encontrada - Estado: Inactiva";
    } else if (fields.EstadoPago !== "Pagado") {
      message = "Gift card encontrada - Pago pendiente";
    }

    return res.status(200).json({
      success: true,
      message,
      giftCard: giftCardInfo,
    });
  } catch (error) {
    console.error("Error al verificar código:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor. Por favor, intenta nuevamente.",
    });
  }
}
