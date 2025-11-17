// Exemplo de código inicial para server.js
const express = require("express");
const app = express();
const port = 3001; // Porta do Backend

app.get("/", (req, res) => {
  res.send("Servidor Backend Rodando!");
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
