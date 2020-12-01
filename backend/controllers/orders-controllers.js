const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Order = require('../models/order');
const Car = require('../models/car');
const User = require('../models/user');

//Create new Order entry
const addOrder = async ( req, res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({msg: 'Invalid inputs, please check your data.'});
    };

    const { firstName, lastName, startDate, endDate, car, customer } = req.body;

    let user;
    try{
        user = await User.findById(customer);
    }catch(err){
        console.errors(err.message);
        res.status(500).send({ msg: 'Error' });
    }

    if(!user){
        return res.status(404).json({ msg: 'No se pudo encontrar el id' });
    }

    let searchedCar;
    try{
        searchedCar = await Car.findById(car);
    }catch(err){
        console.errors(err.message);
        res.status(500).send({ msg: 'Error' });
    }

    if(!searchedCar){
        return res.status(404).json({ msg: 'NO se encontro el auto por id' });
    }

    //Calculate days and a total price for that order
    const days = Math.abs(endDate.getDate() - startDate.getDate());
    const price = (days * searchedCar.price);

    const order = new Order({
        firstName,
        lastName,
        startDate,
        endDate,
        totalDays: days,
        totalPrice: price,
        fixedPrice: price,
        name: searchedCar.name,
        model: searchedCar.model,
        image: searchedCar.image,
        isPayNow: false,
        car,
        customer
    });

    try{
        //Start Transaction
        const session = await mongoose.startSession();
        session.startTransaction();
        await order.save({session: session});
        //Push order in Users orders array
        user.orders.push(order);
        await user.save({session: session});
        //Decrement avaliable cars by one
        const newCar = await Car.findByIdAndUpdate({_id:order.car}, {$inc: {qt: -1}}) 
        await newCar.save({session: session});
        await session.commitTransaction();
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg:'Error'});
    }

    res.status(201).json({ order: order });
};

//Get all users order
const getUsersOrders = async ( req, res ) => {

    let orderByUser
    try{
        orderByUser = await User.findById(req.params.id).populate('orders');
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Error'});
    }

    if(!orderByUser|| orderByUser === 0){
        return res.status(404).json({msg: 'Sin resultados'});
    }

    res.json({ orders: orderByUser.orders.map(order => order.toObject({ getters: true })) });
};

const getOrderById = async ( req, res ) => {

    let orderById
    try{
        orderById = await Order.findById(req.params.id)
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Error'});
    }

    if(!orderById){
        return res.status(404).json({ msg: 'Orden no encontrada' });
    };

    res.json({order: orderById.toObject({ getters: true}) });
};

//Delete order
const deleteOrder = async ( req, res ) => {

    let orederToDelete
    try {
        orederToDelete = await Order.findById(req.params.id).populate('customer').populate('car');
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Server Error, could not delete order'});
    }

    if(!orederToDelete){
        return res.status(404).json({ msg: 'Could not find order for this id' });
    }

    try{
        //Start Transaction
        const session = await mongoose.startSession();
        session.startTransaction();
        const newCar = await Car.findByIdAndUpdate({_id: orederToDelete.car._id}, {$inc: {qt: 1}})
        await newCar.save({session: session});
        await orederToDelete.remove({session: session});
        orederToDelete.customer.orders.pull(orederToDelete);
        await orederToDelete.customer.save({session: session});
        await session.commitTransaction();
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Error'});
    };    

        res.status(200).json({msg: 'Orden elimidada'});
};

//Update single order price
const updatePayOption = async ( req, res ) => {

    const { isPayNow } = req.body;

    let orderToUpdate
    try{
        orderToUpdate = await Order.findById(req.params.id);
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Server Error, could not find order'});
    };

    if(!orderToUpdate){
        return res.status(404).json({ msg: 'Could not find order for this id' });
    }

    let fixedPrice = orderToUpdate.fixedPrice;
    let newTotalPrice = orderToUpdate.totalPrice;
    try{
        if(isPayNow){
            orderToUpdate.totalPrice = (newTotalPrice - (newTotalPrice/100) * 10);
        }else{
            orderToUpdate.totalPrice = fixedPrice;
        }
        orderToUpdate.isPayNow = isPayNow
        await orderToUpdate.save();
    }catch(err){
        console.error(err.message);
        res.status(500).send({msg: 'Server Error, could not update order'});
    };

    res.status(200).json({ order: orderToUpdate.toObject({ getters: true }) });
};


exports.addOrder = addOrder;
exports.deleteOrder = deleteOrder;
exports.getUsersOrders = getUsersOrders;
exports.getOrderById = getOrderById;
exports.updatePayOption = updatePayOption;
