const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    laptopName: { 
        type: String, 
        required: true 
    },
    laptopSerialNumber: { 
        type: String, 
        required: true 
    },
    laptopDescription: { 
        type: String, 
        required: true 
    },
    laptopPurchaseDate: { 
        type: Date, 
        required: true 
    },
    laptopLocation: {
        type: String,
        required: true
    },
    laptopAssignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee',
        required: true 
    },
    laptopCondition: { 
        type: String, 
        enum:['Brand New', 'Used', 'Unavailable'],
        required: true 
    },
    laptopPreviousOwner: {
        type: String
    },
    inspectedBy: {
        type: String,
        default: 'Infra'
    },
    laptopAge: {
        type: String
    },
    totalDuration: {
        type: String
    },
    totalDurationOnGranting: {
        type: String
    },
    laptopsGranted: {
        type: String
    },
    status: { 
        type: String, 
        enum: ['Active', 'Disabled'],
        default: 'Active'
    },
});

module.exports = mongoose.model('Laptop', laptopSchema);



  