<template>
  <el-row :gutter="20" class="page-container">
    <el-col :span="4" class="page-left">
      <el-card class="left-box">
        <el-input v-model="deptData.deptName"
                  placeholder="请输入部门名称"
                  clearable
                  prefix-icon="el-icon-search"/>
        <el-tree
            :data="deptData.deptOptions"
            :props="deptData.defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="treeRef"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
        />
      </el-card>
    </el-col>
    <el-col :span="20" class="page-right">
      <el-card class="search-box" ref="search-box">
        <el-form ref="queryForm"
                 :model="queryParams"
                 label-width="68px"
                 inline>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="queryParams.userName"
                          placeholder="请输入用户名称"
                          clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="queryParams.phonenumber"
                          placeholder="请输入手机号码"
                          clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status"
                           placeholder="用户状态"
                           clearable>
                  <el-option v-for="dict in dictData['sys_normal_disable']"
                             :key="dict.dictValue"
                             :label="dict.dictLabel"
                             :value="dict.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="dateRange">
                <el-date-picker
                    v-model="queryParams.dateRange"
                    :editable="false"
                    value-format="YYYY-MM-DD"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="table-box" ref="table-box" v-auto-height="1">
        <tool-bar
            layouts="add,edit,delete,import,export"
            :add-perm="['system:user:add']"
            @addMethod="handleAdd"
            :edit-perm="['system:user:edit']"
            :delete-perm="['system:user:delete']"
            :export-perm="['system:user:export']"
            :import-perm="['system:user:import']"
        />
        <el-table :data="tableData.userList" border v-auto-height="2"
                  v-loading="tableData.loading">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="用户编号" align="center" key="userId" prop="userId"/>
          <el-table-column label="用户名称" align="center" key="userName" prop="userName" show-overflow-tooltip/>
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" show-overflow-tooltip/>
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" show-overflow-tooltip/>
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" width="120"/>
        </el-table>
        <pagination
            :total="tableData.total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"/>
      </el-card>
    </el-col>
  </el-row>
  <!-- 详情弹窗  -->
  <el-dialog v-model="detailDialogData.visible"
             :title="detailDialogData.title"
             width="600px"
             destroy-on-close
             append-to-body>
    <el-form ref="detailForm"
             label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="phonenumber">
          </el-form-item>
        </el-col>
        <template v-if="detailDialogData.type === 'add'">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts" name="User">
import {Ref} from "vue";
import {ElTree, FormInstance} from "element-plus";
import dict from "@/plugins/dict";
import {deptTreeSelect, listUser} from "@/apis/system/user";
import {T_Q_UserList, I_C_DeptTree} from "@/modals/system/user";
import {I_C_DictData} from "@/modals/system/dict";
import {I_C_UserInfo} from "@/modals/user";
import {addDataRange} from "@/utils";


onMounted(() => {
  getList()
  getDeptOptions()
})

/*数据字典*/
const dictData = ref<Record<string, I_C_DictData[]>>({
  sys_normal_disable: [],
  sys_user_sex: []
})
dict.getDict(['sys_normal_disable', 'sys_user_sex']).then(res => {
  dictData.value = dict.setDict(res)
})

/*左侧树形结构*/
type T_deptData = {
  deptName: string,
  deptOptions: I_C_DeptTree[],
  defaultProps: {
    children: string,
    label: string
  }
}

const deptData = reactive<T_deptData>({
  deptName: "",
  deptOptions: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  }
})

const treeRef = ref<InstanceType<typeof ElTree>>()
watch(() => deptData.deptName, function (value) {
  treeRef.value?.filter(value)
})

function getDeptOptions() {
  deptTreeSelect().then(res => {
    deptData.deptOptions = res.data
  })
}

function filterNode(value: string, data: I_C_DeptTree) {
  if (!value) return true
  return data.label.includes(value)
}

function handleNodeClick(data: I_C_DeptTree) {
  queryParams.deptId = data.id.toString()
  handleQuery();
}

/* 表单查询 */
const queryForm = ref<FormInstance>()
const queryParams = reactive<T_Q_UserList>({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  phonenumber: '',
  status: '',
  deptId: '',
  dateRange: []
})

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryForm.value?.resetFields()
  queryParams.dateRange = []
}

function getQueryParams(): T_Q_UserList {
  return addDataRange(queryParams)
}

/*表格数据*/
type T_tableData = {
  loading: boolean,
  total: Number,
  userList: I_C_UserInfo[]
}
const tableData = reactive<T_tableData>({
  loading: false,
  total: 0,
  userList: []
})

function getList() {
  tableData.loading = true
  const params = getQueryParams()
  listUser(params).then(res => {
    tableData.userList = res.rows
    tableData.total = res.total
    tableData.loading = false
  })
}


/*详情弹窗*/
type T_detailDialogData = {
  visible: boolean,
  title: string,
  type: string,
  form: I_C_UserInfo
}
const detailDialogData = reactive({
  visible: false,
  title: "",
  type: "",
  form: {}
})

function resetForm() {

}

/*新增*/
function handleAdd() {
  detailDialogData.visible = true
  detailDialogData.title = "新增用户"
  detailDialogData.type = "add"
}


</script>

<style lang="scss" scoped>
.page-left {
  min-height: 100%;

  .left-box {
    height: 100%;
  }

  .el-input {
    margin-bottom: 15px;
  }
}
</style>