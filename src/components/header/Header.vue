<template>
  <div class="chat-header-wrap">
    <menu-outlined class="m-menu-entrance" @click="openMmenu" />
    <span class="header-title">{{ title }}</span>
    <plus-outlined class="m-create-session" @click="toHome" />
    <a-drawer
      :width="200"
      bodyStyle="padding: 0"
      placement="left"
      :closable="false"
      :visible="drawerVisible"
      @close="onDrawerVisibleClose"
    >
      <SideWrap></SideWrap>
    </a-drawer>
  </div>
</template>

<script setup>
import { MenuOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import SideWrap from '@/components/side-wrap/SideWrap.vue';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const route = useRoute();
const drawerVisible = ref(false);
let title = ref('TalkBot 聊天机器人');
const toHome = () => {
  router.push({ name: 'home' });
};

const openMmenu = () => {
  drawerVisible.value = true;
};

/**
 * 关闭抽屉
 */
const onDrawerVisibleClose = () => {
  drawerVisible.value = false;
};

const activeSession = computed(() => {
  const active = store.state.session.active;
  const list = store.state.session.list;
  let findRes = list && list.find((item) => item.sessionCode == active);
  return findRes;
});

const setTitle = () => {
  if (router.currentRoute.value.meta) {
    switch (router.currentRoute.value.name) {
      case 'chat':
      case 'file':
        title.value = activeSession.value?.showTitle || '会话';
        break;
      default:
        title.value = router.currentRoute.value.meta.name;
        break;
    }
  }
};

watch(
  activeSession,
  () => {
    setTitle();
  },
  { immediate: true }
);

watch(
  () => router.currentRoute.value,
  (val) => {
    if (val.meta) {
      setTitle();
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.chat-header-wrap {
  height: 64px;
  line-height: 64px;
  font-size: 16px;
  padding: 0 24px;
  font-weight: 600;
  border-bottom: 1px solid rgba(23, 35, 61, 0.1);
}

.header-title {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-menu-entrance,
.m-create-session {
  display: none;
  font-size: 20px;
}

// 小屏兼容
@media only screen and (max-width: 768px) {
  .chat-header-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
  }
  .header-title {
    padding: 12px;
  }

  .m-menu-entrance,
  .m-create-session {
    display: block;
  }
}
</style>
