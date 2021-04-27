<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th width="20"></th>
          <th width="100">Тикер</th>
          <th width="150">Название</th>
          <th width="100">УК</th>

          <th width="30">{{ total.toFixed(2) }}%</th>
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
          <td>
            <div style="display: flex">
              <span style="margin-right: 8px;" class="currency" :class="'currency--' + etf.currency">
                {{ etf.currencySymbol }}
              </span>
              <span>{{ etf.ticker }}</span>
            </div>
          </td>
          <td>
            {{ etf.name }}
            <div>
              <span v-for="tag in etf.tags" :key="tag">#{{ tag }}</span>
            </div>
          </td>
          <td>
            {{  etf.manager }}
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
