
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    // movies: [{ type: Types.ObjectId, ref: 'Movie' }]
});

module.exports = model('Director', schema);