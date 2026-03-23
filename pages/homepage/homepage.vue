<template>
  <view class="page-container">
    <view class="enterprise-card module-enter enter-delay-0">
      <view class="card-header">
        <view class="header-info">
          <text class="company-name">{{
            state.ccompanyinfo.name || "企业信息"
          }}</text>
          <text class="credit-code"
            >统一社会信用代码：{{ state.ccompanyinfo.creditcode || "-" }}</text
          >
          <text class="credit-code"
            >企业联系人：{{ state.ccompanyinfo.approvername || "-" }}</text
          >
        </view>
        <text class="enterprise-tag">企业账户</text>
      </view>
    </view>

    <view class="news-section module-enter enter-delay-1">
      <view class="news-header">
        <text class="news-title">当前账户信息</text>
      </view>

      <view class="info-grid">
        <view class="info-card" style="width: 30%">
          <text class="info-label">姓名</text>
          <text class="info-value">{{ state.userinfo.name || "-" }}</text>
        </view>
        <view class="info-card" style="width: 33%">
          <text class="info-label">手机号码</text>
          <text class="info-value">{{ state.userinfo.phone || "-" }}</text>
        </view>
        <view class="info-card" style="width: 30%">
          <text class="info-label">职位信息</text>
          <text class="info-value">{{ state.userinfo.title || "-" }}</text>
        </view>
      </view>
    </view>

    <view class="news-section module-enter enter-delay-2">
      <view class="news-header">
        <text class="news-title">服务清单</text>
      </view>

      <view class="order-overview">
        <view class="overview-chip">
          <text class="chip-label">服务中</text>
          <text class="chip-value">{{ orderStats.serving }}</text>
        </view>
        <view class="overview-chip">
          <text class="chip-label">服务完成</text>
          <text class="chip-value">{{ orderStats.finished }}</text>
        </view>
        <view class="overview-chip">
          <text class="chip-label">已终止</text>
          <text class="chip-value">{{ orderStats.terminated }}</text>
        </view>
      </view>

      <view class="tab-bar">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'serving' }"
          @click="switchTab('serving')"
        >
          服务中
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'finished' }"
          @click="switchTab('finished')"
        >
          服务完成
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'terminated' }"
          @click="switchTab('terminated')"
        >
          已终止
        </view>
      </view>

      <view class="order-table table-view">
        <view class="table-header">
          <view class="table-cell">序号</view>
          <view class="table-cell">合同编号</view>
          <view class="table-cell">合同总分</view>
          <view class="table-cell">供应商名称</view>
          <view class="table-cell">订单发起时间</view>
          <view class="table-cell">订单状态</view>
        </view>
        <view
          class="table-row"
          v-for="(item, index) in filteredOrderList"
          :key="item.id"
          @click="goToOrderDetail(item.id)"
        >
          <view class="table-cell">{{ index + 1 }}</view>
          <view class="table-cell">{{ item.contractid }}</view>
          <view class="table-cell">{{ item.contractprice }}积分</view>
          <view class="table-cell">{{ item.bcompanyname }}</view>
          <view class="table-cell">{{ formatTime(item.createtime) }}</view>
          <view class="table-cell">
            <text :class="getStatusClass(item.status)">{{
              getStatusText(item.status)
            }}</text>
          </view>
        </view>

        <view class="empty-tip" v-if="filteredOrderList.length === 0"
          >暂无相关订单数据</view
        >
      </view>

      <view class="mobile-order-list" v-if="filteredOrderList.length">
        <view
          class="mobile-order-card"
          v-for="(item, index) in filteredOrderList"
          :key="`mobile-${item.id}`"
          @click="goToOrderDetail(item.id)"
        >
          <view class="mobile-order-top">
            <text class="mobile-order-no">#{{ index + 1 }}</text>
            <text class="mobile-order-id">{{ item.contractid }}</text>
            <text
              class="mobile-order-status"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusText(item.status) }}
            </text>
          </view>
          <view class="mobile-order-row">
            <text class="mobile-order-label">合同总分</text>
            <text class="mobile-order-value strong"
              >{{ item.contractprice }}积分</text
            >
          </view>
          <view class="mobile-order-row">
            <text class="mobile-order-label">供应商</text>
            <text class="mobile-order-value">{{ item.bcompanyname }}</text>
          </view>
          <view class="mobile-order-row">
            <text class="mobile-order-label">发起时间</text>
            <text class="mobile-order-value">{{
              formatTime(item.createtime)
            }}</text>
          </view>
        </view>
      </view>
      <view class="empty-tip mobile-empty" v-else> 暂无相关订单数据 </view>
    </view>

    <view class="news-section module-enter enter-delay-3">
      <view class="news-header">
        <text class="news-title">我的功能</text>
      </view>
      <view class="menu-grid">
        <view
          class="menu-item"
          v-for="(item, index) in visibleMenuList"
          :key="index"
          @click="handleMenuClick(item)"
        >
          <view class="menu-icon">
            <image
              class="func-icon"
              :src="`/static/images/${item.icon}`"
              mode="widthFix"
            ></image>
          </view>
          <view class="menu-text">{{ item.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

// 激活的Tab标签
const activeTab = ref("serving");

// 根据Tab筛选订单列表
const filteredOrderList = computed(() => {
  switch (activeTab.value) {
    case "serving":
      return state.orderList.filter((item) =>
        [0, 1, 2, 4].includes(item.status),
      );
    case "finished":
      return state.orderList.filter((item) => item.status === 3);
    case "terminated":
      return state.orderList.filter((item) =>
        [-1, -2, -3, -4].includes(item.status),
      );
    default:
      return [];
  }
});

const orderStats = computed(() => {
  return {
    serving: state.orderList.filter((item) =>
      [0, 1, 2, 4].includes(item.status),
    ).length,
    finished: state.orderList.filter((item) => item.status === 3).length,
    terminated: state.orderList.filter((item) =>
      [-1, -2, -3, -4].includes(item.status),
    ).length,
  };
});

// 切换Tab
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 格式化时间戳为YYYY-MM-DD HH:mm:ss
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取状态文字
const getStatusText = (status) => {
  const statusMap = {
    0: "待主管审核",
    1: "待签约",
    2: "已签约",
    3: "已完成",
    4: "待后台确认",
    "-1": "取消订单",
    "-2": "审核驳回",
    "-3": "后台终止",
    "-4": "主管驳回",
  };
  return statusMap[status] || "未知状态";
};

// 获取状态文字样式类
const getStatusClass = (status) => {
  const classMap = {
    0: "status-pending",
    1: "status-negotiate",
    2: "status-signed",
    3: "status-finished",
    "-1": "status-cancelled",
    "-2": "status-rejected",
    "-3": "status-terminated",
  };
  return classMap[status] || "";
};

// 双击跳转到订单详情页
const goToOrderDetail = (orderId) => {
  console.log(orderId);
  uni.navigateTo({
    url: `/pages/orderDetail/orderDetail?id=${orderId}`,
  });
};

// 原有代码
const state = reactive({
  userinfo: {},
  orderList: [],
  ccompanyinfo: {},
  creditinfo: {},
});
const menuList = ref([
  {
    text: "消息通知",
    icon: "messages.png",
    action: "mergeAsset",
  },
  {
    text: "评价反馈",
    icon: "pjfk.png",
    action: "myCoupon",
  },
  {
    text: "添加用户",
    icon: "adduser.png",
    action: "addUser",
  },
  {
    text: "退出登录",
    icon: "quit.png",
    action: "quitlogin",
  },
]);

const visibleMenuList = computed(() => {
  const isAdmin = String(state.userinfo?.isadmin) === "1";
  return menuList.value.filter((item) => {
    if (item.action === "addUser") {
      return isAdmin;
    }
    return true;
  });
});

const handleMenuClick = (item) => {
  switch (item.action) {
    case "mergeAsset":
      break;
    case "addUser":
      uni.navigateTo({ url: "/pages/addUser/addUser" });
      break;
    case "quitlogin":
      uni.removeStorageSync("userSessionChaoqitong");
      uni.navigateTo({ url: "/pages/login/login" });
      break;
  }
};
const getOrderList = () => {
  uni.request({
    url: "https://mvpme82.cloud/api/getordersforminiapp", // 目标接口地址
    method: "POST",
    data: {
      cuserid: state.userinfo.id,
    },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.orderList = res.data.data;
      } else {
        uni.showToast({
          title: "获取订单列表失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      // 网络错误处理（如接口不可达、超时等）
      uni.showToast({
        title: "网络异常，无法连接订单列表接口",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

const getccompanyinfo = (cuserid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getccompanyinfobycuserid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { cuserid: cuserid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.ccompanyinfo = res.data.data[0];
        getCreditInfo(state.ccompanyinfo.id);
      } else {
        uni.showToast({
          title: "获取企业信息失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "获取企业信息请求失败！",
        icon: "none",
        duration: 1000,
      });
    },
  });
};
const getCreditInfo = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getcreditinfobyccompanyidforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid: ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.creditinfo = res.data.result;
      } else {
        uni.showToast({
          title: "获取额度信息失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "获取额度信息请求失败！",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

// 页面加载时初始化
onLoad(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getccompanyinfo(state.userinfo.id);
        getOrderList();
      } else {
        uni.showToast({ title: "用户信息异常", icon: "none" });
        uni.reLaunch({ url: "/pages/login/login" });
      }
    },
    fail: () => {
      // 返回到登录页
      uni.reLaunch({ url: "/pages/login/login" });
    },
  });
});

onShow(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getccompanyinfo(state.userinfo.id);
        getOrderList();
      } else {
        uni.showToast({ title: "用户信息异常", icon: "none" });
        uni.reLaunch({ url: "/pages/login/login" });
      }
    },
    fail: () => {
      // 返回到登录页
      uni.reLaunch({ url: "/pages/login/login" });
    },
  });
});
</script>

<style scoped lang="scss">
.page-container {
  --biz-bg: #dfe8f2;
  --biz-surface: #edf3f8;
  --biz-surface-soft: #e5edf6;
  --biz-border: #c7d4e2;
  --biz-border-strong: #b4c6d8;
  --biz-title: #183b63;
  --biz-text: #284868;
  --biz-subtext: #647b94;
  --biz-primary: #245a96;
  --biz-primary-soft: #dbe7f3;
  --quota-bg-dark: #2a587f;
  --quota-bg-dark-2: #416f99;
  --quota-text-light: #e8f2ff;
  --quota-text-strong: #ffffff;

  min-height: 100vh;
  padding: 16rpx 0 24rpx;
  box-sizing: border-box;
  background:
    radial-gradient(
      circle at 12% -10%,
      rgba(65, 107, 153, 0.16) 0,
      transparent 44%
    ),
    radial-gradient(
      circle at 90% -8%,
      rgba(100, 140, 185, 0.12) 0,
      transparent 42%
    ),
    linear-gradient(180deg, #d5e0eb 0%, #dbe5ef 44%, var(--biz-bg) 100%);
}

.enterprise-card,
.news-section {
  margin: 0 16rpx 16rpx;
}

.enterprise-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    var(--quota-bg-dark) 0%,
    #35648e 42%,
    var(--quota-bg-dark-2) 100%
  );
  border: 1rpx solid rgba(199, 218, 238, 0.34);
  border-radius: 22rpx;
  padding: 28rpx 24rpx;
  box-shadow:
    0 12rpx 26rpx rgba(26, 54, 89, 0.18),
    0 1rpx 0 rgba(255, 255, 255, 0.08) inset;
  box-sizing: border-box;
}

.enterprise-card::after {
  content: "";
  position: absolute;
  width: 240rpx;
  height: 240rpx;
  left: -120rpx;
  bottom: -130rpx;
  border-radius: 9999rpx;
  background: radial-gradient(
    circle,
    rgba(121, 159, 201, 0.2) 0,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.enterprise-card::before {
  content: "";
  position: absolute;
  width: 300rpx;
  height: 300rpx;
  right: -120rpx;
  top: -120rpx;
  border-radius: 9999rpx;
  background: radial-gradient(
    circle,
    rgba(146, 186, 228, 0.22) 0,
    transparent 68%
  );
  pointer-events: none;
  z-index: 0;
}

.card-header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16rpx;
}

.header-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.company-name {
  font-size: 34rpx;
  line-height: 1.3;
  font-weight: 700;
  color: var(--quota-text-strong);
  text-shadow: 0 2rpx 4rpx rgba(6, 20, 46, 0.42);
}

.credit-code {
  font-size: 24rpx;
  color: rgba(224, 239, 255, 0.88);
  line-height: 1.45;
  font-weight: 500;
  word-break: break-all;
}

.enterprise-tag {
  flex-shrink: 0;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #234d7d;
  background: linear-gradient(180deg, #edf3f9 0%, #dfe8f2 100%);
  border: 1rpx solid rgba(255, 255, 255, 0.42);
}

.news-section {
  position: relative;
  overflow: hidden;
  padding: 24rpx;
  background: linear-gradient(
    180deg,
    var(--biz-surface) 0%,
    var(--biz-surface-soft) 100%
  );
  border-radius: 20rpx;
  border: 1rpx solid var(--biz-border);
  box-shadow: 0 8rpx 22rpx rgba(24, 45, 74, 0.06);
}

.news-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22rpx;
}

.news-title {
  position: relative;
  font-size: 32rpx;
  font-weight: 800;
  letter-spacing: 0.4rpx;
  color: var(--biz-title);
  padding-left: 16rpx;
}

.news-title:before {
  content: "";
  position: absolute;
  left: 0;
  top: 6rpx;
  bottom: 6rpx;
  width: 6rpx;
  border-radius: 6rpx;
  background: linear-gradient(180deg, #2d68b2 0%, #70a2df 100%);
}

.info-grid {
  position: relative;
  display: grid;
  grid-template-columns: 30% 33% 30%;
  gap: 14rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.info-card {
  background: linear-gradient(180deg, #ecf2f7 0%, #e4ecf4 100%);
  border: 1rpx solid #ccd8e4;
  border-radius: 16rpx;
  padding: 20rpx 10rpx;
  text-align: center;
}

.info-label {
  display: block;
  font-size: 24rpx;
  color: var(--biz-subtext);
  margin-bottom: 8rpx;
  font-weight: 500;
}

.info-value {
  font-size: 31rpx;
  font-weight: 800;
  line-height: 1.25;
  color: var(--biz-title);
  word-break: break-all;
}

.tab-bar {
  position: relative;
  display: flex;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.order-overview {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.overview-chip {
  background: linear-gradient(180deg, #ecf2f7 0%, #e4ecf4 100%);
  border: 1rpx solid #ccd8e4;
  border-radius: 14rpx;
  padding: 14rpx 10rpx;
  text-align: center;
}

.chip-label {
  display: block;
  font-size: 22rpx;
  color: var(--biz-subtext);
  margin-bottom: 6rpx;
  font-weight: 500;
}

.chip-value {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: var(--biz-title);
  line-height: 1.08;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--biz-subtext);
  border-radius: 999rpx;
  background: #dde7f1;
  border: 1rpx solid #c8d5e2;
  transition: all 0.2s ease;

  &.active {
    color: var(--biz-primary);
    font-weight: 700;
    background: var(--biz-primary-soft);
    border-color: #bccbdd;
  }
}

.order-table {
  position: relative;
  width: 100%;
  overflow-x: auto;
  border-radius: 14rpx;
  border: 1rpx solid #ccd8e4;
}

.mobile-order-list {
  position: relative;
  display: none;
  flex-direction: column;
  gap: 12rpx;
}

.mobile-order-card {
  border: 1rpx solid #ccd8e4;
  border-radius: 14rpx;
  background: linear-gradient(180deg, #ecf2f7 0%, #e4ecf4 100%);
  padding: 14rpx 14rpx 12rpx;
}

.mobile-order-top {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 10rpx;
}

.mobile-order-no {
  font-size: 22rpx;
  color: #5a7392;
  font-weight: 700;
}

.mobile-order-id {
  flex: 1;
  min-width: 0;
  font-size: 25rpx;
  color: var(--biz-title);
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-order-status {
  font-size: 22rpx;
  font-weight: 600;
}

.mobile-order-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12rpx;
  padding: 5rpx 0;
}

.mobile-order-label {
  font-size: 23rpx;
  color: var(--biz-subtext);
  font-weight: 500;
}

.mobile-order-value {
  flex: 1;
  min-width: 0;
  text-align: right;
  font-size: 24rpx;
  line-height: 1.35;
  color: var(--biz-text);
  word-break: break-all;
}

.mobile-order-value.strong {
  font-weight: 700;
  color: var(--biz-title);
}

.mobile-empty {
  display: none;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 90rpx 220rpx 180rpx 220rpx 280rpx 160rpx;
  align-items: center;
  min-width: 1150rpx;
}

.table-header {
  background: #d6e1ec;
}

.table-cell {
  width: 100%;
  padding: 16rpx 12rpx;
  text-align: center;
  font-size: 25rpx;
  line-height: 1.35;
  color: var(--biz-text);
  white-space: normal;
  word-break: break-all;
}

.table-header .table-cell {
  font-weight: 700;
  color: #2e4f74;
}

.table-row {
  border-top: 1rpx solid #cdd8e3;
  background-color: #e3ecf4;
}

.table-row:active {
  background-color: #d8e3ee;
}

.status-pending {
  color: #ff9800;
}

.status-negotiate {
  color: #4299e1;
}

.status-signed {
  color: #38b2ac;
}

.status-finished {
  color: #48bb78;
}

.status-cancelled,
.status-rejected,
.status-terminated {
  color: #e53e3e;
}

.empty-tip {
  position: relative;
  text-align: center;
  padding: 36rpx 0;
  font-size: 26rpx;
  color: var(--biz-subtext);
}

.menu-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12rpx;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 162rpx;
  padding: 12rpx 8rpx;
  border-radius: 14rpx;
  border: 1rpx solid #ccd8e4;
  background: linear-gradient(180deg, #ecf2f7 0%, #e4ecf4 100%);
  box-sizing: border-box;
}

.menu-item:active {
  background-color: #d8e3ee;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}

.func-icon {
  width: 64rpx;
}

.menu-text {
  font-size: 25rpx;
  font-weight: 600;
  color: var(--biz-title);
  line-height: 1.3;
  text-align: center;
}

.module-enter {
  animation: moduleFadeIn 0.45s ease both;
}

.enter-delay-0 {
  animation-delay: 0.02s;
}

.enter-delay-1 {
  animation-delay: 0.08s;
}

.enter-delay-2 {
  animation-delay: 0.14s;
}

.enter-delay-3 {
  animation-delay: 0.2s;
}

@keyframes moduleFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 380px) {
  .enterprise-card,
  .news-section {
    margin-left: 12rpx;
    margin-right: 12rpx;
  }

  .enterprise-card,
  .news-section {
    padding-left: 20rpx;
    padding-right: 20rpx;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .menu-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .order-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .table-view {
    display: none;
  }

  .mobile-order-list {
    display: flex;
  }

  .mobile-empty {
    display: block;
  }
}
</style>
