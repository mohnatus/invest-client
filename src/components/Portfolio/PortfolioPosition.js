export class PortfolioPosition {
  constructor(data, url) {
    this.url = url;

    this.figi = data.figi;
    this.ticker = data.ticker;
    this.balance = data.balance;
    this.name = name;
    this.boardId = null;
    this.averagePositionPrice = data.averagePositionPrice
      ? data.averagePositionPrice.value
      : 0;
    this.currentPrice = this.averagePositionPrice;
    this.lastPrice = 0;
    this.currency = data.averagePositionPrice
      ? data.averagePositionPrice.currency
      : '';
    this.yield = data.expectedYield ? data.expectedYield.value : '';
    this.time = null;
    this.status = null;

    this.getMarketData();
  }

  get sum() {
    return this.balance * this.averagePositionPrice;
  }

  getMarketData() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let day = date.getDate() + '';
    let month = date.getMonth() + 1 + '';
    let year = date.getFullYear() + '';
    let from = `${year.padStart(2, '0')}-${month.padStart(
      2,
      '0'
    )}-${day.padStart(2, '0')}`;
    fetch(
      `https://iss.moex.com/iss/history/engines/stock/markets/shares/sessions/3/securities/${this.ticker.toLowerCase()}.json?iss.meta=off&iss.only=history&from=${from}&history.columns=CLOSE`
    )
      .then((res) => res.json())
      .then((json) => {
        this.lastPrice = json.history.data[0][0];
      });

    fetch(
      `https://iss.moex.com/iss/engines/stock/markets/shares/securities/${this.ticker.toLowerCase()}.json?iss.meta=off&iss.only=marketdata&marketdata.columns=BOARDID,OFFER,SPREAD,UPDATETIME,TRADINGSTATUS`
    )
      .then((res) => res.json())
      .then((json) => {
        let marketdata = json.marketdata;
        let columns = marketdata.columns;
        let data = marketdata.data[0];
        let res = columns.reduce((res, col, ind) => {
          res[col] = data[ind];
          return res;
        }, {});

        this.boardId = res.BOARDID;
        this.currentPrice = Math.floor((res.OFFER + res.SPREAD) * 1000) / 1000;
        this.time = res.UPDATETIME;
        this.status = res.TRADINGSTATUS;
      });
  }

  buy(count) {
    fetch(`${this.url}/buy?figi=${this.figi}&count=${count}`);
  }
}
