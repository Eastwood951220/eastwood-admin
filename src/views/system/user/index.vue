<template xmlns="">
  <div class="page-container">
    <el-row :gutter="20">
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
              <el-col :span="7">
                <el-form-item label="用户名称" prop="userName">
                  <el-input v-model="queryParams.userName"
                            placeholder="请输入用户名称"
                            clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="手机号码" prop="phonenumber">
                  <el-input v-model="queryParams.phonenumber"
                            placeholder="请输入手机号码"
                            clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
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
              <el-col :span="7">
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
              <el-col :span="7">
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
              :params="getQueryParams()"
              :add-perm="['system:user:add']"
              @addMethod="handleAdd"
              :edit-perm="['system:user:edit']"
              @editMethod="handleEdit"
              :is-edit-disabled="tableData.selectedIds.length !== 1"
              :delete-perm="['system:user:delete']"
              @deleteMethod="handleDelete"
              :is-delete-disabled="!tableData.selectedIds.length"
              :export-perm="['system:user:export']"
              :import-perm="['system:user:import']"
          />
          <el-table :data="tableData.userList" border v-auto-height="2"
                    v-loading="tableData.loading"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="用户名称" align="center" key="userName" prop="userName" show-overflow-tooltip/>
            <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" width="160px"
                             show-overflow-tooltip/>
            <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" show-overflow-tooltip/>
            <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" width="120"/>
            <el-table-column label="状态" align="center" key="status">
              <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    active-value="0"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" key="createTime" width="180px">
              <template #default="scope">
                {{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" fixed="right"
                             class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link
                           type="primary"
                           icon="el-icon-edit"
                           v-has-permission="['system:user:edit']"
                           @click="handleEdit(scope.row)">
                  修改
                </el-button>
                <el-button link
                           type="danger"
                           icon="el-icon-delete"
                           v-has-permission="['system:user:edit']"
                           @click="handleDelete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
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
      <el-form ref="detailFormRef"
               :model="detailDialogData.form"
               :rules="detailDialogData.rules"
               label-position="right"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="detailDialogData.form.nickName" placeholder="请输入用户昵称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select v-model="detailDialogData.form.deptId"
                              :data="deptData.deptOptions"
                              :props="deptData.defaultProps"
                              placeholder="请选择归属部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="detailDialogData.form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="detailDialogData.form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <template v-if="detailDialogData.type === 'add'">
            <el-col :span="12">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="detailDialogData.form.userName" placeholder="请输入用户名称" maxlength="30"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户密码" prop="password">
                <el-input v-model="detailDialogData.form.password" placeholder="请输入用户密码" type="password"
                          maxlength="20" show-password/>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="detailDialogData.form.sex" placeholder="请选择性别">
                <el-option
                    v-for="dict in dictData.sys_user_sex"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="detailDialogData.form.status">
                <el-radio
                    v-for="dict in dictData.sys_normal_disable"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="detailDialogData.form.postIds" multiple placeholder="请选择岗位">
                <el-option
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                    :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="detailDialogData.form.roleIds" multiple placeholder="请选择角色">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="detailDialogData.form.remark" type="textarea" placeholder="备注"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script setup lang="ts" name="User">
import {ElTree, FormInstance, FormRules} from "element-plus";
import moment from "moment";
import dict from "@/plugins/dict";
import modal from "@/plugins/modal";
import {deptTreeSelect, listUser, getUser, addUser, deleteUser, updateUser, changeUserStatus} from "@/apis/system/user";
import {T_Q_UserList, I_C_DeptTree} from "@/modals/system/user";
import {I_C_DictData} from "@/modals/system/dict";
import {I_C_UserInfo, C_UserInfo} from "@/modals/user";
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
    label: string,
    value: string
  }
}

const deptData = reactive<T_deptData>({
  deptName: "",
  deptOptions: [],
  defaultProps: {
    children: 'children',
    label: 'label',
    value: "id"
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
  return addDataRange<T_Q_UserList>(queryParams)
}

/*表格数据*/
type T_tableData = {
  loading: boolean,
  total: Number,
  userList: I_C_UserInfo[],
  selectedIds: string[]
}
const tableData = reactive<T_tableData>({
  loading: false,
  total: 0,
  userList: [],
  selectedIds: []
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

function handleSelectionChange(selection: I_C_UserInfo[]) {
  tableData.selectedIds = selection.map(item => <string>item.userId)
}


/*详情弹窗*/
type T_detailDialogData = {
  visible: boolean,
  title: string,
  type: string,
  form: I_C_UserInfo | undefined,
  rules: FormRules
}

const detailDialogData = reactive<T_detailDialogData>({
  visible: false,
  title: "",
  type: "",
  form: new C_UserInfo,
  rules: {
    userName: [
      {required: true, message: "用户名称不能为空", trigger: "blur"},
      {min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur'}
    ],
    nickName: [
      {required: true, message: "用户昵称不能为空", trigger: "blur"}
    ],
    password: [
      {required: true, message: "用户密码不能为空", trigger: "blur"},
      {min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur'}
    ],
    email: [
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    phonenumber: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ]
  }
})
const postOptions = ref<any []>([])
const roleOptions = ref<any []>([])
const detailFormRef = ref<FormInstance>()

function resetForm() {
  detailDialogData.form = new C_UserInfo
}

/*新增*/
function handleAdd() {
  getUser().then(res => {
    postOptions.value = res.data.posts
    roleOptions.value = res.data.roles
    resetForm()
    detailDialogData.title = "新增用户"
    detailDialogData.type = "add"
    detailDialogData.visible = true
  })
}

/*修改*/
function handleEdit(row?: I_C_UserInfo) {
  const id = row?.userId || tableData.selectedIds.join()
  getUser(id).then(res => {
    postOptions.value = res.data.posts
    roleOptions.value = res.data.roles
    detailDialogData.form = res.data.user
    detailDialogData.title = "修改用户"
    detailDialogData.type = "edit"
    detailDialogData.visible = true
  })
}

/*启用*/
function handleStatusChange(row: I_C_UserInfo) {
  let text = row.status === "0" ? "启用" : "停用";
  modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(function () {
    return changeUserStatus(<string>row.userId, row.status);
  }).then(() => {
    modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
}

/*删除*/
function handleDelete(row?: I_C_UserInfo) {
  const ids = row?.userId || tableData.selectedIds.join(",")
  modal.confirm("是否确认删除该数据？").then(() => {
    deleteUser(<string>ids).then(res => {
      modal.msgSuccess("删除成功")
      getList()
    })
  })
}

/*提交*/
function handleSubmit() {
  detailFormRef.value?.validate(valid => {
    if (valid) {
      if (detailDialogData.type === "add") {
        addUser(<I_C_UserInfo>detailDialogData.form).then(res => {
          modal.msgSuccess("新增成功")
          detailDialogData.visible = false
          getList()
        })
      } else if (detailDialogData.type === "edit") {
        updateUser(<I_C_UserInfo>detailDialogData.form).then(res => {
          modal.msgSuccess("修改成功")
          detailDialogData.visible = false
          getList()
        })
      }
    }
  })
}

/*取消*/
function handleCancel() {
  detailDialogData.visible = false
  resetForm()
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