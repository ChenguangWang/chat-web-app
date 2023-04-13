<template>
  <a-form
    ref="accountFormRef"
    :model="accountFormState"
    class="form-wrap"
    name="basic"
    autocomplete="off"
    :rules="accountRules"
    @finish="handleAccountFinish"
  >
    <a-form-item has-feedback label="设置登录帐号" name="modifyAccount">
      <a-input v-model:value="accountFormState.modifyAccount" />
    </a-form-item>
    <a-button type="primary" html-type="submit">确认</a-button>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { message as antMessage } from 'ant-design-vue';
import { modifyAccount } from '@/service/user.js';
import { removeToken } from '@/utils/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
// 账户表单
const accountFormRef = ref();

const accountFormState = reactive({
  modifyAccount: ''
});

let validateAccount = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请输入新帐号');
  } else {
    return Promise.resolve();
  }
};

// 校验规则
const accountRules = {
  modifyAccount: [{ required: true, validator: validateAccount, trigger: 'change' }]
};

const handleAccountFinish = async (values) => {
  modifyAccount(values).then((res) => {
    if (res.code == 200) {
      antMessage.success('修改成功');
      removeToken();
      router.push({ name: 'login' });
    }
  });
};
</script>
