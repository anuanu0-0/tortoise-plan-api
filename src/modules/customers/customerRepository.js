const pool = require("../../config/dbConfig");

const addCustomer = async(customerDetails) => {
    try {
        const {name, email, mobile} = customerDetails;
        const query = "INSERT INTO customers(name, email, mobile) VALUES($1,$2,$3)";
        const params = [name, email, mobile];
        await pool.query(query, params);
    } catch(e) {
        console.log("Error in customerRepository addCustomer " + e.message);
        throw e;
    }
}

const getAllPlans = async () => {
    try {
        const query = "SELECT * FROM plans";
        const params = [];
        return await pool.query(query, params);
    } catch (e) {
        console.log("Error in customerRepository getAllPlans " + e.message);
        throw e;
    }
}

const enrollUser = async (planDetails) => {
    try {
        const { 
            planId, userId, amount, tenure, startedDate, depositedAmount, 
            benefitPercentage, benefitType, promotionApplied, promotionType
        } = planDetails;

        const query = "INSERT INTO customergoals(plan_id, user_id, selected_amount, selected_tenure," +
                      "started_date, deposited_amount, benefit_percentage, benefit_type, promotion_applied, promotion_type)" +
                      "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        const params = [planId, userId, amount, tenure, startedDate, depositedAmount,
                        benefitPercentage, benefitType, promotionApplied, promotionType];
        return await pool.query(query, params);
    } catch (e) {
        console.log("Error in customerRepository enrollUser " + e.message);
        throw e;
    }
}

const getPromotionDetailsById = async(promotionId) => {
    try {
        const query = "SELECT * FROM promotions p WHERE id=$1";
        const params = [promotionId];
        return await pool.query(query, params);
    } catch (e) {
        console.log("Error in customerRepository getPromotionDetailsById" + e.message);
        throw e; 
    }
}

const decreaseUserCount = async(promotionId, numUsers) => {
    try {
        const query = "UPDATE promotions SET no_of_users = $1 WHERE id = $2";
        const params = [numUsers, promotionId];
        await pool.query(query, params);
    } catch (e) {
        console.log("Error in customerRepository decreaseUserCount " + e.message);
        throw e; 
    }
}

module.exports = {
    getAllPlans,
    enrollUser,
    addCustomer,
    getPromotionDetailsById,
    decreaseUserCount
}