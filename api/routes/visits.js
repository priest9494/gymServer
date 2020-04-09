// test/api/routes/visits.js
const express = require("express");
const router = express.Router();

const database = require("../../database");
const dateFormat = require('dateformat');

// Get visits by fio route
router.post("/getByFio", async (req, res) => {
    let visits = await database
        .select('visits.id as id', 'clients.fio', 'subs.sub_number', 'visits.visit_date', 'visits.visit_time')
        .from('visits')
        .join('subs', 'visits.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .where('clients.fio', 'ilike' , `%${req.body.fio}%`)
        .limit(150)

    res.send(visits);
})

// Get visits by fio route
router.post("/getBySubNumber", async (req, res) => {
    let visits = await database
        .select('visits.id as id', 'clients.fio', 'subs.sub_number', 'visits.visit_date', 'visits.visit_time')
        .from('visits')
        .join('subs', 'visits.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .where('subs.sub_number', 'ilike' , `%${req.body.sub_number}%`)
        .limit(150)

    res.send(visits);
})

// Get all visits route
router.get("/getLatest", async (req, res) => {
    let visits = await database
        .select('visits.id as id', 'clients.fio', 'subs.sub_number', 'visits.visit_date', 'visits.visit_time')
        .from('visits')
        .join('subs', 'visits.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .limit(150)

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