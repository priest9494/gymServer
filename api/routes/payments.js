// test/api/routes/payments.js
const express = require("express");
const router = express.Router();

const database = require("../../database");
const dateFormat = require('dateformat');

// Validation 
const valid = require("../../validation/paymentsValidation");

// Get 50 latest payments
router.get("/getLatest", async (req, res) => {
    let payments = await database
    .select('payments.id as payment_id', 'payment_date', 'payment_amount', 'payment_method', 'clients.fio as fio', 'subs.sub_number as sub_number')
    .from('payments')
    .join('subs', 'payments.sub_id', 'subs.id')
    .join('clients', 'subs.client_id', 'clients.id')
    .limit(50)

    res.send(payments);
});
router.post("/isExists", async(req, res) => {
    // Check sub id exists
    let subId = await getSubIdBySubNumber(req.body.sub_number)

    res.send(subId ? true : false)
})

// Add payment route
router.post("/add", async (req, res) => {
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
        payment_method: req.body.payment_method
    });

    res.sendStatus(200);
});

// Get all payments route
router.get("/get", async (req, res) => {
    let payments = await database
    .select()
    .from('payments');

    res.send(payments);
})

// Get payment by id route
router.get("/get/:id", async (req, res) => {
    let payments = await database
    .select()
    .from('payments')
    .where( {
        id: req.params.id
    });

    res.send(payments);
});

// Remove payment by id route
router.get("/remove/:id", async (req, res) => {
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