// test/validation/subsValidation.js
const database = require("../database");

// Check id exists in database
const validate = async (idToValidate, tableName) => {
    let fields = await database(tableName)
    .select()
    .where({
        id: idToValidate
    });
    
    return(fields.length !== 0);
}

module.exports = async function(IDs) {
    var validatedIDs = {};

    let values = await Promise.all([
        validate(IDs.type_id, 'types'), 
        validate(IDs.trainer_id, 'trainers'), 
        validate(IDs.client_id, 'clients')
    ])

    validatedIDs.type_id = values[0];
    validatedIDs.trainer_id = values[1];
    validatedIDs.client_id = values[2];

    return validatedIDs;
}