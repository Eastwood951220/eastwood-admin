<template>
  <Logo/>
  <el-scrollbar class="scrollbar-container"
      wrap-class="scrollbar-wrapper">
    <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        background-color="#304156"
        menu-trigger="hover"
        mode="vertical"
        popper-effect="dark">
      <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts" name="Sidebar">
import {RouteRecordRawPlus} from 'vue-router';
import Logo from "./components/Logo.vue";
import SidebarItem from "./components/SidebarItem.vue";
import {usePermissionStore} from "@/store/modules/permission";

const permissionStore = usePermissionStore()
const sidebarRouters = ref(permissionStore.sidebarRouters.filter(f => !f.hidden) as RouteRecordRawPlus[])

const activeMenu = computed<string>(() => {
  const {meta, path} = useRoute()
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const isCollapse = computed<boolean>(() => {
  return false
})
</script>