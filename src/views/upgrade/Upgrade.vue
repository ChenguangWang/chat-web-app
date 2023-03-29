<template>
  <div class="upgrade-wrap">
    <header>
      <div class="header_wrap_info">
        <!-- 头像 -->
        <a-avatar :size="48">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div style="margin-left: 16px">
          <h5>普通用户</h5>
          <span>ID:xxxxxxxxx <span class="iconfont icon-fuzhi"></span></span>
        </div>
      </div>
      <div class="">每日免费token：10000</div>
    </header>
    <section class="token-info">
      <p class="token-info-desc">
        token：chatGPT的官方计费单位，可以理解为按照回答字数计算。通常一个token代表x字的答案。此外，因助手超能聊开启了上下文能力，所以每次回答时会消耗更多的token。
      </p>
      <div class="switch-wrap">
        启动上下文
        <a-switch v-model:checked="checked" />
      </div>
    </section>
  </div>
</template>

<script>
import { UserOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

export default {
  components: { UserOutlined },
  setup() {
    const checked = ref(true)
    return {
      checked
    }
  }
}
</script>

<style lang="less" scoped>
.upgrade-wrap {
  margin: 92px auto 0;
  width: 600px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background: rgb(255, 255, 255);
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.05);
  color: #8f8f94;
  padding: 24px;
  h5 {
    color: #17233d;
  }
  .header_wrap_info {
    display: flex;
    align-items: center;
  }
}
.token-info {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 24px;
  &-desc {
    color: rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }
  .switch-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
  }
}
</style>
