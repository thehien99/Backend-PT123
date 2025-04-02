import jwt from 'jsonwebtoken'

export const generateAccessToken = (id) => {
    return jwt.sign({ id: id }, process.env.ACCESS_TOKKEN_SECRET, { expiresIn: '1m' })
}

export const generateRefreshToken = (id) => {
    return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}