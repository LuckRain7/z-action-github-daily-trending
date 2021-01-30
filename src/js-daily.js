/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-04-26 22:07:19
 */

const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const TIME = dayjs().format("YYYY-MM-DD");
const URL = "https://github.com/trending/javascript?since=daily";

let MarkDownFile = `# [GitHub] JavaScript 日趋势榜项目(${TIME})`;
