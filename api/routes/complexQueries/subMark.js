// test/api/routes/complexQueries/subMark.js
const express = require("express")
const fs = require('fs')
const router = express.Router()
const database = require("../../../database")

// Get client info route. {sub_number}
router.post("/getInfo", async (req, res) => {
    var query = await database
        .select('begin_date', 'start_time', 'end_date', 'training_left', 'left_to_pay', 'fio', 'title', 'training', 'cost', 'clients.id as id')
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
router.post("/markVisit", async (req, res) => {
    await database('subs')
    .decrement('training_left', 1)
    .where({
        sub_number: req.body.sub_number
    });
    
    res.sendStatus(200);
});

module.exports = router;
