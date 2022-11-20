<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <el-form label-position="top"
               ref="loginFormRef"
               hide-required-asterisk
               class="login-form"
               autocomplete="on">
<!--        <el-form-item label="Username" prop="username">
          <el-input ref="userNameRef"
                    v-model="state.loginForm.username"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input ref="passwordRef"
                    v-model="state.loginForm.password"
                    type="password"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
          />
        </el-form-item>-->
        <el-button class="btn">
          Submit
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
const userNameRef = ref(null)
const passwordRef = ref(null)
const loginFormRef = ref(null)
const router = useRouter()
const route = useRoute()



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
    height: 364px;
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

  }

}
</style>