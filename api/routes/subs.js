// test/api/routes/clients.js
const express = require("express");
const router = express.Router();

const database = require("../../database");

const valid = require("../../validation/subsValidation")
const authJwt = require("../../validation/tokenValidation")

// Extend sub route
router.post("/extend", authJwt, async(req, res) => {
    // Get info about sub type
    let typeQuery = await database
    .select('type_id', 'left_to_pay')
    .from('subs')
    .where({
        id: req.body.id
    })
    .first()

    let typeAdditionalInfo = await database
    .select()
    .from('types')
    .where({
        id: typeQuery.type_id
    })
    .first()

    await database('subs').
    update({
        begin_date: req.body.beg_date,
        end_date: req.body.end_date,
        left_to_pay: typeAdditionalInfo.cost + typeQuery.left_to_pay,
        training_left: typeAdditionalInfo.training
    })
    .where({
        id: req.body.id
    })

    res.sendStatus(200)
})
// Check sub number uniq route
router.post("/checkUniq", authJwt, async(req, res) => {
    let field = await database('subs')
        .select()
        .where({
            sub_number: req.body.sub_number
        })
        .first()
    
    var uniqAns = field === undefined ? true : false
    res.send(uniqAns)
})

// Get 10 latest subs route (default search).
router.get("/getLatest", authJwt, async (req, res) => {
    let query = await database
        .select('subs.id as sub_id', 'sub_number', 'start_time', 'subs.note', 'begin_date', 'end_date', 'training_left', 'left_to_pay', 'clients.fio as client_fio', 'clients.id as client_id', 'phone_number', 'title', 'training', 'cost', 'types.id as type_id', 'trainers.id as trainer_id', 'trainers.fio as trainer_fio')
        .from('subs')
        .leftJoin('clients', 'subs.client_id', 'clients.id')
        .leftJoin('types', 'subs.type_id', 'types.id')
        .leftJoin('trainers', 'subs.trainer_id', 'trainers.id')
        .limit(40)
        
    res.send(query);
});

// Get sub info by FIO. {sub_number}
router.post("/getSubByFio", authJwt, async (req, res) => {
    let query = await database
        .select('subs.id as sub_id', 'sub_number', 'start_time', 'subs.note', 'begin_date', 'end_date', 'training_left', 'left_to_pay', 'clients.fio as client_fio', 'clients.id as client_id', 'phone_number', 'title', 'training', 'cost', 'types.id as type_id', 'trainers.id as trainer_id', 'trainers.fio as trainer_fio')
        .from('subs')
        .leftJoin('clients', 'subs.client_id', 'clients.id')
        .leftJoin('types', 'subs.type_id', 'types.id')
        .leftJoin('trainers', 'subs.trainer_id', 'trainers.id')
        .where('clients.fio', 'ilike' , `%${req.body.fio}%`)
        .limit(20)
        
    res.send(query);
});

// Get sub info by phone number route. {sub_number}
router.post("/getSubByPhoneNumber", authJwt, async (req, res) => {
    let query = await database
        .select('subs.id as sub_id', 'sub_number', 'start_time', 'subs.note', 'begin_date', 'end_date', 'training_left', 'left_to_pay', 'clients.fio as client_fio', 'clients.id as client_id', 'phone_number', 'title', 'training', 'cost', 'types.id as type_id', 'trainers.id as trainer_id', 'trainers.fio as trainer_fio')
        .from('subs')
        .leftJoin('clients', 'subs.client_id', 'clients.id')
        .leftJoin('types', 'subs.type_id', 'types.id')
        .leftJoin('trainers', 'subs.trainer_id', 'trainers.id')
        .where('phone_number', 'ilike' , `%${req.body.phone_number}%`)
        .limit(20)

    res.send(query);
});

// Get sub info by sub number route. {sub_number}
router.post("/getSubBySubNumber", authJwt, async (req, res) => {
    let query = await database
        .select('subs.id as sub_id', 'sub_number', 'start_time', 'subs.note', 'begin_date', 'end_date', 'training_left', 'left_to_pay', 'clients.fio as client_fio', 'clients.id as client_id', 'phone_number', 'title', 'training', 'cost', 'types.id as type_id', 'trainers.id as trainer_id', 'trainers.fio as trainer_fio')
        .from('subs')
        .leftJoin('clients', 'subs.client_id', 'clients.id')
        .leftJoin('types', 'subs.type_id', 'types.id')
        .leftJoin('trainers', 'subs.trainer_id', 'trainers.id')
        .where('sub_number', 'ilike' , `%${req.body.sub_number}%`)
        .limit(20)

    res.send(query);
});

// Edit sub route
router.post("/edit", authJwt, async (req, res) => {
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

    // Get info about old sub type
    let oldTypeAdditionalInfo = await database
    .select()
    .from('types')
    .where({
        id: req.body.old_type
    });

    // Get info about new sub type
    let newTypeAdditionalInfo = await database
    .select()
    .from('types')
    .where({
        id: req.body.type_id
    });

    var newLeftToPay = req.body.left_to_pay - oldTypeAdditionalInfo[0].cost + newTypeAdditionalInfo[0].cost

    await database('subs').
    update({
        sub_number: req.body.sub_number,
        type_id: req.body.type_id,
        client_id: req.body.client_id,
        trainer_id: req.body.trainer_id,
        left_to_pay: newLeftToPay, 
        begin_date: req.body.begin_date,
        end_date: req.body.end_date,
        training_left: req.body.training_left,
        start_time: req.body.start_time,
        note: req.body.note
    })
    .where({
        id: req.body.id
    })

    res.sendStatus(200);
});

// Add sub route
router.post("/add", authJwt, async (req, res) => {
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
    .where({
        id: req.body.type_id
    });

    // Add sub
    await database('subs').
    insert({
        sub_number: req.body.sub_number,
        sub_status: 1,
        type_id: req.body.type_id,
        client_id: req.body.client_id,
        trainer_id: req.body.trainer_id,
        left_to_pay: typeAdditionalInfo[0].cost, 
        begin_date: req.body.begin_date,
        end_date: req.body.end_date,
        training_left: typeAdditionalInfo[0].training,
        start_time: req.body.start_time,
        note: req.body.note
    });

    res.sendStatus(200);
});

// Get all subs route
router.get("/get", authJwt, async (req, res) => {
    let types = await database
    .select()
    .from('subs');

    res.send(types);
})

// Get sub by id route
router.get("/get/:id", authJwt, async (req, res) => {
    let types = await database
    .select()
    .from('subs')
    .where({
        id: req.params.id
    });

    res.send(types);
});

// Remove sub by id route
router.get("/remove/:id", authJwt, async (req, res) => {
    await database
    .delete()
    .from('subs')
    .where( {
        id: req.params.id
    });
    
    res.sendStatus(200);
});

module.exports = router;