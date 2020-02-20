// test/validation/visitsValidation.js
const database = require("../database");

// Check id exists in 'visits' table
module.exports = async function(subId) {
    let fields = await database('subs')
    .select()
    .where({
        id: subId
    });
    
    console.log(fields.length);
    return fields.length !== 0;
}