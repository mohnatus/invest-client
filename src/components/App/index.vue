<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div>{{ total.toFixed(2) }}</div>
      <div>
        USD: {{ usd }}
        <br />
        EUR: {{ eur }}
      </div>
      <table>
        <col span="2" class="info">
        <col span="4" class="balance">
        <col span="2" class="count">
        <col span="2" class="buy">
        <thead>
          <tr>
            <th colspan="2"></th>
            <th colspan="4">На балансе</th>
            <th colspan="2">Расчет</th>
            <th colspan="2">Докупить</th>
          </tr>
          <tr>
            <th></th>
            <th>Тикер</th>
            <th>Лот.</th>
            <th>Сред.</th>
            <th>Прирост</th>
            <th>Сумма</th>
            <th>%</th>
            <th>Лот.</th>
            <th>Лот.</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="position in positions">
            <Position
              v-on:changeSum="position._toBuySum = $event.price; recalculate()"
              :position="position"
              :key="position.figi"
              :percent="composition[position.ticker] || 0"
              :total="getTotal(position.currency)"
            ></Position>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="7"></td>
            <td align="right">RUB</td>
            <td align="right">{{ sum.RUB }}</td>
          </tr>
          <tr>
            <td colspan="7"></td>
            <td align="right">USD</td>
            <td align="right">{{ sum.USD }}</td>
          </tr>
          <tr>
            <td colspan="7"></td>
            <td align="right">EUR</td>
            <td align="right">{{ sum.EUR }}</td>
          </tr>
        </tfoot>
      </table>

      <div>
        <button type="button" @click="update">Обновить</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  table {
    border-spacing: 0;
    border-collapse: collapse;

    th {
      padding: 5px 10px;
    }

    tfoot {
      td {
        padding: 5px 10px;
      }
    }

    .balance {
      background: #faecee;
    }

    .count {
      background: #e3fef9;
    }
  }
</style>

<script>
import { PortfolioPosition } from '../../models/PortfolioPosition';
import Position from '../Position/index.vue';

export default {
  props: ['url'],
  components: { Position },
  data() {
    return {
      loading: true,
      eur: 0,
      usd: 0,
      positions: [],
      composition: {},
      sum: {
        USD: 0,
        EUR: 0,
        RUB: 0
      }
    };
  },
  created() {
    console.log('url', this.url)
    Promise.all([
      this.getComposition(),
      this.getRates().then(() => {
        return this.getPortfolio();
      })
    ]).then(() => {
      this.loading = false;
    });
  },
  computed: {
    total() {
      return this.positions.reduce((total, position) => {
        let sum = this.getRUB(position.sum, position.currency);
        return total + sum;
      }, 0);
    },
    totalUSD() {
      return this.total / this.usd;
    },
    totalEUR() {
      return this.total / this.eur;
    },

  },
  methods: {
    recalculate() {
      let sum = {
        RUB: 0,
        EUR: 0,
        USD: 0
      }
      this.positions.forEach(position => {
        sum[position.currency] += position._toBuySum;
      });
      this.sum.RUB = sum.RUB;
      this.sum.USD = sum.USD;
      this.sum.EUR = sum.EUR;
    },
    getPortfolio() {
      return fetch(`${this.url}/portfolio`)
        .then((res) => res.json())
        .then((json) => {
          this.positions = json.portfolio.positions
            .filter((p) => p.instrumentType == 'Etf')
            .map((p) => new PortfolioPosition(p));
        });
    },
    getComposition() {
      return fetch(`${this.url}/composition`)
        .then((res) => res.json())
        .then((json) => {
          this.composition = json.reduce((acc, item) => {
            acc[item.ticker] = item.percent;
            return acc;
          }, {});
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
    getTotal(currency) {
      if (currency == 'RUB') return this.total;
      if (currency == 'USD') return this.totalUSD;
      if (currency == 'EUR') return this.totalEUR;
    },
    update() {
      this.loading = true;

      this.getRates().then(() => {
        return this.getPortfolio();
      }).then(() => {
        this.loading = false;
      });
    }
  }
};
</script>
