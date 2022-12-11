<template>
  <div class="sidebar-item">
    <template v-if="hasOneShowingChild(item.children,item) &&
                    (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
                    !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path,onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <template #title>
            <menu-item :title="onlyOneChild.meta.title"
                       :icon="onlyOneChild.meta.icon"/>
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template #title>
        <menu-item :title="item.meta.title"
                   :icon="item.meta.icon"/>
      </template>
      <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
      />
    </el-sub-menu>
  </div>

</template>


<script setup lang="ts" name="SidebarItem">
import path from "path-browserify";
import {RouteRecordRawPlus} from 'vue-router'
import {PropType} from 'vue'
import AppLink from './Link.vue'
import MenuItem from './Item.vue'
import {isExternal} from "@/utils/validate";
import {tansParams} from "@/utils";


const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRawPlus>,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: '/index'
  }
})

const onlyOneChild = ref<RouteRecordRawPlus>();

function hasOneShowingChild(children: RouteRecordRawPlus[] = [], parent: RouteRecordRawPlus): boolean {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      onlyOneChild.value = item;
      return true;
    }
  });
  if (showingChildren.length === 1) {
    return true;
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = {...parent, path: "", noShowingChildren: true};
    return true;
  }
  return false;
}

function resolvePath(routePath: string, routeQuery?: string): string {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  const basePath = props.basePath || '/'
  if (routeQuery) {
    let query: Record<string, any> = JSON.parse(routeQuery);
    return path.resolve(basePath, routePath) + "?" + tansParams(query)
  }
  return path.resolve(basePath, routePath)
}

</script>

<style lang="scss" scoped>

</style>