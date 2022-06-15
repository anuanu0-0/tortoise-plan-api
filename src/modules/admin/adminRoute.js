const router = require('express').Router();
// const {validate} = require("./../middleware/authenticate");
const adminController = require("./adminController");

/***
 * DONE : APIs
 *  1. Create plans
 *  2. Create promotion
 * 
 *  TODO: Add / Extract planId / userId from auth token
 * ***/

router.post('/create/plan', adminController.createPlan);
router.post('/create/promotion', adminController.createPromotion);

router.get('/promotion', adminController.getPromotions);

module.exports = router;