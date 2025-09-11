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

const allowedOrigins = [
    /^http:\/\/localhost:\d+$/,              // allow any localhost port
    "https://esseauth.netlify.app/"  // deployed frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.some((allowed) =>
                allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
            )
        ) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(cookieParser())

app.use('/api/clothing', clothingRoute);

app.use('/api/auth', userRoute);

app.use(notFound);
app.use(errorHandler)

app.listen(PORT, () => {
    connectdb()
    console.log(`port ${PORT} ready for connection`)
})