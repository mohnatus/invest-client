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
          <input type="text" v-model="total" class="total" />
        </div>
        <div class="info-block">
          <h2>Не куплено</h2>
          <div>
            <span v-for="etf in unused" :key="etf">{{ etf }}</span>
          </div>
        </div>
      </div>

      <div class="table">
        <table>
          <thead>
            <tr>
              <th colspan="1" class="name"></th>
              <th colspan="4" class="balance">На балансе</th>
              <th colspan="3" class="count">Расчет</th>
              <th colspan="2" class="buy">Докупить</th>
            </tr>
            <tr>
              <th class="name">Тикер</th>

              <th class="balance">Лот.</th>
              <th class="balance">Сред.</th>
              <th class="balance">Сумма</th>
              <th class="balance">Прирост</th>

              <th class="count">Цена</th>
              <th class="count">%</th>
              <th class="count">Лот.</th>

              <th class="buy">Лот.</th>
              <th class="buy">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="position in positions">
              <Position
                v-on:changeSum="
                  position._toBuySum = $event.price;
                  recalculate();
                "
                :position="position"
                :key="position.figi"
                :percent="composition[position.ticker] || 0"
                :total="getTotal(position.currency)"
              ></Position>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="8"></td>
              <td align="right">RUB</td>
              <td align="right">{{ sum.RUB }}</td>
            </tr>
            <tr>
              <td colspan="8"></td>
              <td align="right">USD</td>
              <td align="right">{{ sum.USD }}</td>
            </tr>
            <tr>
              <td colspan="8"></td>
              <td align="right">EUR</td>
              <td align="right">{{ sum.EUR }}</td>
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
    flex-wrap: wrap;
    margin-bottom: 16px;

    &-block {
      padding: 10px;
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

    .balance {
      background: #faecee;
    }

    .count {
      background: #e3fef9;
    }
  }
}
</style>

<script>
import { PortfolioPosition } from './PortfolioPosition';
import Position from './position.vue';
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
      positions: [],
      composition: {},
      sum: {
        USD: 0,
        EUR: 0,
        RUB: 0
      },
      unused: []
    };
  },
  created() {
    this.getBalance();

    Promise.all([
      this.getComposition(),
      this.getRates().then(() => {
        return this.getPortfolio();
      })
    ]).then(() => {
      let used = this.positions.map((p) => p.ticker);
      let unused = [];

      Object.keys(this.composition).forEach((key) => {
        if (used.includes(key)) return;
        unused.push(key);
      });

      this.unused = unused;
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
    recalculate() {
      let sum = {
        RUB: 0,
        EUR: 0,
        USD: 0
      };
      this.positions.forEach((position) => {
        sum[position.currency] += position._toBuySum;
      });
      this.sum.RUB = sum.RUB;
      this.sum.USD = sum.USD;
      this.sum.EUR = sum.EUR;
    },
    getPortfolio() {
      return fetch(`${url}/portfolio`)
        .then((res) => res.json())
        .then((json) => {
          this.positions = json.portfolio.positions
            .filter((p) => p.instrumentType == 'Etf')
            .map((p) => new PortfolioPosition(p, url));

          let total = this.positions.reduce((total, position) => {
            let sum = this.getRUB(position.sum, position.currency);
            return total + sum;
          }, 0);
          this.accountTotal = total;
          this.total = total;
        });
    },
    getComposition() {
      return fetch(`${url}/composition/percents`)
        .then((res) => res.json())
        .then((json) => {
          let composition = {};
          Object.keys(json.percents).forEach((key) => {
            composition[key] = json.percents[key];
          });
          this.composition = composition;
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
      if (currency == 'RUB') return this.total;
      if (currency == 'USD') return this.totalUSD;
      if (currency == 'EUR') return this.totalEUR;
    },
    update() {
      this.loading = true;

      this.getRates()
        .then(() => {
          return this.getPortfolio();
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>
