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
        <view class="icon-wrapper" :style="iconWrapperStyle">
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
import { computed } from "vue";

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
  /** 个别切图留白少、同尺寸下显大时缩小，如 0.86 */
  iconScale: {
    type: Number,
    default: 1,
  },
});

const iconWrapperStyle = computed(() => {
  const s = props.iconScale;
  if (typeof s !== "number" || s <= 0 || (s >= 0.999 && s <= 1.001)) {
    return {};
  }
  return {
    transform: `scale(${s})`,
    transformOrigin: "center center",
  };
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
    padding: 15rpx 0 11rpx;
    // 背景透明，无颜色遮罩
    background: rgba(0, 0, 0, 0);

    .card-content-left {
      width: 144rpx;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 11rpx;
      text-align: center;
    }

    .card-content-right {
      width: 56rpx;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
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

  // 序号：置于右侧箭头区内，flex 居中（避免 margin 挤出列宽盖住邻卡）
  .step-number-badge {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    text {
      font-size: 28rpx;
      font-weight: 700;
      color: #f4f5f6;
      line-height: 1;
      text-align: center;
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
      font-size: 26rpx;
      font-weight: 600;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 7rpx;
      word-break: break-word;
      flex-shrink: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .card-subtitle {
      font-size: 20rpx;
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
      padding: 14rpx 0 7rpx;
    }

    .card-content-left {
      width: 109rpx;
      /* 字号略增后略收间距，避免顶底裁切 */
      gap: 13rpx;
    }

    .card-content-right {
      width: 46rpx;
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

      text {
        font-size: 22rpx;
      }
    }

    /* 避免 break-word 把第一行撑满后第二行只剩一字（三个 Tab 申请流程共用） */
    .card-text {
      word-break: normal;
    }

    /* 申请流程：标题/副标题较设计稿各 +2rpx，间距略收以保持 161 高内不乱版 */
    .card-text .card-title {
      font-size: 19rpx;
      line-height: 1.25;
      margin-bottom: 12rpx;
      word-break: break-word;
      overflow-wrap: break-word;
      -webkit-line-clamp: 2;
    }

    /* 副标题宽约 102rpx：14rpx 字号下约每行 6～7 个汉字，仍落在左侧 109rpx 栏内不压序号区 */
    .card-text .card-subtitle {
      font-size: 14rpx;
      line-height: 1.42;
      max-width: 102rpx;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      word-break: normal;
      overflow-wrap: break-word;
      -webkit-line-clamp: 3;
    }
  }
}
</style>
