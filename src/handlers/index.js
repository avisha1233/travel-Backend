import { Router } from "express";
import packageList from "./packageList.js";
import user from "./user.js"; // Assuming you have a user handler
import auth from "./auth.js"; // Assuming you have an auth handler
import trip from "./trip.js"; // Assuming you have a trip handler
import itinerary from "./itinerary.js";

const router = Router();

router.use("/package-lists", packageList);
router.use("/users", user); // Assuming you have a user handler
router.use("/auth",auth);
router.use("/trips", trip); // Assuming you have a trip handler
router.use("/itineraries",itinerary);

export default router;
