<template>
  <a-layout>
    <a-layout-sider>
      <SideWrap></SideWrap>
    </a-layout-sider>
    <a-layout>
      <a-layout-header v-show="showHeader">
        <Header></Header>
      </a-layout-header>
      <a-layout-content>
        <RouterView></RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router';
import SideWrap from '@/components/side-wrap/SideWrap.vue';
import Header from '@/components/header/Header.vue';
import { ref, watch } from 'vue';

const router = useRouter();
const showHeader = ref(true);

watch(
  () => router.currentRoute.value,
  (val) => {
    if (val.meta) {
      showHeader.value =
        router.currentRoute.value.meta && router.currentRoute.value.meta.name ? true : false;
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.ant-layout {
  height: 100%;
  background: #fafafa;
  color: #303030;
}
.ant-layout-sider {
  position: relative;
  z-index: 1;
  background: rgba(240, 240, 240, 0.8);
  box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.1);
}

.ant-layout-header {
  // display: none;
  background: transparent;
  padding: 0;
  font-size: 16px;
  font-weight: 600;
}

@media only screen and (max-width: 768px) {
  .ant-layout-sider {
    display: none;
  }
  .ant-layout-header {
    display: block !important;
  }
}
</style>
