class TP {

  constructor (options) {
    const keyName = 'jinrishici-token';
    const getTokenUrl = 'https://v2.jinrishici.com/token';
    this.config = { keyName, getTokenUrl, ...options };
    this.getToken();
  }

  getToken () {
    fetch(this.config.getTokenUrl).then(rs => rs.json()).then(rs => {
      if (rs.status === 'success') {
        window.localStorage.setItem(this.config.keyName, rs.data);
      } else {
        console.error('获取今日诗词Token失败');
      }
    })
  }

  removeToken () {
    window.localStorage.removeItem(this.config.keyName);
  }

  load (callback, errHandler) {
    if (window.localStorage && window.localStorage.getItem(this.config.keyName)) {
      return this.commonLoad(callback, errHandler, window.localStorage.getItem(this.config.keyName));
    } else {
      return this.corsLoad(callback, errHandler);
    }
  }

  corsLoad (callback, errHandler) {
    const newCallBack = function (result) {
      window.localStorage.setItem(this.config.keyName, result.token);
      callback(result);
    };
    return sendRequest(newCallBack, errHandler, "https://v2.jinrishici.com/one.json?client=npm-sdk/1.0");
  }

  commonLoad(callback, errHandler, token) {
    return sendRequest(callback, errHandler, "https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=" + encodeURIComponent(token));
  }

  sendRequest(callback, errHandler, apiUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', apiUrl);
    xhr.withCredentials = true;
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText);
        if (data.status === "success") {
          callback(data);
        } else {
          if (errHandler) {
            errHandler(data);
          } else {
            console.error("今日诗词API加载失败，错误原因：" + data.errMessage);
          }
        }
      }
    };
  }

}

export default TP;
