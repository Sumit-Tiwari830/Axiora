const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const Routes = require("./routes/route");

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

app.use("/", Routes);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});