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
    keyName?: string;
    getTokenUrl: string;
    uid: string | number;
    others?: any;
  };

  public constructor (options: {
    keyName?: string;
    getTokenUrl?: string;
    uid?: string | number;
    others?: any;
  }) {
    const keyName = 'jinrishici-token';
    const getTokenUrl = 'https://v2.jinrishici.com/token';
    const uid = 'NoLogin';
    this.config = { keyName, getTokenUrl, uid, ...options };
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

  public login (uid?: string | number): void {
    this.getToken(uid);
  }

  public logout (): void {
    window.localStorage.removeItem(String(this.config.uid));
  }

  public load (): Promise<Res<Poetry>> {
    const realKeyName: string = this.getRealKeyName(this.config.uid);
    const token = window.localStorage && window.localStorage.getItem(realKeyName);
    if (token) {
      return this.commonLoad(token);
    } else {
      return this.corsLoad();
    }
  }

  public corsLoad (): Promise<Res<Poetry>> {
    return this.sendRequest('https://v2.jinrishici.com/one.json?client=npm-sdk/1.0');
  }

  public commonLoad(token: string): Promise<Res<Poetry>> {
    return this.sendRequest(`https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=${encodeURIComponent(token)}`)
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
