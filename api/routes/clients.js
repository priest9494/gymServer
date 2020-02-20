// test/api/routes/clients.js
const express = require("express");
const router = express.Router();
const database = require("../../database");
const dateFormat = require('dateformat');

// Add client route
router.post("/add", async (req, res) => {
    await database("clients").
    insert({
        fio: req.body.fio,
        phone_number: req.body.phone,
        first_visit_date: dateFormat(new Date(), 'yyyy-mm-dd'),
        how_to_find: req.body.how_find,
        inviter_id: req.body.inv_id,
        note: req.body.note
    });

    res.sendStatus(200);
});

// Get all clients route
router.get("/get", async (req, res) => {
    let clients = await database
    .select()
    .from('clients');

    res.send(clients);
})

// Get client by id route
router.get("/get/:id", async (req, res) => {
    let cliens = await database
    .select()
    .from('clients')
    .where( {
        id: req.params.id
    });

    res.send(cliens);
});

// Remove client by id route
router.get("/remove/:id", async (req, res) => {
    await database
    .delete()
    .from('clients')
    .where( {
        id: req.params.id
    });

    res.sendStatus(200);
});


// Fill clients route
router.get("/fill", (req, res) => {
    let nodes = [
        {
            fio: 'Первый',
            phone_number: '123',
            first_visit_date: '28-01-2020',
            how_to_find: 'гугл',
            inviter_id: '-1',
            note: 'фыв'
        },
        {
            fio: 'Второй',
            phone_number: '321',
            first_visit_date: '28-05-2018',
            how_to_find: 'яндекс',
            inviter_id: '1',
            note: 'ййцу'
        },{
            fio: 'Третий',
            phone_number: '331--()312',
            first_visit_date: '28-01-2014',
            how_to_find: '2гис',
            inviter_id: '2',
            note: 'фыв'
        },{
            fio: 'Четвертый',
            phone_number: '33333(3-)00(',
            first_visit_date: '14-12-2000',
            how_to_find: 'друг',
            inviter_id: '1',
            note: 'ааааааааааааа'
        },
    ];

    nodes.forEach(async element => {
        await database("clients").
        returning("*").
        insert(element);
    });

    res.sendStatus(200);
});

module.exports = router;
