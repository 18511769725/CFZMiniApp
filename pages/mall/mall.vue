<template>
  <view class="mall-page">
    <!-- Tab 选项卡 -->
    <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
      <view class="tab-container">
        <view
          v-for="(tab, index) in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTabId === tab.id }"
          @click="switchTab(tab.id)"
        >
          {{ tab.label }}
        </view>
      </view>
    </scroll-view>

    <!-- 动态组件内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <!-- 益企·安居 -->
      <AnJuComponent v-if="activeTabId === 1" />

      <!-- 益企·悦享 -->
      <YueXiangComponent v-if="activeTabId === 2" />

      <!-- 益企·康护 -->
      <KangHuComponent v-if="activeTabId === 3" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import AnJuComponent from "./components/AnJuComponent.vue";
import YueXiangComponent from "./components/YueXiangComponent.vue";
import KangHuComponent from "./components/KangHuComponent.vue";

// 标签页数据
const tabs = ref([
  { id: 1, label: "益企·安居" },
  { id: 2, label: "益企·悦享" },
  { id: 3, label: "益企·康护" },
]);

// 当前活跃的tab ID
const activeTabId = ref(1);

// 切换tab
const switchTab = (tabId) => {
  activeTabId.value = tabId;
};
</script>

<style scoped lang="scss">
.mall-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1a3a52 0%, #0d2438 100%);
  color: #fff;

  .mall-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    background: rgba(0, 0, 0, 0.3);

    .header-title {
      font-size: 32rpx;
      font-weight: 600;
    }

    .header-icons {
      display: flex;
      gap: 20rpx;
      font-size: 24rpx;
    }
  }

  .tab-scroll {
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0);
    width: 100%;
    text-align: center;
    /* 仅保留顶部留白；底部交给内容区 padding，益企·安居首块与 Tab 间距为 20rpx */
    padding: 20rpx 0 0;
  }

  .tab-container {
    width: 90%;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    gap: 20rpx;
    padding: 10rpx 15rpx;
    border: 3rpx solid #d4a574;
    border-radius: 50rpx;
    background-color: #242e3a;

    .tab-item {
      flex: 1;
      padding: 16rpx 32rpx;
      border-radius: 50rpx;
      box-sizing: border-box;
      min-height: 30rpx;
      color: #ffffff;
      font-size: 31rpx;
      font-weight: normal;
      font-family: PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif;
      letter-spacing: 0;
      white-space: nowrap;
      transition: all 0.3s ease;

      &.active {
        background: linear-gradient(135deg, #f3cb9f 0%, #c9945f 100%);
        border: 2rpx solid #e98a24;
        color: #061730;
        font-weight: normal;
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  .content-scroll {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
