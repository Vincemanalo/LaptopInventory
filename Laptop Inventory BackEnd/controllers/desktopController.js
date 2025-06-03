const Desktop = require('../models/desktop');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator');
const { validateDesktopInput } = require('../utils/validator');

// ADD DESKTOP------------------------------------------------------------------------------------------------------------
exports.addNewDesktop = [
    validateDesktopInput, 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { desktopName, desktopSerialNumber, desktopModel, desktopProcessor, desktopRam, desktopStorage, desktopPurchaseDate, desktopLocation, desktopAssignedTo, desktopCondition} = req.body;
        try {
            const existingDesktop = await Desktop.findOne({ desktopSerialNumber });
            if (existingDesktop) {
                return res.status(400).json({ message: 'Desktop with this serial number already exists' });
            }
            let inspectedBy, desktopPreviousOwner; 

            const newDesktop = new Desktop({
                desktopName,
                desktopSerialNumber,
                desktopModel,
                desktopProcessor,
                desktopRam,
                desktopStorage,
                desktopPurchaseDate,
                desktopLocation,
                desktopAssignedTo,
                desktopCondition,
                desktopPreviousOwner,
                inspectedBy,
            });

            await newDesktop.save();
            res.json({ message: 'Desktop added successfully', desktop: newDesktop });
        } catch (err) {
            console.log("Error: ", err);
            res.status(500).send('Server Error');
        }
    }
];

// UPDATE DESKTOP---------------------------------------------------------------------------------------------------------
exports.updateDesktop = [
    validateDesktopInput, 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    try {

        let desktop = await Desktop.findById(req.params.id);
        if (!desktop) return res.status(404).json({ message: 'Desktop not found' });

        if (req.body.desktopSerialNumber) {
            const serialNumberExists = await Desktop.findOne({ desktopSerialNumber: req.body.desktopSerialNumber, _id: { $ne: req.params.id } });
            if (serialNumberExists) {
                return res.status(400).json({ message: 'Desktop serial number already exists' });
            }
        }
        
        desktop = await Desktop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Desktop updated successfully', desktop });

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
}
];

// SOFT DELETE DESKTOP-----------------------------------------------------------------------------------------------------
exports.disableDesktop = async (req, res) => {
    try {
        const desktop = await Desktop.findByIdAndUpdate(req.params.id, { status: 'Disabled' }, { new: true });
        if (!desktop) return res.status(404).json({ message: 'Desktop not found' });
        res.json({ message: 'Desktop deleted successfully', desktop });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// RETRIEVE DESKTOP-----------------------------------------------------------------------------------------------------
exports.retrieveDesktop = async (req, res) => {
    try {
        const desktop = await Desktop.findByIdAndUpdate(req.params.id, { status: 'Active' }, { new: true });
        if (!desktop) return res.status(404).json({ message: 'Desktop not found' });
        res.json({ message: 'Desktop retrieved successfully', desktop });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

//GET ALL DESKTOP---------------------------------------------------------------------------------------------------------
exports.getAllDesktop = async (req, res) => {
    try {
        const { desktopName, desktopSerialNumber, page = 1, pageSize = 10 } = req.query; // Add page and pageSize query parameters

        // Filter for active laptops
        let filter = { status: 'Active' };

        // If laptopName is provided, filter by name
        if (desktopName) {
            filter.desktopName = { $regex: desktopName, $options: 'i' };  
        }

        // If laptopSerialNumber is provided, filter by serial number
        if (desktopSerialNumber) {
            filter.desktopSerialNumber = { $regex: `^${desktopSerialNumber}`, $options: 'i' }; 
        }

        // Find laptops based on the filters with pagination
        const desktops = await Desktop.find(filter)
            .limit(parseInt(pageSize)) // Limit the number of results
            .skip((page - 1) * pageSize); // Skip the records based on the current page

        // Count total number of laptops (for pagination and laptop count)
        const desktopCount = await Desktop.countDocuments(filter);

        // Send the combined data in the response
        res.json({
            desktopCount, // Total number of filtered laptops
            desktopCount: desktopCount, // Total count of active laptops (same as desktopCount)
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(desktopCount / pageSize),
            desktop: desktops // Total number of pages
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    }
};

//GET ALL DISABLED DESKTOP---------------------------------------------------------------------------------------------------------
exports.getAllDisabledDesktop = async (req, res) => {
    try {
        const { desktopName, desktopSerialNumber, page = 1, pageSize = 10 } = req.query; // Add page and pageSize query parameters

        // Filter for active laptops
        let filter = { status: 'Disabled' };

        // If laptopName is provided, filter by name
        if (desktopName) {
            filter.desktopName = { $regex: desktopName, $options: 'i' };  
        }

        // If laptopSerialNumber is provided, filter by serial number
        if (desktopSerialNumber) {
            filter.desktopSerialNumber = { $regex: `^${desktopSerialNumber}`, $options: 'i' }; 
        }

        // Find laptops based on the filters with pagination
        const desktops = await Desktop.find(filter)
            .limit(parseInt(pageSize)) // Limit the number of results
            .skip((page - 1) * pageSize); // Skip the records based on the current page

        // Count total number of laptops (for pagination and laptop count)
        const desktopCount = await Desktop.countDocuments(filter);

        // Send the combined data in the response
        res.json({
            desktopCount, // Total number of filtered laptops
            desktopCount: desktopCount, // Total count of active laptops (same as desktopCount)
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(desktopCount / pageSize),
            desktop: desktops // Total number of pages
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    }
};