// test/api/routes/payments.js
const express = require("express");
const router = express.Router();

const database = require("../../database");
const dateFormat = require('dateformat');

// Validation 
const valid = require("../../validation/paymentsValidation");

// Add payment route
router.post("/add", async (req, res) => {
    // Check sub id exists
    let isValid = await valid(req.body.sub_id); 

    if(!isValid) {
        res.sendStatus(400);
        return;
    }

    // Get sub
    let sub = await database
    .select()
    .from('subs')
    .where({
        id: req.body.sub_id
    });

    // Update left to pay
    await database('subs')
    .update({
        left_to_pay: sub[0].left_to_pay - req.body.payment_amount
    })
    .where({
        id: req.body.sub_id
    });

    // Insert payment
    await database("payments").
    insert({
        sub_id: req.body.sub_id,
        payment_date: dateFormat(new Date(), 'yyyy-mm-dd'),
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

module.exports = router;