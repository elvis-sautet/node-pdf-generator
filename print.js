const puppeteer = require("puppeteer");
const { writeFile } = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/", {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: "Letter",
  });

  await browser.close();

  writeFile("./report.pdf", pdf, {}, (err) => {
    if (err) {
      return console.error("error");
    }

    console.log("success!");
  });
})();
