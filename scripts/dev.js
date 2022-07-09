// 解析参数
const args = require("minimist")(process.argv.slice(2))
const { resolve } = require("path")
const { build } = require("esbuild")

const target = args["_"] || "render"

const format = args.f || "global"

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

console.log(args)
/**
 * iife 立即实行函数
 * cjs node中的模块
 * esm 浏览器中的esmodule模块
 */
const outpuFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm"

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  // 所有包打包到一起
  bundle: true,
  sourcemap: false,
  // 输出的格式
  format: outpuFormat,
  // 打包的全局名字
  globalName: pkg.buildOptions?.name,
  // 平台
  platform: format === "cjs" ? "node" : "browser",
  // 监控文件变化
  watch: {
    onRebuild(err) {
      if (!err) console.log("------build-----")
    },
  },
}).then(() => {
  console.log("ok")
})
