<template>
  <tr
    :class="{
      'no-position': !position,
      'to-remove': etf.percent == 0
    }"
  >
    <td>
      <Currency :currency="etf.currency"></Currency>
    </td>
    <td>{{ etf.ticker }}</td>

    <td align="right">{{ etf.percent.toFixed(3) }}</td>
    <td align="right">
      <span v-if="countedSum">{{ countedSum.toFixed(2) }}</span>
      <span v-else>-</span>
    </td>
    <td align="right">
      {{ currentPrice > 0 ? currentPrice.toFixed(4) : '-' }}
    </td>
    <td align="right">
      <i>{{ lastPrice.toFixed(4) }}</i>
    </td>
    <td align="right">{{ countedLots || '-' }}</td>

    <td align="right">{{ position ? position.balance : '-' }}</td>
    <td align="right">
      {{ position ? position.averagePositionPrice.value : '-' }}
    </td>
    <td align="right">
      {{
        position
          ? (position.averagePositionPrice.value * position.balance).toFixed(2)
          : '-'
      }}
    </td>

    <td align="right">{{ buyLots }}</td>
    <td align="right">{{ buySum ? buySum.toFixed(2) : '-' }}</td>
  </tr>
</template>

<style lang="scss" scoped>
tr {
  &.no-position {
    color: rgb(182, 182, 182);
  }
  &.to-remove {
    color: rgba(255, 0, 0, 0.4);
  }

  td,
  th {
    padding: 5px;
  }
}
</style>

<script>
import Currency from '../Currency/index.vue';

export default {
  props: ['etf', 'position', 'total', 'rate'],
  components: { Currency },
  data() {
    return {
      currentPrice: 0,
      lastPrice: 0
    };
  },
  watch: {
    buySum(v, oldV) {
      if (v != oldV)  this.$emit('recalculate');
    }
  },
  created() {
    let cur = this.etf.currency.toUpperCase();
    let boardId = 'TQTF';
    if (cur == 'USD') boardId = 'TQTD';
    if (cur == 'EUR') boardId = 'TQTE';

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
      `https://iss.moex.com/iss/history/engines/stock/markets/shares/sessions/3/securities/${this.etf.ticker.toLowerCase()}.json?iss.meta=off&iss.only=history&from=${from}&history.columns=BOARDID,CLOSE`
    )
      .then((res) => res.json())
      .then((json) => {
        let data = json.history.data;
        let item = data.find((i) => {
          return i[0] == boardId;
        });

        this.lastPrice = item[1];
      });

    fetch(
      `https://iss.moex.com/iss/engines/stock/markets/shares/securities/${this.etf.ticker.toLowerCase()}.json?iss.meta=off&iss.only=marketdata&marketdata.columns=BOARDID,OFFER,SPREAD,UPDATETIME,TRADINGSTATUS`
    )
      .then((res) => res.json())
      .then((json) => {
        let marketdata = json.marketdata;
        let columns = marketdata.columns;
        let item = marketdata.data.find((i) => {
          return i[0] == boardId;
        });
        let res = columns.reduce((res, col, ind) => {
          res[col] = item[ind];
          return res;
        }, {});

        //this.boardId = res.BOARDID;
        this.currentPrice = Math.floor((res.OFFER + res.SPREAD) * 1000) / 1000;
        //this.time = res.UPDATETIME;
        //this.status = res.TRADINGSTATUS;
      });
  },
  computed: {
    countedSum() {
      let total = this.total / this.rate;
      if (total == 0) return null;
      if (this.etf.percent == 0) return null;
      return (total * this.etf.percent) / 100;
    },
    countedLots() {
      if (!this.countedSum) return null;
      return Math.floor(
        this.countedSum / (this.currentPrice || this.lastPrice)
      );
    },
    buyLots() {
      if (!this.position) return Math.floor(this.countedLots);
      return Math.floor(this.countedLots - this.position.balance);
    },
    buySum() {
      let sum = null;
      if (this.buyLots < 0) {
      } else {
        sum = (this.currentPrice || this.lastPrice) * this.buyLots;
      }
      return sum;
    }
  },
  methods: {
    getSum() {
      return this.buySum;
    }
  }
};
</script>
