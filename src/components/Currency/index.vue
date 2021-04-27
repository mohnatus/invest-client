<template>
  <div>
    <span
      class="currency currency--rub"
      title="Российский рубль"
      v-if="currency.toUpperCase() == 'RUB'"
      >₽</span
    >
    <span
      class="currency currency--eur"
      title="Евро"
      v-else-if="currency.toUpperCase() == 'EUR'"
      >€</span
    >
    <span
      class="currency currency--usd"
      title="Доллар США"
      v-else-if="currency.toUpperCase() == 'USD'"
      >$</span
    >
  </div>
</template>

<script>
export default {
  props: ['currency']
}
</script>

<style lang="scss" scoped>
.currency {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;

  &--eur {
    background-color: blue;
    color: white;
  }

  &--usd {
    background-color: green;
    color: white;
  }

  &--rub {
    background-color: goldenrod;
    color: white;
  }
}
</style>
