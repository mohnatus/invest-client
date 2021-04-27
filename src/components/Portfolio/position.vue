<template>
  <tr
    :class="{
      'no-composition': !percent
    }"
  >
    <td class="name">
      <div class="ticker">
        <span
          class="currency currency--rub"
          title="Российский рубль"
          v-if="position.currency == 'RUB'"
          >₽</span
        >
        <span
          class="currency currency--eur"
          title="Евро"
          v-else-if="position.currency == 'EUR'"
          >€</span
        >
        <span
          class="currency currency--usd"
          title="Доллар США"
          v-else-if="position.currency == 'USD'"
          >$</span
        >
        <b>{{ position.ticker }}</b>
      </div>
    </td>

    <td class="balance" align="right">{{ position.balance }}</td>
    <td class="balance" align="right">
      {{ position.averagePositionPrice.toFixed(3) }}
    </td>
    <td class="balance" align="right">{{ position.sum.toFixed(2) }}</td>
    <td class="balance" align="right">
      <span class="yield yield--success" v-if="position.yield > 0"
        >+{{ position.yield }}</span
      >
      <span class="yield yield--danger" v-else-if="position.yield < 0">{{
        position.yield
      }}</span>
      <span class="yield" v-else>0</span>
    </td>

    <td class="count" align="right">
      {{ position.currentPrice.toFixed(3) }}
      <br />
      {{ position.lastPrice.toFixed(3) }}
    </td>
    <td class="count" align="right">{{ percent }}%</td>
    <td class="count" align="right">{{ countedCount }}</td>

    <td class="buy" align="right">{{ diffCount }}</td>
    <td class="buy" align="right">
      {{ diffPrice ? diffPrice.toFixed(2) : '-' }}
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.no-composition {
  background: #eee !important;
  color: #888 !important;
  td {
    background: #eee !important;
    &:not(:first-child) {
      opacity: 0.5;
    }
    &:first-child {
      z-index: 1;
    }
  }
}
td {
  padding: 5px 15px;
  border-bottom: 1px solid #ccc;
}
.ticker {
  display: flex;
  align-items: center;
  .currency {
    margin-right: 12px;
  }
}
.currency {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  line-height: 1;
  color: white;
  cursor: default;

  &--usd {
    background: #16b016;
  }

  &--eur {
    background: #3636d5;
  }

  &--rub {
    background: #c3a609;
  }
}
.yield {
  font-weight: bold;
  font-size: 0.8em;
  color: #ccc;

  &--success {
    color: green;
  }
  &--danger {
    color: red;
  }
}
</style>

<script>
export default {
  props: ['position', 'percent', 'total'],
  computed: {
    countedCount() {
      let countedSum = (this.total * this.percent) / 100;
      let price = this.position.currentPrice || this.position.lastPrice;
      console.log('total', this.total);
      return Math.floor(countedSum / price);
    },
    diffCount() {
      console.log('diff', this.countedCount, this.position.balance);
      return Math.floor(this.countedCount - this.position.balance);
    },
    diffPrice() {
      let price = null;
      if (this.diffCount > 0) {
        price =
          this.diffCount *
          (this.position.currentPrice || this.position.lastPrice);
      }
      this.$emit('changeSum', { price });
      return price;
    }
  }
};
</script>
