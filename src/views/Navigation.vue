<template>
  <a-layout>
    <a-layout-sider>
      <SideWrap></SideWrap>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header>Header</a-layout-header> -->
      <a-layout-content>
        <RouterView></RouterView>
      </a-layout-content>
      <!-- <a-layout-footer>Footer</a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<script>
import { RouterView } from 'vue-router'
import SideWrap from '@/components/side-wrap/SideWrap.vue'

export default {
  components: { SideWrap }
}
</script>

<style scoped>
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
</style>
