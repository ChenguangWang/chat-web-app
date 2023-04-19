<template>
  <div class="regist">
    <div class="regist-container">
      <div class="container-logo">
        <img src="@/assets/logo.jpg" />
        <div class="logo-wrap-desc">
          <h4>TalkBot</h4>
          <span>智能问答机器人</span>
        </div>
      </div>

      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="验证码登录"></a-tab-pane>
        <a-tab-pane key="2" tab="密码登录"></a-tab-pane>
      </a-tabs>

      <div class="container-login" v-if="activeKey == '1'">
        <LoginForm></LoginForm>
      </div>
      <div class="container-login" v-if="activeKey == '2'">
        <PasswordForm></PasswordForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from './components/LoginForm.vue';
import PasswordForm from './components/PasswordForm.vue';
import { ref } from 'vue';

const activeKey = ref('2');
</script>

<style lang="less" scoped>
@color-blue-1: #2d8cf0;
@default-back: #fff;
@font-size-small: 12px;
@font-size-base: 14px;

.a-color {
  color: @color-blue-1;
}
.regist {
  height: 100%;
  width: 100%;
  padding-top: 100px;
  background: linear-gradient(180deg, rgba(219, 28, 12, 0.7) 0%, rgba(219, 28, 12, 0.64) 100%);
  .regist-container {
    width: 400px;
    padding: 24px 24px;
    background: @default-back;
    margin: 0 auto;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  }
}
.container-logo {
  display: flex;
  line-height: normal;
  img {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  }
  .logo-wrap-desc {
    margin-left: 8px;
    span {
      font-size: 12px;
      color: #17233d;
      opacity: 0.8;
    }
  }
}

:deep(.ivu-input) {
  padding: 0 16px;
  height: 44px;
  color: rgba(29, 36, 54, 1);
  line-height: 44px;
  font-size: @font-size-base;
  border-radius: 4px;
}
:deep(.ivu-form-item) {
  margin-top: 18px;
  margin-bottom: 0;
}
:deep(.ivu-form-item-error-tip) {
  position: static;
}
</style>
