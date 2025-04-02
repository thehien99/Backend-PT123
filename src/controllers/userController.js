import * as authService from "../services/userService";
import jwt from 'jsonwebtoken'
import { generateAccessToken } from "../token/token";

const register = async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    if (!name || !phone || !password)
      return res.status(400).json({
        err: 1,
        msg: "Missing inputs !",
      });
    const response = await authService.registerService(req.body);
    res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: true })
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
const login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (!phone || !password)
      return res.status(400).json({
        err: 1,
        msg: "Missing inputs !",
      });
    const response = await authService.loginService(req.body);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: true, // Chỉ bật Secure khi chạy production
      sameSite: 'Lax', // Hoặc 'None' nếu cần dùng cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời hạn cookie (7 ngày)
    })
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at auth controller: " + error,
    });
  }
};

const getOneUser = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await authService.getOne(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  const payload = req.body
  const { id } = req.user
  try {
    if (!payload) return res.status(400).json({ err: 1, msg: "failed" })
    const response = await authService.updateUserService(payload, id)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
  }
}

const refreshtoken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Đảm bảo lấy từ req.cookies

  if (!refreshToken) {
    return res.status(401).json({
      msg: 'Refreshtoken missing'
    })
  }

  if (!refreshToken.includes(refreshToken)) {
    return res.status(403).json({
      msg: 'Invalid refreshtoken'
    })
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    console.log(user)
    if (err) {
      return res.status(403).json({
        msg: 'Invalid token'
      })
    }

    const accessToken = generateAccessToken(user.id)
    res.json({ accessToken })
  })
}

module.exports = {
  login: login,
  register: register,
  getOneUser: getOneUser,
  updateUser: updateUser,
  refreshtoken: refreshtoken
};
