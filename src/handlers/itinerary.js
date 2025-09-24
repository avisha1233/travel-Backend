import { Router } from "express";
import {
  createItinerary,
  findAll,
  findById,
  update,
} from "../services/itinerary.js";
import { createItineraryValidator } from "../validators/itinerary.js";
import { useValidator } from "../middlewares/useValidator.js";

const router = Router();

router.post(
  "/:tripId",
  useValidator(createItineraryValidator),
  createItinerary
);
router.get("/:tripId", findAll);
router.get("/:tripId/:id", findById); //yaa hamiley paila tripko id halxum ani tespaxi itinerary id halxum .trip ra itinerary associate xa.
router.patch("/:tripId", update);
export default router;
