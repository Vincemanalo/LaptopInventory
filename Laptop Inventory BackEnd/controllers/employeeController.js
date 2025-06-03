const Employee = require('../models/employee');
const { validationResult } = require('express-validator');
const { validateEmployeeInput } = require('../utils/validator');

// CALCULATIONS OF EMPLOYMENT PERIOD--------------------------------------------------------------------------------------
const calculateEmploymentPeriod = (employmentDate) => {
    const now = new Date();
    const employment = new Date(employmentDate);

    let diff = now - employment;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));  
    diff -= years * (1000 * 60 * 60 * 24 * 365.25);

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); 
    diff -= months * (1000 * 60 * 60 * 24 * 30.44);

    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    diff -= weeks * (1000 * 60 * 60 * 24 * 7);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `${years} years, ${months} months, ${weeks} weeks, and ${days} days`;
};

// ADD EMPLOYEE-----------------------------------------------------------------------------------------------------------
exports.addNewEmployee = [
    validateEmployeeInput, 

        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

        const { employeeName, employmentDate } = req.body;
        try {
            const existingEmployee = await Employee.findOne({ employeeName });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Employee already exists' });
            }
            const employmentPeriod = calculateEmploymentPeriod(employmentDate);

            const newEmployee = new Employee({
                employeeName, employmentDate, employmentPeriod
            });
            await newEmployee.save();
            res.json({ message: 'Employee added successfully', employee: newEmployee });
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send('Server Error');
        }
    }
];

// UPDATE EMPLOYEE--------------------------------------------------------------------------------------------------------
exports.updateEmployee = [
    validateEmployeeInput, 

            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

        try {
            let employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            // Case-insensitive name duplication check
            if (req.body.employeeName) {
                const existingEmployee = await Employee.findOne({ 
                    employeeName: { $regex: `^${req.body.employeeName}$`, $options: 'i' },
                    _id: { $ne: req.params.id } 
                });

                if (existingEmployee) {
                    return res.status(400).json({ message: 'Employee name already exists' });
                }
            }

            // Recalculate employment period if employmentDate is being updated
            if (req.body.employmentDate) {
                const employment = new Date(req.body.employmentDate);
                req.body.employmentPeriod = calculateEmploymentPeriod(employment);
            }

            employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({ message: 'Employee details updated successfully', employee });

        } catch (err) {
            console.log("Error: ", err);
            res.status(500).send('Server Error');
        }
    }
];



// SOFT DELETE EMPLOYEE-----------------------------------------------------------------------------------------------------
exports.disableEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, { status: 'Disabled' }, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted successfully', employee });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// RETRIEVE EMPLOYEE-----------------------------------------------------------------------------------------------------
exports.retrieveEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, { status: 'Active' }, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee retrieved successfully', employee });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// GET ALL EMPLOYEES-----------------------------------------------------------------------------------------------------
exports.getAllEmployee = async (req, res) => {
    try {
        const { employeeName, page = 1, limit = 50 } = req.query; // Add page and limit query parameters

        let filter = { status: 'Active' };  

        if (employeeName) {
            filter.employeeName = { $regex: employeeName, $options: 'i' }; 
        }

        const employees = await Employee.find(filter)
            .limit(parseInt(limit)) // Limit the number of results per page
            .skip((page - 1) * limit); // Skip records based on the current page

        const employeeCount = await Employee.countDocuments(filter); // Get the total count of employees matching the filter

        res.json({
            employeeCount, // Total number of employees
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(employeeCount / limit), // Total number of pages
            employees // Paginated employees
        });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};

// GET ALL DISABLED-----------------------------------------------------------------------------------------------------
exports.getAllDisabledEmployee = async (req, res) => {
    try {
        const { employeeName, page = 1, limit = 50 } = req.query; // Add page and limit query parameters

        let filter = { status: 'Disabled' };  

        if (employeeName) {
            filter.employeeName = { $regex: employeeName, $options: 'i' }; 
        }

        const employees = await Employee.find(filter)
            .limit(parseInt(limit)) // Limit the number of results per page
            .skip((page - 1) * limit); // Skip records based on the current page

        const employeeCount = await Employee.countDocuments(filter); // Get the total count of employees matching the filter

        res.json({
            employeeCount, // Total number of employees
            currentPage: parseInt(page), // Current page number
            totalPages: Math.ceil(employeeCount / limit), // Total number of pages
            employees // Paginated employees
        });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send('Server Error');
    }
};