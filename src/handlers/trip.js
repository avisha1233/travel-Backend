import { Router } from "express";
//import {createTripValidator} from "../validators/trip.js";
import {
  create,
  findAll,
  findById,
  update,
  remove,
  addExpenses,
  inviteCollaborators,
  acceptInvitation,
  uploadFiles,
} from "../services/trip.js";
import { useValidator } from "../middlewares/useValidator.js";
import multer from "multer";
import {
  createTripValidator,
  inviteCollaboratorValidator,
} from "../validators/trip.js";

const router = Router();

const upload = multer({ dest: "uploads/" }); // Configure multer for file uploads

router.post("/", useValidator(createTripValidator), create);
router.get("/", findAll);
router.get("/:id", findById);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/:id/expenses", addExpenses);
router.post(
  "/:id/invite",
  useValidator(inviteCollaboratorValidator),
  inviteCollaborators
);
router.get("/:id/invite/accept", acceptInvitation); // Assuming this is for accepting invitations
router.post("/:id/files", upload.array("files"), uploadFiles); // Handle file uploads

export default router;
