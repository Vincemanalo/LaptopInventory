const { check, body } = require('express-validator');

//VALIDATION FOR LOGIN
exports.validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address')
        .matches(/^[a-zA-Z0-9@.]+$/).withMessage('Invalid email format')
        .escape(), 
    
    body('password')
        .trim()
        .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password contains invalid characters')
        .customSanitizer(value => {
            return value.replace(/<script.*?>.*?<\/script>/g, '').replace(/[<>]/g, ''); 
        })
        .matches(/^[^\s;'"]+$/).withMessage('Password contains forbidden characters!'),
];

// VALIDATION FOR LAPTOP
exports.validateLaptopInput = [
    body('laptopName')
        .trim()
        .isLength({ min: 1 }).withMessage('Laptop name is required')
        .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Laptop name should not contain special characters')
        .escape(), 

    body('laptopSerialNumber')
        .trim()
        .isLength({ min: 1 }).withMessage('Laptop serial number is required')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('Laptop serial number should only contain alphanumeric characters')
        .escape(), 

    body('laptopDescription')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in laptop location')
        .escape(), 

    body('laptopPurchaseDate')
        .isISO8601().withMessage('Invalid date format'), 

    body('laptopLocation')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in laptop location')
        .escape(), 

    body('laptopCondition')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Laptop condition should only contain alphabetic characters')
        .escape(), 

    body('laptopPreviousOwner')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Previous owner should only contain alphabetic characters')
        .escape(),

    body('inspectedBy')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Inspected by should only contain alphabetic characters')
        .escape(), 
];

// VALIDATION FOR DESKTOP---------------------------------------------------------------------------------------------
exports.validateDesktopInput = [
    body('desktopName')
        .trim()
        .isLength({ min: 1 }).withMessage('Desktop name is required')
        .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Desktop name should not contain special characters')
        .escape(), 

    body('desktopSerialNumber')
        .trim()
        .isLength({ min: 1 }).withMessage('Desktop serial number is required')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('Desktop serial number should only contain alphanumeric characters')
        .escape(), 

    body('desktopModel')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop model')
        .escape(), 

    body('desktopProcessor')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop processor')
        .escape(), 

    body('desktopRam')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop ram')
        .escape(), 

    body('desktopPurchaseDate')
        .isISO8601().withMessage('Invalid date format'), 

    body('desktopLocation')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop location')
        .escape(), 

    body('desktopCondition')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Laptop condition should only contain alphabetic characters')
        .escape(), 

    body('desktopPreviousOwner')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Previous owner should only contain alphabetic characters')
        .escape(),

    body('inspectedBy')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Inspected by should only contain alphabetic characters')
        .escape(), 
];

// VALIDATION FOR SERVER---------------------------------------------------------------------------------------------
exports.validateServerInput = [
    body('serverName')
        .trim()
        .isLength({ min: 1 }).withMessage('Desktop name is required')
        .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Desktop name should not contain special characters')
        .escape(), 

    body('serverSerialNumber')
        .trim()
        .isLength({ min: 1 }).withMessage('Desktop serial number is required')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('Desktop serial number should only contain alphanumeric characters')
        .escape(), 

    body('serverOs')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop model')
        .escape(), 

    body('serverProcessor')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop processor')
        .escape(), 

    body('serverRam')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop ram')
        .escape(), 

    body('serverPurchaseDate')
        .isISO8601().withMessage('Invalid date format'), 

    body('serverLocation')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9\s,.-]+$/).withMessage('Invalid characters in desktop location')
        .escape(), 

    body('serverCondition')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Laptop condition should only contain alphabetic characters')
        .escape(), 

    body('inspectedBy')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Inspected by should only contain alphabetic characters')
        .escape(), 
];

// VALIDATION FOR EMPLOYEE---------------------------------------------------------------------------------------------
exports.validateEmployeeInput = [
    body('employeeName')
        .trim()
        .isLength({ min: 1 }).withMessage('Employee name is required')
        .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Employee name should not contain special characters')
        .escape(), 

    body('employmentDate')
        .isISO8601().withMessage('Invalid date format'), 
];
