// test/api/routes/complexQueries/subMark.js
const express = require("express")
const fs = require('fs')
const router = express.Router()
const database = require("../../../database")
const dateFormat = require('dateformat')
const authJwt = require("../../../validation/tokenValidation");

// Get client info route. {sub_number}
router.post("/getInfo", authJwt, async (req, res) => {
    var query = await database
        .select('subs.id as sub_id','begin_date', 'subs.note', 'start_time', 'end_date', 'training_left', 'left_to_pay', 'fio', 'title', 'training', 'cost', 'clients.id as id')
        .from('subs')
        .join('clients', 'subs.client_id', 'clients.id')
        .join('types', 'subs.type_id', 'types.id')
        .where('sub_number', req.body.sub_number)
        .first();

    var photoRes
    try {
        photoRes = fs.readFileSync("clientPhotos/" + query.id + '.png', 'base64')
    } catch(err) {
        photoRes = null
    }

    res.send({
        dbAnswer: query, 
        photo: photoRes
    });
});

// Register client route. {sub_number}
router.post("/markVisit", authJwt, async (req, res) => {
    // Decrease training left of sub
    await database('subs')
    .decrement('training_left', 1)
    .where({
        id: req.body.id
    });
    
    // Register visit into visits
    try {
        await database("visits").
        insert({
            sub_id: req.body.id,
            visit_date: dateFormat(new Date(), 'yyyy-mm-dd'),
            visit_time: (new Date()).toLocaleTimeString()
        });
    } catch(err) {}

    res.sendStatus(200);
});

module.exports = router;
