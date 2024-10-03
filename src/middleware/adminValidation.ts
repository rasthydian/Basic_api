import { NextFunction, Request, Response } from "express";
import Joi from "joi";



/** create a rule/schema for add new medicine */
const createAdminScheme = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const createValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = createAdminScheme.validate(req.body)
    if (validate.error) {
        /** delete current upload  */
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    next()
}

/** update a rule/schema for add new medicine */
const updateAdminScheme = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const updateValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = updateAdminScheme.validate(req.body)
    if (validate.error) {
        /** delete current upload  */
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    next()
}

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})
    const authValidation = (req: Request, res: Response, next: NextFunction) => {
        const validate = authSchema.validate(req.body)
        if (validate.error) {
            /** delete current upload  */
            return res.status(400).json({
                message: validate.error.details.map(it => it.message).join()
            })
        }
        next()
    }

export { createValidation, updateValidation, authValidation }