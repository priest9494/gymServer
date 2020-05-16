// test/api/routes/types.js
const express = require("express");
const router = express.Router();
const database = require("../../database");

const authJwt = require("../../validation/tokenValidation")

// Get 50 latest trainers route (default search).
router.get("/getLatest", authJwt, async (req, res) => {
    let query = await database
        .select()
        .from('types')
        .limit(50)
        
    res.send(query);
});

//Edit sub type by ID route
router.post("/edit", authJwt, async(req, res) => {
    await database('types')
        .update({
            title: req.body.title,
            cost: req.body.cost,
            training: req.body.training
        })
        .where({
            id: req.body.id
        })

    res.sendStatus(200);
})

// Find type by title route
router.post("/findByTitle", authJwt, async(req, res) => {
    let query = await database
    .select()
    .from('types')
    .where('title', 'ilike' , `%${req.body.title}%`)
    .limit(20)

    res.send(query);
})

// Add type route
router.post("/add", authJwt, async (req, res) => {
    await database('types').
    insert({
        title: req.body.title,
        cost: req.body.cost,
        training: req.body.training
    });

    res.sendStatus(200);
});

// Get all types route
router.get("/get", authJwt, async (req, res) => {
    let types = await database
    .select()
    .from('types');

    res.send(types);
})

// Get type by id route
router.get("/get/:id", authJwt, async (req, res) => {
    let types = await database
    .select()
    .from('types')
    .where( {
        id: req.params.id
    });

    res.send(types);
});

// Remove type by id route
router.get("/remove/:id", authJwt, async (req, res) => {
    await database
    .delete()
    .from('types')
    .where({
        id: req.params.id
    });

    res.sendStatus(200);
});

module.exports = router;

