import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { isTemplateExpression } from "typescript";
import { object } from "joi";

const prisma = new PrismaClient({
    errorFormat: `minimal`
})
type TransactionDetail = {
    medicine_id: number
    qty: number
}
const createTransaction = async (req: Request, res: Response) => {
    try {
        /** read a request data */
        const cashier_name: string = req.body.cashier_name
        const order_date: Date = new Date(req.body.order_date)
        const transaction_detail: TransactionDetail[] = req.body.transaction_detail

        /** checking medicine ( memastikan id obat tersedia) */
        const arrMedicineId = transaction_detail.map(item => item.medicine_id)
        /** check medicine id at medicine table */
        const findMedicine = await prisma.medicine.findMany({
            where: {
                id: { in: arrMedicineId }
            }
        })

        /** check id obat yang tidak tersedia */
        const notFoundMedicine = arrMedicineId.filter(item => !findMedicine.map(obat => obat.id).includes(item))
        if (notFoundMedicine.length > 0) {
            return res.status(200).json({
                message: `There are medicine that not exist`
            })
        }

        /** save transaction data  */
        const newTransaction = await prisma.transaction.create({
            data: {
                cashier_name,
                order_date
            }
        })

        /** prepare data for transaction_detail */
        let newDetail = []
        for (let index = 0; index < transaction_detail.length; index++) {
            const {
                medicine_id, qty
            } = transaction_detail[index]
            /** find price at each medicine  */
            const medicineItem = findMedicine.find(item => item.id == medicine_id)

            /** push data to array  */
            newDetail.push({
                transaction_id: newTransaction.id,
                medicine_id,
                qty,
                order_price: medicineItem?.price || 0

            })
        }
        /** save transaction detail */
        await prisma.transaction_detail.createMany({
            data: newDetail
        })
        return res.status(200).json({
            message: ` New transaction has been created `
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const readTransaction = async (req: Request, res: Response) => {
    try {
        // mendapatkan seluruh data transaksi sekaligus detail di tiap transaksi
        let allTransactions = await prisma.transaction.findMany({
            include: {
                transaction_detail: {
                    include: { medicine_detail: true }
                }
            }
        })

        // menentukan total data disetiap transaksi

        allTransactions = allTransactions.map(trans => {
            let total = trans.transaction_detail
            .reduce((jumlah, detail) => jumlah + (detail.order_price * detail.qty),0)
            // 0 berfungsi sebagai total awal
            return{
                ...trans, total
            }
        })
        return res.status(200).json({
            message: `transaction has been retrieved`,
            data: allTransactions
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

const deleteTransaction = async (res: Response, req: Request) => {
    try {
        const {id} = req.params

        const findTransaction = await prisma.transaction.findFirst ({where: {id:Number(id)}})
if(!findTransaction){
    return res.status(400).json({
        message: `transaction is not found`
    })
}
//  hapus detail transaksi dulu, 
// karna detail transaksi adalah tabel yang tergantung pada tabel transaksi 

await prisma.transaction_detail.deleteMany({where:{transaction_id: Number(id)}})

await prisma.transaction_detail.delete({where: {id:Number(id)}})

return res.status(200).json({
    message: `transaction has been removed`
})
    } catch (error) {
        return res.status(500).json(error)
    }
}

const updateTransaction = async (req: Request, res: Response) => {
    try {
        /** read id transaction from req params */
        const { id } = req.params

        /** check that transaction exists based on "id" */
        const findTransaction = await prisma.transaction.findFirst({
            where: { id: Number(id) },
            include: { transaction_detail: true }
        })
        if (!findTransaction) {
            return res.status(400).json({ message: `Transaction is not found` })
        }

        /** read a request data */
        const cashier_name: string = req.body.cashier_name || findTransaction.cashier_name
        const order_date: Date = new Date(req.body.order_date || findTransaction.order_date)
        const transaction_detail: TransactionDetail[] = req.body.transaction_detail || findTransaction.transaction_detail

        /** empty detail transaction based on transaction id */
        await prisma.transaction_detail.deleteMany({
            where: { transaction_id: Number(id) }
        })

        /** checking medicine (memastikan id obat tersedia) */
        /** kumpilin id obat yang dikirimkan */
        const arrMedicineId = transaction_detail.map(item => item.medicine_id)

        /** check medicine id at medicine table */
        const findMedicine = await prisma.medicine.findMany({
            where: {
                id: { in: arrMedicineId }
            }
        })

        /** cek id obat yang tidak tersedia */
        const notFoundMedicine = arrMedicineId.filter(item => !findMedicine.map(obat => obat.id).includes(item))

        if (notFoundMedicine.length > 0) {
            return res.status(200).json({ message: `There are medicine not exists` })
        }

        /** save transaction data */
        const saveTransaction = await prisma.transaction.update({
            where: {
                id: Number(id)
            },
            data: {
                cashier_name,
                order_date
            }
        })

        /** prepare data for transaction_detail */
        let newDetail = []
        for (let index = 0; index < transaction_detail.length; index++) {
            const {
                medicine_id, qty
            } = transaction_detail[index]

            /** find rpice at each medicine */
            const medicineItem = findMedicine.find(item => item.id == medicine_id)

            /** push data to array */
            newDetail.push({
                transaction_id: saveTransaction.id,
                medicine_id,
                qty,
                order_price: medicineItem?.price || 0
            })

        }

        /** save transaction detail */
        await prisma.transaction_detail.createMany({
            data: newDetail
        })
        return res.status(200).json({ message: ` New Transaction has been updated` })

    } catch (error) {
        console.log(error);

        return res.status(500).json(error)
    }
}


export { createTransaction, readTransaction, deleteTransaction, updateTransaction }
