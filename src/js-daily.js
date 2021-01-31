/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-04-26 22:07:19
 */

const fs = require("fs"),
  path = require("path"),
  puppeteer = require("puppeteer"),
  dayjs = require("dayjs")

const TIME = dayjs().format("YYYY-MM-DD"),
  URL = "https://github.com/trending/javascript?since=daily"

let MarkDownFile = `# [GitHub] JavaScript 日趋势榜项目(${TIME})\n\n`

;(async () => {
  const browser = await puppeteer.launch({
    // headless: false, // 有浏览器界面启动
    // slowMo: 50, // 将 Puppeteer 操作减少指定的毫秒数。
    // devtools: false, // 是否为每个选项卡自动打开DevTools面板
  })

  const page = await browser.newPage()
  await page.goto(URL)

  // 项目标题
  let TitleArr = await page.$$eval("h1.h3.lh-condensed", (el) =>
    el.map((el) => el.innerText.replace(/ /g, ""))
  )

  // 项目简介
  let IntroduceArr = await page.$$eval("p.text-gray", (el) =>
    el.map((el) => el.innerText)
  )

  let StartArr = [] // 项目星星
  let ForkArr = [] // 项目 fork
  let TodayStartArr = [] // 项目 today start

  // 其余信息集合
  let OtherInformation = await page.$$eval("div.text-gray", (el) =>
    el.map((el) => el.innerText)
  )

  OtherInformation.map((item) => {
    const _item = item.split(" ")
    console.log(_item)
    StartArr.push(_item[3])
    ForkArr.push(_item[5])
    TodayStartArr.push(_item[_item.length - 3])
  })

  for (let i = 0; i < TitleArr.length; i++) {
    const title = TitleArr[i]

    MarkDownFile += `## ${i + 1}. ${title} \n\n`
    MarkDownFile += `项目地址：[https://github.com/${title}](https://github.com/${title})\n\n`
    MarkDownFile += `stars:${StartArr[i]} | forks:${ForkArr[i]} | ${TodayStartArr[i]} stars today \n\n`
    MarkDownFile += `${IntroduceArr[i]}\n\n`
  }

  console.log(MarkDownFile)

  // 文件写入
  fs.writeFile(
    path.resolve(__dirname, `../daily-javascript/javascript-${TIME}.md`),
    MarkDownFile,
    (err) => {
      if (!err) {
        console.log("文件写入完成")
      }
    }
  )

  await browser.close()
})().catch((error) => {
  console.log(" ------ [error] ------ ")
  console.log(error)
})

