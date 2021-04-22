<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Тикер</th>
          <th></th>
          <th>{{ total.toFixed(2) }}%</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="etf in sorted"
          :key="etf.ticker"
          :class="{
            inactive: !etf.active
          }"
        >
          <td>
            <input
              type="checkbox"
              :checked="etf.active"
              @change="etf.toggle()"
            />
          </td>
          <td>{{ etf.ticker }}</td>
          <td>
            <div class="currency" :class="'currency--' + etf.currency">
              {{ etf.currencySymbol }}
            </div>
          </td>
          <td align="right">
            <span v-if="percents[etf.ticker]">
              {{ percents[etf.ticker].toFixed(2) }}
            </span>

          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table {
  tr {
    &.inactive {
      opacity: 0.5;
    }
  }
}
</style>

<script>
export default {
  props: ['etfs', 'percents'],
  computed: {
    total() {
      return Object.values(this.percents).reduce((acc, v) => acc + v, 0);
    },
    sorted() {
      let active = this.etfs.filter((i) => i.active);
      let inactive = this.etfs.filter((i) => !i.active);
      return [...active, ...inactive];
    }
  }
};
</script>
