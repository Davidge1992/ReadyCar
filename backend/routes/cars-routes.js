const express = require('express');
const { check } = require('express-validator');

const carsControllers = require('../controllers/cars-controllers');
//Image upload helper
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

//Add new car route
router.post('/',
    fileUpload.single('image'),
    [
        check('name', 'Ingrese un nombre valido').not().isEmpty().trim(),
        check('model', 'Ingrese un modelo valido').not().isEmpty().trim(),
        check('carType', 'Ingrese un tipo de vehiculo correcto').not().isEmpty().trim(),
        check('seats', 'Ingrese número de asientos').not().isEmpty().isNumeric().trim().isInt({gt: 1, lt: 8 }),
        check('gears', 'Mencione el tipo de manejo').not().isEmpty().trim(),
        check('price', 'Ingreso un valor valido').not().isEmpty().isNumeric().trim().isFloat({gt: 0}),
        check('qt', 'Ingrese una cantidad valida').not().isEmpty().isNumeric().trim().isInt({gt: 0})
    ],
    carsControllers.postCar
);
//Get all cars
router.get('/', carsControllers.getAllCars);
//Get by Id
router.get('/:id', carsControllers.getCarById);
//Offers Cars - landing page top cars
router.get('/offers/cars', carsControllers.getOfferCars);
//Sort by Name/Model
router.get('/sort/:name', carsControllers.getCarByName);

module.exports = router;