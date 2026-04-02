<template>
  <view class="line-wrapper">
    <text class="anju-package-title">{{ item?.title || "未命名套餐" }}</text>
    <text class="anju-package-score"
      >{{ formatPrice(item?.value || 0) }}分</text
    >
  </view>
</template>

<script setup>
const { item, formatPrice } = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  formatPrice: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped>
.line-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  width: 100%;
  min-width: 0;
}
.anju-package-title {
  flex: 1;
  min-width: 0;
  margin-right: 16rpx;
  font-size: 25rpx;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.95);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anju-package-score {
  flex-shrink: 0;
  font-family:
    PingFangSC-Regular,
    "PingFang SC",
    -apple-system,
    sans-serif;
  font-size: 25rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #e9d591;
}
</style>
