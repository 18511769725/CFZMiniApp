<template>
  <view class="video-player-page">
    <video
      v-if="videoUrl"
      class="video-player"
      :src="videoUrl"
      controls
      autoplay
      object-fit="contain"
    />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const videoUrl = ref("");

onLoad((options) => {
  if (options?.url) {
    try {
      videoUrl.value = decodeURIComponent(options.url);
    } catch {
      videoUrl.value = options.url;
    }
    return;
  }

  uni.showToast({ title: "视频地址异常", icon: "none" });
  setTimeout(() => uni.navigateBack(), 1000);
});
</script>

<style scoped>
.video-player-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
}

.video-player {
  width: 100%;
  height: 100%;
}
</style>
