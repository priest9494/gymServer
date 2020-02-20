// test/api/routes/visits.js
const express = require("express");
const router = express.Router();

const database = require("../../database");
const dateFormat = require('dateformat');

// Validation 
const valid = require("../../validation/visitsValidation");

// Add visit route
router.post("/add", async (req, res) => {
    // Check sub id exists
    let isValid = await valid(req.body.sub_id); 

    if(!isValid) {
        res.sendStatus(400);
        console.log(req.body);
        return;
    }

    // Register visit
    await database("visits").
    insert({
        sub_id: req.body.sub_id,
        visit_date: dateFormat(new Date(), 'yyyy-mm-dd'),
        visit_time: (new Date()).toLocaleTimeString()
    });

    res.sendStatus(200);
});

// Get all visits route
router.get("/get", async (req, res) => {
    let visits = await database
    .select()
    .from('visits');

    res.send(visits);
})

// Get visit by id route
router.get("/get/:id", async (req, res) => {
    let visits = await database
    .select()
    .from('visits')
    .where( {
        id: req.params.id
    });

    res.send(visits);
});

// Remove visit by id route
router.get("/remove/:id", async (req, res) => {
    await database
    .delete()
    .from('visits')
    .where( {
        id: req.params.id
    });
    
    res.sendStatus(200);
});

module.exports = router;