import Express  from "express";
import MedicineRoute from "./router/medicineRouter"
import AdminRoute from "./router/adminRouter"
import { hasOnlyExpressionInitializer } from "typescript";
import transactionRoute from "./router/transactionRouter"

const app = Express()
/** allow to read a body request with JSON Format  */
app.use(Express.json())

/** prefix for medicine route  */
app.use(`/medicine`, MedicineRoute)

app.use(`/admin`, AdminRoute)
app.use(`/transaction`, transactionRoute)

const PORT = 1992
app.listen(PORT, () => { 
    console.log(`Server Drugstore run on port ${PORT}`)
})