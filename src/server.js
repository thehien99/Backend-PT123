import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import userRouter from "./route/user";
import postRouter from "./route/post";
import postValue from "./route/postValue";
import insertData from "./route/insertData";
import connectDb from "./config/connectDb";

require('dotenv').config();
let app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*', // Cho phép từ nguồn cụ thể
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức hợp lệ
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header hợp lệ
}));
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

userRouter(app)
postRouter(app)
postValue(app)
insertData(app)
connectDb()



let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log('LocalHost' + port)
})