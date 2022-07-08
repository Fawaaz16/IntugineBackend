const mongoose = require('mongoose');
const Schema = mongoose.Schema

const shippingDetailSchema = new Schema({
    address: { type: String, required: true },
    city: { type: String, required: true},
    pincode: { type: Number, required: true },
    purchaseId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchaseOrder',
        required: true
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
})

module.exports = mongoose.model('shippingDetail', shippingDetailSchema)