<template>
  <el-popover popper-class="contextmenu-tooltip el-dropdown__popper"
              :visible="visible"
              :virtual-ref="virtualRef"
              trigger="contextmenu"
              virtual-triggering
              pure>
    <ul class="contextmenu-list el-dropdown-menu el-dropdown-menu--default">
      <li class="el-dropdown-menu__item"
          @click="reload">
        <el-icon>
          <el-icon-refresh-right/>
        </el-icon>
        <span>刷新页面</span>
      </li>
      <li class="el-dropdown-menu__item">
        <el-icon>
          <el-icon-close/>
        </el-icon>
        <span>关闭当前</span>
      </li>
      <li class="el-dropdown-menu__item">
        <el-icon>
          <el-icon-circle-close/>
        </el-icon>
        <span>关闭其他</span>
      </li>
      <li class="el-dropdown-menu__item">
        <el-icon>
          <el-icon-back/>
        </el-icon>
        <span>关闭左侧</span>
      </li>
      <li class="el-dropdown-menu__item">
        <el-icon>
          <el-icon-right/>
        </el-icon>
        <span>关闭右侧</span>
      </li>
      <li class="el-dropdown-menu__item">
        <el-icon>
          <el-icon-circle-close/>
        </el-icon>
        <span>关闭所有</span>
      </li>
    </ul>
  </el-popover>
</template>

<script setup lang="ts" name="Contextmenu">
import {PropType} from "vue";
import {RouteLocationNormalized, useRouter} from "vue-router"
import {useTagsViewStore} from "@/store/modules/tagsView";
import $tabs from '@/plugins/tabs'


const router = useRouter()

const props = defineProps({
  virtualRef: {
    required: true,
    type: Object as PropType<HTMLElement>,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  current: {
    required: true,
    type: Object as PropType<RouteLocationNormalized>,
  },
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>();

// 刷新
function reload() {
  $tabs.refreshPage(props.current)
  closeMenu()
}

async function closeMenu() {
  emit('update:visible', false);
  await nextTick();
}


</script>

<style lang="scss">
.contextmenu-tooltip {
  width: max-content !important;
  min-width: unset !important;

  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: var(--el-dropdown-menuItem-hover-fill);
    color: var(--el-dropdown-menuItem-hover-color);
  }
}

.contextmenu-list {
  list-style: none;
  outline: none;
  padding: 0;
  margin: 0;
}
</style>