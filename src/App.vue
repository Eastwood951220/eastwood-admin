<template>
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>

</template>

<script setup lang="ts">
import {zhCn} from "element-plus/es/locale/index";
const locale = computed(() => zhCn)

</script>


