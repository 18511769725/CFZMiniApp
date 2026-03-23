<template>
  <view class="main-page">
    <!-- 顶部背景区域 -->
    <view class="header-bg">
      <!-- 背景图片 -->
      <image
        class="bg-placeholder"
        src="/static/mainpage_bg0.jpg"
        mode="aspectFill"
      ></image>

      <!-- 平台标题 -->
      <view class="platform-title">
        <text class="title-cn">朝阳企业服务平台</text>
        <text class="title-en">Chaoyang Enterprise Service Platform</text>
      </view>
    </view>

    <!-- 企业信息卡片 -->
    <view class="enterprise-card">
      <view class="enterprise-info">
        <text class="enterprise-name">{{
          state.ccompanyinfo.name || "企业配额总览"
        }}</text>
        <text class="enterprise-tag">{{ companyLevelLabel }}</text>
      </view>
      <view
        style="
          height: 4rpx;
          background-color: rgba(255, 255, 255, 0.2);
          margin: 20rpx 0;
        "
      ></view>

      <!-- 配额配置概览 -->
      <view class="quota-overview">
        <text class="quota-title">配额配置情况与当前使用进度</text>
        <view class="overview-grid">
          <view class="overview-item">
            <text class="overview-label">益企•安居</text>
            <!-- 该位置根据anjuQuotaItems数组里面的对象，如果有对象的type===deduction,则显示标签‘优惠房源’，如果有对象的type===discount，则再显示一个‘补贴房源’的标签，如果两个类型都有则都显示，纵向排列居中。如果anjuQuotaItems数组长度为0，则显示未配置权益 -->
            <text class="overview-value">{{
              state.anjucredits?.anjuContentArray
                ? state.anjucredits.anjuContentArray
                    .map((item) =>
                      item.type === "discount" ? `补贴房源` : `优惠房源`,
                    )
                    .join("\n")
                : "待配置权益"
            }}</text>
          </view>
          <view class="overview-item">
            <text class="overview-label">益企•悦享</text>
            <text class="overview-value">{{
              formatPointsWrape(yuexiangQuota.available)
            }}</text>
          </view>
          <view class="overview-item">
            <text class="overview-label">益企•康护</text>
            <text class="overview-value">{{
              // 如果state.kanghucredits不存在，则返回待配置；如果存在，按照state.kanghucredits.grade的值，为1：钻石级；2：铂金级；3：黄金级；4：白银级。加一个换行符，然后是 支持state.kanghucredits.buyamount人
              state.kanghucredits
                ? `高管医疗\n支持${state.kanghucredits.patchcount || 0}人`
                : "待配置权益"
            }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 益企·安居模块 -->
    <view class="module module-anju">
      <image
        class="module-anju-bg"
        src="/static/mainpage_bg1.jpg"
        mode="aspectFill"
      ></image>
      <view class="module-anju-gradient"></view>

      <view class="module-header">
        <text class="module-title">益企·安居</text>
        <text class="module-tag">{{ anjuStatusText }}</text>
      </view>
      <text class="module-subtitle">住房保障助企安居无忧</text>
      <view
        style="
          height: 4rpx;
          background-color: rgba(255, 255, 255, 0.4);
          margin: 20rpx 0;
        "
      ></view>

      <!-- 优惠房源/补贴房源 -->
      <view
        class="section"
        v-if="anjuQuotaItems.length"
        v-for="item in anjuQuotaItems"
        :key="item.key"
      >
        <view class="section-header">
          <text class="section-title">{{ item.title }}</text>
          <text class="section-tip">{{ item.highlight }}</text>
        </view>
        <view class="data-row">
          <view class="data-item">
            <text class="data-label">支持人数</text>
            <text class="data-value">{{ item.count }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">已使用</text>
            <text class="data-value used">{{ item.used }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">可使用</text>
            <text class="data-value available">{{ item.available }}</text>
          </view>
        </view>
      </view>
      <view v-else class="quota-empty-text">暂无安居配额配置</view>
    </view>

    <!-- 益企·悦享模块 -->
    <view class="module module-yuexiang">
      <image
        class="module-yuexiang-bg"
        src="/static/mainpage_bg2.jpg"
        mode="aspectFill"
      ></image>
      <view class="module-yuexiang-gradient"></view>

      <view class="module-header">
        <text class="module-title">益企·悦享</text>
        <text class="module-tag">{{ yuexiangQuota.statusText }}</text>
      </view>
      <text class="module-subtitle">专属积分悦享朝阳商务资源</text>
      <view
        style="
          height: 4rpx;
          background-color: rgba(255, 255, 255, 0.2);
          margin: 20rpx 0;
        "
      ></view>

      <view class="section">
        <text class="section-title">额度总览</text>
        <view class="data-row">
          <view class="data-item">
            <text class="data-label">总额度</text>
            <text class="data-value">{{ yuexiangQuota.total }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">已使用</text>
            <text class="data-value used">{{ yuexiangQuota.used }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">剩余可用</text>
            <text class="data-value">{{ yuexiangQuota.available }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 益企·康护模块 -->
    <view class="module module-kanghu">
      <image
        class="module-kanghu-bg"
        src="/static/mainpage_bg3.jpg"
        mode="aspectFill"
      ></image>
      <view class="module-kanghu-gradient"></view>

      <view class="module-header">
        <text class="module-title">益企·康护</text>
        <text
          class="quota-section-status"
          :class="
            state.kanghucredits.status === 'USED'
              ? 'status-used'
              : 'status-unused'
          "
        >
          {{ state.kanghucredits.status === "USED" ? "已使用" : "未使用" }}
        </text>
      </view>
      <text class="module-subtitle">可选套餐全心护航健康</text>
      <view
        style="
          height: 4rpx;
          background-color: rgba(255, 255, 255, 0.2);
          margin: 20rpx 0;
        "
      ></view>

      <view class="section">
        <text class="section-title">服务套餐</text>
        <view class="data-row">
          <view class="data-item">
            <text class="data-label">单人额度</text>
            <text class="data-value">{{
              state.kanghucredits.singleprice || "待采购"
            }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">支持人数</text>
            <text class="data-value">{{
              state.kanghucredits.patchcount || "待配置"
            }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">使用状态</text>
            <text
              class="quota-metric-value"
              :class="
                state.kanghucredits.status === 'USED' ? 'warning' : 'success'
              "
            >
              {{ state.kanghucredits.status === "USED" ? "已使用" : "未使用" }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
const state = reactive({
  userinfo: {},
  ccompanyinfo: {},
  anjucredits: {},
  kanghucredits: {},
  creditinfo: {
    totalCredit: 0,
    usedCredit: 0,
    availableCredit: 0,
  },
  feedproductlist: [],
  fagainewslist: [],
});
const iconList = [
  { icon: "/static/images/bg2_0.png", text: "益企安居" },
  { icon: "/static/images/bg2_1.png", text: "益企享悦" },
  { icon: "/static/images/bg2_2.png", text: "益企康护" },
  // { icon: "/static/images/bg2_3.png", text: "评价反馈" },
];
const more = "更多";

const toNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const pickFirstValue = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return "";
};

const pickStringByKeys = (sources, keys) => {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return String(value).trim();
      }
    }
  }
  return "";
};

const pickNumberByKeys = (sources, keys) => {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        return toNumber(value);
      }
    }
  }
  return 0;
};

const normalizeUsageFlag = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      ["1", "true", "used", "done", "completed", "已使用", "已采购"].includes(
        normalized,
      )
    ) {
      return true;
    }
    if (
      ["0", "false", "unused", "pending", "未使用", "未采购"].includes(
        normalized,
      )
    ) {
      return false;
    }
  }
  return false;
};

const formatPoints = (value) => {
  return `${toNumber(value)}积分`;
};
const formatPointsWrape = (value) => {
  return `${toNumber(value)}\n积分`;
};

const digitMap = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

const formatDiscountToChinese = (discountValue) => {
  const value = toNumber(discountValue);
  const safeValue = Math.max(0, Math.min(1, value));
  const scaled = Math.round(safeValue * 100);
  const tens = Math.floor(scaled / 10);
  const ones = scaled % 10;

  if (scaled === 100) return "十折";
  if (ones === 0) return `${digitMap[tens]}折`;
  return `${digitMap[tens]}${digitMap[ones]}折`;
};

const getUsagePercent = (value, total) => {
  const safeTotal = toNumber(total);
  if (safeTotal <= 0) return 0;
  const percent = Math.round((toNumber(value) / safeTotal) * 100);
  return Math.max(0, Math.min(100, percent));
};

// 根据state.ccompanyinfo.grade计算企业等级标签,映射关系如下：1:"总部型"；2：“领军型”；3：“领跑型”；4：“潜力型”
const companyLevelLabel = computed(() => {
  const grade = toNumber(state.ccompanyinfo?.grade);
  switch (grade) {
    case 1:
      return "总部型企业";
    case 2:
      return "领军型企业";
    case 3:
      return "领跑型企业";
    case 4:
      return "潜力型企业";
    default:
      return "企业等级待确认";
  }
});

const anjuQuotaItems = computed(() => {
  const quotaList = Array.isArray(state.anjucredits?.anjuContentArray)
    ? state.anjucredits.anjuContentArray
    : [];

  return quotaList.map((item, index) => {
    const type = item?.type === "discount" ? "discount" : "deduction";
    const count = toNumber(item?.count);
    const used =
      type === "discount"
        ? toNumber(item?.discountCount ?? state.anjucredits?.discountCount)
        : toNumber(item?.deductionCount ?? state.anjucredits?.deductionCount);
    const available = Math.max(0, count - used);
    const highlight =
      type === "discount"
        ? `${formatDiscountToChinese(item?.discount)} · 最高${formatPoints(item?.limit)}`
        : `最高${formatPoints(item?.quota)}`;

    return {
      key: `${type}-${index}`,
      title: type === "discount" ? "补贴房源" : "优惠房源",
      highlight,
      count,
      used,
      available,
    };
  });
});

const anjuStatusText = computed(() => {
  if (!anjuQuotaItems.value.length) {
    return "待配置";
  }
  const availableCount = anjuQuotaItems.value.reduce(
    (sum, item) => sum + item.available,
    0,
  );
  return `可用${availableCount}人`;
});

const yuexiangQuota = computed(() => {
  const total = pickNumberByKeys(
    [state.creditinfo],
    [
      "yuexiangTotalCredit",
      "yuexiangtotalcredit",
      "enjoyTotalCredit",
      "enjoytotalcredit",
      "totalCredit",
      "totalcredit",
      "totalQuota",
    ],
  );
  const used = pickNumberByKeys(
    [state.creditinfo],
    [
      "yuexiangUsedCredit",
      "yuexiangusedcredit",
      "enjoyUsedCredit",
      "enjoyusedcredit",
      "usedCredit",
      "usedcredit",
      "usedQuota",
    ],
  );
  const availableFromField = pickNumberByKeys(
    [state.creditinfo],
    [
      "yuexiangAvailableCredit",
      "yuexiangavailablecredit",
      "enjoyAvailableCredit",
      "enjoyavailablecredit",
      "availableCredit",
      "availablecredit",
      "availableQuota",
    ],
  );
  const hasAvailableField =
    state.creditinfo?.yuexiangAvailableCredit !== undefined ||
    state.creditinfo?.yuexiangavailablecredit !== undefined ||
    state.creditinfo?.enjoyAvailableCredit !== undefined ||
    state.creditinfo?.enjoyavailablecredit !== undefined ||
    state.creditinfo?.availableCredit !== undefined ||
    state.creditinfo?.availablecredit !== undefined ||
    state.creditinfo?.availableQuota !== undefined;
  const available = hasAvailableField
    ? availableFromField
    : Math.max(0, total - used);

  return {
    total,
    used,
    available,
    statusText: total > 0 ? `已用${getUsagePercent(used, total)}%` : "待配置",
  };
});

const hasConfig = !!state.kanghucredits;
const packageName = "康护套餐";

const handleServiceClick = (index) => {
  uni.setStorage({
    key: "mallTabIndex",
    data: index,
    success: () => {
      uni.switchTab({
        url: `/pages/mall/mall`,
      });
    },
    fail: () => {
      uni.showToast({ title: "跳转失败，请重试", icon: "none" });
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
        //getfeedproductlist(state.ccompanyinfo.id);
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

const getAnjuCreditStatus = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getanjucreditstatusbyccompanyid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.anjucredits = res.data.data?.[0] || {};
      } else {
        state.anjucredits = {};
      }
    },
    fail: () => {
      state.anjucredits = {};
    },
  });
};
const getKanghuCreditStatus = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getkanghucreditstatusbyccompanyid",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.kanghucredits = res.data.data?.[0] || {};
      } else {
        state.kanghucredits = {};
      }
    },
    fail: () => {
      state.kanghucredits = {};
    },
  });
};

const getNewsList = () => {
  let payload = {};
  uni.request({
    url: "https://mvpme82.cloud/api/getnewslistforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      if (res && res.data && res.data.retcode === "200" && res.data.data) {
        state.fagainewslist = res.data.data;
      } else {
      }
    },
    fail: (err) => {},
  });
};

const getfeedproductlist = (ccompanyid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getfeedproductlistforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { ccompanyid },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.feedproductlist = res.data.data;
      } else {
        uni.showToast({
          title: "获取产品列表失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "获取产品列表请求失败！",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

const handlePackageClick = (productId) => {
  // 跳转商品详情页，传递商品id（页面路径需根据实际目录调整）
  uni.navigateTo({
    url: `/pages/product/product-detail?id=${productId}`,
  });
};

const progressWidth = computed(() => {
  return `${Math.max(0, 100 - getUsagePercent(yuexiangQuota.value.used, yuexiangQuota.value.total))}%`;
});

// 打开一个url页面
const handleDescClick = (url) => {
  if (url) {
    uni.navigateTo({
      url: `/pages/webview/webview?targetUrl=${encodeURIComponent(url)}`,
    });
  } else {
    uni.showToast({ title: "链接地址异常", icon: "none" });
  }
};

// 页面加载时初始化
onLoad(() => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getccompanyinfo(state.userinfo.id);
        if (state.userinfo.ccompanyid) {
          getAnjuCreditStatus(state.userinfo.ccompanyid);
          getKanghuCreditStatus(state.userinfo.ccompanyid);
        }
        //getNewsList();
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

<style>
.main-page {
  background-color: #0a1a3a;
  min-height: 100vh;
  color: #fff;
  padding-bottom: 30rpx;
}

/* 顶部背景区域 */
.header-bg {
  position: relative;
  padding: 40rpx 30rpx 20rpx;
  height: 460rpx;
}
.bg-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.3;
}
.platform-title {
  text-align: center;
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
  margin-top: 140rpx;
}
.title-cn {
  display: block;
  font-size: 48rpx;
  font-weight: 500;
}
.title-en {
  display: block;
  font-size: 28rpx;
  opacity: 0.8;
  margin-top: 8rpx;
}

/* 企业信息卡片 - 静态银边亮光效果 */
.enterprise-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx;
  backdrop-filter: blur(10rpx);
  position: relative;
  z-index: 1;
  margin: -60rpx 30rpx 20rpx 30rpx;

  /* ========== 静态银边亮光核心 ========== */
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 0 4rpx rgba(255, 255, 255, 0.6),
    0 0 12rpx rgba(190, 210, 255, 0.35),
    0 0 24rpx rgba(170, 190, 255, 0.2);
}
.enterprise-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.enterprise-name {
  font-size: 36rpx;
  font-weight: 500;
}
.enterprise-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  background: rgba(100, 149, 237, 0.3);
  border-radius: 20rpx;
}
.enterprise-desc {
  font-size: 28rpx;
  opacity: 0.7;
  margin-bottom: 24rpx;
}

.overview-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
  margin-bottom: 20rpx;
  margin-top: 15rpx;
}

.overview-item {
  background: linear-gradient(
    180deg,
    rgba(18, 47, 77, 0.18) 0%,
    rgba(24, 54, 88, 0.12) 100%
  );
  border: 1rpx solid rgba(212, 228, 245, 0.16);
  border-radius: 18rpx;
  padding: 16rpx 18rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.overview-label {
  text-align: center;
  font-size: 21rpx;
  color: rgba(219, 236, 255, 0.82);
  position: relative;
}

.overview-label::after {
  content: "";
  position: absolute;
  bottom: -12rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1rpx;
}

.overview-value {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(6, 20, 46, 0.52);
}

.quota-title {
  font-size: 28rpx;
  opacity: 0.8;
  margin-bottom: 20rpx;
}
.quota-items {
  display: flex;
  justify-content: space-between;
}
.quota-item {
  flex: 1;
  text-align: center;
}
.quota-label {
  font-size: 26rpx;
  opacity: 0.9;
  display: block;
  margin-bottom: 12rpx;
}
.quota-desc {
  font-size: 28rpx;
  display: block;
  line-height: 1.5;
}
.quota-value {
  font-size: 36rpx;
  font-weight: 500;
}
.quota-unit {
  font-size: 24rpx;
  opacity: 0.8;
}

/* 通用模块样式 */
.module {
  margin: 20rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  position: relative;
  overflow: hidden;
}
.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.module-title {
  font-size: 40rpx;
  font-weight: 500;
}
.module-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
.module-subtitle {
  font-size: 28rpx;
  opacity: 0.8;
  margin-bottom: 24rpx;
}
.section {
  margin-bottom: 24rpx;
}
.section:last-child {
  margin-bottom: 0;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.section-title {
  font-size: 32rpx;
}
.section-tip {
  font-size: 24rpx;
  opacity: 0.7;
}
.data-row {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 20rpx;
}
.data-item {
  flex: 1;
  text-align: center;
}
.data-item:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}
.data-label {
  font-size: 24rpx;
  opacity: 0.7;
  display: block;
  margin-bottom: 8rpx;
}
.data-value {
  font-size: 36rpx;
  font-weight: 500;
}
.data-value.used {
  color: #e6a8b8;
}
.data-value.available {
  color: #87e8de;
}

/* 模块差异化样式 */
.module-anju {
  background: linear-gradient(
    135deg,
    rgba(65, 105, 225, 0.3),
    rgba(30, 144, 255, 0.2)
  );
  z-index: 1;
}

.module-anju-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.4;
}

.module-anju-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(65, 105, 225, 0.1) 0%,
    rgba(30, 144, 255, 0.1) 50%,
    rgba(21, 60, 94, 0.9) 100%
  );
  z-index: 1;
}

.module-anju .module-header,
.module-anju .module-subtitle,
.module-anju .section {
  position: relative;
  z-index: 2;
}

.module-anju .module-tag {
  background: rgba(30, 144, 255, 0.4);
}

.module-yuexiang {
  background: linear-gradient(
    135deg,
    rgba(139, 69, 19, 0.3),
    rgba(205, 133, 63, 0.2)
  );
  position: relative;
  z-index: 1;
}

.module-yuexiang-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.4;
}

.module-yuexiang-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(139, 69, 19, 0.1) 0%,
    rgba(205, 133, 63, 0.1) 50%,
    #28153a 100%
  );
  z-index: 1;
}

.module-yuexiang .module-header,
.module-yuexiang .module-subtitle,
.module-yuexiang .section {
  position: relative;
  z-index: 2;
}

.module-yuexiang .module-tag {
  background: rgba(205, 133, 63, 0.4);
}

.module-kanghu {
  background: linear-gradient(
    135deg,
    rgba(72, 209, 204, 0.3),
    rgba(95, 158, 160, 0.2)
  );
  position: relative;
  z-index: 1;
  margin-bottom: 50rpx; /* 默认 module 20rpx + 额外 30rpx */
}

.module-kanghu-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.4;
}

.module-kanghu-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(72, 209, 204, 0.1) 0%,
    rgba(95, 158, 160, 0.1) 50%,
    #082b34 100%
  );
  z-index: 1;
}

.module-kanghu .module-header,
.module-kanghu .module-subtitle,
.module-kanghu .section {
  position: relative;
  z-index: 2;
}

.module-kanghu .module-tag {
  background: rgba(95, 158, 160, 0.4);
}

.quota-empty-text {
  font-size: 24rpx;
  color: rgba(213, 231, 252, 0.88);
}

.quota-section-status {
  flex-shrink: 0;
  min-width: 110rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  font-size: 21rpx;
  font-weight: 600;
  text-align: center;
  color: var(--biz-primary);
  background: rgba(226, 236, 246, 0.92);
  border: 1rpx solid rgba(190, 207, 224, 0.9);
}

.status-used {
  color: #9a3a00;
}

.status-unused {
  color: #0b7f5c;
}

.quota-metric-value {
  font-size: 33rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  text-shadow: 0 3rpx 8rpx rgba(6, 22, 48, 0.56);
}

.quota-metric-unit {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: rgba(205, 226, 250, 0.82);
}

.quota-metric-value.warning {
  color: #ffdf9f;
}

.quota-metric-value.success {
  color: #b8ffd9;
}
</style>
