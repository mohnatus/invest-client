export class PortfolioPosition {
  constructor(data) {
    this.figi = data.figi;
    this.ticker = data.ticker;
    this.balance = data.balance;
    this.name = name;
    this.boardId = null;
    this.averagePositionPrice = data.averagePositionPrice.value;
    this.currentPrice = this.averagePositionPrice;
    this.currency = data.averagePositionPrice.currency;
    this.yield = data.expectedYield.value;
    this.time = null;
    this.status = null;

    this.getMarketData();
  }

  get sum() {
    return this.balance * this.averagePositionPrice;
  }

  getMarketData() {
    //fetch(`http://iss.moex.com/iss/securities/${this.ticker}.json?iss.meta=off&iss.only=description`)
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
}
