const cheerio = require("cheerio");
const request = require("request-promise");
const Film = require("./models/Film");
const Ep = require("./models/Ep");

const baseUrl = "https://www.ssphim.net";

const crawl = async (link, group) => {
  request(link, (err, res, html) => {
    const $ = cheerio.load(html);

    $(".item").each((index, ele) => {
      const styleImg = $(ele).find(".item-image-block").attr().style;
      const image = styleImg.slice(
        styleImg.indexOf("//"),
        styleImg.lastIndexOf('"')
      );
      const url = baseUrl + $(ele).find(".item-image-block").attr().href;
      const name = $(ele).find(".item-block-title").text();
      const category = $(ele).find(".info-title-link").text();

      request(url, (err, res, html) => {
        const $ = cheerio.load(html);
        const watchUrl = baseUrl + $(".button_xemphim").attr().href;
        const shortDesc = $(".header-short-description p").html();
        const review = $("#review .w-richtext").html();
        const trailer = $("#trailer iframe").attr().src;

        const film = new Film({
          name,
          category,
          image,
          shortDesc,
          review,
          trailer,
          ep: [],
          group,
        });

        request(watchUrl, async (err, res, html) => {
          const $ = cheerio.load(html);
          const isMultipleEp = $(".episodes-list .collection-item").length
            ? true
            : false;

          if (isMultipleEp) {
            $(".episodes-list .collection-item").each(async (index, ele) => {
              const epName = $(ele).text();
              const epLink = baseUrl + $(ele).find("a").attr().href;

              request(epLink, (err, res, html) => {
                const $ = cheerio.load(html);
                const video = $(".w-iframe iframe").attr()?.src;
                const ep = new Ep({
                  epName,
                  video,
                });
                ep.save();
                film.ep.push(ep._id);
              });
            });
          } else {
            const video = $(".w-iframe iframe").attr()?.src;
            const ep = new Ep({
              epName: "Full",
              video,
            });
            ep.save();
            film.ep.push(ep._id);
          }
        });

        setTimeout(() => {
          film.save();
        }, 1000);
      });
    });
  });
};

module.exports = {
  crawl,
};
