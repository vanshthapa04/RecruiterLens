const express = require('express')
const cors = require('cors')
const jdRoutes = require("./routes/jdRouter");
const analysisRoute = require('./routes/analysisRoute')
const app = express();

app.use(cors())
app.use(express.json())

app.get("/", (req,res) => {
    res.send("API running successfully");
});
app.use("/api", analysisRoute)
app.use("/api", jdRoutes);


module.exports = app