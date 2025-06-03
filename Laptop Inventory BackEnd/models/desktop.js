const mongoose = require('mongoose');

const desktopSchema = new mongoose.Schema({
    desktopName: { 
        type: String, 
        required: true 
    },
    desktopSerialNumber: { 
        type: String, 
        required: true 
    },
    desktopModel: { 
        type: String, 
        required: true 
    },
    desktopProcessor: { 
        type: String, 
        required: true 
    },
    desktopRam: { 
        type: String, 
        required: true 
    },
    desktopStorage: { 
        type: String, 
        required: true 
    },
    desktopPurchaseDate: { 
        type: Date, 
        required: true 
    },
    desktopLocation: {
        type: String,
        required: true
    },
    desktopAssignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee',
        required: true 
    },
    desktopCondition: { 
        type: String, 
        enum:['Brand New', 'Used', 'Unavailable'],
        required: true 
    },
    desktopPreviousOwner: {
        type: String
    },
    inspectedBy: {
        type: String,
        default: 'Infra'
    },
    status: { 
        type: String, 
        enum: ['Active', 'Disabled'],
        default: 'Active'
    },
});

module.exports = mongoose.model('Desktop', desktopSchema);



  