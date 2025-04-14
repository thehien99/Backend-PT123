import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { generateAccessToken, generateRefreshToken } from "../token/token";
require('dotenv').config()

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

export const registerService = ({ phone, password, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Seller.findOrCreate({
        where: { phone },
        defaults: {
          phone,
          name,
          password: hashPassword(password),
          id: v4(),
        },
      });
      const res = response[0].dataValues
      const accessToken = res && generateAccessToken(res.id)
      const refreshToken = accessToken && generateRefreshToken(res.id)
      resolve({
        err: accessToken ? 0 : 2,
        msg: accessToken
          ? "Register is successfully !"
          : "Phone number has been aldready used !",
        accessToken,
        refreshToken
      });
    } catch (error) {
      reject(error);
    }
  });

export const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Seller.findOne({
        where: { phone },
        raw: true,
      });
      const isCorrectPassword = response && bcrypt.compareSync(password, response.password);
      const accessToken = isCorrectPassword && generateAccessToken(response.id)
      const refreshToken = accessToken && generateRefreshToken(response.id)
      resolve({
        err: accessToken ? 0 : 2,
        msg: accessToken
          ? "Login is successfully !"
          : response
            ? "Password is wrong !"
            : "Phone number not found !",
        accessToken,
        refreshToken
      });
    } catch (error) {
      reject(error);
    }
  });

export const getOne = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Seller.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password"],
        },
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Oke" : "Failed to get provinces",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUserService = (payload, id) => new Promise(async (resolve, reject) => {
  try {
    const response = await db.Seller.update(payload, { where: { id } })
    resolve({
      err: response[0] > 0 ? 0 : 1,
      msg: response[0] > 0 ? "Update" : "Failed",
      response
    })
  } catch (error) {
    reject(error)
  }
})

