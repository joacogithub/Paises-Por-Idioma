const express = require('express'); // Importa ExpressJS. Más info de Express en =>https://expressjs.com/es/starter/hello-world.html
const cors = require('cors');
const jwt = require('jsonwebtoken');
const key = '1234';
const app = express();
const port = 3000;
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: key,
  database: 'api',
  connectionLimit: 5,
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log('¡Buenas bueeeenas!');
});

app.post('/registro', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT user FROM usuarios WHERE user=?', [req.body.user]);
    if (rows[0]) {
      res.json({ message: 'El usuario ya existe, ingresa un usuario nuevo' });
    } else {
      const save = await conn.query('INSERT INTO usuarios(user, password) VALUE(?,?)', [req.body.user, req.body.password]);
      res.json({ message: 'true' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al transmitir los datos' });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.post('/login', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT user, password FROM usuarios WHERE user=?', [req.body.user]);
    if (!rows[0]) {
      res.json({ message: 'Usuario o contraseña incorrectos' });
    } else {
      if (rows[0].password === req.body.password) {
        let user = req.body.user;
        let token = jwt.sign({ user }, key);
        res.json({ message: `Bienvenido ${rows[0].user}.`, status: 'ok', user: `${rows[0].user}`, token: `${token}` });
      } else {
        res.json({ message: 'Usuario o contraseña incorrectos', status: 'no' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al transmitir los datos' });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en https://localhost:${port}`);
});
