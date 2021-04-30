<template>
  <div class="counter">
    <div
      class="minus lg"
      @click="descreaseLg()"
      :class="{
        inactive: value == 0
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M0 10h24v4h-24z" />
      </svg>
    </div>
    <div
      class="minus"
      @click="descrease()"
      :class="{
        inactive: value == 0
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
      >
        <path d="M0 10h24v4h-24z" />
      </svg>
    </div>
    <div class="value">{{ value }}</div>
    <div
      class="plus"
      @click="increase()"
      :class="{
        inactive: value >= max
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
      >
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
      </svg>
    </div>
    <div
      class="plus lg"
      @click="increaseLg()"
      :class="{
        inactive: value >= max
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.counter {
  display: flex;
  align-items: center;
  padding: 0;
  user-select: none;

  .minus,
  .plus {
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: currentColor;

    &.inactive {
      opacity: 0.4;
      cursor: not-allowed;
    }

    svg {
      fill: currentColor;
    }
  }

  .value {
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
  }
}
</style>

<script>
export default {
  props: ['value', 'max'],
  methods: {
    increase() {
      if (this.value < this.max) {
        this.$emit('input', this.value + 1);
      }
    },
    descrease() {
      if (this.value > 0) {
        this.$emit('input', this.value - 1);
      }
    },
    increaseLg() {
      if (this.value < this.max) {
        let newValue = this.value + 5;
        this.$emit('input', Math.min(this.max, newValue));
      }
    },
    descreaseLg() {
      if (this.value > 0) {
        let newValue = this.value - 5;
        this.$emit('input', Math.max(0, newValue));
      }
    }
  }
};
</script>
