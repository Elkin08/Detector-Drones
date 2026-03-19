// Generar certificados SSL autofirmados con selfsigned
// Run: node setup-ssl.js

const selfsigned = require("selfsigned");
const path = require("path");
const fs = require("fs");

const certsDir = path.join(__dirname, "certs");

// Crear directorio si no existe
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

console.log("Generando certificado SSL autofirmado con selfsigned...");

try {
  // Atributos del certificado
  const attrs = [
    {
      name: "commonName",
      value: "localhost",
    },
    {
      name: "organizationName",
      value: "Detector Drones",
    },
    {
      name: "countryName",
      value: "CO",
    },
  ];

  // Generar certificado autofirmado
  const pems = selfsigned.generate(attrs, {
    days: 365,
    keySize: 2048,
    algorithm: "sha256",
  });

  // Escribir clave privada
  fs.writeFileSync(path.join(certsDir, "key.pem"), pems.private);

  // Escribir certificado público
  fs.writeFileSync(path.join(certsDir, "cert.pem"), pems.cert);

  console.log("✓ Certificado SSL autofirmado generado correctamente");
  console.log("  📁 certs/key.pem (clave privada)");
  console.log("  📁 certs/cert.pem (certificado público)");
  console.log("");
  console.log(
    "⚠️  El navegador mostrará advertencia de seguridad: haz clic en 'Avanzado' → 'Continuar' o 'Aceptar'"
  );
} catch (err) {
  console.error("❌ Error al generar certificado:", err.message);
  process.exit(1);
}
