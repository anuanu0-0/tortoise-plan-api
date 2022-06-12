# tortoise-plan-api

Coding assignment

## System flow

### Admin

- Admin creates plan
- Admin creates promotion for plans

### Customers

- Customer login/signup
- Customer enroll in a plan. Customer applies available promotion while enrolling.

## Brand Partner / Admin

- Create plans with default benefit_percentages (5%, 10% ....)
- Create promotions

### Plans table

| id  | name     | amount_option | tenure_option (in days) | benefit_percentage (default) | benefit_type |
| --- | -------- | ------------- | ----------------------- | ---------------------------- | ------------ |
| 1   | Student  | 200           | 60                      | 5                            | CASHBACK     |
| 2   | Employee | 500           | 180                     | 15                           | VOUCHER      |

### Promotions table

| id  | benefit_percentage | promotion_type  | no_of_users | start_date | end_date |
| --- | ------------------ | --------------- | ----------- | ---------- | -------- |
| 1   | 20                 | LIMIT_BY_USER   | 5           | null       | null     |
| 2   | 50                 | LIMIT_BY_PERIOD | null        | 11/06/22   | 17/06/22 |

#### Assumptions :

- Plans table with contain only default benefit percentage.
- For simplicity assuming random range values for amount and tenure
- By default if no benefit_type is provided, it will be set to NONE.

## Customer

- Store customer data in customers table. (Login/signup)
- Enroll customer into any of the plans.
- Customer can apply promotion while enrolling in the plan
<!-- or after enrolling in the plan. In later case, promotion can be applied only before the end date. -->

### Customer table

| id  | name        | email           | mobile    |
| --- | ----------- | --------------- | --------- |
| 1   | Anupam      | null            | null      |
| 2   | Demo-test   | xyz@gmail.com   | 656015151 |
| 3   | DemonSlayer | anime@gmail.com | null      |

### CustomerGoals table

| id  | plan_id | user_id | selected_amount | selected_tenure | start_date | deposited_amount | benefit_percentage | benefit_type | applied_promotion | promotion_type  |
| --- | ------- | ------- | --------------- | --------------- | ---------- | ---------------- | ------------------ | ------------ | ----------------- | --------------- |
| 1   | 1       | 1       | 200             | 60              | 12/06/22   | 1000             | 5                  | CASHBACK     | false             | LIMIT_BY_USER   |
| 2   | 1       | 3       | 200             | 60              | 12/06/22   | 200              | 20                 | CASHBACK     | true              | LIMIT_BY_USER   |
| 3   | 2       | 2       | 500             | 180             | 12/06/22   | 1500             | 50                 | VOUCHER      | true              | LIMIT_BY_PERIOD |

#### Assumptions :

- Ideally customer table stores login/signup details in addition to the above details
- Omitting sigin/signup functionality for simplicity.
- Omitting authentication and authorization for simplicity. Client have to pass userId and other details explicitly and will not be decoded from the auth token.
- Customer can leave mobile, email attributes null.
- user_id in customer goals table maps to id in customers table
- Deposited amount should be greater or equal to selected plan amount
