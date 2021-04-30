<template>
  <div class="ticker" @click="$emit('click')">
    <span class="ticker-name">{{ etf.ticker }}</span>

    <div class="ticker-bubble">
      <div class="ticker-bubble__name"><b>{{ etf.name }}</b></div>
      <div>{{ etf.manager }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ticker {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 20px;
  height: 32px;
  margin: 2px;
  font-size: 12px;
  background: rgba(238, 238, 238, 1);
  cursor: pointer;
  position: relative;

  &.inactive {
    background: rgba(238, 238, 238, 0.5);
    span {
      opacity: 0.5;
    }
  }

  &-bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    background: white;
    padding: 5px;
    border-radius: 4px;
    transform: translate(-50%, -10px);
    display: none;
    box-shadow: 0 0 5px  rgba(0,0,0,0.1);

    &__name {
      white-space: nowrap;
      margin-bottom: 4px;
    }
  }

  &:hover {
    .ticker-bubble {
      display: block;
    }
  }

}
</style>

<script>

export default {
  props: ['etf']
}
</script>
