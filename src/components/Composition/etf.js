export class ETF {
  constructor(data) {
    console.log(data);
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });

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
