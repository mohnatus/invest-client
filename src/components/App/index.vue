<template>
  <div>

    <div class="menu">
      <router-link class="menu-item" to="/etfs">Список фондов</router-link>
      <router-link class="menu-item" to="/composition">Балансировка</router-link>
      <router-link class="menu-item" to="/portfolio">Портфель</router-link>

      <router-link class="menu-item" to="/balance">Сбалансируй</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  margin-bottom: 24px;
  display: flex;

  &-item {
    display: flex;
    height: 40px;
    padding: 0 15px;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: black;
    background: #eee;
    cursor: pointer;
    transition: background 350ms ease-in-out;

    &:hover {
      background: #ccc;
    }
  }
}
</style>

<script>
</script>
