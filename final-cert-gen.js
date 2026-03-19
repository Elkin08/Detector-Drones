#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

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
  // Intentar con git bash
  const gitBashPath = path.join(
    process.env.ProgramFiles || "C:\\Program Files",
    "Git",
    "bin",
    "bash.exe"
  );

  if (!fs.existsSync(gitBashPath)) {
    throw new Error(`Git Bash no encontrado en: ${gitBashPath}`);
  }

  console.log("Usando OpenSSL desde Git Bash...");

  // Convertir rutas de Windows a formato compatible con bash
  const keyPathBash = keyPath.replace(/\\/g, "/");
  const certPathBash = certPath.replace(/\\/g, "/");

  const bashScript = `#!/bin/bash
set -e
mkdir -p "$(dirname "${keyPathBash}")"
# pipe the subject data to openssl
echo -e "CO\\nDetector\\nDetectorDrones\\nlocalhost\\nlocalhost\\nDetector Drones\\n\\n\\n" | openssl req -x509 -newkey rsa:2048 -keyout "${keyPathBash}" -out "${certPathBash}" -days 365 -nodes
echo "Done"
`;

  const cmdPath = path.join(__dirname, "gen-cert.sh");
  fs.writeFileSync(cmdPath, bashScript);

  const result = spawnSync(gitBashPath, [cmdPath], {
    stdio: ["ignore", "inherit", "inherit"],
    encoding: "utf-8",
  });

  try {
    fs.unlinkSync(cmdPath);
  } catch (e) {}

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`OpenSSL falló con código: ${result.status}`);
  }

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log("\n✓ Certificado SSL autofirmado generado correctamente");
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
  if (err.stdout) console.error("STDOUT:", err.stdout);
  if (err.stderr) console.error("STDERR:", err.stderr);
  process.exit(1);
}
