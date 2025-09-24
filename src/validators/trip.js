import {body} from 'express-validator';

export const createTripValidator = [
    body("title")
    .notEmpty().withMessage("Title is required"),
    body("startDate")
    .notEmpty().withMessage("startDate is required"),
    body("endDate")
    .trim()
    .notEmpty().withMessage("endDate is required")
    

    .custom((value, {req}) => {
        if(value < req.body.startDate) {
            throw new Error("End date must be after start date");
        }
        return true;
    }),
    body("destinations")
    .trim()
    .isArray().withMessage("Destinations must be an array"),
body("budget.total")
.trim()
.isNumeric().withMessage("Total budget must be a number"),
    body("budget.spent")
    .trim()
    .notEmpty().withMessage(" spent amount must be a number"),
    body("budget.expenses")
    .optional()
    .isArray()
    .withMessage("Expenses must be an array"),
    body("budget.expenses.*.name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Expense name is required"),
    body("budget.expenses.*.amount")

];

export const inviteCollaboratorValidator = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required "   )
    .isArray()
    .withMessage("Email must be an array"),
    body("email.*")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email address"),

];
