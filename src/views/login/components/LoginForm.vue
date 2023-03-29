<template>
  <a-form
    :model="formState"
    name="basic"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item name="username" :rules="[{ required: true, message: '请输入手机号' }]">
      <a-input v-model:value="formState.username" placeholder="输入手机号">
        <template #prefix> +86 </template>
      </a-input>
    </a-form-item>

    <a-form-item name="verificationCode" :rules="[{ required: true, message: '请输入验证码' }]">
      <div style="display: flex">
        <a-input v-model:value="formState.verificationCode" placeholder="输入验证码"></a-input>
        <a-button type="text">获取验证码</a-button>
      </div>
    </a-form-item>

    <a-button type="primary" block html-type="submit">注册/登录</a-button>
    <p class="register-tiptop">未注册的手机号验证后自动注册</p>
  </a-form>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'LoginForm',
  setup() {
    const formState = reactive({
      username: '',
      verificationCode: '',
      remember: true
    })

    const onFinish = (values) => {
      console.log('Success:', values)
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo)
    }
    return {
      formState,
      onFinish,
      onFinishFailed
    }
  }
}
</script>

<style lang="less" scoped>
.register-tiptop {
  margin-bottom: 0;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
