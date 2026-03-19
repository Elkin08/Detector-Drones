#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const certsDir = path.join(__dirname, "certs");

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

const keyPath = path.join(certsDir, "key.pem");
const certPath = path.join(certsDir, "cert.pem");

// Si los certificados ya existen, no regenerar
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log("✓ Certificados ya existen en certs/");
  process.exit(0);
}

console.log("Generando certificado SSL autofirmado...");

try {
  // Intentar con openssl de sistema (puede estar disponible en PATH)
  try {
    console.log("Intentando con OpenSSL del sistema...");
    execSync(
      `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=localhost/O=Detector Drones/C=CO"`,
      {
        stdio: "ignore",
        shell: true,
      }
    );

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      console.log("✓ Certificado SSL autofirmado generado correctamente");
      console.log("  📁 certs/key.pem (clave privada)");
      console.log("  📁 certs/cert.pem (certificado público)");
      console.log("");
      console.log(
        '⚠️  El navegador mostrará advertencia de seguridad: haz clic en "Continuar"'
      );
      process.exit(0);
    }
  } catch (osErr) {
    console.log("[openssl no disponible en PATH]");
  }

  // Plan B: usar selfsigned
  console.log("Generando con librería selfsigned...");
  const selfsigned = require("selfsigned");

  const attrs = [
    { name: "commonName", value: "localhost" },
    { name: "organizationName", value: "Detector Drones" },
    { name: "countryName", value: "CO" },
  ];

  // selfsigned.generate devuelve [{ private, public }] como array
  const result = selfsigned.generate(attrs, {
    days: 365,
    keySize: 2048,
    algorithm: "sha256",
  });

  let privateKey, certificate;

  if (Array.isArray(result) && result[0]) {
    const pem = result[0];
    privateKey = pem.private || pem.key;
    certificate = pem.public || pem.cert || pem.certificate;
  } else if (result.private && result.cert) {
    privateKey = result.private || result.key;
    certificate = result.cert || result.public;
  } else {
    throw new Error(
      "Formato inesperado de selfsigned.generate(): " +
        JSON.stringify(Object.keys(result))
    );
  }

  if (!privateKey || !certificate) {
    throw new Error("No se obtuvieron private key o certificate válidos");
  }

  fs.writeFileSync(keyPath, privateKey);
  fs.writeFileSync(certPath, certificate);

  console.log("✓ Certificado SSL autofirmado generado correctamente");
  console.log("  📁 certs/key.pem (clave privada)");
  console.log("  📁 certs/cert.pem (certificado público)");
  console.log("");
  console.log(
    '⚠️  El navegador mostrará advertencia de seguridad: haz clic en "Continuar"'
  );
} catch (err) {
  console.error("❌ Error al generar certificado:");
  console.error("   " + err.message);
  process.exit(1);
}
