import express from 'express'
import connectdb from './config/db.js'
import clothingRoute from './route/clothingRoute.js'
import userRoute from './route/userRoute.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'
import cors from "cors"
import cookieParser from 'cookie-parser'
import crypto from 'crypto'

const PORT = process.env.PORT || 6000

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true  //sending cookies
}))

app.use(cookieParser())

app.use('/api/clothing', clothingRoute);

app.use('/api/auth', userRoute);

app.use(notFound);
app.use(errorHandler)

app.listen(PORT, () => {
    connectdb()
    console.log(`port ${PORT} ready for connection`)
})