const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// CORS abierto para pruebas; puedes restringirlo a tu dominio/app si quieres
app.use(cors());

app.get("/api/tasas", async (req, res) => {
  try {
    const response = await fetch("https://tasas.eltoque.com/v1/trmi", {
      headers: { "Authorization": `Bearer ${process.env.ELTOQUE_TOKEN}` }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "Upstream error", details: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tasas", details: err.message });
  }
});

// Healthcheck simple
app.get("/", (req, res) => res.send("Render elTOQUE proxy OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy activo en puerto ${PORT}`));
