const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const csv = require('csv-parser');
const { exec } = require('child_process');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client", "dist")));
app.use('/pictures', express.static(path.join(__dirname, 'statistics/pictures')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const processValues = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            // Replace asterisks with commas
            obj[key] = obj[key].replace(/\*/g, ',');

            // Convert to integer if the string is a number
            if (!isNaN(obj[key]) && obj[key].trim() !== "") {
                obj[key] = parseInt(obj[key], 10);
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            processValues(obj[key]);
        }
    }
};

app.post("/stats", (req, res) => {
    if(req.body[0] == "STATISTICS_REQUEST"){
        exec('python3 statistics/player_stats.py', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            } else {
                console.log(stdout);
                console.log("Created pictures...");

                // Fetch a list of image files in the directory
                fs.readdir(path.join(__dirname, 'statistics/pictures'), (err, files) => {
                    if (err) {
                        console.error(`Error reading directory: ${err}`);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
                    const imageUrls = images.map(image => `/pictures/${image}`);
                    res.json({ images: imageUrls });
                });
            }
        });
    }
});

app.post("/data", (req, res) => {
    if (req.body) {
        const [dayOrSession, csvTable] = req.body;
        console.log("\nReceived data:", "\nDay or Session:", dayOrSession, "\nCSV Table:", csvTable, "\n");
        res.status(200).send("OK");

        const dataDir = path.join(__dirname, "data");
        const jsonDir = path.join(__dirname, "data_json");

        const handleCSVtoJSON = (csvFilePath, jsonFilePath) => {
            const results = [];
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const output = { "Sheet1": results };
                    processValues(output); // Replace asterisks with commas and convert to integers
                    fs.writeFile(jsonFilePath, JSON.stringify(output, null, 2), (err) => {
                        if (err) {
                            console.error("Error writing JSON file:", err);
                        } else {
                            console.log(`JSON file successfully updated: ${jsonFilePath}`);
                        }
                    });
                });
        };

        if(dayOrSession === "day"){
            fs.readdir(dataDir, (err, files) => {
                if (err) {
                    console.error("Error reading directory:", err);
                    return;
                }

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

                const nextNumber = maxNumber + 1;
                const newFileName = `data${nextNumber}.csv`;

                fs.writeFile(path.join(dataDir, newFileName), csvTable, err => {
                    if (err) {
                        console.error("File write error:", err);
                    } else {
                        console.log(`File write successful! New file created: ${newFileName}`);
                    }

                    const csvFilePath = path.join(dataDir, newFileName);
                    const jsonFilePath = path.join(jsonDir, `data${nextNumber}.json`);
                    handleCSVtoJSON(csvFilePath, jsonFilePath);
                });
            });
        } else if(dayOrSession === "session"){
            fs.readdir(dataDir, (err, files) => {
                if (err) {
                    console.error("Error reading directory:", err);
                    return;
                }

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

                const latestFileName = `data${maxNumber}.csv`;

                fs.appendFile(path.join(dataDir, latestFileName), '\n' + csvTable, err => {
                    if (err) {
                        console.error("File append error:", err);
                    } else {
                        console.log(`File append successful! Data appended to: ${latestFileName}`);
                    }

                    const csvFilePath = path.join(dataDir, latestFileName);
                    const jsonFilePath = path.join(jsonDir, `data${maxNumber}.json`);
                    handleCSVtoJSON(csvFilePath, jsonFilePath);
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
