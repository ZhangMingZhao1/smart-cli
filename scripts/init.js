// 用户选择的交互命令
const inquirer = require('inquirer')
const util = require('util');
// 同步执行命令
const execSync = require('child_process').execSync;
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora');
const symbol = require('log-symbols');

module.exports = async function (ctx, projectName) {
  try {
    const tpls = ctx.getTemplateList()
    // tpl为选择的模板名字
    const {
      tpl
    } = await inquirer.prompt([{
      type: 'list',
      name: 'tpl',
      message: 'Please choose a template',
      choices: tpls
    }])

    const tplObj = tpls.find((t) => t.name === tpl)
    ctx._log(`You choosed template ${chalk.green(`${tpl}`)}`);
    // localTplCachePath /Users/zhangmingchao9/.mieo/mieotpl-react-antd-ts
    const localTplCachePath = `${ctx.dir.templateCacheDir}/${tpl}`
    // console.log('localTplCachePath',localTplCachePath);
    // console.log('projectName',projectName);

    if (fs.existsSync(localTplCachePath)) {
      // 本地存在，检查版本，如果有更新，更新模版
      const ltsVersion = execSync(`npm view ${tpl} version --json`) + ''
      const localVersion = `"${require(`${localTplCachePath}/package.json`).version}"`
      // console.log('ltsVersion,localVersion',ltsVersion,localVersion);
      if (localVersion !== ltsVersion.trim()) {
        ctx._log(chalk.blue(`This template need update to latest`))
        // 进行更新
        let update_loaing = ora(`${chalk.green('updating template ...')}`).start();
        exec(`
          git clone ${ tplObj.remote} ${projectName} --depth=1
          rm -rf ./${ projectName}/.git
          rm -rf ${ localTplCachePath}
          cp -rf ./${ projectName} ${localTplCachePath}
        `).then((stdout, stderr) => {
          update_loaing.succeed();
          install_package(projectName);
        }).catch(err => {
          update_loaing.fail();
          ctx._log(chalk.red(err));
        })
      } else {
        ctx._log(`${chalk.blue(`local template version is equal to remote , will copy from the local template cache`)}`)
        let copy_loading = ora(`${chalk.green('copying template ...')}`).start();
        exec(`
          cp -rf ${ localTplCachePath} ./${projectName}
        `).then((stdout, stderr) => {
          copy_loading.succeed();
          install_package(projectName)
        }).catch(err => {
          copy_loading.fail();
          ctx._log(chalk.red(err));
        });
      }
    } else {
      // 本地不存在，开始拉取模版，并同步更新本地缓存的模版
      ctx._log(chalk.blue(`local cache not exist, will start fetch template from ${chalk.cyan(tplObj.remote)}`))
      let download_loading = ora(`${chalk.green('downloading template ...')}`);
      download_loading.start();
      exec(`
        git clone ${ tplObj.remote} ${projectName} --depth=1
        rm -rf ./${ projectName}/.git
        cp -rf ./${ projectName} ${localTplCachePath}
      `).then((stdout, stderr) => {
        download_loading.succeed();
        install_package(projectName)
      }).catch(err => {
        download_loading.fail();
        ctx._log(chalk.red(err));
      });
    }

  } catch (err) {
    process.exit(0)
  }
}

function install_package(projectName) {
  // 开始安装依赖
  let install_loading = ora(chalk.green(`Installing packages ...`));
  install_loading.start();
  exec(`
    cd ${ projectName}
    npm i
    `)
    .then((stdout, stderr) => {
      install_loading.succeed();
      console.log(symbol.success, chalk.green('Project initialization finished!'))
      console.log(chalk.cyan(`We suggest that you begin by shell: \n\n\t${'cd ' + projectName}\n`))
      console.log(chalk.cyan('     Happy Coding!\n'))
    })
    .catch((error) => {
      console.log(chalk.red(error));
      install_loading.fail()
    })
}