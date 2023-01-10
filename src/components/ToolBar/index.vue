<template>
  <div class="tool-bar">
    <div class="tool-bar-left">
      <el-button
          v-if="isShowAdd"
          @click="addMethod"
          type="primary"
          plain
          size="small"
          icon="el-icon-plus">
        新增
      </el-button>
      <el-button
          v-if="isShowEdit"
          @click="editMethod"
          type="success"
          plain
          size="small"
          icon="el-icon-edit">
        修改
      </el-button>
      <el-button
          v-if="isShowDelete"
          @click="deleteMethod"
          type="danger"
          plain
          size="small"
          icon="el-icon-delete">
        删除
      </el-button>
      <el-button
          v-if="isShowImport"
          @click="importMethod"
          type="info"
          plain
          size="small"
          icon="el-icon-upload">
        导入
      </el-button>
      <el-button
          v-if="isShowExport"
          @click="exportMethod"
          type="warning"
          plain
          size="small"
          icon="el-icon-download">
        导出
      </el-button>
      <slot></slot>
    </div>
    <div class="tool-bar-right">
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="el-icon-refresh"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts" name="ToolBar">
import auth from '@/plugins/auth'
import {PropType} from "vue";

const props = defineProps({
  layouts: {
    type: String,
    required: false
  },
  addPerm: {
    type: Object as PropType<string[]>,
    required: false
  },
  editPerm: {
    type: Object as PropType<string[]>,
    required: false
  },
  deletePerm: {
    type: Object as PropType<string[]>,
    required: false
  },
  importPerm: {
    type: Object as PropType<string[]>,
    required: false
  },
  exportPerm: {
    type: Object as PropType<string[]>,
    required: false
  },
})

const emit = defineEmits<{
  (e: 'addMethod'): void,
  (e: 'editMethod'): void,
  (e: 'deleteMethod'): void,
  (e: 'importMethod'): void,
  (e: 'exportMethod'): void,
}>();

/*新增*/
const isShowAdd = computed<Boolean>(() => {
  return props.layouts !== undefined &&
      props.layouts.includes("add") &&
      ((props.addPerm !== undefined &&
              auth.hasPermissionOr(props.addPerm)) ||
          props.addPerm === undefined)
})

function addMethod() {
  emit("addMethod")
}

/*修改*/
const isShowEdit = computed<Boolean>(() => {
  return props.layouts !== undefined &&
      props.layouts.includes("edit") &&
      ((props.editPerm !== undefined &&
              auth.hasPermissionOr(props.editPerm)) ||
          props.editPerm === undefined)
})

function editMethod() {
  emit("editMethod")
}

/*删除*/
const isShowDelete = computed<Boolean>(() => {
  return props.layouts !== undefined &&
      props.layouts.includes("delete") &&
      ((props.deletePerm !== undefined &&
              auth.hasPermissionOr(props.deletePerm)) ||
          props.deletePerm === undefined)
})

function deleteMethod() {
  emit("deleteMethod")
}

/*导入*/
const isShowImport = computed<Boolean>(() => {
  return props.layouts !== undefined &&
      props.layouts.includes("import") &&
      ((props.importPerm !== undefined &&
              auth.hasPermissionOr(props.importPerm)) ||
          props.importPerm === undefined)
})

function importMethod() {
  emit("importMethod")
}

/*导出*/
const isShowExport = computed<Boolean>(() => {
  return props.layouts !== undefined &&
      props.layouts.includes("export") &&
      ((props.exportPerm !== undefined &&
              auth.hasPermissionOr(props.exportPerm)) ||
          props.exportPerm === undefined)
})

function exportMethod() {
  emit("exportMethod")
}


</script>

<style scoped lang="scss">
.tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .tool-bar-left {
    display: flex;
    align-items: center;
  }

  .tool-bar-right {
    display: flex;
    align-items: center;
  }
}
</style>