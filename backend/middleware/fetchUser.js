
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv/config");

const JWT_SEC = process.env.JWT_SEC;

const fetchUser = (req, res, next) => {
    const tempToken = req.header("authorization");
    // console.log(req.header("authorization"))
    if (!tempToken) {
        return res
            .status(401)
            .json({ error: "Please authenticate using a valid token!" });
    }
    let token=tempToken.split(' ')[1]

    try {
        const data = jwt.verify(token, JWT_SEC);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({
            error: "Please authenticate using a valid token!",
        });
    }
};


const fetchAdmin = (req, res, next) => {
    const token = req.header("authToken");
    // console.log(req.headers);
    if (!token) {
        return res
            .status(401)
            .json({ error: "Please authenticate using  valid token here!" });
    }
    try {
        const data = jwt.verify(token, JWT_SEC);
        req.user = data.user;
        console.log(data.user);
        if (data.user.type === "ADMIN") {
            next();
        } else {
            res.status(403).send({ error: "forbidden!" });
        }
    } catch (error) {
        res.status(401).send({
            error: "Please authenticate using a valid token!",
        });
    }
};

module.exports = { fetchUser, fetchAdmin };
