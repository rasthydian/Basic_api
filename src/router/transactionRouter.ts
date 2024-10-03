import { Router } from "express";
import { createTransaction, deleteTransaction, readTransaction, updateTransaction } from "../controller/transactionController";
import { createValidation } from "../middleware/transactionValidation";
import { verifyToken } from "../middleware/authorization";
import { updateValidation } from "../middleware/medicineValidation";

const router = Router()
router.post(`/`, [verifyToken, createValidation], createTransaction)
router.get(`/`, [verifyToken], readTransaction)
router.put(`/:id`, [verifyToken, updateValidation], updateTransaction)
router.delete(`/`, [verifyToken], deleteTransaction)
export default router