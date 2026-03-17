import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface TarjetasEmailProps {
  nombreCliente: string;
  tarjetas: Array<{
    codigoTarjeta: string;
    codigoReferencia: string;
    tipoTarjeta: string;
    precioUnitario: string;
    qrCode: string; // Base64 data URL
  }>;
  totalCompra: string;
  whatsappUrl?: string;
}

export const TarjetasEmail = ({
  nombreCliente,
  tarjetas,
  totalCompra,
  whatsappUrl = "https://wa.me/573106138120?text=Hola,%20quiero%20coordinar%20mi%20cita",
}: TarjetasEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Encabezado */}
          <Section style={header}>
            <Text style={headerTitle}>💎 ¡Gift Cards Confirmadas! ✨</Text>
            <Text style={headerSubtitle}>
              Gracias por tu compra, {nombreCliente}
            </Text>
          </Section>

          {/* Resumen de Compra */}
          <Section style={section}>
            <Text style={sectionTitle}>💳 Resumen de tus Gift Cards</Text>
            <Text style={infoText}>
              Has adquirido <strong>{tarjetas.length} gift card(s)</strong> por
              un total de <strong>{totalCompra}</strong>
            </Text>
          </Section>

          {/* AVISO IMPORTANTE */}
          <Section style={section}>
            <div style={warningBox}>
              <Text style={warningTitle}>📌 INFORMACIÓN IMPORTANTE</Text>
              <Text style={warningText}>
                <strong>Tus gift cards están en estado PENDIENTE.</strong> Para
                activarlas definitivamente:
              </Text>
              <Text style={warningText}>
                1️⃣ <strong>CONFIRMA TU PAGO:</strong> Usa el botón de WhatsApp
                abajo para confirmar tu pago
              </Text>
              <Text style={warningText}>
                2️⃣ <strong>AGENDA TU CITA:</strong> Una vez activadas, agenda tu
                cita directamente en nuestra página web GlowFinder.com
              </Text>
              <Text style={warningSubtext}>
                Tienes 24 horas para confirmar el pago o los códigos QR se
                desactivarán automáticamente.
              </Text>
            </div>
          </Section>

          {/* Recomendaciones */}
          <Section style={section}>
            <div style={recommendationsBox}>
              <Text style={recommendationsTitle}>✨ Proceso Completo</Text>
              <ul style={recommendationsList}>
                <li style={recommendationItem}>
                  <strong>1. Confirma Pago:</strong> Usa el botón de WhatsApp
                  arriba para confirmar tu pago y activar las gift cards.
                </li>
                <li style={recommendationItem}>
                  <strong>2. Agenda Cita:</strong> Una vez activadas, ve a
                  GlowFinder.com y agenda tu cita en la clínica que prefieras.
                </li>
                <li style={recommendationItem}>
                  <strong>3. Presenta QR:</strong> En tu cita, presenta el
                  código QR para canjear tu gift card por el tratamiento.
                </li>
                <li style={recommendationItem}>
                  <strong>Transferible:</strong> Puedes regalar estas gift
                  cards. Solo comparte el código QR con la persona que las
                  usará.
                  <br />
                  <br />
                  <span style={{ color: "#059669", fontWeight: "bold" }}>
                    ¡DISFRUTA TU EXPERIENCIA DE BELLEZA Y BIENESTAR!
                  </span>
                </li>
              </ul>
            </div>
          </Section>

          {/* Instrucciones de Pago */}
          <Section style={section}>
            <Text style={sectionTitle}>💳 CONFIRMAR PAGO</Text>
            <Text style={infoText}>
              Para activar tus gift cards, confirma tu pago a través de
              WhatsApp:
            </Text>
            <Button style={button} href={whatsappUrl}>
              💵 Confirmar Pago por WhatsApp
            </Button>
            <Text style={noteText}>
              ⚠️ <strong>¡IMPORTANTE!</strong> El WhatsApp es SOLO para
              confirmar el pago. Para agendar citas usa nuestra página web.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Gift Cards con QR Codes */}
          <Section style={section}>
            <Text style={sectionTitle}>💳 Tus Gift Cards</Text>
            <Text style={infoText}>
              A continuación encontrarás el detalle de cada gift card con su
              código QR único. Presenta estos códigos en la clínica para redimir
              tu tratamiento.
            </Text>
          </Section>

          {tarjetas.map((tarjeta, index) => (
            <Section key={tarjeta.codigoTarjeta} style={tarjetaCard}>
              <div style={tarjetaHeader}>
                <Text style={tarjetaNumber}>💎 Gift Card #{index + 1}</Text>
                <div style={tarjetaBadge}>{tarjeta.tipoTarjeta}</div>
              </div>

              <div style={tarjetaInfoGrid}>
                <div style={infoBlock}>
                  <Text style={infoLabel}>💰 Valor</Text>
                  <Text style={infoValue}>{tarjeta.precioUnitario}</Text>
                </div>

                <div style={infoBlock}>
                  <Text style={infoLabel}>🔑 Código</Text>
                  <Text style={infoValue}>{tarjeta.codigoTarjeta}</Text>
                </div>
              </div>

              <div style={referenceBox}>
                <Text style={referenceLabel}>📋 Código de Referencia</Text>
                <Text style={referenceValue}>{tarjeta.codigoReferencia}</Text>
              </div>
            </Section>
          ))}

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Si tienes alguna pregunta, no dudes en contactarnos por WhatsApp.
            </Text>
            <Text style={footerText}>
              <strong>¡Disfruta tu experiencia de belleza! ✨</strong>
            </Text>
            <Text style={footerSmall}>
              Este es un correo automático, por favor no respondas directamente
              a este mensaje.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TarjetasEmail;

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  background: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
  padding: "40px 30px",
  textAlign: "center" as const,
  borderRadius: "8px 8px 0 0",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const headerSubtitle = {
  color: "#f0f0f0",
  fontSize: "18px",
  margin: "0",
};

const section = {
  padding: "30px",
};

const sectionTitle = {
  color: "#0f766e",
  fontSize: "22px",
  fontWeight: "bold",
  margin: "0 0 15px 0",
};

const infoText = {
  color: "#555555",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 15px 0",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 20px",
  margin: "20px 0",
};

const noteText = {
  backgroundColor: "#f0fdfa",
  border: "1px solid #5eead4",
  borderRadius: "6px",
  color: "#134e4a",
  fontSize: "14px",
  lineHeight: "20px",
  padding: "15px",
  margin: "15px 0",
};

const divider = {
  borderColor: "#e6e6e6",
  margin: "30px 0",
};

const tarjetaCard = {
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  border: "3px solid #e91e63",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "20px",
  boxShadow: "0 4px 6px rgba(233, 30, 99, 0.1)",
};

const tarjetaHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  paddingBottom: "15px",
  borderBottom: "2px solid #e6e6e6",
};

const tarjetaNumber = {
  color: "#e91e63",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const tarjetaBadge = {
  backgroundColor: "#e91e63",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "6px 16px",
  borderRadius: "20px",
  textTransform: "uppercase" as const,
};

const tarjetaInfoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginBottom: "15px",
};

const infoBlock = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6e6e6",
  borderRadius: "8px",
  padding: "12px",
};

const infoLabel = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "600",
  margin: "0 0 6px 0",
  textTransform: "uppercase" as const,
};

const infoValue = {
  color: "#333333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const referenceBox = {
  backgroundColor: "#0f766e",
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center" as const,
};

const referenceLabel = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  opacity: 0.9,
};

const referenceValue = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  letterSpacing: "1px",
  margin: "0",
  fontFamily: "monospace",
};

const qrImage = {
  border: "3px solid #e91e63",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: "#ffffff",
};

const footer = {
  padding: "20px 30px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const footerSmall = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "15px 0 0 0",
};

const recommendationsBox = {
  backgroundColor: "#fff8e1",
  border: "2px solid #e91e63",
  borderRadius: "8px",
  padding: "20px",
};

const warningBox = {
  backgroundColor: "#f0fdfa",
  border: "3px solid #14b8a6",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(20, 184, 166, 0.2)",
};

const warningTitle = {
  color: "#0f766e",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 15px 0",
  textAlign: "center" as const,
};

const warningText = {
  color: "#134e4a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 12px 0",
  textAlign: "center" as const,
};

const warningSubtext = {
  color: "#059669",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const recommendationsTitle = {
  color: "#059669",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 15px 0",
};

const recommendationsList = {
  margin: "0",
  padding: "0 0 0 20px",
  color: "#333333",
};

const recommendationItem = {
  fontSize: "14px",
  lineHeight: "22px",
  marginBottom: "12px",
  color: "#333333",
};
