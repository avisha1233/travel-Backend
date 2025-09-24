import {body,param } from 'express-validator';

export const createItineraryValidator = [
    param("title").trim().notEmpty().withMessage("Trip is required")
    .isMongoId().withMessage("Trip ID must be a valid MongoDB ObjectId"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().optional(),
    body("date")
        .trim()
        .notEmpty()
        .withMessage("Date is required")
        .isDate()
        .withMessage("Date must be a valid date"),
    body("activities").isArray().withMessage("Activities must be an array"),
    body("activities.*.name")
    .trim()
        .notEmpty()
        .withMessage("Activity name is required"),
    body("activities.*.time")
        .trim()
        .notEmpty()
        .withMessage("Activity time is required"),
    body("activities.*.notes")//eutai array ma multiple notes huna sakxa 
        .trim()
        .isArray()
        .withMessage("Notes must be an array"),
    body("activities.*.notes.*")
        .trim()
        .notEmpty()
        .withMessage("note is required"),
];
    