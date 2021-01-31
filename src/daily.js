/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2021-01-31 10:31:10
 * @LastEditTime : 2021-01-31 11:10:40
 * @Description  : daily
 * @   Love and Peace
 */
const fs = require("fs"),
  path = require("path"),
  puppeteer = require("puppeteer"),
  dayjs = require("dayjs")

const TYPE_ARR = ["JavaScript", "TypeScript", "CSS", "HTML", "Vue"]
const TIME = dayjs().format("YYYY-MM-DD")
const URL = (type) => `https://github.com/trending/${type}?since=daily`
const MarkDownFileTitle = (type) =>
  `# [GitHub] ${type} 日趋势榜项目(${TIME})\n\n`

const FilePath = (type) => path.resolve(__dirname, `../daily-${type}`)

;(async () => {
  // 开启浏览器
  const browser = await puppeteer.launch({
    // headless: false, // 有浏览器界面启动
    slowMo: 50, // 将 Puppeteer 操作减少指定的毫秒数。
    // devtools: false, // 是否为每个选项卡自动打开DevTools面板
  })

  for (let type_i = 0; type_i < TYPE_ARR.length; type_i++) {
    const type = TYPE_ARR[type_i]
    const page = await browser.newPage()
    await page.goto(URL(type.toLowerCase()))

    let MarkDownFile = MarkDownFileTitle(type) // 一级标题

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
      // console.log(_item)
      StartArr.push(_item[3])
      ForkArr.push(_item[5])
      TodayStartArr.push(_item[_item.length - 3])
    })

    for (let i = 0; i < TitleArr.length; i++) {
      const title = TitleArr[i]

      MarkDownFile += `## ${i + 1}. ${title} \n\n`
      MarkDownFile += `项目地址：[https://github.com/${title}](https://github.com/${title})\n\n`
      MarkDownFile += `stars:${StartArr[i]} | forks:${ForkArr[i]} | ${TodayStartArr[i]} stars today \n\n`
      MarkDownFile += `${IntroduceArr[i] || ""}\n\n`
    }

    // console.log(MarkDownFile)

    // 存放目录
    const FILEPATH = FilePath(type)

    // 判断文件夹是否存在
    try {
      fs.statSync(FILEPATH)
    } catch (err) {
      fs.mkdirSync(FILEPATH)
    }

    // 文件写入
    fs.writeFile(FILEPATH + `/${type}-${TIME}.md`, MarkDownFile, (err) => {
      if (!err) {
        console.log("[INFO SUCCESS] " + type + " 文件写入完成 ")
      }
    })
  }

  await browser.close()
})().catch((error) => {
  console.log(" ------ [error] ------ ")
  console.log(error)
})
