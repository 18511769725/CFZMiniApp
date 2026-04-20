<template>
  <view class="pick-account-page">
    <view class="page-title">请选择企业账号</view>
    <view class="phone-line">
      <text class="phone-label">当前登录手机号：</text>
      <text class="phone-value">{{ state.phone || "--" }}</text>
    </view>

    <PickAccountCard
      v-for="(item, index) in state.accountList"
      :key="item.id || item.userid || index"
      :account="item"
      :index="index"
      :phone="state.phone"
      :loading="state.loggingInIndex === index"
      @select="handleLoginByAccount(item, index)"
    />
  </view>
</template>

<script setup>
import { reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import PickAccountCard from "./components/PickAccountCard.vue";

const state = reactive({
  phone: "",
  loading: false,
  errorMsg: "",
  accountList: [],
  loggingInIndex: -1,
});

const getUserInfoByPhone = () => {
  if (!state.phone) {
    state.errorMsg = "未获取到手机号";
    return;
  }

  state.loading = true;
  state.errorMsg = "";

  uni.request({
    url: "https://mvpme82.cloud/api/getuserinfobyphone",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { phone: state.phone },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.accountList = Array.isArray(res.data.data) ? res.data.data : [];
        return;
      }
      state.errorMsg =
        (res && res.data && res.data.str_err_code) || "获取账号列表失败";
    },
    fail: () => {
      state.errorMsg = "网络异常，无法获取账号列表";
    },
    complete: () => {
      state.loading = false;
    },
  });
};

const handleLoginByAccount = (account, index) => {
  if (!account) return;

  state.loggingInIndex = index;
  const status = Number(account.status);

  // 创建一个数组
  const accountArray = [account];

  if (status === 2) {
    uni.setStorage({
      key: "userSessionChaoqitong",
      data: { data: [account] },
      success: () => {
        uni.switchTab({ url: "/pages/mainpage/mainpage" });
      },
      complete: () => {
        state.loggingInIndex = -1;
      },
    });
    return;
  }

  if (status === 0 || status === -1) {
    uni.navigateTo({
      url: `/pages/moreinfo/moreinfo?phone=${state.phone}`,
      complete: () => {
        state.loggingInIndex = -1;
      },
    });
    return;
  }

  if (status === 1) {
    uni.showToast({
      title: "该账号正在审核中",
      icon: "none",
      duration: 2000,
    });
  } else {
    uni.showToast({
      title: "账号状态异常，请联系管理员",
      icon: "none",
      duration: 2000,
    });
  }
  state.loggingInIndex = -1;
};

onLoad((option) => {
  state.phone = option && option.phone ? decodeURIComponent(option.phone) : "";
  if (!state.phone) {
    uni.showToast({ title: "未获取到手机号", icon: "none" });
    state.errorMsg = "未获取到手机号";
    return;
  }
  getUserInfoByPhone();
});
</script>

<style scoped lang="scss">
.pick-account-page {
  min-height: 100vh;
  background-color: #061730;
  padding: 32rpx;
  box-sizing: border-box;
}
.page-card {
  width: 100%;
  background: #f5f8ff;
  border-radius: 24rpx;
  padding: 28rpx 24rpx 24rpx;
  box-sizing: border-box;
  border: 1rpx solid #dfebff;
  box-shadow: 0 12rpx 30rpx rgba(27, 85, 197, 0.06);
}

.page-title {
  width: 100%;
  text-align: center;
  font-size: 48rpx;
  font-weight: 600;
  color: #f9fafb;
  margin-top: 48rpx;
}

.phone-line {
  margin-top: 24rpx;
  margin-bottom: 24rpx;
  font-size: 32rpx;
  color: #4f5d75;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.phone-label {
  color: #f9fafb;
}

.phone-value {
  color: #f9fafb;
  font-weight: 600;
}

.status-box {
  background: #f3f7ff;
  border: 1rpx solid #dce7ff;
  border-radius: 14rpx;
  color: #415880;
  text-align: center;
  font-size: 26rpx;
  padding: 28rpx 12rpx;
}

.status-box.is-error {
  border-color: #f4c8c8;
  background: #fff4f4;
  color: #b33939;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
