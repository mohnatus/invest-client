<template>
  <div>

    <div class="menu">
      <router-link to="/etfs">Фонды</router-link>
      <router-link to="/portfolio">Портфель</router-link>
      <router-link to="/composition">Балансировка</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  margin-bottom: 24px;
}
</style>

<script>
</script>
