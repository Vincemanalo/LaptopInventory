const router = require('express').Router();
const laptopController = require('../controllers/laptopController');
const desktopController = require('../controllers/desktopController');
const serverController = require('../controllers/serverController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.route('/laptop/dashboard')
//   .get(authMiddleware, laptopController.getDashboard);
  
// router.route('/laptop/count')
//   .get(authMiddleware, laptopController.getLaptopCount); 

//LAPTOP ROUTES-----------------------------------------------------------------------------------------------------------
router.route('/laptop')
  .get(authMiddleware, laptopController.getAllLaptops) 
  .post(authMiddleware, laptopController.addNewLaptop); 

router.route('/laptop/:id')
  .put(authMiddleware, laptopController.updateLaptop)   
  .patch(authMiddleware, laptopController.disableLaptop); 

router.route('/laptop/archived')
  .get(authMiddleware, laptopController.getAllDisabledLaptop);

router.route('/laptop/archived/:id')
  .patch(authMiddleware, laptopController.retrieveLaptop);

//DESKTOP ROUTES----------------------------------------------------------------------------------------------------------
router.route('/desktop')
  .get(authMiddleware, desktopController.getAllDesktop) 
  .post(authMiddleware, desktopController.addNewDesktop); 

router.route('/desktop/:id')
  .put(authMiddleware, desktopController.updateDesktop)
  .patch(authMiddleware, desktopController.disableDesktop);

router.route('/desktop/archived')
  .get(authMiddleware, desktopController.getAllDisabledDesktop);

router.route('/desktop/archived/:id')
  .patch(authMiddleware, desktopController.retrieveDesktop);  

//SERVER ROUTES----------------------------------------------------------------------------------------------------------
router.route('/server')
  .get(authMiddleware, serverController.getAllServer) 
  .post(authMiddleware, serverController.addNewServer); 

router.route('/server/:id')
  .put(authMiddleware, serverController.updateServer)
  .patch(authMiddleware, serverController.disableServer);

router.route('/server/archived')
  .get(authMiddleware, serverController.getAllDisabledServer);

router.route('/server/archived/:id')
  .patch(authMiddleware, serverController.retrieveServer);  

module.exports = router;
