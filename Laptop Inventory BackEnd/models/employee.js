const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeName: { 
        type: String, 
        required: true 
    },
    employmentDate: { 
        type: Date, 
        required: true 
    },
    employmentPeriod: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['Active', 'Disabled'],
        default: 'Active'
    },
});

module.exports = mongoose.model('Employee', employeeSchema);
