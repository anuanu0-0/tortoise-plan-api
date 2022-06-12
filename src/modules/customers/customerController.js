const customerService = require('./customerService');
const {BENEFIT_TYPE, PROMOTION_TYPE} = require('../../helper/enum');

const addNewCustomer = async(req, res) => {
    const response = { status: false };
    try {
        const {name, email, mobile} = req.body;
        const customerReqObj = {name, email, mobile};
        const seriveResponse = await customerService.addCustomer(customerReqObj);
        res.status(200).send(seriveResponse);
    } catch (e) {
        console.log("Error in customerController addNewCustomer()" + e.message);
        response.message = e.message;
        return response;
    }}


const getPlans = async(req, res) => {
    const response = { status: false };
    try {
        const seriveResponse = await customerService.getPlans();
        res.status(200).send(seriveResponse);
    } catch (e) {
        console.log("Error in customerController getPlans()" + e.message);
        response.message = e.message;
        return response;
    }
}

const enrollUser = async(req, res) => {
    const response = { status: false };
    try {
        const { plan_id, user_id, promotion_id, deposited_amount, promotion_type } = req.body;
        const {promotion_applied} = req.query;
        const enrollUserReqObj = {
            planId: plan_id, 
            userId: user_id,
            promotionId: promotion_id,
            // selectedAmount: selected_amount,
            // selected_tenure: selected_tenure,
            // benefitPercentage: benefit_percentage,
            // benefitType: benefit_type,
            startedDate: new Date(),
            depositedAmount: deposited_amount,
            promotionApplied: promotion_applied || false,
            promotionType: promotion_type || PROMOTION_TYPE.NONE
        };

        const seriveResponse = await customerService.enrollUser(enrollUserReqObj);
        res.status(200).send(seriveResponse);
    } catch (e) {
        console.log("Error in customerController enrollUser()" + e.message);
        response.message = e.message;
        return response;
    }
}

module.exports = {
    getPlans,
    enrollUser,
    addNewCustomer
}