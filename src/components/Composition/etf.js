export class ETF {
  constructor(data) {
    this.ticker = data.ticker;
    this.type = data.type;
    this.currency = data.currency || '';

    this.market = data.market;
    this.region = data.region;
    this.sector = data.sector;

    this.markets = data.markets;
    this.actives = data.actives;

    this.active = data.active;
  }

  get currencySymbol() {
    if (this.currency == 'usd') return '＄';
    if (this.currency == 'eur') return '€';
    if (this.currency == 'rub') return '₽';
    return '';
  }

  toggle() {
    this.active = !this.active;
  }
}
