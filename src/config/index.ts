import 'dotenv/config';

export default {
    PORT: process.env.PORT || 4000,
    CRYPT_SALT: process.env.CRYPT_SALT || 10,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_SECRET_REFRESH_KEY: process.env.JWT_SECRET_REFRESH_KEY,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME || "1h",
    TOKEN_REFRESH_EXPIRE_TIME: process.env.TOKEN_REFRESH_EXPIRE_TIME || "24h",
};