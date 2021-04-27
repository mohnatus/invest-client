<template>
  <div class="portfolio">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="info">
        <div class="info-block account">
          <h2>Портфель</h2>
          <div class="info-item">
            <span class="currency currency--rub">₽</span>
            {{ accountTotal.toFixed(2) }}
          </div>
          <div class="info-item">
            <span class="currency currency--usd">$</span>
            {{ toRUB(accountTotal, 'USD').toFixed(2) }}
          </div>
          <div class="info-item">
            <span class="currency currency--eur">€</span>
            {{ toRUB(accountTotal, 'EUR').toFixed(2) }}
          </div>
        </div>
        <div class="info-block rates">
          <h2>На счете</h2>
          <div class="info-item">
            <span class="currency currency--rub">₽</span>
            {{ balance.RUB }}
          </div>
          <div class="info-item">
            <span class="currency currency--usd">$</span>
            {{ balance.USD }}
          </div>
          <div class="info-item">
            <span class="currency currency--eur">€</span>
            {{ balance.EUR }}
          </div>
        </div>
        <div class="info-block rates">
          <h2>Курсы</h2>
          <div class="info-item">
            <span class="currency currency--usd">$</span>
            {{ usd }}
          </div>
          <div class="info-item">
            <span class="currency currency--eur">€</span>
            {{ eur }}
          </div>
        </div>
        <div class="info-block">
          <h2>Рассчитать для суммы</h2>
          <input type="number" v-model="total" class="total" />
        </div>
      </div>

      <div class="table">
        <table>
          <colgroup>
            <col class="col-ticker" />
            <col class="col-ticker" />
          </colgroup>
          <colgroup>
            <col class="col-count" />
            <col class="col-count" />
            <col class="col-count" />
            <col class="col-count" />
            <col class="col-count" />
          </colgroup>
          <colgroup>
            <col class="col-portfolio" />
            <col class="col-portfolio" />
            <col class="col-portfolio" />
          </colgroup>
          <colgroup>
            <col class="col-buy" />
            <col class="col-buy" />
          </colgroup>
          <thead>
            <tr>
              <th colspan="2"></th>
              <th colspan="5">Расчет, в валюте актива</th>
              <th colspan="3">Портфель</th>
              <th colspan="2">Купить</th>
            </tr>
            <tr>
              <th></th>
              <th>Тикер</th>

              <th>%</th>
              <th>Сумма</th>
              <th>Цена, тек.</th>
              <th>Цена, закр.</th>
              <th>Лот.</th>

              <th>Лот.</th>
              <th>Сред. цена</th>
              <th>Сумма</th>

              <th>Лот.</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <Position
              ref="position"
              v-for="etf of etfs"
              :key="etf.id"
              :etf="etf"
              :total="total"
              :position="portfolio[etf.ticker]"
              :rate="getRate(etf.currency)"
              @recalculate="calculate"
            ></Position>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="10"></td>
              <td align="right">RUB</td>
              <td align="right">{{ sum.RUB.toFixed(2) }}</td>
            </tr>
            <tr>
              <td colspan="10"></td>
              <td align="right">USD</td>
              <td align="right">{{ sum.USD.toFixed(2) }}</td>
            </tr>
            <tr>
              <td colspan="10"></td>
              <td align="right">EUR</td>
              <td align="right">{{ sum.EUR.toFixed(2) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div>
        <button type="button" @click="update">Обновить</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.portfolio {
  .info {
    display: flex;
    // flex-wrap: wrap;
    margin-bottom: 16px;

    &-block {
      padding: 10px;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      max-width: 300px;

      span {
        padding: 5px;
      }
    }
    h2 {
      margin-bottom: 12px;
    }

    .total {
      height: 36px;
      padding: 5px;
    }

    &-item {
      display: flex;
      align-items: center;
      font-weight: bold;
      margin-bottom: 8px;

      .currency {
        margin-right: 12px;
      }
    }
  }
  .table {
    width: 100%;
    overflow: auto;
  }
  table {
    border-spacing: 0;
    border-collapse: collapse;

    tr:not(.no-composition):hover {
      td {
        background: rgb(25, 25, 78);
        color: white;
        cursor: pointer;
      }
    }

    th {
      padding: 5px 10px;
    }

    tfoot {
      td {
        padding: 5px 10px;
      }
    }

    thead,
    tbody {
      th:first-child,
      td:first-child {
        background: white;
        position: sticky;
        left: 0;
      }
    }

    .col-portfolio {
      background: #faecee;
    }

    .col-count {
      background: #e3fef9;
    }

    .col-buy {
      background: #f9fee3;
    }
  }
}
</style>

<script>
// import { PortfolioPosition } from './PortfolioPosition';
import Position from './item.vue';
import { url } from '../../config/api';

export default {
  components: { Position },
  data() {
    return {
      accountTotal: 0,
      total: 0,
      balance: {
        USD: 0,
        EUR: 0,
        RUB: 0
      },
      loading: true,
      eur: 0,
      usd: 0,
      etfs: [],
      portfolio: {},
      sum: {
        RUB: 0,
        EUR: 0,
        USD: 0,
      },

    };
  },
  created() {
    this.getBalance();

    Promise.all([
      this.getEtfs(),
      this.getComposition(),
      this.getRates().then(() => {
        return this.getPortfolio();
      })
    ]).then(([etfsList, percents, portfolioItems]) => {
      let positions = portfolioItems.map((i) => i.ticker);

      this.etfs = etfsList
        .map((e) => {
          return {
            ...e,
            percent: percents[e.ticker]
          };
        })
        .filter((e) => {
          if (e.percent > 0) return true;
          if (positions.includes(e.ticker)) return true;
        });

      portfolioItems.forEach((i) => {
        this.portfolio[i.ticker] = i;
      });

      this.accountTotal = portfolioItems.reduce((sum, i) => {
        let itemSum = i.balance * i.averagePositionPrice.value;
        return sum + this.getRUB(itemSum, i.averagePositionPrice.currency);
      }, 0);
      this.total = Math.floor(this.accountTotal);
      this.loading = false;
    });
  },
  computed: {
    totalUSD() {
      return this.total / this.usd;
    },
    totalEUR() {
      return this.total / this.eur;
    }
  },
  methods: {
    calculate() {
      console.log('calculate')
      let sum = {
        USD: 0,
        EUR: 0,
        RUB: 0
      };


      if (this.$refs.position) {
        this.$refs.position.forEach((p) => {
          let itemSum = p.getSum();
          let cur = p.etf.currency.toUpperCase();
          sum[cur] += itemSum;
        });
      }

      this.sum = sum;
    },
    getRate(currency) {
      if (currency.toUpperCase() == 'RUB') return 1;
      if (currency.toUpperCase() == 'USD') return this.usd;
      if (currency.toUpperCase() == 'EUR') return this.eur;
    },
    getCountSum(etf) {
      let total = this.total;
      if (etf.currency == 'usd') total = this.totalUSD;
      else if (etf.currency == 'eur') total = this.totalEUR;

      if (etf.percent == 0) return '-';

      return ((total * etf.percent) / 100).toFixed(2);
    },

    getEtfs() {
      return fetch(`${url}/etfs`, {
        method: 'GET'
      })
        .then((res) => res.json())
        .then((json) => {
          return json.etfs;
        });
    },
    getPortfolio() {
      return fetch(`${url}/portfolio`)
        .then((res) => res.json())
        .then((json) => {
          return json.portfolio.positions.filter(
            (p) => p.instrumentType == 'Etf'
          );
        });
    },
    getComposition() {
      return fetch(`${url}/composition/percents`)
        .then((res) => res.json())
        .then((json) => {
          return json.percents || {};
        });
    },
    getBalance() {
      return fetch(`${url}/balance`)
        .then((res) => res.json())
        .then((json) => {
          let currencies = json.balance.currencies;
          currencies.forEach((c) => {
            this.balance[c.currency] = c.balance;
          });
        });
    },
    getRates() {
      return fetch(
        'http://iss.moex.com/iss/statistics/engines/currency/markets/selt/rates.json?cbrf.columns=CBRF_USD_LAST,CBRF_EUR_LAST&iss.meta=off'
      )
        .then((res) => res.json())
        .then((json) => {
          let data = json.cbrf.data[0];
          this.usd = data[0];
          this.eur = data[1];
        });
    },
    getRUB(value, currency) {
      if (currency == 'RUB') return value;
      if (currency == 'USD') return value * this.usd;
      if (currency == 'EUR') return value * this.eur;
    },
    toRUB(value, currency) {
      if (currency == 'RUB') return value;
      if (currency == 'USD') return value / this.usd;
      if (currency == 'EUR') return value / this.eur;
    },
    getTotal(currency) {
      if (currency.toUpperCase() == 'RUB') return this.total;
      if (currency.toUpperCase() == 'USD') return this.totalUSD;
      if (currency.toUpperCase() == 'EUR') return this.totalEUR;
    },
    update() {
      // this.loading = true;
      // this.getRates()
      //   .then(() => {
      //     return this.getPortfolio();
      //   })
      //   .then(() => {
      //     this.loading = false;
      //   });
    }
  }
};
</script>
