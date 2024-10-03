import { Request, Response } from "express";
import { PrismaClient } from "prisma/prisma-client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "minimal" })
const createAdmin = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const email: string = req.body.email
        const password: string = req.body.password
        const findEmail = await prisma.admin.findFirst({ where: { email: email } })
        if (findEmail) {
            return res.status(400).json({ message: `Email has exists` })
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const newAdmin = await prisma.admin.create({
            data: {
                nama_admin: name, email: email, password: hashPassword,
            }
        })
        return res.status(200).json({
            message: `New admin has been created`,
            data: newAdmin
        })
        data: newAdmin
    } catch (error) {
        return res.status(500).json(error)
    }
}

const readAdmin = async (req: Request, res: Response) => {
    try {
        const search = req.query.search
        /** get all medicine */
        const allAdmin = await prisma.admin.findMany({
            where: { OR: [{ nama_admin: { contains: search?.toString() || "" } },] }
        })
        return res.status(200).json({
            message: `admin has been retrieved`,
            data: allAdmin
        })
    } catch (error) {
        res.status(500).json(error)

    }
}

const updateAdmin = async (req: Request, res: Response) => {
    try {
        /** read "id" of medicine that sent at parameter URL */
        const id = await req.params.id;

        /** check existing medicine based on id */
        const findAdmin = await prisma.admin.findFirst({ where: { id: Number(id) } });

        if (!findAdmin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        /** read a property from medicine from req.body */
        const { name, email, password } = req.body
        const saveAdmin = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                nama_admin: name ? name : findAdmin.nama_admin,
                email: email ? email : findAdmin.email,
                password: password ? await bcrypt.hash(password, 12) : findAdmin.password
            }
        })

        return res.status(200).json({
            message: `Admin had been updated`,
            data: saveAdmin
        })
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const findAdmin = await prisma.admin.findFirst({ where: { id: Number(id) } })

        if (!findAdmin) {
            return res.status(200).json({ message: `Admin is not found` })
        }

        /** delete the file  */

        const saveMedicine = await prisma.medicine.delete({ where: { id: Number(id) } })
        return res.status(200).json({ message: `medicine has been removed`, data: saveMedicine })
    } catch (error) {
        return res.status(500).json(error)

    }
}
// function for login (authentication)

const authentication = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        // check existing email
        const findAdmin = await prisma.admin.findFirst({
            where: {email}
        })
        if (!findAdmin) {
            return res.status(200).json({
                message: `Email is not registered`
            }) 
        }

        const isMatchPassword = await bcrypt.compare(password, findAdmin.password)

        if (!isMatchPassword) {
            return res.status(200).json({
                message: `Invalid password`
            })
        }

        // preparation to generate token using JWT
        const payload = {
            name: findAdmin.nama_admin,
            email: findAdmin.email
        }
        const signature = process.env.SECRET || ""

        const token = jwt.sign(payload,signature)
        return res.status(200).json({
            logged: true, 
            token,
            id: findAdmin.id,
            name: findAdmin.nama_admin,
            email: findAdmin.email

        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export { createAdmin, updateAdmin, readAdmin, deleteAdmin, authentication };