const express = require("express");
const ejs = require("ejs");
const path = require("path");
const app = express();
const puppeteer = require("puppeteer");
const fsPromises = require("fs").promises;

// this json response comes from the query send to fecth receipts or invoive, according to the array response, that how many the receipts or invoive are generated
const receiptsJson = [
  {
    id: 1,
    transaction_id: "110374901154",
    student_number: "TESTADMISION",
    amount: 1,
    payment_method: 1,
    donation: 0,
    overpay_used: 0,
    recieved_by: null,
    auto_correct: 0,
    school_id: 1,
    deactivated: false,
    dateDeactivated: null,
    createdBy: null,
    updatedBy: null,
    deactivatedBy: null,
    createdAt: "2022-06-11T13:41:50.032Z",
    updatedAt: "2022-06-11T13:41:50.032Z",
    payment_methods: {
      id: 1,
      method: "Mobile Money",
    },
  },
];
app.get("/", async (request, response) => {
  // remember to pass the valid data to the template, right now thats dummy data rendered using ejs
  const filePath = path.join(__dirname, "print.ejs");
  ejs.renderFile(filePath, { data: receiptsJson }, async (err, str) => {
    if (err) {
      return response.status(500).send(err);
    }
    return response.send(str);
  });
});

// download the pdf
app.get("/download", async (request, response) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //create a new PDFpdf from your url or the client side :3000
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });

  const items = await page.$eval(".receipts", (el) => {
    return Array.from(el.children).map((child) => {
      // return the elements and style them here
      return child.outerHTML;
    });
  });

  // create a new PDF styled with the elements
  const pdf = await page.pdf({
    format: "A4", //send the format of receipt from the client side
    printBackground: true,
    path: "print.pdf",
    // compress the pdf
    compress: true,
  });

  // close the browser
  await browser.close();

  // before creating the pdf, compress it to save space
  const compressedPdf = await pdf.compress();

  // send the pdf to the client
  response.setHeader("Content-Type", "application/pdf");
  response.send(compressedPdf);
});

app.listen(3000, () => console.log("The server is running on port 3000"));
