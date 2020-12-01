const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const router = express.Router();

router.post('/register',
    [
        check('name', 'Ingrese un nombre').not().isEmpty().isLength({ min: 4 }).trim(),
        check('email', 'Ingrese un email').isEmail().not().isEmpty().isLength({ min: 6 }).normalizeEmail(),
        check('password', 'Ingrese una contraseña de al menos 6 caracteres').isLength({ min: 6 }).trim()
    ],
    usersController.registerUser
);

//Login user
router.post('/login',
    [
        check('email', 'Ingrese un mail').isEmail().not().isEmpty().isLength({ min: 6 }).normalizeEmail(),
        check('password', 'El contraseña debe tener 6 caracteres').isLength({ min: 6 }).trim()
    ],
    usersController.loginUser
);

//Change user's password
router.post('/update',
    [
        check('password', 'El contraseña debe tener 6 caracteres').isLength({ min: 6 }).trim()
    ], 
    usersController.updateUserPassword
);

module.exports = router;