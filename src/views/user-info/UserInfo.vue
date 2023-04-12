<template>
  
  <!-- <a-collapse v-model:activeKey="activeKey" ghost> -->
    <!-- <a-collapse-panel key="1" header="修改密码"> -->
      <a-form
        ref="passwordFormRef"
        :model="passwordFormState"
        class="form-wrap"
        name="basic"
        autocomplete="off"
        :rules="passwordRules"
        @finish="handlePasswordFinish"
      >
      <a-form-item class="user-mobile"  label="手机号" name="phoneNumber">
        <div style="display: flex">
          {{ userInfo.phoneNumber }} 
        </div>
      </a-form-item>
        <a-form-item
          label="验证码"
          name="verificationCode"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <div style="display: flex">
            <a-input
              v-model:value="passwordFormState.verificationCode"
              placeholder="输入验证码"
            ></a-input>
            <a-button type="text" @click="fetchCode" :loading="codeBtnLoading">{{
              codeBtnLoading ? `${times}秒后重试` : '获取验证码'
            }}</a-button>
          </div>
        </a-form-item>

        <a-form-item has-feedback label="新密码" name="pass">
          <a-input v-model:value="passwordFormState.pass" type="password" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="确认密码" name="checkPass">
          <a-input v-model:value="passwordFormState.checkPass" type="password" autocomplete="off" />
        </a-form-item>
        <a-button type="primary" html-type="submit">确认</a-button>
      </a-form>
    <!-- </a-collapse-panel> -->
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
  <!-- </a-collapse> -->
</template>

<script setup>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { message as antMessage } from 'ant-design-vue';
import { getVerificationCodeForPass, modifyPassword, getUserInfo } from '@/service/user.js';
import { removeToken } from '@/utils/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeKey = ref(['1']);
let userInfo = reactive({
  phoneNumber: '--'
});
// 密码表单
const passwordFormRef = ref();

const passwordFormState = reactive({
  verificationCode: '',
  pass: '',
  checkPass: ''
});

// 按钮loading
const codeBtnLoading = ref(false);
const times = ref(60);

let timer = null;
const fetchCode = () => {
  getVerificationCodeForPass().then((res) => {
    if (res.code == 200) {
      antMessage.success(res.data);
    }
    codeBtnLoading.value = true;
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
    code: values.verificationCode,
    modifyPassword: values.pass
  };
  modifyPassword(params).then((res) => {
    if (res.code == 200) {
      antMessage.success('修改成功');
      removeToken();
      router.push({ name: 'login' });
    }
  });
};

onMounted(async () => {
  const userRes = await getUserInfo();
  if (userRes.code == 200) {
    userInfo.phoneNumber = userRes.data.phoneNumber
    console.log('userInfo====', userRes.data);
  }
});

</script>

<style lang="less" scoped>
.user-mobile{
  padding-top: 20px;
  margin-left: 12px;
}
.form-wrap {
  max-width: 300px;
  margin-left: 24px;
}
</style>
