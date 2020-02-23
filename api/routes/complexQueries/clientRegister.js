// test/api/routes/complexQueries/clientRegister.js
const express = require("express");
const router = express.Router();
const database = require("../../../database");
const dateFormat = require('dateformat');

// Get client info route. {sub_number}
router.post("/getInfo", async (req, res) => {
    let query = await database
    .raw("SELECT subs.begin_date, subs.end_date, subs.training_left, subs.left_to_pay, clients.fio, types.title, types.training, types.cost FROM subs, clients, types WHERE (subs.type_id = types.id AND subs.client_id = clients.id AND subs.sub_number = '" + req.body.sub_number + "');");
    
    res.send(query.rows);
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
