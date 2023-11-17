const express = require('express');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const app = express();

const pool = new Pool({
    connectionString: 'postgres://lab5_gc4o_user:SNDreeQG4Idf0GUWWXkEE9uUNxEtxDLD@dpg-ckad6nugtj9c73fbn6j0-a.oregon-postgres.render.com/lab5_gc4o',
  ssl: {
    rejectUnauthorized: false, // Opción para evitar errores de autorización (NO se recomienda para entornos de producción)
  },
  });

app.use(cors());

const multiPartMiddelware = multipart({
    uploadDir: './imagenes'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tabla_archivos (
    id SERIAL PRIMARY KEY,
    nombre_archivo TEXT
  );
`;
pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla:', err);
    } else {
      console.log('Tabla creada exitosamente o ya existente');
    }
  });


  app.post('/api/subir', multiPartMiddelware, (req, res) => {
    console.log('Archivos recibidos:', req.files);

    const archivo = req.files.uploads[0];
    if (archivo) {
        const nombreArchivo = archivo.name;
        const rutaArchivoTemp = archivo.path;
        const nuevaRutaArchivo = path.join(__dirname, './imagenes', nombreArchivo);

        fs.rename(rutaArchivoTemp, nuevaRutaArchivo, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const insertQuery = 'INSERT INTO tabla_archivos (nombre_archivo) VALUES ($1)';
            const values = [nombreArchivo];

            pool.query(insertQuery, values, (dbErr, result) => {
                if (dbErr) {
                    res.status(500).json({ error: dbErr.message });
                } else {
                    res.json({ message: 'Archivo subido y datos guardados en la base de datos correctamente' });
                }
            });
        });
    } else {
        res.status(400).json({ error: 'No se encontraron archivos para subir' });
    }
});

app.get('/api/archivos', (req, res) => {
    const query = 'SELECT * FROM tabla_archivos';

    pool.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result.rows);
        }
    });
});



app.get('/', (req, res) => {
    res.send('Hola Mundo....!!!');
});

app.listen(PORT, () => { 
    console.log(`Servidor corriendo en puerto ${PORT}`)
});