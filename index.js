import express from "express";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";
import fs from "fs";
import ejs from "ejs";

const app = express();
const port = 3000;
import {dirname} from "path";
import {fileURLToPath} from "url";
const dir_name = dirname(fileURLToPath(import.meta.url));


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(dir_name + "/public/index.html");
})

app.post("/download", (req, res) => {
    const details = {
        name: req.body.name,
        country: req.body.country,
        destination: req.body.destination,
        date: req.body.date,
        time: req.body.time,
        flightID: req.body.flightid,
        departure: req.body.from,
        gate: req.body.gate,
        seat: req.body.seat,


    }
    console.log(details);
    res.render("result.ejs", { details: details });
    ( async () => {
    const browser = await puppeteer.launch( { headless: true });
    const page = await browser.newPage();
    // const websiteURL = fs.readFileSync("index.html", "utf8");
    // await page.setContent(websiteURL, { waitUntil: "domcontentloaded" });
    // await page.emulateMediaType("screen");
    const html = await ejs.renderFile(dir_name + "/views/result.ejs", {details: details});
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
        path: "./result.pdf",
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
    });
    await browser.close();
}) ();

})

app.post("/generatePDF", (req, res) => {
    res.sendFile(dir_name + "/result.pdf");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// // https://stackoverflow.com/questions/74255357/express-puppeteer-generate-pdf-from-ejs-template-and-send-as-response
  