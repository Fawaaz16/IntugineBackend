const mongoose = require('mongoose');
const Schema = mongoose.Schema

const customerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    city: { type: String, required: true },
})

module.exports = mongoose.model('Customer', customerSchema)