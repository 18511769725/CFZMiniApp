<template>
  <view
    class="account-card"
    :class="{ 'is-loading': loading }"
    hover-class="account-card-hover"
    hover-stay-time="120"
    @click="handleClick"
  >
    <view class="card-top">
      <view class="index-badge">{{ index + 1 }}</view>
      <view class="card-main">
        <view class="name-line">
          <text class="user-name">{{ account.name || "--" }}</text>
          <text class="user-title">{{ account.title || "未填写职务" }}</text>
        </view>
        <view class="company-line">{{
          account.company_name || "未绑定企业"
        }}</view>
      </view>
      <view class="arrow-wrap">
        <text class="arrow-text">{{ loading ? "处理中" : "进入" }}</text>
      </view>
    </view>

    <view class="card-bottom">
      <view class="info-item">
        <text class="info-label">手机号</text>
        <text class="info-value">{{ phone || "--" }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">账号状态</text>
        <text class="info-value">{{ statusText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  account: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  phone: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select"]);

const statusText = computed(() => {
  const status = Number(props.account?.status);
  if (status === 2) return "可登录";
  if (status === 1) return "审核中";
  if (status === 0 || status === -1) return "待补充信息";
  return "状态异常";
});

const handleClick = () => {
  if (props.loading) return;
  emit("select");
};
</script>

<style scoped lang="scss">
.account-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #152942;
  border: #5683ad solid 4rpx;
  border-radius: 41rpx;
  padding: 24rpx;
  margin-top: 24rpx;
  box-sizing: border-box;
  box-shadow: 0 10rpx 26rpx rgba(30, 82, 184, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.account-card-hover {
  transform: translateY(-2rpx);
  box-shadow: 0 14rpx 30rpx rgba(30, 82, 184, 0.12);
}

.account-card.is-loading {
  opacity: 0.78;
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
}

.index-badge {
  width: 52rpx;
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #2f75ff 0%, #1f5ce8 100%);
  color: #ffffff;
  text-align: center;
  font-size: 24rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.card-main {
  flex: 1;
  min-width: 0;
}

.name-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #f4f5f8;
}

.user-title {
  font-size: 22rpx;
  color: #f6f7f9;
  background: rgba(47, 117, 255, 0.08);
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
}

.company-line {
  margin-top: 12rpx;
  font-size: 25rpx;
  color: #f5f6f9;
  line-height: 1.5;
}

.arrow-wrap {
  padding-top: 6rpx;
  flex-shrink: 0;
}

.arrow-text {
  font-size: 23rpx;
  color: #2d68dd;
  font-weight: 600;
}

.card-bottom {
  margin-top: 22rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #e4edff;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.info-item {
  flex: 1;
  min-width: 0;
}

.info-label {
  display: block;
  font-size: 22rpx;
  color: #f3f5f7;
}

.info-value {
  display: block;
  margin-top: 10rpx;
  font-size: 25rpx;
  color: #f6f7f9;
  word-break: break-all;
}
</style>
