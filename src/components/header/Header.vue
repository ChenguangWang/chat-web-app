<template>
  <div class="chat-header-wrap">
    <menu-outlined class="m-menu-entrance" @click="openMmenu" />
    {{ title }}
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
import { onMounted, ref, watch } from 'vue';
import SideWrap from '@/components/side-wrap/SideWrap.vue';

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

onMounted(() => {
  console.log('onMounted====>>>', route, router.currentRoute.value);
  if (router.currentRoute.value.meta) {
    title.value = router.currentRoute.value.meta.name;
  }
});

watch(
  () => router.currentRoute.value,
  (val) => {
    if (val.meta) {
      title.value = router.currentRoute.value.meta.name;
    }
  }
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
    color: #fff;
  }
  .m-menu-entrance,
  .m-create-session {
    display: block;
  }
}
</style>
