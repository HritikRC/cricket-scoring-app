const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.post("/data", (req, res) => {
    if (req.body) {
        const [dayOrSession, csvTable] = req.body;
        console.log("\nReceived data:", "\nDay or Session:", dayOrSession, "\nCSV Table:", csvTable, "\n");
        res.status(200).send("OK");

        const dataDir = path.join(__dirname, "data");
        if(dayOrSession == "day"){
            // Determine the next available filename
            fs.readdir(dataDir, (err, files) => {
                if (err) {
                    console.error("Error reading directory:", err);
                    return;
                }
                // Filter out the existing CSV files and find the maximum number
                const csvFiles = files.filter(file => file.startsWith("data") && file.endsWith(".csv"));
                let maxNumber = 0;
                csvFiles.forEach(file => {
                    const match = file.match(/data(\d+)\.csv/);
                    if (match) {
                        const number = parseInt(match[1], 10);
                        if (number > maxNumber) {
                            maxNumber = number;
                        }
                    }
                });
                // Determine the next number
                const nextNumber = maxNumber + 1;
                const newFileName = `data${nextNumber}.csv`;
                // Write the new file
                fs.writeFile(path.join(dataDir, newFileName), csvTable, err => {
                    if (err) {
                        console.error("File write error:", err);
                    } else {
                        console.log(`File write successful! New file created: ${newFileName}`);
                    }
                });
            });
        } else if(dayOrSession == "session"){
            fs.readdir(dataDir, (err, files) => {
                if (err) {
                    console.error("Error reading directory:", err);
                    return;
                }
                // Filter out the existing CSV files and find the maximum number
                const csvFiles = files.filter(file => file.startsWith("data") && file.endsWith(".csv"));
                let maxNumber = 0;
                csvFiles.forEach(file => {
                    const match = file.match(/data(\d+)\.csv/);
                    if (match) {
                        const number = parseInt(match[1], 10);
                        if (number > maxNumber) {
                            maxNumber = number;
                        }
                    }
                });
                // Determine the latest file
                const latestFileName = `data${maxNumber}.csv`;
                // Append to the latest file
                fs.appendFile(path.join(dataDir, latestFileName), '\n' + csvTable, err => {
                    if (err) {
                        console.error("File append error:", err);
                    } else {
                        console.log(`File append successful! Data appended to: ${latestFileName}`);
                    }
                });
            });
        }
    } else {
        res.status(400).send("No data received");
    }
});

app.listen(8000, () => {
    console.log("Server started on port 8000.");
});
