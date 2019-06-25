interface Res {
  status: string;
  data?: {
      id: string,
      content: string,
      popularity?: number,
      origin?: {
          title?: string,
          dynasty?: string,
          author?: string,
          content?: string[],
          translate?: string[]
      },
      matchTags?: string[],
      recommendedReason?: string | null,
      cacheAt?: string
  } | string;
  token?: string;
  ipAddress?: string;
  errCode?: number | string;
  errMessage?: string;
}

class TP {  
  public config: {
    keyName?: string,
    getTokenUrl?: string,
    uid?: string | number;
    others?: any
  }; 

  public constructor (options: {
    keyName?: string,
    getTokenUrl?: string,
    uid?: string | number;
    others?: any
  }) {
    const keyName = 'jinrishici-token';
    const getTokenUrl = 'https://v2.jinrishici.com/token';
    const uid = 'NoLogin';
    this.config = { keyName, getTokenUrl, uid, ...options };
  }

  public async getToken (uid?: string | number): Promise<Res> {
    if (uid) {
      this.config.uid = uid;
    }
    return await fetch(this.config.getTokenUrl).then(rs => rs.json()).then(rs => {
      if (rs.status === 'success') {
        window.localStorage.setItem(this.getRealKeyName(this.config.uid), rs.data);
      } else {
        console.error('获取今日诗词Token失败');
      }
      return rs;
    })
  }

  public getRealKeyName (uid: string | number): string {
    return `${this.config.keyName}_${uid}`;
  }

  public login (uid: string | number): void {
    this.config.uid = uid;
    this.getToken(uid);
  }

  public logout (): void {
    window.localStorage.removeItem(String(this.config.uid));
  }

  public load (): Promise<Res>  {
    const realKeyName: string = this.getRealKeyName(this.config.uid);
    if (window.localStorage && window.localStorage.getItem(realKeyName)) {
      return this.commonLoad(window.localStorage.getItem(realKeyName));
    } else {
      return this.corsLoad();
    }
  }

  private corsLoad (): Promise<Res>  {
    return this.sendRequest('https://v2.jinrishici.com/one.json?client=npm-sdk/1.0');
  }

  private commonLoad(token: string): Promise<Res> {
    return this.sendRequest(`https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=${encodeURIComponent(token)}`);
  }

  private async sendRequest(apiUrl: string): Promise<Res> {
    return await fetch(apiUrl).then(rs => rs.json()).then(rs => {
      if (rs.status === 'success') {
        window.localStorage.setItem(this.getRealKeyName(this.config.uid), rs.token);
      } else {
        console.error('获取今日诗词Token失败');
      }
      return rs;
    })
  }
}

export default TP;
