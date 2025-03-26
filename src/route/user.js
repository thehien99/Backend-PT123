import verifyToken from "../middleware/checkAuth";
import express from "express";
import userController from "../controllers/userController";
let router = express.Router()

let userRouter = (app) => {
  router.post("/login", userController.login)
  router.post("/api/register", userController.register)
  router.get("/getuser", verifyToken, userController.getOneUser)
  router.put("/updateuser", verifyToken, userController.updateUser)
  router.post('/refreshtoken', verifyToken, userController.refreshtoken)
  return app.use("/", router);
}
export default userRouter
