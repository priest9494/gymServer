// test/validation/paymentsValidation.js
const database = require("../database");

// Check id exists in 'subs' table
module.exports = async function(subId) {
    let fields = await database('subs')
    .select()
    .where({
        id: subId
    });
    
    return fields.length !== 0;
}