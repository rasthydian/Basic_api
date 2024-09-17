import { Router } from "express";
import { createMedicine, readMedicine } from "../controller/medicineController";
import { createValidation } from "../middleware/medicineValidation";

const router = Router()

/** route for add new medicine */
router.post(`/`,[createValidation], createMedicine)

// route for add show all medicine
router.get(`/`, readMedicine)

export default router