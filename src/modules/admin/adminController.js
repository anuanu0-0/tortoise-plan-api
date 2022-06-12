const adminService = require('./adminService');
const {BENEFIT_TYPE, PROMOTION_TYPE} = require('../../helper/enum');
const logger = require('../../utils/logger');

const createPlan = async(req, res) => {
    const response = { status: false };
    try {
        const {name, amount, tenure, benefit_percentage, benefit_type} = req.body;
        const planRequestObj = {
            name,
            amount: amount,
            tenure: tenure,
            benefitPercentage: benefit_percentage,
            benefitType: benefit_type || BENEFIT_TYPE.NONE
        };
        const seriveResponse = await adminService.createPlan(planRequestObj);
        res.status(200).send(seriveResponse);
    } catch (e) {
        logger.info("Error in adminController createPlan() - " + e.message);
        response.message = e.message;
        return response;
    }
}

const createPromotion = async(req, res) => {
    const response = { status: false };
    try {
        const { plan_id, promotion_type, benefit_percentage, no_of_users, start_date, end_date } = req.body;
        const promotionRequestObj = {
            planId: plan_id,
            benefitPercentage: benefit_percentage,
            promotionType: promotion_type || PROMOTION_TYPE.NONE,
            noOfUsers: no_of_users,
            startDate: new Date(start_date) || new Date(),
            endDate: new Date(end_date) || null
        };
        const seriveResponse = await adminService.createPromotion(promotionRequestObj);
        res.status(200).send(seriveResponse);
    } catch (e) {
        logger.info("Error in adminController createPromotion() - " + e.message);
        response.message = e.message;
        return response;
    }
}

module.exports = {
    createPlan, 
    createPromotion
}