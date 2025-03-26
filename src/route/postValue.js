import express from "express";
import categoryCotroller from "../controllers/categoryCotroller";
import priceController from "../controllers/priceController"
import acreaController from "../controllers/acreaController"
import provinceController from "../controllers/provinceController"

let router = express.Router();

let postValue = (app) => {
  //Category
  router.get("/getall", categoryCotroller.getCategory);

  //Price
  router.get("/price", priceController.getPrice);

  //Acre
  router.get("/acrea", acreaController.getAllAcrea);

  //Province
  router.get("/province", provinceController.getProvince);

  return app.use("/", router)
}
export default postValue