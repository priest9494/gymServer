// test/api/routes/complexQueries/clientRegister.js
const express = require("express");
const router = express.Router();
const database = require("../../../database");
const dateFormat = require('dateformat');

// Get client info route. {sub_number}
router.post("/getInfo", async (req, res) => {
    let query = await database
        .select('begin_date', 'start_time', 'end_date', 'training_left', 'left_to_pay', 'fio', 'title', 'training', 'cost')
        .from('subs')
        .join('clients', 'subs.client_id', 'clients.id')
        .join('types', 'subs.type_id', 'types.id')
        .where('sub_number', req.body.sub_number)
        .first();


    res.send(query);
});

// Register client route. {sub_number}
router.post("/markVisit", async (req, res) => {
    await database('subs')
    .decrement('training_left', 1)
    .where({
        sub_number: req.body.sub_number
    });
    
    res.sendStatus(200);
});

module.exports = router;
