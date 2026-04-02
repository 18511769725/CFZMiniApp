<template>
  <view class="package-content-range-wrap">
    <text class="package-content-range-title">{{
      item?.title || "未命名套餐"
    }}</text>
    <text
      v-if="Number(item?.minRent) === Number(item?.maxRent)"
      class="package-content-range-text"
      >房源计分：{{ formatPrice(item?.minRent || 0) }}分</text
    >
    <text v-else class="package-content-range-text"
      >记分区间：{{ formatPrice(item?.minRent || 0) }} ~
      {{ formatPrice(item?.maxRent || 0) }}分</text
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
.package-content-range-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 100%;
  min-width: 0;
}

.package-content-range-title {
  display: block;
  width: 100%;
  font-size: 25rpx;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.package-content-range-text {
  display: block;
  width: 100%;
  font-size: 22rpx;
  line-height: 1.4;
  color: #e9d591;
  text-align: center;
}
</style>
