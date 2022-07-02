const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const fetchUser = require("../middleware/fetchUser");
const nodemailer = require("nodemailer");

require("dotenv/config");


const JWT_SEC = process.env.JWT_SEC;

//Creating a route for aading an user to the DB
router.post("/createuser", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Checks if the user with same email exists already
        const email = await User.findOne({ email: req.body.email });

        if (email) {
            return res.status(400).json("User already exists!");
        }
        let salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);
        let profilePicUrl;

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
        });
        const data = {
            user: {
                id: user.id,
            },
        };
        const authToken = jwt.sign(data, JWT_SEC);
        res.status(200).send(
            "Your account has been successfully created. Please log in"
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal error occured");
    }
});
// Route2: Creating a router for logging in.
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    try {
        let user = await User.findOne({ email: email });
        let tempUser = user;
        if (!user) {
            return res.status(400).json({
                error: "Please try to login with correct credentials",
            });
        }
        console.log(user.password);

        const passCompare = await bcrypt.compare(password, user.password);

        if (!passCompare) {
            return res.status(400).json({
                error: "Please try to login with correct credentials",
            });
        }
        const data = {
            user: {
                id: user.id,
            },
        };
        1;
        const authToken = jwt.sign(data, JWT_SEC);

        console.log(tempUser);
        const dataToSend = {
            name: user.name,
            id: user["_id"],

            email: user.email,

            authToken: authToken,
        };
        res.status(200).json(dataToSend);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal error occured");
    }
});
router.post("/forgotpassword", async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("User not found");
        }
        const token = jwt.sign(
            { _id: user._id },
            process.env.RESET_PASSWORD_KEY,
            { expiresIn: "60m" }
        );

        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "developerhibjul@gmail.com",
                pass: "hvkcgdzvoatsemyk",
            },
        });
        let details = {
            from: "developerhibjul@gmail.com",
            to: email,
            subject: "Reset your password",
            html: `
                <h3>Please click the link below to reset your password</h3>
                <p>${process.env.HOSTURL}/updatepassword/${token}</p>
            `,
        };
        console.log(token);
        console.log("Hi");
        User.findOneAndUpdate(
            { email: email },
            { resetLink: token },
            (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ error: "An error occured" });
                } else {
                    mailTransporter.sendMail(details, (err) => {
                        if (err) {
                            console.log(err);
                            return res
                                .status(400)
                                .json({ error: "An error occured" });
                        } else {
                            console.log("Mail send");
                            return res.status(200).json({
                                message: "Reset link sent to your mail",
                            });
                        }
                    });
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
});
router.post("/updatepassword", async (req, res) => {
    try {
        const { oldPassword, email, token, newPassword } = req.body;
        if (oldPassword && email) {
            const user = await User.findOne({ email: email });
            const passCompare = await bcrypt.compare(
                oldPassword,
                user.password
            );
            console.log(passCompare);
            if (!passCompare) {
                return res.status(400).json({
                    error: "Please try to login with correct credentials",
                });
            }
            let salt = await bcrypt.genSalt(10);
            let secPassword = await bcrypt.hash(newPassword, salt);
            await user.updateOne({ password: secPassword });
            return res.status(200).send("Password changed");
        } else if (token) {
            // console.log("Hi");
            jwt.verify(
                token,
                process.env.RESET_PASSWORD_KEY,
                async (err, decodedData) => {
                    if (err) {
                        return res.status(400).json({
                            error: "Incorrect token or token is expired",
                        });
                    }
                    console.log("Hi");
                    let salt = await bcrypt.genSalt(10);
                    let secPassword = await bcrypt.hash(newPassword, salt);
                    console.log(newPassword);
                    const user = await User.findOneAndUpdate(
                        { resetLink: token },
                        { password: secPassword }
                    );

                    return res.status(200).send("Password changed");
                }
            );
            console.log("Hi");
        }
        // res.status(400).send(
        //     "Please use old password and email or token to update password"
        // );
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;
