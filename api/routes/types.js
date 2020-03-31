// test/api/routes/types.js
const express = require("express");
const router = express.Router();
const database = require("../../database");

// Get 10 latest trainers route (default search).
router.get("/getLatest", async (req, res) => {
    let query = await database
        .select()
        .from('types')
        .limit(10)
        
    res.send(query);
});

//Edit sub type by ID route
router.post("/edit", async(req, res) => {
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
router.post("/findByTitle", async(req, res) => {
    let query = await database
    .select()
    .from('types')
    .where('title', 'ilike' , `%${req.body.title}%`)
    .limit(20)

    res.send(query);
})

// Add type route
router.post("/add", async (req, res) => {
    await database('types').
    insert({
        title: req.body.title,
        cost: req.body.cost,
        training: req.body.training
    });

    res.sendStatus(200);
});

// Get all types route
router.get("/get", async (req, res) => {
    let types = await database
    .select()
    .from('types');

    res.send(types);
})

// Get type by id route
router.get("/get/:id", async (req, res) => {
    let types = await database
    .select()
    .from('types')
    .where( {
        id: req.params.id
    });

    res.send(types);
});

// Remove type by id route
router.get("/remove/:id", async (req, res) => {
    await database
    .delete()
    .from('types')
    .where({
        id: req.params.id
    });

    res.sendStatus(200);
});

// Fill types route
router.get("/fill", async (req, res) => {
    let nodes = [
        {
            title: 'Бокс',
            cost: '1000',
            training: '10'
        },
        {
            title: 'Качалка',
            cost: '2000',
            training: '12'
        },
        {
            title: 'Каратэ',
            cost: '3000',
            training: '30'
        }
    ];

    nodes.forEach(async element => {
        await database("types").
        insert(element);
    });

    res.sendStatus(200);
});

module.exports = router;

