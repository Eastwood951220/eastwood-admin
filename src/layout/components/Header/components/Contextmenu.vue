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
      <li class="el-dropdown-menu__item"
          :class="{'is-disabled': IsAffix}"
          @click="closeCurrent">
        <el-icon>
          <el-icon-close/>
        </el-icon>
        <span>关闭当前</span>
      </li>
      <li class="el-dropdown-menu__item"
          @click="closeOtherTags">
        <el-icon>
          <el-icon-circle-close/>
        </el-icon>
        <span>关闭其他</span>
      </li>
      <li class="el-dropdown-menu__item"
          :class="{'is-disabled': IsFirstView}"
          @click="closeLeftTags">
        <el-icon>
          <el-icon-back/>
        </el-icon>
        <span>关闭左侧</span>
      </li>
      <li class="el-dropdown-menu__item"
          :class="{'is-disabled': IsLastView}"
          @click="closeRightTags">
        <el-icon>
          <el-icon-right/>
        </el-icon>
        <span>关闭右侧</span>
      </li>
      <li class="el-dropdown-menu__item"
          @click="closeAllTags">
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
import $tabs from '@/plugins/tabs'
import {useTagsViewStore} from "@/store/modules/tagsView";
import _ from "lodash";


const router = useRouter()
const tagsViewStore = useTagsViewStore()
const visitedViews = tagsViewStore.visitedViews

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

// 是否无法关闭
const IsAffix = computed<Boolean>(() => {
  return (props.current.meta || {}).affix === true
})
// 是否是第一个
const IsFirstView = computed<Boolean>(() => {
  try {
    return props.current?.fullPath === '/index' || props.current?.fullPath === visitedViews[1].fullPath
  } catch (e) {
    return false
  }
})
// 是否最后一个
const IsLastView = computed<Boolean>(() => {
  try {
    return props.current?.fullPath === _.last(visitedViews)?.fullPath
  } catch (e) {
    return false
  }
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>();

// 刷新
function reload() {
  $tabs.refreshPage(props.current)
  closeMenu()
}

// 关闭当前
function closeCurrent() {
  $tabs.closePage(props.current)
  toLastTag()
  closeMenu()
}

// 关闭其他
function closeOtherTags() {
  $tabs.closeOtherPages(props.current)
  toLastTag()
  closeMenu()
}

// 关闭左侧
function closeLeftTags() {
  $tabs.closeLeftPages(props.current)
  if (!_.includes(visitedViews, router.currentRoute.value)) {
    toLastTag()
  }
  closeMenu()
}

// 关闭右侧
function closeRightTags() {
  $tabs.closeRightPages(props.current)
  if (!_.includes(visitedViews, router.currentRoute.value)) {
    toLastTag()
  }
  closeMenu()
}

// 关闭所有
function closeAllTags() {
  $tabs.closeAllPages()
  toLastTag()
  closeMenu()
}

function toLastTag() {
  const latestView = _.last(visitedViews)
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    if (props.current.name === 'Dashboard') {
      // to reload home page
      router.replace({path: '/redirect' + props.current.fullPath})
    } else {
      router.push('/')
    }
  }
}

async function closeMenu() {
  emit('update:visible', false);
  await nextTick();
}

defineExpose({closeCurrent})

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