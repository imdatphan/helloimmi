const puppeteer = require("puppeteer");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const job = schedule.scheduleJob("* */1 * * *", () => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    const URL =
      "https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps?fbclid=IwAR34zh4ZbaGlo5803-7x8rFSm1XpCvyXGthLXejxQsFFVDnaCYSAKXR_Lz0";

    await page.goto(URL, { waitUntil: "load" });
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table tr td"));
      return tds.map((td) => td.innerText);
    });
    // sending email function

    function notifyAustralia() {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tandatk37ueh@gmail.com",
          pass: "aoxrmqdobsiqytqq",
        },
      });
      var mailOptions = {
        from: "tandatk37ueh@gmail.com",
        to: "datphandev@gmail.com",
        subject: "Cổng Immi đã mở",
        text: "Nộp đơn ngay đi",
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
        }
      });
    }
    function getDay() {
      let today = new Date();
      let hh = String(today.getHours()).padStart(1, "0");
      let mn = String(today.getMinutes()).padStart(2, "0");
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();

      today = hh + ":" + mn + "         " + dd + "/" + mm + "/" + yyyy;
      return today;
    }
    let vietnamIndex = data.indexOf("Vietnam");
    let vietnamStatusIndex = vietnamIndex + 1;

    if ((data[vietnamStatusIndex] = "SUSPENDED**")) {
      console.log(getDay());
      await browser.close();
    } else {
      notifyAustralia();
    }
  })();
});
