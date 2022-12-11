<template>
  <el-container class="app-wrapper">
    <el-aside class="sidebar-container" :width="variables.sideBarWidth">
      <Sidebar/>
    </el-aside>
    <el-container>
      <el-header class="header-wrapper">
        <Header/>
      </el-header>
      <el-main>
        Main
        <router-view/>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="Layout">
import Sidebar from './components/Sidebar/index.vue'
import Header from "@/layout/components/Header/index.vue";
import StyleVariables from "@/assets/styles/variables.module.scss"


const variables = ref<CSSModuleClasses>(StyleVariables)
onMounted(()=>{
})

</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;


}
</style>