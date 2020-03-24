// test/api/routes/clients.js
const express = require("express");
const router = express.Router();
const database = require("../../database");
const dateFormat = require('dateformat');


// Get client info by phone number. {phone_number}
router.post("/getClientByPhoneNumber", async (req, res) => {
    let query = await database
        .select()
        .from('clients')
        .where('clients.phone_number', 'ilike' , `%${req.body.phone_number}%`);

    res.send(query);
});

// Get client info by FIO. {fio}
router.post("/getClientByFio", async (req, res) => {
    let query = await database
        .select()
        .from('clients')
        .where('clients.fio', 'ilike' , `%${req.body.fio}%`);

    res.send(query);
});

// Add client route
router.post("/add", async (req, res) => {
    await database("clients").
    insert({
        fio: req.body.fio,
        phone_number: req.body.phone,
        first_visit_date: dateFormat(new Date(), 'yyyy-mm-dd'),
        how_to_find: req.body.how_find,
        inviter_phone: req.body.inv_phone,
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
            fio: 'Иванов Иван Иванович',
            phone_number: '+79999999999',
            first_visit_date: '28-01-2020',
            how_to_find: 'гугл',
            inviter_phone: '-1',
            note: 'фыв'
        },
        {
            fio: 'Петров Петр Петрович',
            phone_number: '+79999990000',
            first_visit_date: '28-05-2018',
            how_to_find: 'яндекс',
            inviter_phone: '1',
            note: 'ййцу'
        },{
            fio: 'Иванов Иван Петрович',
            phone_number: '+76666666666',
            first_visit_date: '28-01-2014',
            how_to_find: '2гис',
            inviter_phone: '2',
            note: 'фыв'
        },{
            fio: 'Петров Петр Геннадьевич',
            phone_number: '+79618465050',
            first_visit_date: '14-12-2000',
            how_to_find: 'друг',
            inviter_phone: '1',
            note: 'ааааааааааааа'
        },{
            fio: 'Муковин Алексей Сергеевич',
            phone_number: '+79505858998',
            first_visit_date: '14-01-2020',
            how_to_find: 'друг',
            inviter_phone: '1',
            note: 'ааааааааааааа'
        },{
            fio: 'Князев Роман Игоревич',
            phone_number: '+79876543223',
            first_visit_date: '06-03-2020',
            how_to_find: 'дун',
            inviter_phone: '-1',
            note: 'ааааааааааааа'
        }
    ];

    nodes.forEach(async element => {
        await database("clients").
        returning("*").
        insert(element);
    });

    res.sendStatus(200);
});

module.exports = router;
