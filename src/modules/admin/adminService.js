const adminRepository = require('./adminRepository');
const constants = require('../../helper/constants');
const {BENEFIT_TYPE, PROMOTION_TYPE} = require('../../helper/enum');
const logger = require('../../utils/logger');


const createPlan = async(planDetails) => {
    const response = { status: false };
    try {
        await adminRepository.addPlan(planDetails);
        response.message = constants.PLAN_CREATED_SUCESSFULLY;
        response.status = true;
        return response;
    } catch (e) {
        logger.info("Error in adminService createPlan() - " + e.message);
        response.message = e.message;
        return response;
    }
}

const checkPlanValidity = async(planId) => {
    try {
        const isPlanValidQueryRes = await adminRepository.getPlanById(planId);
        const planExists = isPlanValidQueryRes.rowCount;
        if (planExists) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        logger.info("Error in adminService checkPlanValidity() - " + e.message);
        throw e;
    }
}

// Promotion can be limited in two ways
// i. By the number of users to get the promotion (for example: 500 users)
// ii. By a time period (for example: 22th May 2022 to 24th May 2022)
// b. Assume that promotion can only affect benefitPercentage for a given plan

const userPromotionHelper = (noOfUsers) => {
    try {
        if (noOfUsers && noOfUsers > 0) {
            return true;
        }
        return false;
    } catch (e) {   
        logger.info("Error in adminService userPromotionHelper() - " + e.message);
        throw e;
    }
}

const periodPromotionHelper = (startDate, endDate) => {
    try {
        if (startDate && endDate && endDate > startDate) {
            return true;
        } 
        return false;
    } catch (e) {   
        logger.info("Error in adminService periodPromotionHelper() - " + e.message);
        throw e;
    }
}

const createPromotion = async(promotionDetails) => {
    const response = { status: false };
    try {
        const {planId, promotionType, noOfUsers, startDate, endDate} = promotionDetails;
        const isPlanValid = await checkPlanValidity(planId); 
        if (!isPlanValid) {
            response.message = constants.INVALID_PLAN;
            return response;
        }

        /**
         * IMPROVEMENT : FACTORY PATTERN, if promotion types have scope of increasing
         * ***/
        let isPromotionValid = null;
        if (promotionType === PROMOTION_TYPE.LIMIT_BY_USERS) {
            isPromotionValid = userPromotionHelper(noOfUsers);
        } else if (promotionType === PROMOTION_TYPE.LIMIT_BY_PERIOD) {
            isPromotionValid = periodPromotionHelper(startDate, endDate);
        } else {
            response.message = constants.INVALID_REQUEST;
            return response;
        }

        if (!isPromotionValid) {
            response.message = constants.INVALID_REQUEST;
            return response;
        }
        
        await adminRepository.addPromotion(promotionDetails);
        response.status = true;
        response.message = constants.PROMOTION_CREATED_SUCESSFULLY;
        return response;
    } catch (e) {
        logger.info("Error in adminService createPromotion() - " + e.message);
        response.message = e.message;
        return response;
    }
}



module.exports = {
    createPlan, 
    createPromotion,
    checkPlanValidity
}