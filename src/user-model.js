const mongoose = require('mongoose');

const useSchema = new mongoose.Schema({
    name: String,
    password: String
});

module.exports = mongoose.model('User', useSchema);