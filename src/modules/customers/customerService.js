const customerRepository = require("./customerRepository");
const constants = require("../../helper/constants");
const { PROMOTION_TYPE } = require("../../helper/enum");
const adminRepository = require("../admin/adminRepository");

const addCustomer = async (customerDetails) => {
  const response = { status: false };
  try {
    await customerRepository.addCustomer(customerDetails);
    response.message = constants.CUSTOMER_ADDED_SUCCESSFULL;
    response.status = true;
    return response;
  } catch (e) {
    logger.info("Error in adminService addCustomer() - " + e.message);
    response.message = e.message;
    return response;
  }
};

const getPlans = async () => {
  const response = { status: false };
  try {
    const plansQueryRes = await customerRepository.getAllPlans();
    const plans = plansQueryRes.rows;
    console.log("Plan details: ", plans);
    response.status = true;
    response.data = plans;
    return response;
  } catch (e) {
    console.log("Error in customerService getPlans()" + e.message);
    response.message = e.message;
    return response;
  }
};

const managePromotions = async (currentDate, promotionId) => {
  const response = { data: null, error: null };
  try {
    let promotionQueryRes = await customerRepository.getPromotionDetailsById(
      promotionId
    );
    const {
      benefit_percentage: benefitPercentage,
      promotion_type: promotionType,
    } = promotionQueryRes.rows[0];

    if (!promotionQueryRes.rowCount || promotionType === PROMOTION_TYPE.NONE) {
      response.error = { message: constants.INVALID_PROMOTION };
      return response;
    }

    if (promotionType === PROMOTION_TYPE.LIMIT_BY_USERS) {
      let numUsers = promotionQueryRes.rows[0].no_of_users;
      if (numUsers <= 0) {
        response.error = { message: constants.INVALID_PROMOTION };
        return response;
      } else {
        numUsers = numUsers - 1;
        await customerRepository.decreaseUserCount(promotionId, numUsers);
      }
    } else if (promotionType === PROMOTION_TYPE.LIMIT_BY_PERIOD) {
      const { start_date, end_date } = promotionQueryRes.rows[0];
      const start = new Date(start_date);
      const end = new Date(end_date);
      if (currentDate < start && currentDate > end) {
        response.error = { message: constants.INVALID_PROMOTION };
        return response;
      }
    }

    const getUsersQueryRes = await customerRepository.getUsers(promotionId);
    const usersCount = getUsersQueryRes.rows[0].total_users + 1;
    await customerRepository.updateTotalUserCount(usersCount, promotionId);

    response.data = {
      promotionType,
      benefitPercentage,
    };
    return response;
  } catch (e) {
    console.log("Error in customerService managePromotions()" + e.message);
    throw e;
  }
};

/**
 * FLOW : Enroll customer with / without promotion
 *  0. Check if plan is valid and get plan details from plans table by plan id.
 *  1. Check if customer applied promotion.
 *  2. If promotion is applied :
 *      2.1. Check promotion validity.
 *      2.2. If valid then get promotion details from promotions db and for users limit update value in promotions table.
 *      2.3. Else if not valid then return error message for invalid promotion.
 *  3. Promotion details are valid => Add Customer to customergoals table
 * ***/
const enrollUser = async (planDetails) => {
  const response = { status: false };
  try {
    const {
      promotionApplied,
      planId,
      userId,
      promotionId,
      startedDate,
      depositedAmount,
    } = planDetails;
    let { promotionType } = planDetails;
    const isPlanValidQueryRes = await adminRepository.getPlanById(planId);
    if (!isPlanValidQueryRes.rowCount) {
      response.message = constants.INVALID_PLAN;
      return response;
    }

    const plan = isPlanValidQueryRes.rows[0];
    let promotionValidityResponse = null;
    if (promotionApplied) {
      promotionValidityResponse = await managePromotions(
        startedDate,
        promotionId
      );
      const isValidPromotion = promotionValidityResponse.error;
      if (isValidPromotion && !isValidPromotion.message) {
        response.message = isValidPromotion.message;
        return response;
      }
    }

    const {
      amount_options: amount,
      tenure_options,
      benefit_type,
    } = isPlanValidQueryRes.rows[0];
    const { benefitPercentage } = promotionValidityResponse.data;
    promotionType = promotionValidityResponse.data.promotionType;

    if (amount > depositedAmount) {
      response.message = constants.LOW_BALANCE;
      return response;
    }

    const planDetailsObj = {
      planId,
      userId,
      amount,
      tenure: tenure_options,
      startedDate,
      depositedAmount,
      benefitPercentage,
      benefitType: benefit_type,
      promotionApplied,
      promotionType,
    };

    await customerRepository.enrollUser(planDetailsObj);
    response.status = true;
    response.message = constants.USER_ENROLLMENT_SUCCESSFULL;
    return response;
  } catch (e) {
    console.log("Error in customerService enrollUser()" + e.message);
    response.message = e.message;
    return response;
  }
};

module.exports = {
  getPlans,
  enrollUser,
  addCustomer,
};
