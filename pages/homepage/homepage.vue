<template>
  <view class="page-container">
    <!-- 固定高度 + aspectFill，避免 widthFix 把整图拉高导致首卡距顶过远 -->
    <view class="personal-top-hero">
      <image
        class="personal-top-bg"
        src="https://mvpme82.cloud/data/9a2da926-b553-43d7-9edd-d18aa5e86962_1774526652367.png"
        mode="aspectFill"
      />
    </view>
    <view class="page-inner">
      <view class="company-card-outer module-enter enter-delay-0">
        <view class="company-card-inner">
          <image
            class="company-card-bg"
            src="https://mvpme82.cloud/data/9b281412-91b6-4aee-80bf-dcd9d448510f_1774526679284.png"
            mode="scaleToFill"
          />
          <view class="company-card-content">
            <view class="card-header">
              <view class="header-info">
                <text class="company-name">{{
                  state.ccompanyinfo.name || "企业信息"
                }}</text>
                <text class="credit-code"
                  >统一社会信用代码：{{
                    state.ccompanyinfo.creditcode || "-"
                  }}</text
                >
              </view>
              <view class="enterprise-tag-wrap">
                <image
                  v-if="companyLevelLabel"
                  class="enterprise-tag-img"
                  :src="companyLevelLabel"
                  mode="aspectFit"
                />
                <text v-else class="enterprise-tag-fallback">企业账户</text>
              </view>
            </view>
            <view class="divider-h" />
            <view class="company-info-grid">
              <view class="ci-line">
                <view class="ci-item">
                  <view class="ci-label-wrap">
                    <image
                      class="ci-label-bg"
                      :src="companyFieldLabelBgSrc"
                      mode="scaleToFill"
                    />
                    <view class="ci-label"><text>企业联系人</text></view>
                  </view>
                  <text class="ci-val ci-val--style1">{{
                    state.ccompanyinfo.approvername ||
                    state.userinfo.name ||
                    "-"
                  }}</text>
                </view>
                <view class="ci-item">
                  <view class="ci-label-wrap">
                    <image
                      class="ci-label-bg"
                      :src="companyFieldLabelBgSrc"
                      mode="scaleToFill"
                    />
                    <view class="ci-label"><text>手机号码</text></view>
                  </view>
                  <text class="ci-val ci-val--style2">{{
                    state.userinfo.phone || "-"
                  }}</text>
                </view>
              </view>
              <view class="ci-line">
                <view class="ci-item ci-full">
                  <view class="ci-label-wrap">
                    <image
                      class="ci-label-bg"
                      :src="companyFieldLabelBgSrc"
                      mode="scaleToFill"
                    />
                    <view class="ci-label"><text>职位信息</text></view>
                  </view>
                  <text class="ci-val ci-val--style1">{{
                    state.userinfo.title || "-"
                  }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section-title section-title--account module-enter enter-delay-1">
        <view class="section-title-bar" />
        <text>当前账户信息</text>
      </view>
      <view class="g-border g-border--account module-enter enter-delay-1">
        <view class="account-card-inner">
          <image
            class="account-card-bg"
            src="https://mvpme82.cloud/data/086a8443-ee49-4651-ae9e-4318856a6990_1774526700790.png"
            mode="scaleToFill"
          />
          <image
            class="account-avatar"
            src="/static/personal/head.png"
            mode="aspectFill"
          />
          <view class="account-detail">
            <text class="account-name">{{ state.userinfo.name || "—" }}</text>
            <text class="account-role">{{ state.userinfo.title || "—" }}</text>
            <view class="account-contact-row">
              <view class="account-contact-item">
                <image
                  class="account-contact-icon"
                  src="/static/personal/phone.png"
                  mode="aspectFit"
                />
                <text>{{ state.userinfo.phone || "—" }}</text>
              </view>
              <view class="account-contact-item">
                <image
                  class="account-contact-icon"
                  src="/static/personal/email.png"
                  mode="aspectFit"
                />
                <text>{{ state.userinfo.email || "—" }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section-title module-enter enter-delay-2">
        <view class="section-title-bar" />
        <text>服务清单</text>
      </view>

      <view class="g-border g-border--order-panel module-enter enter-delay-2">
        <view class="order-panel-inner">
          <view class="order-overview">
            <view class="overview-chip">
              <image
                class="overview-chip-bg"
                src="https://mvpme82.cloud/data/fc679518-c72c-4f02-883c-72ffb22c7676_1774526729020.png"
                mode="scaleToFill"
              />
              <text class="chip-label">服务中</text>
              <view class="chip-divider" />
              <text class="chip-value chip-serving">{{
                orderStats.serving
              }}</text>
            </view>
            <view class="overview-chip">
              <image
                class="overview-chip-bg"
                src="https://mvpme82.cloud/data/fc679518-c72c-4f02-883c-72ffb22c7676_1774526729020.png"
                mode="scaleToFill"
              />
              <text class="chip-label">服务完成</text>
              <view class="chip-divider" />
              <text class="chip-value chip-done">{{
                orderStats.finished
              }}</text>
            </view>
            <view class="overview-chip">
              <image
                class="overview-chip-bg"
                src="https://mvpme82.cloud/data/fc679518-c72c-4f02-883c-72ffb22c7676_1774526729020.png"
                mode="scaleToFill"
              />
              <text class="chip-label">已终止</text>
              <view class="chip-divider" />
              <text class="chip-value chip-end">{{
                orderStats.terminated
              }}</text>
            </view>
          </view>

          <view class="tab-bar-shell">
            <view class="tab-bar">
              <view
                class="tab-item"
                :class="{ active: activeTab === 'serving' }"
                @tap="switchTab('serving')"
              >
                服务中
              </view>
              <view
                class="tab-item"
                :class="{ active: activeTab === 'finished' }"
                @tap="switchTab('finished')"
              >
                服务完成
              </view>
              <view
                class="tab-item"
                :class="{ active: activeTab === 'terminated' }"
                @tap="switchTab('terminated')"
              >
                已终止
              </view>
            </view>
          </view>

          <view class="order-card-list">
            <template v-if="filteredOrderList.length">
              <view
                v-for="item in filteredOrderList"
                :key="item.id"
                class="order-row-wrap"
              >
                <image
                  class="order-row-item-bg"
                  :src="orderRowCardBgSrc"
                  mode="scaleToFill"
                />
                <view
                  class="order-row-card-inner"
                  @tap="goToOrderDetail(item.id)"
                >
                  <view class="order-thumb-shell">
                    <view class="order-thumb-inner">
                      <image
                        class="order-thumb-img"
                        :src="orderThumbSrc(item)"
                        mode="aspectFill"
                      />
                    </view>
                  </view>
                  <view class="order-row-main">
                    <view class="order-row-text">
                      <text class="order-row-line"
                        >订单编号：{{ item.contractid }}</text
                      >
                      <text class="order-row-line"
                        >供应商名称：{{ orderServiceType(item) }}</text
                      >
                      <text class="order-row-line order-row-line--status"
                        >进度状态：{{ orderProgressLine(item) }}</text
                      >
                    </view>
                    <view
                      class="order-row-btn-wrap"
                      @tap.stop="goToOrderDetail(item.id)"
                    >
                      <image
                        class="order-row-btn-bg"
                        :src="orderDetailBtnBgSrc"
                        mode="scaleToFill"
                      />
                      <view class="order-row-btn">
                        <text>查看详情</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </template>
            <view v-else class="empty-tip order-list-empty"
              >暂无相关订单数据</view
            >
          </view>
        </view>
      </view>

      <view
        class="logout-btn-wrap module-enter enter-delay-3"
        @tap="handleLogout"
      >
        <image
          class="logout-btn-img"
          :src="logoutBtnBgSrc"
          mode="scaleToFill"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

/** 企业联系人 / 手机号码 / 职位信息 标签底图 */
const companyFieldLabelBgSrc =
  "https://mvpme82.cloud/data/ad6c8fa3-e332-492d-aa15-9a952df4c974_1774544221276.png";

/** 服务清单「查看详情」按钮底图 */
const orderDetailBtnBgSrc =
  "https://mvpme82.cloud/data/87edb7e3-00ac-4f48-9c2c-2589f9f802ac_1774546014161.png";

/** 每个订单条目卡片底图（非整列表） */
const orderRowCardBgSrc =
  "https://mvpme82.cloud/data/96457779-cfc2-4052-ba58-1f33358cc23b_1774544790763.png";

/** 退出登录整图按钮 693×78 */
const logoutBtnBgSrc =
  "https://mvpme82.cloud/data/6357b032-c52e-48c8-9123-56c3ddac2376_1774545252238.png";

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

const orderServiceType = (item) =>
  item?.producttitle || item?.bcompanyname || "—";

const orderProgressLine = (item) => {
  const t = getStatusText(item.status);
  if (Number(item.status) === 0) return `${t}（预计2个工作日内完成）`;
  return t;
};

const orderThumbSrc = (item) => {
  const u =
    item?.imageurl ||
    item?.imageUrl ||
    item?.productimg ||
    item?.productimage ||
    item?.coverurl;
  if (u && String(u).trim()) return u;
  return "/static/building.png";
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

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
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

const handleLogout = () => {
  uni.removeStorageSync("userSessionChaoqitong");
  uni.reLaunch({ url: "/pages/login/login" });
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
  background-color: #020713;
}
</style>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: #020713;
  color: #fff;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 导航栏下沿到首卡顶部 ≈ hero高度 + page-inner 的 margin-top（负值） */
.personal-top-hero {
  width: 100%;
  height: 106rpx;
  overflow: hidden;
  line-height: 0;
}

.personal-top-bg {
  width: 100%;
  height: 100%;
  display: block;
}

.page-inner {
  position: relative;
  z-index: 2;
  padding: 0 31rpx;
  padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
  max-width: 750rpx;
  margin: 0 auto;
  /* 106 - 40 = 66rpx，对齐设计稿；仍嫌高可把 height 降到 96 或 margin 调到 -44 */
  margin-top: -40rpx;
}

.g-border {
  box-sizing: border-box;
}

/* 企业卡：描边与圆角由切图承担，外层不再叠渐变/padding 边框 */
.company-card-outer {
  margin-top: 0;
  width: 688rpx;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.company-card-inner {
  position: relative;
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
  padding: 26rpx 24rpx 22rpx;
  box-sizing: border-box;
}

.card-header {
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
  gap: 10rpx;
}

.company-name {
  width: 357rpx;
  max-width: 100%;
  height: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC, -apple-system, sans-serif;
  font-size: 30rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0;
  line-height: 28rpx;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.credit-code {
  width: 473rpx;
  max-width: 100%;
  height: 23rpx;
  font-family: PingFangSC-Light, PingFang SC, -apple-system, sans-serif;
  font-size: 24rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0;
  line-height: 23rpx;
  color: #ffffff;
  opacity: 0.65;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.enterprise-tag-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.enterprise-tag-img {
  width: 150rpx;
  height: 50rpx;
}

.enterprise-tag-fallback {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #e8f2ff;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.25);
}

.divider-h {
  height: 2rpx;
  background: rgba(255, 255, 255, 0.18);
  margin: 18rpx 0 16rpx;
}

.company-info-grid {
  display: flex;
  flex-direction: column;
}

.ci-line {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.ci-item {
  width: 50%;
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
}

.ci-full {
  width: 100%;
}

.ci-label-wrap {
  position: relative;
  width: 115rpx;
  height: 31rpx;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
}

.ci-label-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.ci-label {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  font-size: 20rpx;
  color: #ffffff;
  line-height: 1;
  padding: 0 4rpx;
}

.ci-val {
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

.ci-val.ci-val--style1 {
  font-family: PingFang SC, PingFangSC-Medium, sans-serif;
  font-size: 24rpx;
}

.ci-val.ci-val--style2 {
  font-family: PingFang SC, PingFangSC-Light, sans-serif;
  font-size: 21rpx;
  letter-spacing: 1rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
  margin: 32rpx 0 18rpx;
}

.section-title-bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #80c3f6 0%, #4a8cc4 100%);
}

.section-title--account {
  margin-top: 28rpx;
  margin-bottom: 14rpx;
}

.g-border--account {
  width: 692rpx;
  max-width: 100%;
  margin: 0 auto;
  padding: 2rpx;
  border-radius: 35rpx;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.38) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
}

.account-card-inner {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 165rpx;
  padding: 28rpx 32rpx;
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

.account-avatar {
  position: relative;
  z-index: 1;
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.account-detail {
  margin-left: 28rpx;
  flex: 1;
  min-width: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.account-name {
  font-family: PingFang SC, PingFangSC-Medium, sans-serif;
  font-size: 34rpx;
  font-weight: normal;
  line-height: 51rpx;
  letter-spacing: 0;
  color: #ffffff;
}

.account-role {
  font-family: PingFang SC, PingFangSC-Regular, sans-serif;
  font-size: 22rpx;
  font-weight: normal;
  line-height: 32rpx;
  letter-spacing: 0;
  color: #ffffff;
}

.account-contact-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10rpx 32rpx;
  margin-top: 6rpx;
}

.account-contact-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
  max-width: 100%;
}

.account-contact-item text {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}

.account-contact-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
  opacity: 0.92;
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
  padding: 22rpx 18rpx 24rpx;
  box-sizing: border-box;
  background: rgba(6, 20, 40, 0.94);
}

.order-overview {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

/* 设计稿 .10 尺寸 + 24.png 底图（替代 CSS 渐变） */
.overview-chip {
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

.overview-chip-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.overview-chip .chip-label,
.overview-chip .chip-divider,
.overview-chip .chip-value {
  position: relative;
  z-index: 1;
}

.chip-label {
  font-size: 22rpx;
  color: #b7ab93;
}

.chip-divider {
  width: 72%;
  height: 2rpx;
  background: rgba(183, 171, 147, 0.55);
  margin: 8rpx 0 4rpx;
}

.chip-value {
  font-size: 38rpx;
  font-weight: 700;
}

.chip-serving {
  color: #fdcf82;
}

.chip-done {
  color: #74bea0;
}

.chip-end {
  color: #d27374;
}

/* 设计稿 .23：椭圆外框金色描边（去掉中间深蓝，小程序不用 border-image） */
.tab-bar-shell {
  width: 650rpx;
  max-width: 100%;
  margin: 0 auto 18rpx;
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

.tab-bar {
  display: flex;
  align-items: stretch;
  gap: 10rpx;
  padding: 6rpx 8rpx;
  box-sizing: border-box;
  min-height: 68rpx;
  height: 68rpx;
  border-radius: 34rpx;
  background: rgba(10, 24, 48, 0.94);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 8rpx;
  border-radius: 27rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.tab-item.active {
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
  color: #1a2a3d;
  font-weight: 600;
}

.order-card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 单条订单：底图 + 内容叠层（描边/圆角由切图承担） */
.order-row-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 22rpx;
  box-sizing: border-box;
}

.order-row-item-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.order-row-card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 22rpx;
  padding: 22rpx;
  box-sizing: border-box;
  background: transparent;
}

/* 设计稿 .24：137×137，3rpx 渐变描边 + 内区竖向渐变底（小程序模拟 border-image） */
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

.order-row-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 137rpx;
}

.order-row-text {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

/* 设计稿订单信息块：全文 #ffffff，19rpx / 35rpx */
.order-row-line {
  display: block;
  font-size: 19rpx;
  line-height: 35rpx;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 0;
  word-break: break-all;
}

.order-row-line--status {
  color: #ffffff;
}

/* 查看详情：底图由切图承担，不再叠渐变边框 */
.order-row-btn-wrap {
  position: relative;
  align-self: flex-end;
  margin-top: 12rpx;
  width: 127rpx;
  height: 41rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.order-row-btn-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.order-row-btn {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #ffffff;
  line-height: 1;
  background: transparent;
  box-sizing: border-box;
}

.order-list-empty {
  padding: 36rpx 0 8rpx;
}

.empty-tip {
  text-align: center;
  padding: 32rpx 0;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.4);
}

.logout-btn-wrap {
  margin-top: 36rpx;
  width: 693rpx;
  max-width: 100%;
  height: 78rpx;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  line-height: 0;
}

.logout-btn-img {
  width: 100%;
  height: 100%;
  display: block;
  vertical-align: top;
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
  .order-overview {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
