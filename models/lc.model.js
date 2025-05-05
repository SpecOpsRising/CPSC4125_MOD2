const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lCSchema = new Schema({
    date : {type: String, max: 10},
    liked : Boolean,
    imgUrl : {type: String}
});

module.exports = mongoose.model('lCModel', lCSchema);