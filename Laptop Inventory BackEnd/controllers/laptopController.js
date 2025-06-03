const Laptop = require('../models/laptop');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator');
const { validateLaptopInput} = require('../utils/validator');

// CALCULATION OF LAPTOP AGE----------------------------------------------------------------------------------------------
const calculateLaptopAge = (purchaseDate) => {
    const now = new Date();
    const purchase = new Date(purchaseDate);

    let diff = now - purchase;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));  
    diff -= years * (1000 * 60 * 60 * 24 * 365.25);

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); 
    diff -= months * (1000 * 60 * 60 * 24 * 30.44);

    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    diff -= weeks * (1000 * 60 * 60 * 24 * 7);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `${years} years, ${months} months, ${weeks} weeks, and ${days} days`;
};

// ADD LAPTOP-------------------------------------------------------------------------------------------------------------
exports.addNewLaptop = [
    validateLaptopInput, // Use the validation middleware

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { laptopName, laptopSerialNumber, laptopDescription, laptopPurchaseDate, laptopLocation, laptopAssignedTo, laptopCondition } = req.body;
        try {
            const existingLaptop = await Laptop.findOne({ laptopSerialNumber });
            if (existingLaptop) {
                return res.status(400).json({ message: 'Laptop with this serial number already exists' });
            }
            const laptopAge = calculateLaptopAge(laptopPurchaseDate);
            let inspectedBy, laptopPreviousOwner; 

            const newLaptop = new Laptop({
                laptopName,
                laptopSerialNumber,
                laptopDescription,
                laptopPurchaseDate,
                laptopLocation,
                laptopAssignedTo,
                laptopCondition,
                laptopPreviousOwner,
                inspectedBy,
                laptopAge
            });

            await newLaptop.save();
            res.json({ message: 'Laptop added successfully', laptop: newLaptop });
        } catch (err) {
            console.log("Error: ", err);
            res.status(500).send('Server Error');
        }
    }
];

// UPDATE LAPTOP----------------------------------------------------------------------------------------------------------
exports.updateLaptop = [
    validateLaptopInput,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let laptop = await Laptop.findById(req.params.id);
            if (!laptop) return res.status(404).json({ message: 'Laptop not found' });

            // Check if the laptopSerialNumber exists and belongs to another laptop
            if (req.body.laptopSerialNumber) {
                const serialNumberExists = await Laptop.findOne({ laptopSerialNumber: req.body.laptopSerialNumber, _id: { $ne: req.params.id } });
                if (serialNumberExists) {
                    return res.status(400).json({ message: 'Laptop serial number already exists' });
                }
            }
            
            if (req.body.laptopPurchaseDate) {
                const purchaseDate = new Date(req.body.laptopPurchaseDate);
                req.body.laptopAge = calculateLaptopAge(purchaseDate);
            }

            laptop = await Laptop.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({ message: 'Laptop updated successfully', laptop });

        } catch (err) {
            console.log("Error: ", err);
            res.status(500).send('Server Error');
        }
    }
];

// SOFT DELETE LAPTOP-----------------------------------------------------------------------------------------------------
exports.disableLaptop = async (req, res) => {
    try {
        const laptop = await Laptop.findByIdAndUpdate(req.params.id, { status: 'Disabled' }, { new: true });
        if (!laptop) return res.status(404).json({ message: 'Laptop not found' });
        res.json({ message: 'Laptop deleted successfully', laptop });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// RETRIEVE LAPTOP-----------------------------------------------------------------------------------------------------
exports.retrieveLaptop = async (req, res) => {
    try {
        const laptop = await Laptop.findByIdAndUpdate(req.params.id, { status: 'Active' }, { new: true });
        if (!laptop) return res.status(404).json({ message: 'Laptop not found' });
        res.json({ message: 'Laptop retrieved successfully', laptop });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// CALCULATION OF TOTAL DURATION------------------------------------------------------------------------------------------
const addDurations = (laptopAge, employmentPeriod) => {
    const laptopAgeParts = laptopAge.match(/(\d+)\s+years,\s+(\d+)\s+months,\s+(\d+)\s+weeks,\s+and\s+(\d+)\s+days/);
    const employmentPeriodParts = employmentPeriod.match(/(\d+)\s+years,\s+(\d+)\s+months,\s+(\d+)\s+weeks,\s+and\s+(\d+)\s+days/);

    const years = parseInt(laptopAgeParts[1]) + parseInt(employmentPeriodParts[1]);
    const months = parseInt(laptopAgeParts[2]) + parseInt(employmentPeriodParts[2]);
    const weeks = parseInt(laptopAgeParts[3]) + parseInt(employmentPeriodParts[3]);
    const days = parseInt(laptopAgeParts[4]) + parseInt(employmentPeriodParts[4]);

    let additionalMonths = Math.floor(weeks / 4);
    let totalWeeks = weeks % 4;
    let additionalYears = Math.floor(months / 12);
    let totalMonths = months % 12;
    let additionalWeeks = Math.floor(days / 7);
    let totalDays = days % 7;

    return `${years + additionalYears} years, ${totalMonths + additionalMonths} months, ${totalWeeks + additionalWeeks} weeks, and ${totalDays} days`;
};

// CALCULATION OF TOTAL DURATION WITH GRANTING SUBTRACTION--------------------------------------------------------------
const subtractDuration = (totalDuration, subtractYears = 6, subtractMonths = 0, subtractWeeks = 0, subtractDays = 0) => {
    const durationParts = totalDuration.match(/(\d+)\s+years,\s+(\d+)\s+months,\s+(\d+)\s+weeks,\s+and\s+(\d+)\s+days/);

    let years = parseInt(durationParts[1]) - subtractYears;
    let months = parseInt(durationParts[2]) - subtractMonths;
    let weeks = parseInt(durationParts[3]) - subtractWeeks;
    let days = parseInt(durationParts[4]) - subtractDays;

    // No adjustment for negative values; we allow them to show the remaining time.
    return `${years} years, ${months} months, ${weeks} weeks, and ${days} days`;
};

// Usage of subtracting 6 years from the total duration
const totalDurationOnGranting = (laptopAge, employmentPeriod) => {
    const totalDuration = addDurations(laptopAge, employmentPeriod); // First, calculate the total duration
    return subtractDuration(totalDuration, 6, 0, 0, 0); // Then subtract 6 years
};

// GRANTED LAPTOP/S-------------------------------------------------------------------------------------------------------
const grantedLaptopsCount = (totalDuration) => {
    const durationParts = totalDuration.match(/(\d+)\s+years,\s+(\d+)\s+months,\s+(\d+)\s+weeks,\s+and\s+(\d+)\s+days/);
    const years = parseInt(durationParts[1]);

    // Calculate the number of laptops granted (every 6 full years)
    const laptopsGranted = Math.floor(years / 6);
    return laptopsGranted;
};

// GET ALL LAPTOPS--------------------------------------------------------------------------------------------------------
exports.getAllLaptops = async (req, res) => {
    try {
        const { laptopName, laptopSerialNumber, page = 1, pageSize = 10 } = req.query; // Add page and pageSize query parameters

        // Filter for active laptops
        let filter = { status: 'Active' };

        // If laptopName is provided, filter by name
        if (laptopName) {
            filter.laptopName = { $regex: laptopName, $options: 'i' };  
        }

        // If laptopSerialNumber is provided, filter by serial number
        if (laptopSerialNumber) {
            filter.laptopSerialNumber = { $regex: `^${laptopSerialNumber}`, $options: 'i' }; 
        }

        // Find laptops based on the filters with pagination
        const laptops = await Laptop.find(filter)
            .limit(parseInt(pageSize)) // Limit the number of results
            .skip((page - 1) * pageSize); // Skip the records based on the current page

        // Count total number of laptops (for pagination and laptop count)
        const laptopCount = await Laptop.countDocuments(filter);

        // Add dashboard logic: calculate total duration, granted laptops, and related fields
        const laptopsWithTotalDuration = await Promise.all(
            laptops.map(async (laptop) => {
                const employee = await Employee.findById(laptop.laptopAssignedTo, 'employmentPeriod');
                
                if (!employee) {
                    // If employee not found, set default values for totalDuration and laptopsGranted
                    return {
                        ...laptop._doc, 
                        totalDuration: "N/A (Employee not found)",
                        laptopsGranted: 0 // No employee means no granted laptops
                    };
                }

                // Calculate total duration of laptop age + employment period
                const totalDuration = addDurations(laptop.laptopAge, employee.employmentPeriod);

                // Calculate the number of laptops granted based on total duration
                const laptopsGranted = grantedLaptopsCount(totalDuration);

                // Calculate the total duration on granting (subtracting 6 years)
                const totalDurationOnGranting = subtractDuration(totalDuration, 6, 0, 0, 0);

                // Save calculated fields to the database (optional, remove if unnecessary)
                laptop.totalDuration = totalDuration;
                laptop.totalDurationOnGranting = totalDurationOnGranting;
                laptop.laptopsGranted = laptopsGranted;

                await laptop.save(); // Save changes to the database

                // Return the laptop object with calculated values
                return {
                    ...laptop._doc, 
                    totalDuration, 
                    totalDurationOnGranting,
                    laptopsGranted
                };
            })
        );

        // Send the combined data in the response
        res.json({
            laptopCount, // Total number of filtered laptops
            laptopCount: laptopCount, // Total count of active laptops (same as laptopCount)
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(laptopCount / pageSize), // Total number of pages
            laptops: laptopsWithTotalDuration // Laptops with calculated total duration and granted laptops
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// GET DISABLED LAPTOPS--------------------------------------------------------------------------------------------------------
exports.getAllDisabledLaptop = async (req, res) => {
    try {
        const { laptopName, laptopSerialNumber, page = 1, pageSize = 10 } = req.query; // Add page and pageSize query parameters

        // Filter for active laptops
        let filter = { status: 'Disabled' };

        // If laptopName is provided, filter by name
        if (laptopName) {
            filter.laptopName = { $regex: laptopName, $options: 'i' };  
        }

        // If laptopSerialNumber is provided, filter by serial number
        if (laptopSerialNumber) {
            filter.laptopSerialNumber = { $regex: `^${laptopSerialNumber}`, $options: 'i' }; 
        }

        // Find laptops based on the filters with pagination
        const laptops = await Laptop.find(filter)
            .limit(parseInt(pageSize)) // Limit the number of results
            .skip((page - 1) * pageSize); // Skip the records based on the current page

        // Count total number of laptops (for pagination and laptop count)
        const laptopCount = await Laptop.countDocuments(filter);

        // Add dashboard logic: calculate total duration, granted laptops, and related fields
        const laptopsWithTotalDuration = await Promise.all(
            laptops.map(async (laptop) => {
                const employee = await Employee.findById(laptop.laptopAssignedTo, 'employmentPeriod');
                
                if (!employee) {
                    // If employee not found, set default values for totalDuration and laptopsGranted
                    return {
                        ...laptop._doc, 
                        totalDuration: "N/A (Employee not found)",
                        laptopsGranted: 0 // No employee means no granted laptops
                    };
                }

                // Calculate total duration of laptop age + employment period
                const totalDuration = addDurations(laptop.laptopAge, employee.employmentPeriod);

                // Calculate the number of laptops granted based on total duration
                const laptopsGranted = grantedLaptopsCount(totalDuration);

                // Calculate the total duration on granting (subtracting 6 years)
                const totalDurationOnGranting = subtractDuration(totalDuration, 6, 0, 0, 0);

                // Save calculated fields to the database (optional, remove if unnecessary)
                laptop.totalDuration = totalDuration;
                laptop.totalDurationOnGranting = totalDurationOnGranting;
                laptop.laptopsGranted = laptopsGranted;

                await laptop.save(); // Save changes to the database

                // Return the laptop object with calculated values
                return {
                    ...laptop._doc, 
                    totalDuration, 
                    totalDurationOnGranting,
                    laptopsGranted
                };
            })
        );

        // Send the combined data in the response
        res.json({
            laptopCount, // Total number of filtered laptops
            laptopCount: laptopCount, // Total count of active laptops (same as laptopCount)
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(laptopCount / pageSize), // Total number of pages
            laptops: laptopsWithTotalDuration // Laptops with calculated total duration and granted laptops
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    }
};
//--------------------------------------------------------------------------------------------------
