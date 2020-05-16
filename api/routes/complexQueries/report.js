const express = require("express")
const router = express.Router()
const database = require("../../../database")

const authJwt = require("../../../validation/tokenValidation")

// Get trainer list route
router.get("/getTrainerList", authJwt, async (req, res) => {
    let query = await database
        .select('trainers.id', 'trainers.fio')
        .from('trainers')

    res.send(query);
});

// Get report route
router.post("/getReport", authJwt, async (req, res) => {
    // Для поиска с любыми значениями дат
    var rangeResult = getDateSearchCondition(req.body.beg, req.body.end)

    // Если id тренера = -1, поиск проводися по всем тренерам
    let idWhereObj = {}
    if(parseInt(req.body.id) !== -1) {
        idWhereObj = {
            'trainers.id': req.body.id
        }
    }

    // Если время начала отсутствует, поиск проводися по всему времени
    let timeWhereObj = {}
    if(req.body.time !== '') {
        timeWhereObj = {
            'subs.start_time': req.body.time
        }
    }

    let query = await database
        .select(
            'payments.payment_date',
            'payments.interest_rate',
            'payments.payment_amount',
            'subs.sub_number',
            'subs.start_time',
            'trainers.fio',
            'types.title',
            'types.cost',
            'types.training')
        .from('payments')
        .leftJoin('subs', 'payments.sub_id', 'subs.id')
        .leftJoin('clients', 'subs.client_id', 'clients.id')
        .leftJoin('types', 'subs.type_id', 'types.id')
        .leftJoin('trainers', 'subs.trainer_id', 'trainers.id')
        .where(idWhereObj)
        .where(timeWhereObj)
        .where(rangeResult.firstCond[0], rangeResult.firstCond[1], rangeResult.firstCond[2])
        .where(rangeResult.secondCond[0], rangeResult.secondCond[1], rangeResult.secondCond[2])
        .orderBy('subs.start_time')

    res.send(query);
});

// В случае отсутствия дат заменяет выражение условия заглушкой
const getDateSearchCondition = function(beg, end) {
    var firstCondition = ''
    var secondCondition = ''

    if(beg) {
        firstCondition = ['payments.payment_date', '>=', beg]
    } else {
        firstCondition = ['trainers.id', '>=', 0]
    }

    if(end) {
        secondCondition = ['payments.payment_date', '<=', end]
    } else {
        secondCondition = ['trainers.id', '>=', 0]
    }

    return { 
        firstCond: firstCondition,
        secondCond: secondCondition
    }
}

module.exports = router;