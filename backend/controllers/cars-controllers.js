const { validationResult } = require('express-validator');

const Car = require('../models/car');

const postCar = async ( req, res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({msg: 'Invalid inputs, please check your data.'});
    }

    const { name, model, carType, seats, gears, clima, price, qt } = req.body;
    try{
        const car = new Car({
            name,
            model,
            carType,
            seats,
            gears,
            clima,
            price,
            image: req.file.path,
            qt
        });

        const newCar = await car.save();
        res.status(201).json({ car: newCar });
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'No se pudo crear el carro'});
    };
};

const getAllCars = async ( req, res ) => {
    let cars;
    try{
        cars = await Car.find({qt: {$gt: 0}}).sort({price: 1});
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Error, vuelve a intentar'});
    }
    res.json({ cars: cars.map(car => car.toObject({ getters: true })) });
};

const getCarById = async ( req, res ) => {

    let carById;
    try{
        carById = await Car.findById(req.params.id);
    }catch(err){
        console.err(err.message);
        res.status(500).send({msg: 'Sin resultados'});
    }
    if(!carById){
        return res.status(404).json({ msg: 'Sin resultados' });
    }

    res.json({car: carById.toObject({ getters: true}) });
};

const getOfferCars = async ( req, res ) => {
    
    let offerCars;
    try{    
        offerCars = await Car.find({qt: {$gt: 0}}).sort({price: 1}).limit(3);
    }catch(err){
        console.err(err.message);
        res.status(500).send({msg: 'Sin resultados, vuelve a intentar'});
    }

    res.json({ cars: offerCars.map(car => car.toObject({ getters: true })) });
}

const getCarByName = async ( req, res ) => {

    let cars
    try{
        cars = await Car
        .find({$or: [{name: req.params.name}, {model: req.params.name}, {carType: req.params.name}], qt: {$gt: 0}}).sort({price: 1});
    }catch(err){
        console.err(err.message);
        res.status(500).send({msg: 'No se encontraron resultados'});
    }

    if(!cars){
        return res.status(404).json({ msg: 'Sin resultados' });
    }

    res.json({ cars: cars.map(car => car.toObject({ getters: true })) });
};

exports.postCar = postCar;
exports.getAllCars = getAllCars;
exports.getCarById = getCarById;
exports.getCarByName = getCarByName;
exports.getOfferCars = getOfferCars;