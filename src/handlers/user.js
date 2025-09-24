import { Router } from "express";
import { createUser } from "../services/user.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createUserValidator } from "../validators/user.js";

const router = Router();

router.post("/", useValidator(createUserValidator), createUser);

export default router;
