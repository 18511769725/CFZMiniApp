<template>
  <view class="process-step-card" :class="{ 'is-compact-flow': compactFlow }">
    <!-- 背景图片 -->
    <!-- aspectFill 会裁切上下边，设计稿底图自带描边须完整露出，用 aspectFit -->
    <image
      :src="backgroundImage"
      class="card-background"
      mode="aspectFit"
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

        <!-- 标题和描述（副标题用 view 以便多行省略在小程序端生效） -->
        <view class="card-text">
          <view class="card-title">{{ title }}</view>
          <view class="card-subtitle">{{ subtitle }}</view>
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
  /** 申请流程 .29 容器内：高 161rpx（289 - 93顶 - 35底） */
  compactFlow: {
    type: Boolean,
    default: false,
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
  /* 圆角与描边以底图为准，容器不再叠一层 border-radius / border */
  height: 210rpx;
  display: flex;
  align-items: stretch;
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
    align-items: stretch;
    justify-content: center;
    box-sizing: border-box;
    padding: 16rpx 0 12rpx;
    // 背景透明，无颜色遮罩
    background: rgba(0, 0, 0, 0);

    .card-content-left {
      width: 150rpx;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 12rpx;
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
    flex-shrink: 0;
  }

  // 序号（统一相对左侧内容右移 7rpx）
  .step-number-badge {
    width: 40rpx;
    height: 40rpx;
    margin-left: 13rpx;

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
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    word-break: break-word;
    white-space: normal;
    overflow: hidden;

    .card-title {
      font-size: 24rpx;
      font-weight: 600;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 8rpx;
      word-break: break-word;
      flex-shrink: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .card-subtitle {
      font-size: 18rpx;
      color: rgba(255, 255, 255);
      line-height: 1.35;
      word-break: break-word;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    }
  }

  &.is-compact-flow {
    width: 161rpx;
    height: 161rpx;
    margin-right: 12rpx;

    /* 设计稿：icon 距卡片顶 15rpx */
    .card-content-wrapper {
      padding: 15rpx 0 8rpx;
    }

    .card-content-left {
      width: 115rpx;
      /* 设计稿：标题距 icon 底 16rpx */
      gap: 16rpx;
    }

    .card-content-right {
      width: 38rpx;
    }

    .card-icon {
      width: 44rpx;
      height: 44rpx;
    }

    .card-icon-emoji {
      font-size: 44rpx;
    }

    .step-number-badge {
      width: 32rpx;
      height: 32rpx;
      margin-left: 11rpx;

      text {
        font-size: 22rpx;
      }
    }

    /* 申请流程：标题 17rpx，副标题 12rpx，二者间距 15rpx */
    .card-text .card-title {
      font-size: 17rpx;
      line-height: 1.25;
      margin-bottom: 15rpx;
      -webkit-line-clamp: 2;
    }

    .card-text .card-subtitle {
      font-size: 12rpx;
      line-height: 1.35;
      -webkit-line-clamp: 3;
    }
  }
}
</style>
