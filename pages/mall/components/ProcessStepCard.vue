<template>
  <view class="process-step-card">
    <!-- 背景图片 -->
    <image
      :src="backgroundImage"
      class="card-background"
      mode="aspectFill"
    ></image>

    <view class="card-content-wrapper">
      <!-- 卡片内容 -->
      <view class="card-content-left">
        <!-- 图标 -->
        <view class="icon-wrapper">
          <image
            v-if="isImgPath(icon)"
            :src="icon"
            class="card-icon"
            mode="aspectFit"
          ></image>
          <view v-else class="card-icon-emoji">{{ icon }}</view>
        </view>

        <!-- 标题和描述 -->
        <view class="card-text">
          <text class="card-title">{{ title }}</text>
          <text class="card-subtitle">{{ subtitle }}</text>
        </view>
      </view>
      <!-- 序号徽章 -->
      <view class="card-content-right">
        <view class="step-number-badge">
          <text>{{ stepNumber }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  stepNumber: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  backgroundImage: {
    type: String,
    default: "/static/pages/mall/processitembg.png",
  },
});

// 判断是否为图片路径
const isImgPath = (value) => {
  if (!value) return false;
  return (
    /\.(png|jpe?g|gif|svg|webp)$/i.test(value) ||
    value.startsWith("/") ||
    value.startsWith("http") ||
    value.startsWith("@/")
  );
};
</script>

<style scoped lang="scss">
.process-step-card {
  width: 210rpx;
  position: relative;
  overflow: hidden;
  border-radius: 20rpx;
  height: 210rpx;
  display: flex;
  align-items: flex-end;
  margin-right: 20rpx;
  background: rgba(0, 0, 0, 0);

  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    //背景透明，无颜色遮罩
    background: rgba(0, 0, 0, 0);
  }

  .card-content-wrapper {
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // 背景透明，无颜色遮罩
    background: rgba(0, 0, 0, 0);
    margin-bottom: 10rpx;

    .card-content-left {
      width: 150rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      text-align: center;
    }

    .card-content-right {
      width: 50rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // 背景透明，无颜色遮罩
      background: rgba(0, 0, 0, 0);
    }
  }

  .icon-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20rpx;
  }

  // 序号
  .step-number-badge {
    width: 40rpx;
    height: 40rpx;
    margin-left: 6rpx;

    text {
      font-size: 28rpx;
      font-weight: 700;
      color: #f4f5f6;
    }
  }

  .card-icon {
    width: 56rpx;
    height: 56rpx;
    flex-shrink: 0;
  }

  .card-icon-emoji {
    font-size: 56rpx;
    flex-shrink: 0;
  }

  .card-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    word-break: break-word;
    white-space: normal;

    .card-title {
      font-size: 24rpx;
      font-weight: 600;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 15rpx;
      word-break: break-word;
    }

    .card-subtitle {
      font-size: 18rpx;
      color: rgba(255, 255, 255);
      line-height: 1.3;
      word-break: break-word;
    }
  }
}
</style>
