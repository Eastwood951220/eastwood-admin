<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <el-form label-position="top"
               ref="loginFormRef"
               :rules="loginRules"
               :model="loginForm"
               hide-required-asterisk
               class="login-form"
               autocomplete="off">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"
                    type="password"
                    name="password"
                    show-password
                    tabindex="2"
                    autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="loginForm.code"
                    class="code-input"
                    name="code"
                    tabindex="3"
                    autocomplete="off">
            <template #append>
              <img @click="getCode" class="code-img" :src="codeUrl" alt="验证码"/>
            </template>
          </el-input>
        </el-form-item>
        <el-button class="btn" @click="handleLogin">
          登陆
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="Login">
import {getCodeImg} from "@/apis/user";
import {LoginParams} from "@/modals/user";
import type {FormInstance, FormRules} from 'element-plus';
import {useUserStore} from "@/store/modules/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
let codeUrl = ref("")
const loginForm: LoginParams = reactive({
  username: "",
  password: "",
  code: "",
  uuid: ""
})
const loginRules = computed<FormRules>(() => ({
  username: [
    {
      required: true,
      message: "请填写用户名",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "请填写密码",
      trigger: "blur"
    }
  ],
  code: [
    {
      required: true,
      message: "请填写验证码",
      trigger: "blur"
    }
  ]
}))

onMounted(() => {
  getCode()
})

const getCode = () => {
  getCodeImg().then(res => {
    let data = res.data
    codeUrl.value = "data:image/gif;base64," + data.img
    loginForm.uuid = data.uuid
  })
}
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.Login(loginForm)
        await router.replace((route.query.redirect as string) || '/');
      } catch (e) {
        getCode()
        loginForm.code = ""
      }
    }
  });
}

</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(#141e30, #243b55);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #03e9f4;

  .login-box {
    width: 400px;
    background-color: #0c1622;
    margin: 100px auto;
    border-radius: 10px;
    box-shadow: 0 15px 25px 0 rgba(0, 0, 0, .6);
    padding: 40px;
    box-sizing: border-box;

    h2 {
      text-align: center;
      color: aliceblue;
      margin-bottom: 30px;
      font-family: 'Courier New', Courier, monospace;
    }

    .btn {
      padding: 10px 20px;
      color: #03e9f4;
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 20px;
      width: 100%;
      font-family: 'Courier New', Courier, monospace;
    }

    .btn:hover {
      border-radius: 5px;
      color: #fff;
      background: #03e9f4;
      box-shadow: 0 0 5px 0 #03e9f4,
      0 0 25px 0 #03e9f4,
      0 0 50px 0 #03e9f4,
      0 0 100px 0 #03e9f4;
      transition: all 1s linear;
    }

    .code-input {
      ::v-deep(.el-input-group__append) {
        padding: 0;
      }

      .code-img {
        height: 32px;
        width: 100px;
        cursor: pointer;
      }
    }

  }

}
</style>