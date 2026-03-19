const selfsigned = require("selfsigned");

const attrs = [
  {
    name: "commonName",
    value: "localhost",
  },
];

// Prueba 1: sin opciones
console.log("Prueba 1: sin opciones");
try {
  const result1 = selfsigned.generate(attrs);
  console.log("  Resultado tipo:", typeof result1);
  console.log("  Es Array?", Array.isArray(result1));
  console.log("  Propiedades:", Object.keys(result1));
  if (Array.isArray(result1) && result1.length > 0) {
    console.log("  Array[0] propiedades:", Object.keys(result1[0]));
  }
} catch (e) {
  console.error("  Error:", e.message);
}

// Prueba 2: con callback
console.log("\nPrueba 2: con callback");
try {
  selfsigned.generate(attrs, {}, (err, pems) => {
    if (err) {
      console.error("  Error:", err.message);
    } else {
      console.log("  Callback propiedades:", Object.keys(pems));
      if (pems.private)
        console.log("  Private key:", pems.private.substring(0, 50) + "...");
    }
  });
} catch (e) {
  console.error("  Error:", e.message);
}
