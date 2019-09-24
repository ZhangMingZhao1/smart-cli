/**
 * major
 * 获取 Node.js 的主版本信息
 */
const currentNodeVersion = process.versions.node
const semver = currentNodeVersion.split('.')
const major = semver[0]
// commander 用来接收用户输入的命令
const commander = require('commander')
const path = require('path')
// chalk 用来输出五颜六色的 log 信息
const chalk = require('chalk')
// 跨平台获取 home 的路径
const homeDir = require('osenv').home()
// 用来缓存模版文件的文件夹路径，比如 `~/.mieo`
const templateCacheDir = path.resolve(homeDir, '.smart-cli')
// 批量递归创建目录
const mkdirp = require('mkdirp')
const pkg = require('./package.json')
const Cli = require('./cli')
// init 命令
const initScript = require('./scripts/init')

// 检测 Node 版本，主版本最低要求为 8
if (major < 8) {
  chalk.red(
    'You are running Node ' +
    currentNodeVersion +
    '.\n' +
    'smart-cli requires Node 8 or higher. \n' +
    'Please update your version of Node.'
  )
  process.exit(1)
}

class SmartCli extends Cli {
  constructor() {
    super()
    this.dir = {
      homeDir: homeDir,
      templateCacheDir: templateCacheDir
    }
    // 创建存储模版的文件夹
    this.checktemplateCacheDir()
    // 检查更新，每次执行命令时都会检查一下，因为要网络请求感觉会影响效率，暂时注释
    // this.checkCliUpdate()
    // 初始化
    this.initProgram()
  }

  initProgram() {
    this.program = new commander.Command()
    // CLI 的版本信息
    this.program
      .version(pkg.version)
    // init 命令
    this.program
      .command('init <dir>')
      .description('Init a project by choosing template.')
      .action((templateName) => {
        // console.log('templateName: ', templateName);
        return initScript(this, templateName);
      })
    // 提供系统参数来给 commander 解析
    this.program.parse(process.argv)
  }

  checktemplateCacheDir() {
    // 创建模板缓存文件夹
    mkdirp(this.dir.templateCacheDir)
  }
}

module.exports = new SmartCli()