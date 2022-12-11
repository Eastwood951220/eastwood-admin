<template>
  <div class="sidebar-logo-container" @click="toHome">
    <img class="sidebar-logo" src="@/assets/vue.svg" alt=""/>
    <span class="sidebar-title">Eastwood-Admin</span>
  </div>
</template>

<script setup lang="ts" name="SidebarLogo">
const router = useRouter()
const toHome = () => {
  router.push({path: '/index'})
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .sidebar-logo {
    width: 32px;
    height: 32px;
    margin-right: 12px;;
  }

  .sidebar-title {
    color: #fff;
    font-size: 14px;
    margin: 0;
  }
}
</style>