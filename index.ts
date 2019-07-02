export interface Res<T> {
  status: string;
  data: T;
  token?: string;
  ipAddress?: string;
  warning?: null | string;
  errCode?: number | string;
  errMessage?: string;
}

export interface Poetry {
  id: string;
  content: string;
  popularity?: number;
  origin?: {
      title?: string;
      dynasty?: string;
      author?: string;
      content?: string[];
      translate?: string[];
  };
  matchTags?: string[];
  recommendedReason?: string | null;
  cacheAt?: string;
};

export class TP {
  public config: {
    keyName: string;
    getTokenUrl: string;
    requestUrl: string;
    tokenName: string;
    uid: string | number;
    others?: any;
  };

  public constructor (options?: {
    keyName?: string;
    getTokenUrl?: string;
    requestUrl?: string;
    tokenName?: string;
    uid?: string | number;
    others?: any;
  }) {
    const keyName = 'jinrishici-token';
    const getTokenUrl = 'https://v2.jinrishici.com/token';
    const requestUrl = 'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0';
    const tokenName = 'X-User-Token';
    const uid = 'NoLogin';
    this.config = { keyName, getTokenUrl, requestUrl, tokenName, uid, ...options };
  }

  public async getToken (uid?: string | number): Promise<Res<string>> {
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

  public setUid (uid: string | number): TP {
    this.config.uid = uid;
    return this;
  }

  public login (uid?: string | number): TP {
    this.getToken(uid);
    return this;
  }
  
  public logout (uid?: string | number): TP {
    if (uid) {
      this.config.uid = uid;
    }
    window.localStorage.removeItem(this.getRealKeyName(this.config.uid));
    return this;
  }

  public async load (uid?: string | number): Promise<Res<Poetry>> {
    if (uid) {
      this.config.uid = uid;
    }
    const realKeyName: string = this.getRealKeyName(this.config.uid);
    const token = window.localStorage && window.localStorage.getItem(realKeyName);
    if (token) {
      return this.commonLoad(token);
    } else {
      const rs = await this.getToken();
      return this.commonLoad(rs.data);
    }
  }

  public getPoetry (): Promise<Res<Poetry>> {
    return this.sendRequest(this.config.requestUrl);
  }

  public commonLoad(token: string): Promise<Res<Poetry>> {
    return this.sendRequest(`${this.config.requestUrl}&${this.config.tokenName}=${encodeURIComponent(token)}`)
  }

  private async sendRequest(apiUrl: string): Promise<Res<Poetry>> {
    const rs: Response = await fetch(apiUrl);
    const res: Res<Poetry> = await rs.json();
    if (res.status === 'success') {
      if (!window.localStorage.getItem(this.getRealKeyName(this.config.uid))) {
        window.localStorage.setItem(this.getRealKeyName(this.config.uid), String(res.token));
      }
    } else {
      console.error('获取今日诗词Token失败');
    }
    return res;
  }
}

export default TP;
