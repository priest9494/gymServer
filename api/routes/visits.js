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
        .orderBy('visit_date')
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
        .orderBy('visit_date')
        .limit(150)

    res.send(visits);
})

// Get all visits route
router.post("/getLatest", async (req, res) => {
    var rangeResult = getDateSearchCondition(req.body.beg_range, req.body.end_range)

    let visits = await database
        .select('visits.id as id', 'clients.fio', 'subs.sub_number', 'visits.visit_date', 'visits.visit_time')
        .from('visits')
        .join('subs', 'visits.sub_id', 'subs.id')
        .join('clients', 'subs.client_id', 'clients.id')
        .where(rangeResult.firstCond[0], rangeResult.firstCond[1], rangeResult.firstCond[2])
        .where(rangeResult.secondCond[0], rangeResult.secondCond[1], rangeResult.secondCond[2])
        .orderBy('visit_date')
        .limit(150)

    res.send(visits)
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

const getDateSearchCondition = function(beg, end) {
    var firstCondition = ''
    var secondCondition = ''

    if(beg) {
        firstCondition = ['visit_date', '>=', beg]
    } else {
        firstCondition = ['visits.id', '>=', 0]
    }

    if(end) {
        secondCondition = ['visit_date', '<=', end]
    } else {
        secondCondition = ['visits.id', '>=', 0]
    }

    return { 
        firstCond: firstCondition,
        secondCond: secondCondition
    }
}

module.exports = router;