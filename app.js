// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // Asegúrate de incluir CORS

// const app = express();
// app.use(cors()); // Permitir CORS
// app.use(bodyParser.json());

// // Conexión a MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Conectado a MongoDB'))
//     .catch(err => console.error('No se pudo conectar a MongoDB', err));

// // Definición del modelo de usuario
// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
// });

// const User = mongoose.model('User', UserSchema);

// // Endpoint para registrar un usuario
// app.post('/api/auth/register', async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         const newUser = new User({ username, email, password });
//         await newUser.save();
//         res.status(201).json({ message: "Usuario registrado exitosamente" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error al registrar el usuario" });
//     }
// });

// // Iniciar el servidor
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Servidor escuchando en el puerto ${PORT}`);
// });


























// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');

// const app = express();
// app.use(cors()); // Permitir CORS
// app.use(bodyParser.json());

// // Conexión a MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Conectado a MongoDB'))
//     .catch(err => console.error('No se pudo conectar a MongoDB', err));

// // Definición del modelo de usuario
// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true }, // Asegúrate de que el correo electrónico sea único
//     password: { type: String, required: true },
// });

// const User = mongoose.model('User', UserSchema);

// // Endpoint para registrar un usuario
// app.post('/api/auth/register', async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         // Encriptar la contraseña antes de guardarla
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, email, password: hashedPassword });
//         await newUser.save();
//         res.status(201).json({ message: "Usuario registrado exitosamente" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error al registrar el usuario" });
//     }
// });

// // Endpoint para iniciar sesión
// app.post('/api/auth/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "Usuario inexistente" });
//         }

//         // Comparar la contraseña proporcionada con la almacenada
//         const match = await bcrypt.compare(password, user.password);
//         if (match) {
//             return res.status(200).json({ message: "¡Bienvenido!" });
//         } else {
//             return res.status(401).json({ message: "Contraseña incorrecta" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error al iniciar sesión" });
//     }
// });

// // Iniciar el servidor
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Servidor escuchando en el puerto ${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Asegúrate de incluir CORS
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt

const app = express();
app.use(cors()); // Permitir CORS
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err));

// Definición del modelo de usuario
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Endpoint para registrar un usuario
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
});

// Endpoint para iniciar sesión
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar la contraseña
        console.log("Contraseña ingresada:", password); // Depuración
        console.log("Contraseña almacenada:", user.password); // Depuración

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Si la autenticación es exitosa
        res.status(200).json({ message: "Bienvenido" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
