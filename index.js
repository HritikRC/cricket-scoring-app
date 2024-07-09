const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.text()); 

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.post("/data", (req, res) => {
    console.log("\nReceived data:", "\n" + req.body + "\n"); 
    if (req.body) {
        res.status(200).send("OK"); 

        fs.writeFile(path.join(__dirname, "data", "data.csv"), req.body, err => {
            if (err) {
                console.error(err);
            } else {
                console.log("File write successfull!");
            }
        });
    } else {
        res.status(400).send("No data received");
    }
});

app.listen(8000, () => {
    console.log("Server started on port 8000.");
});
