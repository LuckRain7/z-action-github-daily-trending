/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-04-26 22:07:19
 */
const superagent = require("superagent");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const TIME = dayjs().format("YYYY-MM-DD");
const URL = "https://github.com/trending/typescript?since=daily";

let MarkDownFile = `# [GitHub] TypeScript 日趋势榜项目(${TIME})`;

superagent.get(URL).then((res) => {
  // 获取数据并进行 DOM 操作
  let $ = cheerio.load(res.text);

  const BoxRowArray = $(".Box-row");
  console.log("项目数量:", BoxRowArray.length);
  console.log("############################");

  // 获取数据
  BoxRowArray.each((index, item) => {
    const $BoxRow = cheerio.load(item);

    console.log(`第${index + 1}个项目`);

    // ------- 项目标题 & 链接-------
    const title = $BoxRow("h1.lh-condensed").find("a")[0].attribs.href.slice(1);
    console.log("链接地址：", `https://github.com/${title}`);
    console.log("项目标题:", title);

    // ------- 项目概述 -------
    let description = "";
    const $description = $BoxRow("P.text-gray");

    // 解决无简介问题
    if ($description.length !== 0) {
      // 去除 emoji 的影响
      $description[0].children.forEach((item, index) => {
        if (item.type === "text") {
          description += item.data.trim();
        }
      });
    } else {
      // 无简介
      description += "";
    }

    console.log("项目概述：", description);

    // ------- 项目星星 -------f6 text-gray mt-2

    const divForNumber = $BoxRow("div.f6.text-gray.mt-2");

    const stars = divForNumber
      .find("a.muted-link.d-inline-block.mr-3")[0]
      .children[2].data.toString()
      .trim();
    console.log("⭐：", parseInt(stars));

    // ------- 项目fork -------
    const forks = divForNumber
      .find("a.muted-link.d-inline-block.mr-3")[1]
      .children[2].data.toString()
      .trim();
    console.log("forks数量：", parseInt(forks));

    // ------- 本周赞数 -------
    const weekStars = divForNumber
      .find("span.d-inline-block.float-sm-right")[0]
      .children[2].data.toString()
      .trim();
    console.log("本周赞数：", parseInt(weekStars));

    console.log("======================");
    console.log("");

    // 拼接输出
    MarkDownFile += `
## ${index + 1}.  ${title}

项目地址：[https://github.com/${title}](https://github.com/${title})

stars:${stars} | forks:${forks} | ${weekStars} 

${description}
`;
  }); // each END

  // 获取当前时间作为

  // console.log(MarkDownFile)

  // 写入文件
  fs.writeFile(
    path.resolve(__dirname, `../github-typescript-daily/${TIME}.md`),
    MarkDownFile,
    (err) => {
      if (!err) {
        console.log("文件写入完成");
      }
    }
  );
});
