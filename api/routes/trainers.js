// test/api/routes/trainers.js
const express = require("express");
const router = express.Router();
const database = require("../../database");

const authJwt = require("../../validation/tokenValidation")

// Get 50 latest trainers (default search).
router.get("/getLatest", authJwt, async (req, res) => {
    let query = await database
        .select()
        .from('trainers')
        .limit(50)
        
    res.send(query);
});

//Edit trainer by ID route
router.post("/edit", authJwt, async(req, res) => {
    await database('trainers')
        .update({
            fio: req.body.fio,
            date_birth: req.body.bdate
        })
        .where({
            id: req.body.id
        })

    res.sendStatus(200);
})

// Find trainer by fio route
router.post("/findByFio", authJwt, async(req, res) => {
    let query = await database
        .select()
        .from('trainers')
        .where('fio', 'ilike' , `%${req.body.fio}%`)
        .limit(20)

    res.send(query);
})

// Get all trainers route
router.get("/get", authJwt, async (req, res) => {
    let trainers = await database
    .select()
    .from('trainers');

    res.send(trainers);
})

// Get trainer by id route
router.get("/get/:id", authJwt, async (req, res) => {
    let trainers = await database
    .select()
    .from('trainers')
    .where( {
        id: req.params.id
    });

    res.send(trainers);
});

// Add trainer route
router.post("/add", authJwt, async (req, res) => {
    await database("trainers").
    insert({
        fio: req.body.fio,
        date_birth: req.body.bdate,
    });

    res.sendStatus(200);
});


// Remove trainer by id route
router.get("/remove/:id", authJwt, async (req, res) => {
    await database
    .delete()
    .from('trainers')
    .where( {
        id: req.params.id
    });

    res.sendStatus(200); 
});

module.exports = router;