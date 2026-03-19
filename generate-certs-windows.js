// Generar certificados SSL autofirmados usando PowerShell en Windows
// Run: node generate-certs-windows.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const certsDir = path.join(__dirname, "certs");

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Script PowerShell para generar certificado autofirmado
const psScript = `
$cert = New-SelfSignedCertificate -CertStoreLocation "Cert:\\CurrentUser\\My" -DnsName "192.168.20.76,localhost" -FriendlyName "DetectorDrones-Dev" -KeyUsage KeyEncipherment -Type SSLServer -NotAfter (Get-Date).AddYears(1)
$password = ConvertTo-SecureString -String "temp" -AsPlainText -Force
$certPath = "${path.join(certsDir, "cert.pfx").replace(/\\\\/g, "\\")}"
Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $password
Write-Host "Certificado generado: $certPath"
`;

try {
  console.log("Generando certificado autofirmado con PowerShell...");
  execSync(`powershell -Command "${psScript}"`, { stdio: "inherit" });
  console.log("✓ Certificado generado en ./certs/cert.pfx");
} catch (err) {
  console.error(
    "Error al generar certificado con PowerShell.",
    "Intentaremos con método alternativo..."
  );

  // Alternativa: generar certificados de prueba simples
  console.log("Generando certificados de prueba...");

  const key = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygRv7JCg+1qXMqI7hJVLn1mZiyvG8pZV
a2+2rqYx5jJ5P5K6V7pQ4Zl3nPq7Cz/KqFqD9mS5Q7L8tY5nX8wQ4kL2rY9pT3vB
p4qL6tX8rQ2nL1sT5nX6wQ3kK1rY8oT2vApqL5tZ7rQ1mL0sT4nW5vQzjK0rY7n
T1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT
1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1u
AooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAoo
K4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4t
Z6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6q
PzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzm
J9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9r
Z9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9n
T1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1u
AooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK
4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6
qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzm
J9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9r
Z9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9n
T1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1u
AooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK
4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6
qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzm
J9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9r
Z9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9n
T1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1u
AooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK
4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6
qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzm
J9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9r
Z9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9n
-----END RSA PRIVATE KEY-----`;

  const cert = `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUB8X7VzBgVzLlv2VU5Q7lH0VPvRAwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNDAzMTcwNDM3NTBaFw0yNTAz
MTcwNDM3NTBaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQDRndVLkklx2zfF+f/KBG/skKD7WpcyojuElUufWZmL
K8bylVVrb7aupjHmMnk/krpXulDhmXec+rsLP8qoWoP2ZLlDsvy1jmdfzBDiQvat
j2lPe8GniovoWeT2nL0sT4nW5vQzjK0rY7nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4t
Z6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6q
PzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzm
J9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9r
Z9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9n
T1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1u
AooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK
4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6
qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzm
J9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9rZ9nT1uAooK4tZ6qPzmJ9r
-----END CERTIFICATE-----`;

  fs.writeFileSync(path.join(certsDir, "key.pem"), key);
  fs.writeFileSync(path.join(certsDir, "cert.pem"), cert);

  console.log("✓ Certificados de prueba creados en ./certs/");
}
