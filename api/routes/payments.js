// test/api/routes/payments.js
const express = require("express")
const router = express.Router()

const database = require("../../database")
const dateFormat = require('dateformat')

const authJwt = require("../../validation/tokenValidation")
const valid = require("../../validation/paymentsValidation")

// Get payment by sub number
router.post("/remove", authJwt, async (req, res) => {
    let paymentInfo = await database
    .select('payment_amount', 'sub_id')
    .from('payments')
    .where({
        id: req.body.id
    })
    .first()

    // Increase left to pay of choosed sub
    await database('subs')
    .increment('left_to_pay', paymentInfo.payment_amount)
    .where({
        id: paymentInfo.sub_id
    });

    // Remove row from payments
    await database
    .delete()
    .from('payments')
    .where( {
        id: req.body.id
    });
    
    res.sendStatus(200);
});

// Get payment by sub full name
router.post("/findByFio", authJwt, async (req, res) => {
    let payments = await database
        .select('interest_rate', 'payments.id as payment_id', 'payment_date', 'payment_amount', 'payment_method', 'clients.fio as fio', 'subs.sub_number as sub_number')
        .from('payments')
        .join('subs', 'payments.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .where('clients.fio', 'ilike' , `%${req.body.fio}%`)
        .orderBy('payment_date')

    res.send(payments);
});

// Get payment by sub number
router.post("/findBySubNumber", authJwt, async (req, res) => {
    let payments = await database
        .select('interest_rate', 'payments.id as payment_id', 'payment_date', 'payment_amount', 'payment_method', 'clients.fio as fio', 'subs.sub_number as sub_number')
        .from('payments')
        .join('subs', 'payments.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .where('subs.sub_number', 'ilike' , `%${req.body.sub_number}%`)
        .orderBy('payment_date')

    res.send(payments);
});

// Get 50 latest payments
router.get("/getLatest", authJwt, async (req, res) => {
    let payments = await database
        .select('interest_rate', 'payments.id as payment_id', 'payment_date', 'payment_amount', 'payment_method', 'clients.fio as fio', 'subs.sub_number as sub_number')
        .from('payments')
        .join('subs', 'payments.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .orderBy('payment_date')
        .limit(200)

    res.send(payments);
});

// Check sub id exists route
router.post("/isExists", authJwt, async(req, res) => {
    let subId = await getSubIdBySubNumber(req.body.sub_number)

    res.send(subId ? true : false)
})

// Add payment route
router.post("/add", authJwt, async (req, res) => {
    // Get sub id by sub number 
    var subId = await getSubIdBySubNumber(req.body.sub_number)

    // Update left to pay
    await database('subs')
    .decrement('left_to_pay', req.body.payment_amount)
    .where({
        id: subId
    });

    // Insert payment
    await database("payments").
    insert({
        sub_id: subId,
        payment_date: req.body.payment_date,
        payment_amount: req.body.payment_amount,
        payment_method: req.body.payment_method,
        interest_rate: req.body.interest_rate
    });

    res.sendStatus(200);
});

// Get all payments route
router.get("/get", authJwt, async (req, res) => {
    let payments = await database
    .select()
    .from('payments');

    res.send(payments);
})

// Get payment by id route
router.get("/get/:id", authJwt, async (req, res) => {
    let payments = await database
    .select()
    .from('payments')
    .where( {
        id: req.params.id
    });

    res.send(payments);
});

// Remove payment by id route
router.get("/remove/:id", authJwt, async (req, res) => {
    await database
    .delete()
    .from('payments')
    .where( {
        id: req.params.id
    });
    
    res.sendStatus(200);
});

const getSubIdBySubNumber = async function(sub_number) {
    const res = await database
    .select('subs.id as id')
    .from('subs')
    .where({
        sub_number: sub_number
    })
    .first()

    if(res) {
        return res.id
    } else {
        return null
    }
}

module.exports = router;