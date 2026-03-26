<template>
  <view class="service-card-wrapper" @click="handleCardClick">
    <image
      :src="backgroundImage"
      class="card-background"
      mode="aspectFill"
    ></image>
    <view v-if="title || subtitle" class="card-content">
      <text class="card-title">{{ title }}</text>
      <text class="card-subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  backgroundImage: {
    type: String,
    default: "https://via.placeholder.com/400x300?text=Background",
  },
  title: {
    type: String,
    default: "服务标题",
  },
  subtitle: {
    type: String,
    default: "服务描述",
  },
  categorya: {
    type: [String, Number],
    default: 0,
  },
  categoryb: {
    type: [String, Number],
    default: 0,
  },
});

// 简单的正则或后缀判断，识别是否为图片路径
const isImgPath = (value) => {
  if (!value) return false;
  // 匹配常见的图片后缀或路径特征（/、@/、http、.png 等）
  return (
    /\.(png|jpe?g|gif|svg|webp)$/i.test(value) ||
    value.startsWith("/") ||
    value.startsWith("http") ||
    value.startsWith("@/")
  );
};

const handleCardClick = () => {
  // 跳转页面，并传递props.categorya和props.categoryb作为参数
  uni.navigateTo({
    url: `/pages/mall/productlist?categorya=${props.categorya || 0}&categoryb=${props.categoryb || 0}`,
  });
};
</script>

<style scoped lang="scss">
.service-card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 24rpx;
  overflow: hidden;
  display: flex;
  //   align-items: flex-end;

  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(26, 58, 82, 0.4) 0%,
      rgba(13, 36, 56, 0.6) 100%
    );
  }

  .card-content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);

    .card-icon {
      margin-top: 20rpx;
      // 保持容器高度一致
      height: 48rpx;
      display: flex;
      align-items: center;

      font-size: 40rpx; // 针对 Emoji 的大小

      .icon-img {
        width: 64rpx; // 设定本地图标的大小
        height: 64rpx;
      }
    }

    .card-title {
      font-size: 48rpx;
      font-weight: 800;
      color: goldenrod;
      margin-bottom: 6rpx;
      margin-top: 24rpx;
    }

    .card-subtitle {
      font-size: 30rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
