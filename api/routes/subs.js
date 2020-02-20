// test/api/routes/clients.js
const express = require("express");
const router = express.Router();

const database = require("../../database");
const dateFormat = require('dateformat');

// Validation module (check id exists)
const valid = require("../../validation/subsValidation");

// Add sub route
router.post("/add", async (req, res) => {
    // ID's validation
    let validatedIDs = await valid({
        type_id: req.body.type_id,
        trainer_id: req.body.trainer_id,
        client_id: req.body.client_id
    });

    if(validatedIDs.type_id === false || validatedIDs.trainer_id === false || validatedIDs.client_id === false) {
        res.sendStatus(400);
        return;
    }

    // Select information about sub type (left to pay and training left)
    let typeAdditionalInfo = await database
    .select()
    .from('types')
    .where( {
        id: req.body.type_id
    });

    // Create end sub date (+ 1 month)
    var end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 1);

    // Add sub
    await database('subs').
    insert({
        sub_number: req.body.sub_number,
        sub_status: 1,
        type_id: req.body.type_id,
        client_id: req.body.client_id,
        trainer_id: req.body.trainer_id,
        left_to_pay: typeAdditionalInfo[0].cost, 
        begin_date: dateFormat(new Date(), 'yyyy-mm-dd'),
        end_date: dateFormat(end_date, 'yyyy-mm-dd'),
        training_left: typeAdditionalInfo[0].training,
        start_time: req.body.start_time,
        note: req.body.note
    });

    res.sendStatus(200);
});

// Get all subs route
router.get("/get", async (req, res) => {
    let types = await database
    .select()
    .from('subs');

    res.send(types);
})

// Get sub by id route
router.get("/get/:id", async (req, res) => {
    let types = await database
    .select()
    .from('subs')
    .where({
        id: req.params.id
    });

    res.send(types);
});

// Remove sub by id route
router.get("/remove/:id", async (req, res) => {
    await database
    .delete()
    .from('subs')
    .where( {
        id: req.params.id
    });
    
    res.sendStatus(200);
});

module.exports = router;