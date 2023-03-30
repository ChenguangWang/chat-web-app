<template>
  <a-form
    :model="formState"
    name="basic"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item name="account" :rules="[{ required: true, message: '请输入帐号' }]">
      <a-input v-model:value="formState.account" placeholder="输入手机号/帐号"> </a-input>
    </a-form-item>

    <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
      <a-input-password
        v-model:value="formState.password"
        placeholder="输入密码"
        autocomplete="off"
      />
    </a-form-item>

    <a-button type="primary" block html-type="submit">登录</a-button>
  </a-form>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { setToken } from '@/utils/auth'

import { login } from '@/service/user.js'

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter()
    const formState = reactive({
      account: '',
      password: ''
    })

    const onFinish = async (values) => {
      const loginRes = await login(values)
      if (loginRes.code == 200) {
        setToken(loginRes.data.token)
        router.push({ name: 'chat' })
      }
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
