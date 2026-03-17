import { NextApiRequest, NextApiResponse } from "next";
import { crearGiftCards } from "@/lib/airtable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const purchaseData = req.body;

    console.log("📦 Datos recibidos:", purchaseData);

    const result = await crearGiftCards(purchaseData);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      giftCards: result.giftCards,
    });
  } catch (error: any) {
    console.error("❌ Error en API:", error);
    return res.status(500).json({
      error: error.message || "Error al procesar la solicitud",
    });
  }
}
