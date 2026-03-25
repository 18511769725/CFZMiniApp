<template>
  <view class="container">
    <view class="card company-card">
      <view class="company-header">
        <text class="company-name">{{ data.company.name }}</text>
        <view class="enterprise-tag">
          <image
            v-if="companyLevelLabel"
            class="enterprise-tag-icon"
            :src="companyLevelLabel"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <view class="code">统一社会信用代码：{{ data.company.code }}</view>
      <view class="divider"></view>
      <view class="info-grid">
        <view class="info-line">
          <view class="info-item">
            <view class="label"><text>企业联系人</text></view>
            <text class="val">{{ data.company.contact }}</text>
          </view>
          <view class="info-item">
            <view class="label"><text>手机号码</text></view>
            <text class="val">{{ data.company.phone }}</text>
          </view>
        </view>
        <view class="info-line">
          <view class="info-item" style="width: 100%">
            <view class="label"><text>职位信息</text></view>
            <text class="val">{{ data.company.position }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section-title">当前账户信息</view>
    <view class="card account-card">
      <image
        class="avatar"
        :src="data.account.avatar"
        mode="aspectFill"
      ></image>
      <view class="account-detail">
        <view class="name-row">
          <text class="name">{{ data.account.name }}</text>
          <text class="role">{{ data.account.role }}</text>
        </view>
        <view class="contact-row">
          <view class="contact-item">
            <image
              class="contact-icon"
              src="/static/personal/phone.png"
              mode="aspectFit"
            />
            <text>{{ data.account.phone }}</text>
          </view>
          <view class="contact-item" style="margin-left: 30rpx">
            <image
              class="contact-icon"
              src="/static/personal/email.png"
              mode="aspectFit"
            />
            <text>{{ data.account.email }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section-title">服务清单</view>

    <view class="card order-card">
      <view class="stats-grid">
        <view class="stat-box">
          <text class="stat-label">服务中</text>
          <view class="stat-divider"></view>
          <text class="stat-count" style="color: #fdcf82">{{
            data.stats[0].count
          }}</text>
        </view>
        <view class="stat-box">
          <text class="stat-label">服务完成</text>
          <view class="stat-divider"></view>
          <text class="stat-count" style="color: #74bea0">{{
            data.stats[1].count
          }}</text>
        </view>
        <view class="stat-box">
          <text class="stat-label">已终止</text>
          <view class="stat-divider"></view>
          <text class="stat-count" style="color: #d27374">{{
            data.stats[2].count
          }}</text>
        </view>
      </view>
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
      <view class="order-content">
        <image
          class="order-img"
          :src="data.order.image"
          mode="aspectFill"
        ></image>
        <view class="order-info">
          <view class="order-row">订单编号：{{ data.order.id }}</view>
          <view class="order-row">服务类型：{{ data.order.type }}</view>
          <view class="order-row status"
            >进度状态：{{ data.order.status }}</view
          >
          <button class="detail-btn">查看详情</button>
        </view>
      </view>
    </view>

    <view class="section-title">我的功能</view>
    <view class="card function-card">
      <view v-for="fn in data.functions" :key="fn.name" class="fn-item">
        <view class="fn-icon">📍</view> <text>{{ fn.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

const data = reactive({
  company: {
    name: "北京中科智城科技有限公司",
    code: "91110105MA00XXXXXX",
    contact: "张 明",
    phone: "138****1234",
    position: "企业服务对接专员",
    tag: "总部型企业",
  },
  account: {
    name: "张 明",
    role: "企业服务对接专员",
    phone: "138****1234",
    email: "38576268@qq.com",
    avatar: "/static/personal/head.png", // 指定头像文件地址
  },
  stats: [
    { label: "服务中", count: 0 },
    { label: "服务完成", count: 0 },
    { label: "已终止", count: 0 },
  ],
  order: {
    id: "CYQY20240521001",
    type: "益企 · 安居—昆泰公寓优惠房源申请",
    status: "资料审核中 (预计2个工作日内完成)",
    image: "/static/building.png",
  },
  functions: [
    { name: "消息通知", icon: "notification" },
    { name: "评价反馈", icon: "feedback" },
    { name: "退出登录", icon: "logout" },
  ],
});

// 标签页数据
const tabs = ref([
  { id: 1, label: "服务中" },
  { id: 2, label: "服务完成" },
  { id: 3, label: "已终止" },
]);

// 当前活跃的tab ID
const activeTabId = ref(1);

// 切换tab
const switchTab = (tabId) => {
  activeTabId.value = tabId;
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

// 激活的Tab标签
const activeTab = ref("serving");

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

<style lang="scss">
.container {
  min-height: 100vh;
  background:
    url("https://mvpme82.cloud/data/9b82d795-9982-4e39-aa73-2138868cf6b3_1774399232772.jpg")
      no-repeat top center,
    linear-gradient(180deg, #0a1931 0%, #162a4d 100%);
  background-size:
    100% auto,
    auto;
  padding: 20rpx 30rpx;
  color: #fff;
}

.header-title {
  text-align: center;
  font-size: 34rpx;
  padding: 40rpx 0;
}

.section-title {
  font-size: 32rpx;
  margin: 30rpx 0 20rpx;
  font-weight: bold;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20rpx;
}

.company-card {
  margin-top: 40rpx;
  background: rgba(49, 69, 107, 0.73); /* #31456b 73% */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 调整边框更清晰 */
  .company-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .company-name {
      font-size: 32rpx;
      font-weight: 400;
    }
    .enterprise-tag {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 94rpx;
      min-height: 40rpx;
      padding: 0;
      background: transparent;
      border-radius: 0;
    }
    .enterprise-tag-icon {
      width: 150rpx;
      height: 50rpx;
      object-fit: contain;
    }
  }
  .divider {
    height: 2rpx;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 20rpx 0;
  }
  .code {
    font-size: 24rpx;
    color: #b0adad;
    margin: 10rpx 0 30rpx;
  }
  .info-grid {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .info-line {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .info-item {
        width: 50%;
        margin-bottom: 15rpx;
        display: flex;
        align-items: center;
        .label {
          font-size: 22rpx;
          color: #e6e7e7;
          background-color: #3e5b8a;
          padding: 4rpx 10rpx;
          border-radius: 4rpx;
          width: 120rpx;
          text-align: center;
          flex-shrink: 0;
        }
        .val {
          font-size: 26rpx;
          margin-left: 12rpx;
        }
      }
    }
  }
}

.account-card {
  display: flex;
  align-items: center;
  background-image: url("https://mvpme82.cloud/data/0230c28f-a692-40b0-b5d8-7ab5b7a824ae_1774405848969.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20rpx;
  border-radius: 20rpx;
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #eee;
    margin-left: 20rpx;
  }
  .account-detail {
    margin-left: 20rpx;
    .name-row {
      display: flex;
      flex-direction: column;
      .name {
        font-size: 32rpx;
        font-weight: bold;
        margin-right: 15rpx;
      }
      .role {
        font-size: 24rpx;
        color: #ccc;
        margin-top: 15rpx;
      }
    }
    .contact-row {
      font-size: 22rpx;
      color: #f7f6f6;
      margin-top: 15rpx;
      display: flex;
      align-items: center;
      .contact-item {
        display: flex;
        align-items: center;
        gap: 6rpx;
      }
      .contact-icon {
        width: 25rpx;
        height: 25rpx;
      }
    }
  }
}

.stats-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .stat-box {
    background: rgba(255, 255, 255, 0.05);
    width: 31%;
    height: 140rpx;
    border-radius: 15rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2rpx solid #d4af37;
    .stat-label {
      font-size: 24rpx;
      color: #b7ab93;
    }
    .stat-divider {
      width: 80%;
      height: 2rpx;
      background-color: #b7ab93;
      margin: 10rpx 0;
      border-radius: 1rpx;
    }
    .stat-count {
      font-size: 40rpx;
      font-weight: bold;
      margin-top: 10rpx;
      color: #4dbd71;
    }
  }
}

.tab-scroll {
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0);
  width: 100%;
  text-align: center;
  padding: 20rpx 0;
}

.tab-container {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10rpx;
  padding: 10rpx 15rpx;
  border: 3rpx solid #d4a574;
  border-radius: 50rpx;
  background-color: #3d597e;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    border-radius: 50rpx;
    color: rgba(255, 255, 255, 0.959);
    font-size: 32rpx;
    white-space: nowrap;
    transition: all 0.3s ease;

    &.active {
      background: linear-gradient(135deg, #f3cb9f 0%, #c9945f 100%);
      border: 2rpx solid #e98a24;
      color: #1a3a52;
      font-weight: 600;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

.order-content {
  display: flex;
  gap: 20rpx;
  .order-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 10rpx;
  }
  .order-info {
    flex: 1;
    font-size: 22rpx;
    .order-row {
      margin-bottom: 8rpx;
      color: #ccc;
    }
    .status {
      color: #88b0ff;
    }
    .detail-btn {
      margin-top: 10rpx;
      float: right;
      font-size: 20rpx;
      padding: 0 20rpx;
      height: 44rpx;
      line-height: 44rpx;
      background: transparent;
      border: 1px solid #556b8d;
      color: #fff;
      border-radius: 22rpx;
    }
  }
}

.function-card {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 0;
  .fn-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    .fn-icon {
      font-size: 40rpx;
      margin-bottom: 15rpx;
    }
  }
}
</style>
