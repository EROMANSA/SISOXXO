const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/database');
const proveedoresRoutes = require('./routes/proveedores.routes');
const listasRoutes = require('./routes/listas.routes');
const ubigeoRoutes = require('./routes/ubigeo.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const despachosRoutes = require('./routes/despachos.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/listas', listasRoutes);
app.use('/api/ubigeo', ubigeoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/despachos', despachosRoutes);


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        sistema: 'SISOXXO',
        mensaje: 'API SISOXXO funcionando correctamente'
    });
});

// Prueba de conexión a PostgreSQL
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                current_database() AS database,
                current_schema() AS schema,
                NOW() AS fecha_hora
        `);

        res.json({
            ok: true,
            mensaje: 'Conexión a PostgreSQL exitosa',
            datos: result.rows[0]
        });

    } catch (error) {
        console.error('Error de conexión a PostgreSQL:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error de conexión a PostgreSQL',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor SISOXXO ejecutándose en http://localhost:${PORT}`);
});