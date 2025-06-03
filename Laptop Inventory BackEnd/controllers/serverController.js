const Server = require('../models/server');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator');
const { validateServerInput } = require('../utils/validator');

// ADD SERVER------------------------------------------------------------------------------------------------------------
exports.addNewServer = [
    validateServerInput, 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { serverName, serverSerialNumber, serverOs, serverProcessor, serverRam, serverPurchaseDate, serverLocation, serverCondition} = req.body;
        try {
            const existingServer = await Server.findOne({ serverSerialNumber });
            if (existingServer) {
                return res.status(400).json({ message: 'Server with this serial number already exists' });
            }
            let inspectedBy;

            const newServer = new Server({
                serverName,
                serverSerialNumber,
                serverOs,
                serverProcessor,
                serverRam,
                serverPurchaseDate,
                serverLocation,
                serverCondition,
                inspectedBy,
            });

            await newServer.save();
            res.json({ message: 'Server added successfully', server: newServer });
        } catch (err) {
            console.log("Error: ", err);
            res.status(500).send('Server Error');
        }
    }
];

// UPDATE SERVER---------------------------------------------------------------------------------------------------------
exports.updateServer = [
    validateServerInput, 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    try {

        let server = await Server.findById(req.params.id);
        if (!server) return res.status(404).json({ message: 'Server not found' });

        if (req.body.serverSerialNumber) {
            const serialNumberExists = await Server.findOne({ serverSerialNumber: req.body.serverSerialNumber, _id: { $ne: req.params.id } });
            if (serialNumberExists) {
                return res.status(400).json({ message: 'Server serial number already exists' });
            }
        }
    
        server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Server updated successfully', server });

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
}
];

// SOFT DELETE SERVER-----------------------------------------------------------------------------------------------------
exports.disableServer = async (req, res) => {
    try {
        const server = await Server.findByIdAndUpdate(req.params.id, { status: 'Disabled' }, { new: true });
        if (!server) return res.status(404).json({ message: 'Server not found' });
        res.json({ message: 'Server deleted successfully', server });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// RETRIEVE SERVER-----------------------------------------------------------------------------------------------------
exports.retrieveServer = async (req, res) => {
    try {
        const server = await Server.findByIdAndUpdate(req.params.id, { status: 'Active' }, { new: true });
        if (!server) return res.status(404).json({ message: 'Server not found' });
        res.json({ message: 'Server retrieved successfully', server });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

//GET ALL SERVER---------------------------------------------------------------------------------------------------------
exports.getAllServer = async (req, res) => {
    try {
        const { serverName, serverSerialNumber, page = 1, pageSize = 50 } = req.query; // Add page and pageSize query parameters

        // Filter for active servers
        let filter = { status: 'Active' };

        // If serverName is provided, filter by name
        if (serverName) {
            filter.serverName = { $regex: serverName, $options: 'i' };  
        }

        // If serverSerialNumber is provided, filter by serial number
        if (serverSerialNumber) {
            filter.serverSerialNumber = { $regex: `^${serverSerialNumber}`, $options: 'i' }; 
        }

        // Find servers based on the filters with pagination
        const servers = await Server.find(filter)
            .limit(parseInt(pageSize)) // Limit the number of results
            .skip((page - 1) * pageSize); // Skip the records based on the current page

        // Count total number of servers (for pagination and server count)
        const serverCount = await Server.countDocuments(filter);

        // Send the combined data in the response
        res.json({
            serverCount, // Total number of filtered servers
            serverCount: serverCount, // Total count of active servers (same as serverCount)
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(serverCount / pageSize),
            server: servers // Total number of pages
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    }
};

//GET ALL SERVER---------------------------------------------------------------------------------------------------------
exports.getAllDisabledServer = async (req, res) => {
    try {
        const { serverName, serverSerialNumber, page = 1, pageSize = 50 } = req.query; // Add page and pageSize query parameters

        // Filter for active servers
        let filter = { status: 'Disabled' };

        // If serverName is provided, filter by name
        if (serverName) {
            filter.serverName = { $regex: serverName, $options: 'i' };  
        }

        // If serverSerialNumber is provided, filter by serial number
        if (serverSerialNumber) {
            filter.serverSerialNumber = { $regex: `^${serverSerialNumber}`, $options: 'i' }; 
        }

        // Find servers based on the filters with pagination
        const servers = await Server.find(filter)
            .limit(parseInt(pageSize)) // Limit the number of results
            .skip((page - 1) * pageSize); // Skip the records based on the current page

        // Count total number of servers (for pagination and server count)
        const serverCount = await Server.countDocuments(filter);

        // Send the combined data in the response
        res.json({
            serverCount, // Total number of filtered servers
            serverCount: serverCount, // Total count of active servers (same as 
            // Records)
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(serverCount / pageSize),
            server: servers // Total number of pages
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    }
};