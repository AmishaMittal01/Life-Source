// backend/routes/screeningRoutes.js
import express from "express";
import { submitScreening } from "../controllers/screeningController.js";
import { recordDonation } from "../controllers/donationController.js";

const router = express.Router();

router.post("/submit", submitScreening);
router.post("/donate", recordDonation);

export default router;
