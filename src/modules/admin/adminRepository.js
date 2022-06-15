const pool = require("../../config/dbConfig");
const logger = require('../../utils/logger');

const getAllPromotions = async () => {
    try {
        const query = "SELECT * FROM promotions";
        const params = [];
        return await pool.query(query, params);
    } catch (e) {
        logger.info("Error in adminRepository getAllPromotions() - " + e.message);
        throw e;
    }
}

const addPlan = async(planDetails) => {
    try {
        const { name, amount, tenure, benefitPercentage, benefitType } = planDetails;
        const query = "INSERT INTO plans(name, amount_options, tenure_options, benefit_percentage, benefit_type) VALUES ($1,$2,$3,$4, $5)";
        const params = [name, amount, tenure, benefitPercentage, benefitType];
        await pool.query(query, params);
    } catch (e) {
        logger.info("Error in adminRepository addPlan - " + e.message);
        throw e;
    }
}

const getPlanById = async(planId) => {
    try {
        const query = "SELECT * FROM plans WHERE id = $1";
        const params = [planId];
        return await pool.query(query, params);
    } catch (e) {
        logger.info("Error in adminRepository getPlanById - " + e.message);
        throw e;
    }
}

const updatePlan = async(planDetails) => {
    try { 
        const query = "UPDATE plans SET benefit_percentage = $1";
        const params = [planId];
        await pool.query(query, params);
    } catch (e) {
        logger.info("Error in adminRepository updatePlan - " + e.message);
        throw e;
    }
}

const addPromotion = async(promotionDetails) => {
    try {
        const {planId, promotionType, benefitPercentage, noOfUsers, startDate, endDate} = promotionDetails;
        const query = "INSERT INTO promotions(plan_id, benefit_percentage, promotion_type, no_of_users, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6)";
        const params = [planId, benefitPercentage, promotionType, noOfUsers, startDate, endDate];
        await pool.query(query, params);
    } catch (e) {
        logger.info("Error in adminRepository addPromotion - " + e.message);
        throw e;
    }
}

module.exports = {
    addPlan,
    getPlanById,
    updatePlan,
    addPromotion,
    getAllPromotions
}