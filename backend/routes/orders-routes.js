const express = require('express');
const { check } = require('express-validator');

const ordersController = require('../controllers/orders-controllers');
const router = express.Router();

router.post('/' , 
    [
        check('firstName', 'Ingrese un nombre valido').not().isEmpty().trim(),
        check('lastName', 'Ingrese un apellido valido').not().isEmpty().trim(),
        check('endDate', 'Ingrese un dato valido').isISO8601().toDate(),
        check('startDate', 'Ingrese una fecha valido').isISO8601().toDate() 
        .custom((value, {req}) => {
            if(value <= Date.now()){
                throw new Error('Fecha invalida');
            }
            return true;
        })      
    ],
    ordersController.addOrder
);
router.get('/:id', ordersController.getOrderById)
router.get('/user/:id', ordersController.getUsersOrders);
router.delete('/:id', ordersController.deleteOrder);
router.patch('/option/:id', ordersController.updatePayOption);

module.exports = router;