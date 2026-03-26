<template>
  <view class="container">
    <image
      class="personal-top-bg"
      src="https://mvpme82.cloud/data/9a2da926-b553-43d7-9edd-d18aa5e86962_1774526652367.png"
      mode="widthFix"
    />
    <view class="personal-main">
      <!-- 企业卡片：171° 渐变描边 + 半透明底（设计 688×254 / 圆角 41） -->
      <view class="g-border g-border--company">
        <view class="company-card-inner">
          <image
            class="company-card-bg"
            src="https://mvpme82.cloud/data/9b281412-91b6-4aee-80bf-dcd9d448510f_1774526679284.png"
            mode="scaleToFill"
          />
          <view class="company-card-content">
            <view class="company-header">
              <text class="company-name">{{ companyDisplay.name }}</text>
              <view class="enterprise-tag">
                <image
                  v-if="companyLevelLabel"
                  class="enterprise-tag-icon"
                  :src="companyLevelLabel"
                  mode="aspectFit"
                />
              </view>
            </view>
            <view class="code"
              >统一社会信用代码：{{ companyDisplay.code }}</view
            >
            <view class="divider" />
            <view class="info-grid">
              <view class="info-line">
                <view class="info-item">
                  <view class="label-wrap">
                    <view class="label"><text>企业联系人</text></view>
                  </view>
                  <text class="val val--style1">{{
                    companyDisplay.contact
                  }}</text>
                </view>
                <view class="info-item">
                  <view class="label-wrap">
                    <view class="label"><text>手机号码</text></view>
                  </view>
                  <text class="val val--style2">{{
                    companyDisplay.phone
                  }}</text>
                </view>
              </view>
              <view class="info-line">
                <view class="info-item info-item-full">
                  <view class="label-wrap">
                    <view class="label"><text>职位信息</text></view>
                  </view>
                  <text class="val val--style1">{{
                    companyDisplay.position
                  }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section-title">
        <view class="section-title-bar" />
        <text>当前账户信息</text>
      </view>
      <view class="g-border g-border--account">
        <view class="account-card-inner">
          <image
            class="account-card-bg"
            src="https://mvpme82.cloud/data/086a8443-ee49-4651-ae9e-4318856a6990_1774526700790.png"
            mode="scaleToFill"
          />
          <image
            class="avatar"
            :src="accountDisplay.avatar"
            mode="aspectFill"
          />
          <view class="account-detail">
            <view class="name-row">
              <text class="name">{{ accountDisplay.name }}</text>
              <text class="role">{{ accountDisplay.role }}</text>
            </view>
            <view class="contact-row">
              <view class="contact-item">
                <image
                  class="contact-icon"
                  src="/static/personal/phone.png"
                  mode="aspectFit"
                />
                <text>{{ accountDisplay.phone }}</text>
              </view>
              <view class="contact-item contact-item-mail">
                <image
                  class="contact-icon"
                  src="/static/personal/email.png"
                  mode="aspectFit"
                />
                <text>{{ accountDisplay.email }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section-title">
        <view class="section-title-bar" />
        <text>服务清单</text>
      </view>

      <view class="g-border g-border--order-panel">
        <view class="order-panel-inner">
          <view class="stats-grid">
            <view class="stat-box">
              <image
                class="stat-box-bg"
                src="https://mvpme82.cloud/data/fc679518-c72c-4f02-883c-72ffb22c7676_1774526729020.png"
                mode="scaleToFill"
              />
              <text class="stat-label">服务中</text>
              <view class="stat-divider" />
              <text class="stat-count stat-count--serving">{{
                orderStats.serving
              }}</text>
            </view>
            <view class="stat-box">
              <image
                class="stat-box-bg"
                src="https://mvpme82.cloud/data/fc679518-c72c-4f02-883c-72ffb22c7676_1774526729020.png"
                mode="scaleToFill"
              />
              <text class="stat-label">服务完成</text>
              <view class="stat-divider" />
              <text class="stat-count stat-count--done">{{
                orderStats.finished
              }}</text>
            </view>
            <view class="stat-box">
              <image
                class="stat-box-bg"
                src="https://mvpme82.cloud/data/fc679518-c72c-4f02-883c-72ffb22c7676_1774526729020.png"
                mode="scaleToFill"
              />
              <text class="stat-label">已终止</text>
              <view class="stat-divider" />
              <text class="stat-count stat-count--end">{{
                orderStats.terminated
              }}</text>
            </view>
          </view>

          <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
            <view class="tab-bar-shell">
              <view class="tab-container">
                <view
                  v-for="tab in tabs"
                  :key="tab.id"
                  class="tab-item"
                  :class="{ active: activeTabId === tab.id }"
                  @tap="switchTab(tab.id)"
                >
                  {{ tab.label }}
                </view>
              </view>
            </view>
          </scroll-view>

          <view v-if="displayOrder" class="g-border g-border--order-item">
            <view class="order-item-inner">
              <view class="order-thumb-shell">
                <view class="order-thumb-inner">
                  <image
                    class="order-thumb-img"
                    :src="displayOrder.image"
                    mode="aspectFill"
                  />
                </view>
              </view>
              <view class="order-info">
                <view class="order-row"
                  >订单编号：{{ displayOrder.contractid }}</view
                >
                <view class="order-row"
                  >服务类型：{{ displayOrder.typeLabel }}</view
                >
                <view class="order-row status"
                  >进度状态：{{ displayOrder.statusText }}</view
                >
                <view class="detail-btn-shell">
                  <button
                    class="detail-btn"
                    @tap="goToOrderDetail(displayOrder.id)"
                  >
                    查看详情
                  </button>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="order-empty">暂无相关订单数据</view>
        </view>
      </view>

      <view class="section-title">
        <view class="section-title-bar" />
        <text>我的功能</text>
      </view>
      <view class="function-panel">
        <view
          v-for="item in functionMenuItems"
          :key="item.action"
          class="function-item"
          @tap="handleMenuClick(item)"
        >
          <image
            class="function-icon"
            :src="menuIconSrc(item)"
            mode="aspectFit"
          />
          <text class="function-text">{{ item.text }}</text>
        </view>
      </view>

      <view class="g-border g-border--logout" @tap="handleLogout">
        <view class="logout-inner">
          <image
            class="logout-icon"
            src="/static/personal/quit.png"
            mode="aspectFit"
          />
          <text>退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

const tabs = ref([
  { id: 1, label: "服务中" },
  { id: 2, label: "服务完成" },
  { id: 3, label: "已终止" },
]);

const activeTabId = ref(1);
const activeTab = ref("serving");

const switchTab = (tabId) => {
  activeTabId.value = tabId;
  const m = { 1: "serving", 2: "finished", 3: "terminated" };
  activeTab.value = m[tabId] ?? "serving";
};

const toNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const companyLevelLabel = computed(() => {
  const grade = toNumber(state.ccompanyinfo?.grade);
  switch (grade) {
    case 1:
      return "/static/companytypes/zongbu.png";
    case 2:
      return "/static/companytypes/lingjun.png";
    case 3:
      return "/static/companytypes/lingao.png";
    case 4:
      return "/static/companytypes/qianli.png";
    default:
      return "";
  }
});

const companyDisplay = computed(() => ({
  name: state.ccompanyinfo?.name || "—",
  code: state.ccompanyinfo?.creditcode || "—",
  contact: state.ccompanyinfo?.approvername || state.userinfo?.name || "—",
  phone: state.userinfo?.phone || "—",
  position: state.userinfo?.title || "—",
}));

const accountDisplay = computed(() => ({
  name: state.userinfo?.name || "—",
  role: state.userinfo?.title || "—",
  phone: state.userinfo?.phone || "—",
  email: state.userinfo?.email || "—",
  avatar: "/static/personal/head.png",
}));

const orderItemThumb = (item) => {
  const u =
    item?.imageurl ||
    item?.imageUrl ||
    item?.productimg ||
    item?.productimage ||
    item?.coverurl;
  if (u && String(u).trim()) return u;
  return "/static/building.png";
};

const displayOrder = computed(() => {
  const list = filteredOrderList.value;
  if (!list.length) return null;
  const item = list[0];
  return {
    id: item.id,
    contractid: item.contractid || String(item.id ?? ""),
    typeLabel: item.producttitle || item.bcompanyname || "服务订单",
    statusText: getStatusText(item.status),
    image: orderItemThumb(item),
  };
});

const menuIconSrc = (item) => {
  if (item.icon === "messages.png") return "/static/personal/messages.png";
  if (item.icon === "pjfk.png") return "/static/personal/feedback.png";
  if (item.icon === "quit.png") return "/static/personal/quit.png";
  return `/static/images/${item.icon}`;
};

const getuserinfo = () => {
  let payload = {
    userid: state.ComponentPublicInstance,
  };
};

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

const functionMenuItems = computed(() =>
  visibleMenuList.value.filter((item) => item.action !== "quitlogin"),
);

const handleLogout = () => {
  uni.removeStorageSync("userSessionChaoqitong");
  uni.reLaunch({ url: "/pages/login/login" });
};

const handleMenuClick = (item) => {
  switch (item.action) {
    case "mergeAsset":
      break;
    case "addUser":
      uni.navigateTo({ url: "/pages/addUser/addUser" });
      break;
    case "quitlogin":
      handleLogout();
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

<style lang="scss">
page {
  background-color: #061730;
}

.container {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: #061730;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom);
  color: #fff;
}

.personal-top-bg {
  width: 100%;
  display: block;
  vertical-align: top;
}

.personal-main {
  padding: 0 31rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  max-width: 750rpx;
  margin: 0 auto;
}

/* 渐变描边：外层 padding 模拟 border-image + 圆角（小程序兼容） */
.g-border {
  box-sizing: border-box;
}

.g-border--company {
  margin-top: 20rpx;
  width: 688rpx;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 2rpx;
  border-radius: 41rpx;
  background: linear-gradient(
    171deg,
    #80c3f6 0%,
    #244368 48%,
    #9ccdf0 100%
  );
}

.company-card-inner {
  position: relative;
  border-radius: 39rpx;
  min-height: 254rpx;
  overflow: hidden;
  box-sizing: border-box;
  background: transparent;
}

.company-card-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.company-card-content {
  position: relative;
  z-index: 1;
  padding: 28rpx 26rpx 24rpx;
  box-sizing: border-box;
}

.company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16rpx;
}

.company-name {
  flex: 1;
  font-size: 30rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.35;
}

.enterprise-tag {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.enterprise-tag-icon {
  width: 150rpx;
  height: 50rpx;
}

.divider {
  height: 2rpx;
  background: rgba(255, 255, 255, 0.18);
  margin: 20rpx 0 18rpx;
}

.code {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 12rpx;
}

.info-grid {
  display: flex;
  flex-direction: column;
}

.info-line {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.info-item {
  width: 50%;
  margin-bottom: 14rpx;
  display: flex;
  align-items: center;
}

.info-item-full {
  width: 100%;
}

/* 设计稿 .24-2：小程序 border-image 弱，用渐变 1rpx 模拟描边；整体 0.47 只作用在底色，避免字被 opacity 冲淡 */
.label-wrap {
  width: 115rpx;
  height: 31rpx;
  padding: 1rpx;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 8rpx;
  overflow: hidden;
  background: linear-gradient(-33deg, #4268a0 0%, #ffffff 100%);
}

.info-item .label {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(36, 55, 90, 0.47);
  /* 外框 8rpx、描边 1rpx，内圆角约 7rpx */
  border-radius: 7rpx;
  font-size: 20rpx;
  color: #ffffff;
  line-height: 1;
  padding: 0 4rpx;
}

.info-item .val {
  max-width: 569rpx;
  min-height: 23rpx;
  margin-left: 12rpx;
  flex: 1;
  min-width: 0;
  font-family: PingFang SC, PingFangSC-Light, sans-serif;
  font-size: 21rpx;
  font-weight: normal;
  letter-spacing: 0;
  color: #ffffff;
}

.info-item .val.val--style1 {
  font-family: PingFang SC, PingFangSC-Medium, sans-serif;
  font-size: 24rpx;
  font-weight: normal;
  letter-spacing: 0;
  color: #ffffff;
}

.info-item .val.val--style2 {
  font-family: PingFang SC, PingFangSC-Light, sans-serif;
  font-size: 21rpx;
  font-weight: normal;
  letter-spacing: 1rpx;
  color: #ffffff;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
  margin: 36rpx 0 20rpx;
}

.section-title-bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #80c3f6 0%, #4a8cc4 100%);
}

.g-border--account {
  width: 692rpx;
  max-width: 100%;
  margin: 0 auto;
  padding: 2rpx;
  border-radius: 35rpx;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.42) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
}

.account-card-inner {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 165rpx;
  padding: 24rpx 28rpx;
  border-radius: 33rpx;
  overflow: hidden;
  box-sizing: border-box;
  background: transparent;
}

.account-card-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.avatar {
  position: relative;
  z-index: 1;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  border: 2rpx solid rgba(255, 255, 255, 0.15);
}

.account-detail {
  margin-left: 24rpx;
  flex: 1;
  min-width: 0;
  z-index: 1;
}

.name-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.name-row .name {
  font-family: PingFang SC, PingFangSC-Medium, sans-serif;
  font-size: 34rpx;
  font-weight: normal;
  line-height: 51rpx;
  letter-spacing: 0;
  color: #ffffff;
}

.name-row .role {
  font-family: PingFang SC, PingFangSC-Regular, sans-serif;
  font-size: 22rpx;
  font-weight: normal;
  line-height: 32rpx;
  letter-spacing: 0;
  color: #ffffff;
}

.contact-row {
  margin-top: 14rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12rpx 24rpx;
  font-size: 22rpx;
  color: rgba(247, 246, 246, 0.95);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.contact-icon {
  width: 28rpx;
  height: 28rpx;
  opacity: 0.9;
}

.g-border--order-panel {
  width: 690rpx;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rpx;
  border-radius: 24rpx;
  background: linear-gradient(
    -8deg,
    #4683d3 1%,
    #2c62bb 26%,
    #1141a2 51%,
    #558dd8 100%
  );
}

.order-panel-inner {
  border-radius: 23rpx;
  padding: 24rpx 20rpx 28rpx;
  box-sizing: border-box;
  background: rgba(6, 20, 40, 0.94);
}

.stats-grid {
  display: flex;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.stat-box {
  position: relative;
  flex: 1 1 0;
  max-width: 193rpx;
  min-width: 0;
  height: 124rpx;
  box-sizing: border-box;
  border-radius: 22rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-box-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.stat-box .stat-label,
.stat-box .stat-divider,
.stat-box .stat-count {
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 24rpx;
  color: #b7ab93;
}

.stat-divider {
  width: 72%;
  height: 2rpx;
  background: rgba(183, 171, 147, 0.6);
  margin: 10rpx 0 6rpx;
}

.stat-count {
  font-size: 40rpx;
  font-weight: 700;
}

.stat-count--serving {
  color: #fdcf82;
}

.stat-count--done {
  color: #74bea0;
}

.stat-count--end {
  color: #d27374;
}

.tab-scroll {
  width: 100%;
  padding: 20rpx 0 8rpx;
}

.tab-bar-shell {
  width: 650rpx;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rpx;
  box-sizing: border-box;
  border-radius: 35rpx;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(250, 235, 204, 0.83) 0%,
    rgba(221, 184, 119, 0.9) 45%,
    rgba(240, 214, 160, 0.83) 100%
  );
}

.tab-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  gap: 10rpx;
  padding: 6rpx 8rpx;
  border-radius: 34rpx;
  background: rgba(10, 24, 48, 0.94);
  min-width: 100%;
  box-sizing: border-box;
  min-height: 68rpx;
  height: 68rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 8rpx;
  border-radius: 27rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
}

.tab-item.active {
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
  color: #1a2a3d;
  font-weight: 600;
  box-shadow: 0 2rpx 12rpx rgba(218, 178, 107, 0.35);
}

.g-border--order-item {
  margin-top: 20rpx;
  padding: 2rpx;
  border-radius: 20rpx;
  background: linear-gradient(
    171deg,
    #80c3f6 0%,
    #244368 48%,
    #9ccdf0 100%
  );
}

.order-item-inner {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  min-height: 137rpx;
  background: rgba(30, 50, 86, 0.72);
}

/* 与首页一致：设计稿 .24 订单缩略图外框 */
.order-thumb-shell {
  width: 137rpx;
  height: 137rpx;
  padding: 3rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(
    178deg,
    #5e97d2 0%,
    #2c5f8f 49%,
    #6a9ccf 100%
  );
}

.order-thumb-inner {
  width: 100%;
  height: 100%;
  border-radius: 15rpx;
  overflow: hidden;
  background: linear-gradient(180deg, #1b4163 0%, #76aadf 100%);
}

.order-thumb-img {
  width: 100%;
  height: 100%;
  display: block;
}

.order-info {
  flex: 1;
  min-width: 0;
  position: relative;
  padding-bottom: 48rpx;
}

/* 设计稿订单信息：三行均为 #ffffff，19rpx / 35rpx */
.order-row {
  margin-bottom: 10rpx;
  font-size: 19rpx;
  line-height: 35rpx;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 0;
}

.order-row.status {
  color: #ffffff;
}

.detail-btn-shell {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 127rpx;
  height: 41rpx;
  padding: 1rpx;
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background: linear-gradient(
    159deg,
    #afcde9 0%,
    #3763b3 50%,
    #2453ab 58%,
    #afcef2 100%
  );
}

.detail-btn {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  line-height: 1;
  color: #ffffff;
  background: transparent;
  border: none;
  border-radius: 14rpx;
}

.detail-btn::after {
  border: none;
}

.order-empty {
  margin-top: 28rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.45);
}

.function-panel {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;
  padding: 32rpx 8rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border: 2rpx solid rgba(128, 195, 246, 0.22);
  margin-bottom: 8rpx;
}

.function-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  position: relative;
}

.function-item:not(:first-child)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 18%;
  bottom: 18%;
  width: 1rpx;
  background: rgba(255, 255, 255, 0.12);
}

.function-icon {
  width: 48rpx;
  height: 48rpx;
  opacity: 0.95;
}

.function-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.88);
}

.g-border--logout {
  margin-top: 28rpx;
  margin-bottom: 8rpx;
  padding: 1rpx;
  border-radius: 27rpx;
  background: linear-gradient(
    178deg,
    #5e97d2 0%,
    #2c5f8f 49%,
    #6a9ccf 100%
  );
}

.logout-inner {
  height: 78rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  font-size: 28rpx;
  color: #ffffff;
  background: linear-gradient(
    180deg,
    rgba(32, 58, 95, 0.96) 0%,
    rgba(12, 28, 52, 0.98) 100%
  );
}

.logout-icon {
  width: 36rpx;
  height: 36rpx;
}
</style>
