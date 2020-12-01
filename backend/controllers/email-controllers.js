const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Order = require('../models/order');

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_user: process.env.SENDGRID_API_KEY
    }
}))

const sendInvoiceEmail = async ( req, res ) => {

    const { orderId } = req.body
    let user
    try{
        user = await User.findById(req.params.id).populate('orders');
    }catch(err){
        console.log(err);
        res.status(500).send({msg: 'No se encontro el usuario'})
    }

    if(!user){
        return res.status(403).json({ msg: 'No hay usuari con ese id'});
    }

    let emailOrder
    try {
        emailOrder = await Order.findById({_id: orderId})
    }catch(err){
         console.log(err);
         res.status(500).send({ msg: 'No se pudo enviar el mail'})
     }
    
     if(!emailOrder){
        return res.json({ msg: 'No se encontraron resultados'});
    }

    const firstName = emailOrder.firstName;
    const lastName = emailOrder.lastName;
    const totalPrice = (emailOrder.totalPrice).toFixed(2);
    const carName = emailOrder.name;
    const carModel = emailOrder.model;
    const startDate = new Date(emailOrder.startDate).toLocaleDateString('de-DE');
    const endDate = new Date(emailOrder.endDate).toLocaleDateString('de-DE');
    const totalDays = emailOrder.totalDays;
}

//Send reset passowrd link
const resetPassword = async ( req, res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ msg: 'Ingreso Invalido' });
    }
    
    //Generate token
    let token
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err)
        }
    token = buffer.toString('hex');       
    });

    let user
    try{
        user = await User.findOne({email: req.body.email});
    }catch(err){
        console.log(err);
        res.status(500).send({msg: 'Error, el no existe'});
    };
};

exports.sendInvoiceEmail = sendInvoiceEmail;
exports.resetPassword = resetPassword;