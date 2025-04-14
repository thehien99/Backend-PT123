import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import userRouter from "./route/user";
import postRouter from "./route/post";
import postValue from "./route/postValue";
import insertData from "./route/insertData";
import connectDb from "./config/connectDb";
import cookieParser from 'cookie-parser'

require('dotenv').config();
let app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*', // Cho phép từ nguồn cụ thể
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức hợp lệ
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header hợp lệ
  credentials: true,  // Cho phép gửi cookie từ frontend
}));

// const corsOptions = {
//   origin: 'http://localhost:5173', // Địa chỉ frontend của bạn
//   credentials: true, // Cho phép cookies
// };

// app.use(cors(corsOptions));


//config app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

userRouter(app)
postRouter(app)
postValue(app)
insertData(app)
connectDb()



let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log('LocalHost' + port)
})