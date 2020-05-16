const express = require("express")
const router = express.Router()
const database = require("../../database")
const fs = require('fs')

const authJwt = require("../../validation/tokenValidation")

// Get latest clients (default search).
router.get("/getLatest", authJwt, async (req, res) => {
    let query = await database
        .select()
        .from('clients')
        .limit(20)

    await setInviters(query)
    setPhotos(query)

    res.send(query);
});

//Edit client by ID route
router.post("/edit", authJwt, async(req, res) => {
    await database('clients')
        .update({
            fio: req.body.fio,
            phone_number: req.body.phone,
            first_visit_date: req.body.first_visit_date,
            how_to_find: req.body.how_find,
            inviter_id: req.body.inviter_id,
            note: req.body.note,
        })
        .where({
            id: req.body.id
        })

    if(req.body.photo) {
        var filename = req.body.id + '.png'
        var base64Data = req.body.photo.replace(/^data:image\/png;base64,/, "");
        
        fs.writeFile("clientPhotos/" + filename, base64Data, 'base64', function(err) {
        });
    }
    

    res.sendStatus(200);
})

// Get client info by phone number. {phone_number}
router.post("/getClientByPhoneNumber", authJwt, async (req, res) => {
    let query = await database
        .select()
        .from('clients')
        .where('clients.phone_number', 'ilike' , `%${req.body.phone_number}%`)
        .limit(20)

    await setInviters(query)
    setPhotos(query)

    res.send(query);
});

// Get client info by FIO. {fio}
router.post("/getClientByFio", authJwt, async (req, res) => {
    let query = await database
        .select()
        .from('clients')
        .where('clients.fio', 'ilike' , `%${req.body.fio}%`)
        .limit(20)

    await setInviters(query)
    setPhotos(query)

    res.send(query);
});

// Add client route
router.post("/add", authJwt, async (req, res) => {
    const id = await database("clients")
        .returning('id')
        .insert({
            fio: req.body.fio,
            phone_number: req.body.phone,
            first_visit_date: req.body.first_visit_date,
            how_to_find: req.body.how_find,
            inviter_id: req.body.inviter_id ? req.body.inviter_id : -1,
            note: req.body.note,
        });

    var filename = id + '.png'

    var base64Data = req.body.photo.replace(/^data:image\/png;base64,/, "");
    fs.writeFile("clientPhotos/" + filename, base64Data, 'base64', function(err) {
    });

    res.sendStatus(200);
});

// Get all clients route
router.get("/get", authJwt, async (req, res) => {
    let clients = await database
    .select()
    .from('clients');

    res.send(clients);
})

// Get client by id route
router.get("/get/:id", authJwt, async (req, res) => {
    let cliens = await database
    .select()
    .from('clients')
    .where( {
        id: req.params.id
    });

    res.send(cliens);
});

// Remove client by id route
router.get("/remove/:id", authJwt, async (req, res) => {
    await database
    .delete()
    .from('clients')
    .where( {
        id: req.params.id
    });
    fs.unlink("clientPhotos/" + req.params.id + ".png", err => {
    })

    res.sendStatus(200);
});

const setInviters = async function(clientList) {
    for (i in clientList) {
        let invFio = await database
            .select('fio')
            .from('clients')
            .where('id', clientList[i].inviter_id)
            .first()
        try {
            clientList[i].inviter = invFio.fio
        } catch(err) {
            clientList[i].inviter = null
        }
    }
}

const setPhotos = function(clientList) {
    clientList.forEach(node => {
        let photoRes
        try {
            photoRes = fs.readFileSync("clientPhotos/" + node.id + '.png', 'base64')
            node.photo = photoRes
        } catch(err) {
            node.photo = null
        }
    });
}

module.exports = router;
