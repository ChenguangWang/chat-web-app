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
        <a-button
          type="text"
          @click="fetchCode"
          :loading="codeBtnLoading"
          :disabled="!formState.username"
          >{{ codeBtnLoading ? `${times}秒后重试` : '获取验证码' }}</a-button
        >
      </div>
    </a-form-item>

    <a-button type="primary" block html-type="submit">注册/登录</a-button>
    <p class="register-tiptop">未注册的手机号验证后自动注册</p>
  </a-form>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getVerificationCode, registerAndLogin } from '@/service/user.js';
import { setToken } from '@/utils/auth';
import { message as antMessage } from 'ant-design-vue';

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter();
    const formState = reactive({
      username: '',
      verificationCode: '',
      remember: true
    });

    // 按钮loading
    const codeBtnLoading = ref(false);
    const times = ref(60);

    const onFinish = (values) => {
      console.log('Success:', values);
      const param = {
        phoneNumber: values.username,
        code: values.verificationCode
      };
      registerAndLogin(param).then((res) => {
        if (res.code == 200) {
          setToken(res.data.token);
          router.push({ name: 'home' });
        }
      });
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    let timer = null;
    const fetchCode = () => {
      if (!/^1\d{10}$/.test(formState.username)) {
        antMessage.warning('请输入正确手机号');
        return;
      }
      codeBtnLoading.value = true;
      const param = {
        phoneNumber: formState.username
      };
      getVerificationCode(param).then((res) => {
        if (res.code == 200) {
          antMessage.success(res.data);
        }
        timer = setInterval(() => {
          if (times.value == 0) {
            codeBtnLoading.value = false;
            times.value = 60;
            clearInterval(timer);
            return;
          }
          --times.value;
        }, 1000);
      });
    };

    return {
      times,
      codeBtnLoading,
      formState,
      fetchCode,
      onFinish,
      onFinishFailed
    };
  }
};
</script>

<style lang="less" scoped>
.register-tiptop {
  margin-bottom: 0;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
