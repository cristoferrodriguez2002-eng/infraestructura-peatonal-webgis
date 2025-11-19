const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// para leer JSON (incluye las fotos en base64)
app.use(express.json({ limit: '10mb' }));

// servir archivos estáticos (index.html, data, etc.)
app.use(express.static(__dirname));

// Ruta para guardar un nuevo reporte
app.post('/api/reportes', (req, res) => {
  const nuevoFeature = req.body; // viene del front

  const filePath = path.join(__dirname, 'data', 'reportes.geojson');

  // Leer el geojson actual (si no existe, se crea uno nuevo)
  fs.readFile(filePath, 'utf8', (err, data) => {
    let geojson;

    if (err) {
      // si el archivo no existe o está vacío
      geojson = { type: 'FeatureCollection', features: [] };
    } else {
      geojson = JSON.parse(data);
    }

    // Agregar el nuevo reporte
    geojson.features.push(nuevoFeature);

    // Guardar archivo
    fs.writeFile(filePath, JSON.stringify(geojson, null, 2), 'utf8', (err2) => {
      if (err2) {
        console.error('Error al guardar el archivo:', err2);
        return res.status(500).json({ ok: false, error: 'Error al guardar' });
      }
      return res.json({ ok: true });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
