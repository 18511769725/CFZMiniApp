<template>
  <view class="mall-page">
    <!-- Tab 选项卡 -->
    <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
      <view class="tab-container">
        <image
          class="tab-container-frame"
          src="https://mvpme82.cloud/data/cbfc06ca-f049-4f0e-ba0c-0be540cf73a3_1774539208989.png"
          mode="scaleToFill"
        />
        <view class="tab-container-body">
          <view
            v-for="(tab, index) in tabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTabId === tab.id }"
            @click="switchTab(tab.id)"
          >
            <image
              v-if="activeTabId === tab.id"
              class="tab-item-active-bg"
              src="https://mvpme82.cloud/data/7995a8a3-36c6-4cb7-95ca-23884da30be5_1774540022437.png"
              mode="scaleToFill"
            />
            <text class="tab-item-label">{{ tab.label }}</text>
          </view>
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
import { onShow } from "@dcloudio/uni-app";
import AnJuComponent from "./components/AnJuComponent.vue";
import YueXiangComponent from "./components/YueXiangComponent.vue";
import KangHuComponent from "./components/KangHuComponent.vue";

const MALL_PENDING_TAB_KEY = "mall_pending_tab_id";

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

onShow(() => {
  try {
    const raw = uni.getStorageSync(MALL_PENDING_TAB_KEY);
    const id = Number(raw);
    if (id === 1 || id === 2 || id === 3) {
      activeTabId.value = id;
      uni.removeStorageSync(MALL_PENDING_TAB_KEY);
    }
  } catch (e) {
    /* ignore */
  }
});
</script>

<style scoped lang="scss">
.mall-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #020713;
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
    position: relative;
    width: 90%;
    display: inline-flex;
    box-sizing: border-box;
    padding: 10rpx 15rpx;
    border-radius: 50rpx;
    overflow: hidden;
    vertical-align: top;
    background-color: transparent;

    .tab-container-frame {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      display: block;
      pointer-events: none;
    }

    .tab-container-body {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 20rpx;
      width: 100%;
    }

    .tab-item {
      position: relative;
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
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .tab-item-active-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        display: block;
        border-radius: 50rpx;
        pointer-events: none;
      }

      .tab-item-label {
        position: relative;
        z-index: 1;
        text-align: center;
        line-height: 1.2;
      }

      &.active {
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
