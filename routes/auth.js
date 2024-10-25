const express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcryptjs');

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error); // Imprimir el error en la consola
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message }); // Incluir el mensaje del error
    }
});

module.exports = router;
