<template>
  <view class="container">
    <view class="webview-header">
      <text class="header-title"></text>
    </view>
    <web-view :src="decodeURIComponent(targetUrl)"></web-view>
  </view>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
const targetUrl = ref("");
onLoad((options) => {
  if (options.targetUrl) {
    targetUrl.value = options.targetUrl;
  } else {
    uni.showToast({ title: "链接地址异常", icon: "none" });
  }
});
</script>
<style scoped lang="scss"></style>
