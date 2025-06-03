const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    serverName: { 
        type: String, 
        required: true 
    },
    serverSerialNumber: { 
        type: String, 
        required: true 
    },
    serverOs: { 
        type: String, 
        required: true 
    },
    serverProcessor: { 
        type: String, 
        required: true 
    },
    serverRam: { 
        type: String, 
        required: true 
    },
    serverPurchaseDate: { 
        type: Date, 
        required: true 
    },
    serverLocation: {
        type: String,
        required: true
    },
    serverCondition: { 
        type: String, 
        enum:['Brand New', 'Used', 'Unavailable'],
        required: true 
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

module.exports = mongoose.model('Server', serverSchema);



  