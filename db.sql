/******* DEMO DATABASE SCHEMA **********/
-- TODO: REDESIGN DATABASE SCHEMA

create database tortoise_plan;

\c tortoise_plan

CREATE TYPE BenefitType as ENUM ('NONE', 'CASHBACK', 'EXTRA_VOUCHER');
CREATE TYPE PromotionType as ENUM ('NONE', 'USER_LIMIT', 'TIME_LIMIT');

CREATE TABLE IF NOT EXISTS plans(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    amount_options integer NOT NULL,
    tenure_options integer NOT NULL,
    benefit_percentage integer DEFAULT 0,
    benefit_type BenefitType DEFAULT 'NONE'
);

CREATE TABLE IF NOT EXISTS promotions(
    id SERIAL PRIMARY KEY,
    plan_id int NOT NULL,
    benefit_percentage integer NOT NULL DEFAULT 0,
    promotion_type PromotionType NOT NULL DEFAULT 'NONE',
    no_of_users integer DEFAULT NULL,
    start_date DATE NULL DEFAULT CURRENT_DATE,
    end_date DATE DEFAULT NULL
); 

CREATE TABLE IF NOT EXISTS customers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(300) DEFAULT NULL,
    mobile VARCHAR(300) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS customerGoals(
    id SERIAL PRIMARY KEY,
    plan_id integer NOT NULL,
    user_id integer NOT NULL,
    selected_amount integer NOT NULL DEFAULT 0,
    selected_tenure integer NOT NULL DEFAULT 0, 
    started_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deposited_amount integer DEFAULT 0,
    benefit_percentage integer NOT NULL,
    benefit_type BenefitType DEFAULT 'NONE',
    promotion_applied BOOLEAN NOT NULL DEFAULT 'false',
    promotion_type PromotionType NOT NULL DEFAULT 'NONE'
);

--  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP