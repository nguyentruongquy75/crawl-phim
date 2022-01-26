const express = require("express");
const app = express();
const request = require("request-promise");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const crawl = require("./crawl");

const link = [
  {
    url: "https://www.ssphim.net/the-loai/phim-chieu-rap?d5307828_page=",
    totalPage: 10,
    group: "Phim chiếu rạp",
  },
  {
    url: "https://www.ssphim.net/the-loai/phim-le?d5307828_page=",
    totalPage: 41,
    group: "Phim lẻ",
  },
  {
    url: "https://www.ssphim.net/the-loai/phim-hoat-hinh?d5307828_page=",
    totalPage: 4,
    group: "Phim hoạt hình",
  },
];

const db = mongoose.connection;
dotenv.config();

//connect db
mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true })
  .then(() => console.log("DB Connected!"));
db.on("error", (err) => {
  console.log("DB connection error:", err.message);
});

const wait = async (time) =>
  new Promise((res, rej) => setTimeout(() => res(), time));

link.forEach(async (item) => {
  for (let page = 1; page <= item.totalPage; page++) {
    await wait(1000 * 60);
    crawl.crawl(
      {
        url: item.url + page,
        headers: {
          Referer: "https://www.ssphim.net/",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
        },
      },
      item.group
    );
  }
});

app.get("/", async (req, res) => {
  res.json("ok");
});

app.listen(process.env.PORT || 3000);
