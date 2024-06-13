const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())

const db = require('./models')

//Routers
const userRouter = require('./routes/Users')
app.use("/auth", userRouter);

const serviceRouter = require('./routes/Services')
app.use("/services", serviceRouter);

const appointmentRouter = require('./routes/Appointments')
app.use("/appointments", appointmentRouter);

db.sequelize.sync().then(() => {
    app.listen(process.env.MYSQLPORT || 3001, () => {
        console.log(`Server running on port: ${process.env.MYSQLPORT}`);
    })
})

