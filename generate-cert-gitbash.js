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
  // Usar Git Bash que tiene OpenSSL disponible
  const gitBashPath = `${process.env.ProgramFiles}\\Git\\bin\\bash.exe`;

  if (!fs.existsSync(gitBashPath)) {
    throw new Error(
      "Git Bash no encontrado. Por favor instala Git para Windows con OpenSSL."
    );
  }

  console.log("Usando OpenSSL desde Git Bash...");

  const command = `"${gitBashPath}" -c "openssl req -x509 -newkey rsa:2048 -keyout '${keyPath}' -out '${certPath}' -days 365 -nodes -subj '/CN=localhost/O=Detector Drones/C=CO'"`;

  execSync(command, { stdio: "inherit", shell: "powershell" });

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log("✓ Certificado SSL autofirmado generado correctamente");
    console.log("  📁 certs/key.pem (clave privada)");
    console.log("  📁 certs/cert.pem (certificado público)");
    console.log("");
    console.log(
      '⚠️  El navegador mostrará advertencia de seguridad: haz clic en "Continuar"'
    );
  } else {
    throw new Error("Los archivos de certificado no se crearon");
  }
} catch (err) {
  console.error("❌ Error al generar certificado:");
  console.error("   " + err.message);
  process.exit(1);
}
