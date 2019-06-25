declare class TP {
  config: {
    keyName: string,
    getTokenUrl: string,
    others?: any
  }
  constructor(options: {
    keyName: string,
    getTokenUrl: string,
    others?: any
  })
  getToken(): void
  removeToken(): void
  load (callback: Function, errHandler: Function): any
  corsLoad (callback: Function, errHandler: Function): any
  commonLoad(callback: Function, errHandler: Function): any
  sendRequest(callback: Function, errHandler: Function, apiUrl: string): void
}
export = TP;
