const express = require("express");
const cors = require("cors");
require("dotenv/config");
const mongoConnect = require("./db");

const authRoute = require("./Routes/auth");
const postsRoute = require("./Routes/posts");


const app = express();

mongoConnect();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use("/auth", authRoute);
app.use("/posts", postsRoute);


app.use("/", (req, res) => {
    res.send("Hi I am ON");
});

app.listen(PORT, () =>
    console.log(`Server Running on Port: http://localhost:${PORT}`)
);
