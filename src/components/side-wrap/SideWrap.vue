<template>
  <div class="side-wrap">
    <div>
      <div class="logo-wrap">
        <img src="/src/assets/logo.jpg1" class="logo-wrap-img" alt="" />
        <div class="logo-wrap-desc">
          <h4>爱能智慧助手</h4>
          <span>AITalkAssistant</span>
        </div>
      </div>
      <div class="user-wrap">
        <a-avatar :size="48">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <br />
        <a-button class="login-btn" type="text">点击登录</a-button>
      </div>
    </div>
    <div class="session-wrap">
      <div class="session-wrap-title">当前会话</div>
      <div class="add-btn"><plus-outlined style="margin-right: 8px" />新建会话</div>
      <div class="session-wrap-item"></div>
    </div>
    <div class="option-wrap">
      <div class="option-wrap-item"><clear-outlined /><span class="btn-text">清除会话</span></div>
      <div class="option-wrap-item">
        <account-book-outlined /><span class="btn-text">升级功能</span>
      </div>
      <div class="option-wrap-item"><logout-outlined /><span class="btn-text">退出登录</span></div>
    </div>
  </div>
</template>

<script>
import {
  UserOutlined,
  PlusOutlined,
  ClearOutlined,
  AccountBookOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
export default {
  components: {
    UserOutlined,
    PlusOutlined,
    ClearOutlined,
    AccountBookOutlined,
    LogoutOutlined
  }
}
</script>

<style lang="less" scoped>
.logo-wrap {
  padding: 16px 12px;
  display: flex;
  line-height: normal;
  &-img {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  }
  &-desc {
    margin-left: 8px;
    span {
      font-size: 12px;
      color: #17233d;
      opacity: 0.8;
    }
  }
}
.user-wrap {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(23, 35, 61, 0.1);
  .login-btn {
    font-size: 12px;
  }
}

.session-wrap {
  height: calc(100vh - 312px);
  overflow: scroll;
  padding: 0 12px;
  font-size: 12px;
  border-bottom: 1px solid rgba(23, 35, 61, 0.1);
  &-title,
  .add-btn {
    height: 38px;
    line-height: 38px;
    font-weight: 500;
  }
  .add-btn {
    font-weight: 400;
    cursor: pointer;
    &:hover {
      color: #2285f0;
    }
  }
}
.option-wrap {
  font-size: 12px;
  &-item {
    padding: 0 12px;
    height: 38px;
    line-height: 38px;
    cursor: pointer;
    .btn-text {
      margin-left: 8px;
    }
    &:hover {
      color: #2285f0;
    }
  }
}
</style>
