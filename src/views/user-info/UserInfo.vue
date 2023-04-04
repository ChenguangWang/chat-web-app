<template>
  <a-collapse v-model:activeKey="activeKey" ghost>
    <a-collapse-panel key="1" header="修改密码">
      <a-form
        ref="passwordFormRef"
        :model="passwordFormState"
        class="form-wrap"
        name="basic"
        autocomplete="off"
        :rules="passwordRules"
        @finish="handlePasswordFinish"
      >
        <a-form-item has-feedback label="新密码" name="pass">
          <a-input v-model:value="passwordFormState.pass" type="password" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="确认密码" name="checkPass">
          <a-input v-model:value="passwordFormState.checkPass" type="password" autocomplete="off" />
        </a-form-item>
        <a-button type="primary" html-type="submit">确认</a-button>
      </a-form>
    </a-collapse-panel>
    <!-- <a-collapse-panel key="2" header="修改帐号">
      <a-form
        ref="passwordFormRef"
        :model="passwordFormState"
        class="form-wrap"
        name="basic"
        autocomplete="off"
        :rules="passwordRules"
        @finish="handlePasswordFinish"
      >
        <a-form-item has-feedback label="设置登录帐号" name="pass">
          <a-input v-model:value="passwordFormState.pass" type="password" autocomplete="off" />
        </a-form-item>
        <a-button type="primary" html-type="submit">确认</a-button>
      </a-form>
    </a-collapse-panel> -->
  </a-collapse>
</template>

<script setup>
import { defineComponent, reactive, ref, watch } from 'vue';
import { message as antMessage } from 'ant-design-vue';
import { modifyPassword } from '@/service/user.js';

const activeKey = ref(['1']);
// 密码表单
const passwordFormRef = ref();

const passwordFormState = reactive({
  pass: '',
  checkPass: ''
});

let validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请输入新密码');
  } else {
    if (passwordFormState.checkPass !== '') {
      passwordFormRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
let validatePass2 = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请重新输入密码');
  } else if (value !== passwordFormState.pass) {
    return Promise.reject('两次密码不一致');
  } else {
    return Promise.resolve();
  }
};

// 校验规则
const passwordRules = {
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }]
};

const handlePasswordFinish = async (values) => {
  const params = {
    modifyPassword: values.pass
  };
  modifyPassword(params).then((res) => {
    if (res.code == 200) {
      antMessage.success('修改成功');
    }
  });
};
</script>

<style lang="less" scoped>
.form-wrap {
  max-width: 300px;
  margin-left: 24px;
}
</style>
