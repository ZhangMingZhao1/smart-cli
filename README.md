# smart-cli

A simple, fast, and universality template-download command line tools.

# Usage

```
npm install -g smart-cli
smart-cli -h
```

# Create a project

```
smart-cli init quick_demo
```

# Dev
```
git clone https://github.com/ZhangMingZhao1/smart-cli.git
cd smart-cli 
npm link
```
# Template List

+ [react-ts-pc-start](https://github.com/jd-smart-fe/react-ts-pc-start) A Template based on react, typecript, antd
+ [react-ts-mobile-start](https://github.com/jd-smart-fe/react-ts-mobile-start) A Template based on react, typecript, antd-mobile

# Tip

本地会在unix的~/.smart-cli创建缓存文件夹，下载过的模板会保存在这里，如果云端模板和本地模板版本一致，会直接从缓存中拷贝模板到当前目录，如果版本不一致，会重新拉取云端最新模板到当前目录，并把当前新版本模板保存在缓存文件夹中。
