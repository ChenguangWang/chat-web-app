<template>
  <div class="regist">
    <div class="regist-container">
      <p class="container-logo">
        <img src="@/assets/logo-regist.png" />
      </p>

      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="验证码登录"></a-tab-pane>
      </a-tabs>

      <div class="container-login" v-if="formType == 'login'">
        <LoginForm></LoginForm>
      </div>
      <div class="container-login" v-if="formType == 'findPassword'">
        <FindPassword></FindPassword>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import FindPassword from './components/FindPassword.vue'

export default {
  name: 'Login',
  components: { LoginForm, FindPassword },
  data() {
    return {
      activeKey: '1'
    }
  },
  computed: {
    formType() {
      return this.$route.query.type || 'login'
    }
  },
  methods: {},
  mounted() {
    document.title = '登陆'
  }
}
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
  img {
    width: 130px;
    height: 32px;
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
