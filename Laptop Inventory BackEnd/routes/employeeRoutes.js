const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/employee')
  .get(authMiddleware, employeeController.getAllEmployee)  
  .post(authMiddleware, employeeController.addNewEmployee);

router.route('/employee/:id')
  .put(authMiddleware, employeeController.updateEmployee) 
  .patch(authMiddleware, employeeController.disableEmployee);

router.route('/employee/archived')
  .get(authMiddleware, employeeController.getAllDisabledEmployee);

router.route('/employee/archived/:id')
  .patch(authMiddleware, employeeController.retrieveEmployee);
  
module.exports = router;
