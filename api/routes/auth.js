const express = require("express")
const database = require("../../database")
const jwt = require('jsonwebtoken')
const router = express.Router()

const accessTokenSecret = 'Qm7UNBio86hJ79Bz00O';

router.post("/login", async (req, res) => {
    let user = await database
        .select('username', 'userpass')
        .from('users')
        .where('username', req.body.username)
        .first()

    if(!user) {
        res.send('not exists')
    }

    if(user.userpass !== req.body.password) {
        res.send('not exists')
    }

    const accessToken = jwt.sign({ username: user.username }, accessTokenSecret, { expiresIn: '17h' });
    res.send(accessToken)
})

module.exports = router