import { NextFunction, Request, Response } from "express";
import Joi from "joi";

/** create a rule/schema for add new medicine */
const createScheme = Joi.object({
    name: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    exp_date: Joi.date().required(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").required(),
    price: Joi.number().min(1).required()
})

const createValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = createScheme.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    next ()
}

export{createValidation}
