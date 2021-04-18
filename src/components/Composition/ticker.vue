<template>
  <div class="ticker" :class="{
    inactive: !etf.active
  }" @click="etf.toggle()">
    {{ etf.ticker }}
  </div>
</template>

<style lang="scss">
.ticker {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 20px;
  height: 32px;
  margin: 2px;
  font-size: 12px;
  background: #eee;
  cursor: pointer;

  &.inactive {
    opacity: 0.5;
  }

}
</style>

<script>

export default {
  props: ['etf']
}
</script>
