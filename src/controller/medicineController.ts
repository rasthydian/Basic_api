import { Request, Response } from "express";
import { PrismaClient } from "prisma/prisma-client";

/** create object of prisma */
const prisma = new PrismaClient({ errorFormat: "minimal" })
type DrugType = "Syrup" | "Tablet" | "Powder"

const createMedicine = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const stock: number = Number(req.body.stock)
        const exp_date: Date = new Date(req.body.exp_date)
        const type: DrugType = req.body.type
        const price: number = Number(req.body.price)

        /** save a new medicine to database */
        const newMedicine = await prisma.medicine.create({
            data: {
                name, stock, exp_date, type, price
            }
        })
        return res.status(200).json({ message: `New medicine has been created` })
        data: newMedicine
    } catch (error) {
        return res.status(500).json(error)
    }
}

const readMedicine = async (
    req: Request, res: Response
) => {
    try {
        // get all medicine
        const allMedicine = await prisma.medicine.findMany()
        return res.status(200).json({
            message: `medicine has been retrieved`,
            data: allMedicine
        })
    } catch (error) {
        res.status(500).json(error)
        
    }
}
export { createMedicine, readMedicine }