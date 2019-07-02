# Today's Poetry for Typescript

- 本项目为`第三方`版本，非官方版本

- 官方原包为js版本，此项目为typescript版本，可在ts项目中使用

- 如何使用本项目：

  ```shell
  npm install today-poetry-ts
  ```
  ```ts
  import TP from 'today-poetry-ts';

  const tp = new TP({
    keyName: '_today_poetry_token_'
  });

  // 简单使用 直接获取诗词 【官方不推荐使用】【无token将降低诗词推荐质量】
  tp.getPoetry().then(rs => {
    // TODO
  });

  // 登录用户 获取诗词  【官方推荐使用】【携带token】
  tp.login(uid).load().then(rs => {
    // TODO
  });

  // 用户注销
  tp.logout(uid);


  // 手动获取token 然后携带token获取诗词
  tp.setUid(uid).getToken().then(rs => (
    rs.status === 'success' && tp.commonLoad(rs.data)
  )).then(rs => {
    // TODO
  });
  ```

- 官方原版项目名称：`jinrishici`

- 官方原版安装方式：`npm install jinrishici`

- 以下为官方原本README

> 今日诗词API 是一个可以免费调用的诗词接口：[https://www.jinrishici.com](https://www.jinrishici.com)
> 
> 该包是官方 SDK 包
> 
> 每次调用返回一句诗词，根据时间、地点、天气、事件智能推荐
> 
> npm 安装后，引入本模块，调用 load 方法，传入一个回调函数即可。
> 
> ```javascript
> const jinrishici = require('jinrishici');
> jinrishici.load(result => {
>   console.log(result);
> });
> ```
> 
> 仅支持浏览器环境中调用，不支持 Node 环境，不支持服务器渲染，请打包时注意。