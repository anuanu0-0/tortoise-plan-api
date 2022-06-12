const router = require('express').Router();
// const {validate} = require("./../middleware/authenticate");
const customerController = require("./customerController");

router.post('/add', customerController.addNewCustomer);

router.get('/', customerController.getPlans);
router.post('/enroll', customerController.enrollUser);

module.exports = router;