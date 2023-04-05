<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<style>
/* 小屏兼容 */
@media only screen and (max-width: 768px) {
  input,
  textarea,
  .ant-input,
  .ivu-select {
    font-size: 16px !important;
  }
}
</style>
