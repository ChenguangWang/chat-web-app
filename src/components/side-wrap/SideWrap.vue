<template>
  <div class="side-wrap">
    <div>
      <div class="logo-wrap" @click="routerChange('home')">
        <img src="/src/assets/logo.jpg" class="logo-wrap-img" alt="" />
        <div class="logo-wrap-desc">
          <h4>TalkBot</h4>
          <span>智能问答机器人</span>
        </div>
      </div>
      <div class="user-wrap">
        <a-avatar :size="48" :src="defaultUserAvatar">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <br />
        <a-button class="login-btn" v-show="!hasToken" type="text" @click="routerChange('login')">
          点击登录
        </a-button>
        <!-- <a-button class="login-btn" v-show="hasToken" type="text" @click="routerChange('userInfo')">
          个人信息
        </a-button> -->
      </div>
    </div>
    <div class="session-wrap">
      <div class="add-btn" @click="createSession">
        <plus-outlined style="margin-right: 8px" />新建会话
      </div>

      <div class="session-content">
        <a-spin v-if="loading" />
        <template v-else>
          <div
            v-for="item in sessions"
            :key="item.sessionCode"
            :class="
              activeSession == item.sessionCode ? 'session-wrap-item active' : 'session-wrap-item'
            "
          >
            <p @click="chooseSession(item)" :title="item.showTitle">
              <i :class="item.sessionType === 3 ? 'iconfont icon-pdf' : 'iconfont icon-duihua'"></i>
              {{ item.showTitle }}
            </p>
            <i class="iconfont icon-quxiao" @click="deleteSession(item)"></i>
          </div>
        </template>
      </div>
    </div>
    <div class="option-wrap">
      <div class="option-wrap-item" @click="clearAll">
        <clear-outlined /><span class="btn-text">清除会话</span>
      </div>
      <div class="option-wrap-item" @click="routerChange('share')">
        <share-alt-outlined />
        <span class="btn-text">分享链接</span>
      </div>
      <div class="option-wrap-item" @click="routerChange('userInfo')">
        <!-- <i class="iconfont icon-lianxiwomen" style="font-size: 12px"></i> -->
        <setting-outlined />
        <span class="btn-text">系统设置</span>
      </div>
      <div class="option-wrap-item" @click="callMe">
        <i class="iconfont icon-lianxiwomen" style="font-size: 12px"></i>
        <span class="btn-text">联系我们</span>
      </div>
      <!--  <div class="option-wrap-item" @click="routerChange('upgrade')">
        <account-book-outlined /><span class="btn-text">升级功能</span>
      </div> -->
      <div class="option-wrap-item" @click="logout">
        <logout-outlined /><span class="btn-text">退出登录</span>
      </div>
    </div>
    <a-modal v-model:visible="callMeModal" :width="400" title="联系我们" :footer="null">
      <div style="text-align: center">
        <img src="/src/assets/call-me-qrcode.jpg" style="width: 100%" alt="" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getToken, removeToken } from '@/utils/auth';
import {
  UserOutlined,
  PlusOutlined,
  ClearOutlined,
  AccountBookOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue';
import defaultUser from '@/assets/default_user.jpg';
import { useStore } from 'vuex';
import { Modal } from 'ant-design-vue';

export default {
  components: {
    UserOutlined,
    PlusOutlined,
    ClearOutlined,
    AccountBookOutlined,
    SettingOutlined,
    LogoutOutlined,
    ShareAltOutlined
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const callMeModal = ref(false);

    const routerChange = (name) => {
      router.push({ name });
    };

    onBeforeMount(async () => {
      //获取session列表
      await store.dispatch('session/getList', {});
    });

    //选择会话
    const chooseSession = (item) => {
      router.push({
        name: item.sessionType === 1 ? 'chat' : 'file',
        params: {
          id: item.sessionCode
        }
      });
      store.commit('session/updateActive', item.sessionCode);
    };

    //选择会话
    const deleteSession = (item) => {
      Modal.confirm({
        title: item.showTitle,
        content: `删除后无法恢复,确认删除？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          await store.dispatch('session/delete', item.sessionCode);
          router.push({
            name: 'home'
          });
        }
      });
    };

    // 计算属性 是否存在token
    const hasToken = computed(() => {
      return getToken() ? true : false;
    });

    // 返回首页进行新的对话
    const createSession = () => {
      router.push({
        name: 'home'
      });
      store.commit('session/updateActive', '');
    };

    const clearAll = () => {
      Modal.confirm({
        title: '清除所有会话？',
        content: `删除后无法恢复,确认删除？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          await store.dispatch('session/clearAll');
          router.push({
            name: 'home'
          });
        }
      });
    };

    const callMe = () => {
      callMeModal.value = true;
    };

    // 默认头像
    const defaultUserAvatar = hasToken.value ? defaultUser : '';

    const logout = () => {
      removeToken();
      router.push({ name: 'login' });
    };
    return {
      hasToken,
      sessions: computed(() => {
        return store.state.session.list;
      }),
      activeSession: computed(() => store.state.session.active),
      loading: computed(() => store.state.session.loading),
      defaultUserAvatar,
      callMe,
      callMeModal,
      logout,
      clearAll,
      routerChange,
      deleteSession,
      createSession,
      chooseSession
    };
  }
};
</script>

<style lang="less" scoped>
.logo-wrap {
  padding: 16px 12px;
  display: flex;
  line-height: normal;
  cursor: pointer;
  &-img {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  }
  &-desc {
    margin-left: 8px;
    span {
      font-size: 14px;
      color: #17233d;
      opacity: 0.8;
    }
  }
}
.user-wrap {
  padding: 8px 0;
  text-align: center;
  .login-btn {
    font-size: 14px;
  }
}

.session-wrap {
  height: calc(100vh - 324px);
  padding: 0;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid rgba(23, 35, 61, 0.1);

  .add-btn {
    margin: 0 6px 8px;
    padding: 6px 8px;
    text-align: left;
    font-weight: 400;
    color: rgb(122, 122, 122);
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid rgb(151, 151, 151);
    &:hover {
      color: @primary-color;
      border-color: @primary-color;
    }
  }
  .session-content {
    position: relative;
    height: calc(100% - 44px);
    overflow-y: scroll;
    .ant-spin {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .session-wrap-item {
    text-align: left;
    position: relative;
    height: 36px;
    margin: 0 6px;
    border-radius: 2px;
    padding: 0 25px 0 15px;
    color: rgb(122, 122, 122);
    p {
      vertical-align: middle;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 34px;
      line-height: 34px;
      margin: 0 !important;
      white-space: nowrap;
      cursor: pointer;
      margin-block: 4px;
    }
    .icon-quxiao {
      display: none;
      position: absolute;
      cursor: pointer;
      right: 6px;
      top: 6px;
      color: #aaa;
    }
    &.active {
      background: #fff;
      color: @primary-color;
    }
    &:hover {
      background-color: #ddd;
      .icon-quxiao {
        display: block;
      }
    }
  }
}
.option-wrap {
  font-size: 14px;
  color: rgb(122, 122, 122);
  &-item {
    padding: 0 12px;
    height: 38px;
    line-height: 38px;
    cursor: pointer;
    .btn-text {
      margin-left: 8px;
    }
    &:hover {
      color: @primary-color;
    }
  }
}

@media only screen and (max-width: 768px) {
  .icon-quxiao {
    display: block !important;
  }
}
</style>
