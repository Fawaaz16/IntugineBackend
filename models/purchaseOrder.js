const mongoose = require('mongoose');
const Schema = mongoose.Schema

const purchaseOrderSchema = new Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true},
    pricing: { type: Number, required: true },
    MRP: { type: Number, required: true },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
})

module.exports = mongoose.model('purchaseOrder', purchaseOrderSchema)