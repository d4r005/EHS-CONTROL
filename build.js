// Genera data/normas.json a partir de data/normas.js (para Supabase, CI o consumo externo)
const fs = require("fs");
const { NORMAS } = require("./data/normas.js");
fs.writeFileSync("data/normas.json", JSON.stringify(NORMAS, null, 2));
console.log("normas.json generado:", NORMAS.length, "normas");
