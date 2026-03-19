// Generar certificados SSL autofirmados para desarrollo local
// Run: node generate-certs.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const certsDir = path.join(__dirname, "certs");

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

try {
  // Generar clave privada
  console.log("Generando clave privada...");
  execSync(`openssl genrsa -out "${path.join(certsDir, "key.pem")}" 2048`, {
    stdio: "inherit",
  });

  // Generar certificado autofirmado válido por 365 días
  console.log("Generando certificado autofirmado...");
  execSync(
    `openssl req -new -x509 -key "${path.join(certsDir, "key.pem")}" -out "${path.join(certsDir, "cert.pem")}" -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=192.168.20.76"`,
    { stdio: "inherit" }
  );

  console.log("✓ Certificados generados en ./certs/");
  console.log("  - certs/key.pem");
  console.log("  - certs/cert.pem");
} catch (err) {
  console.error("Error al generar certificados. ¿Tienes OpenSSL instalado?");
  console.error("Intenta instalar: choco install openssl");
  process.exit(1);
}
