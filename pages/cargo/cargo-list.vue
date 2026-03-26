<template>
  <view class="cargo-list-page">
    <!-- 滚动容器（购物车列表/空页面） -->
    <scroll-view
      scroll-y
      class="scroll-container"
      refresher-enabled="true"
      @refresherrefresh="onPullDownRefresh"
      refresher-triggered="refreshing"
    >
      <!-- 购物车为空状态 -->
      <view
        v-if="state.cargoList.length === 0 && !refreshing"
        class="cargo-empty"
      >
        <image
          class="empty-img"
          src="/static/images/empty-cargo.png"
          mode="aspectFit"
        ></image>
        <view class="empty-tip">购物车空空如也~</view>
      </view>

      <!-- 购物车列表 -->
      <view v-else class="cargo-list">
        <cargo-item
          v-for="(item, index) in state.cargoList"
          :key="item.id"
          class="cargo-list-item"
          :is-last="index === state.cargoList.length - 1"
          :cargo="item"
          v-model:checked="item.checked"
          @checkChange="handleCargoCheckChange"
          @cargoDelete="handleCargoDelete"
          @amountChange="handleCargoAmountChange"
        ></cargo-item>
      </view>
    </scroll-view>

    <!-- 底栏 .23-4：750×108，1rpx 渐变描边 0deg；底用 rgba 模拟 opacity 0.83，避免压暗文字 -->
    <view v-if="state.cargoList.length > 0" class="bottom-dock">
      <view class="bottom-bar">
        <view class="bottom-bar-inner">
        <view class="bottom-select-all" @click="toggleSelectAll">
          <view class="select-all-check">
            <view
              class="select-all-check-inner"
              :class="{ 'select-all-check-inner--on': isAllSelected }"
            >
              <uni-icons
                v-if="isAllSelected"
                type="checkmarkempty"
                size="14"
                color="#020713"
              ></uni-icons>
            </view>
          </view>
          <text class="select-all-text">全选</text>
        </view>
        <view class="bottom-total-wrap">
          <text class="total-label">总积分：</text>
          <text class="total-value">{{ totalPrice }}积分</text>
        </view>
        <button class="create-order-btn" @click="handleCreateOrder">
          发起订单
        </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, reactive, nextTick } from "vue";
import cargoItem from "./components/cargo-item.vue";
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";

const CARGO_NAV_BG = "#F8F8F8";
/* 页面与滚动空白区；列表块底与条目 .34 一致 rgba(48,83,156,.14) */
const CARGO_PAGE_BG = "#020713";

const applyCargoNavBarStyle = () => {
  try {
    uni.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: CARGO_NAV_BG,
    });
    // #ifdef MP-WEIXIN
    uni.setBackgroundColor({
      backgroundColor: CARGO_PAGE_BG,
      backgroundColorTop: CARGO_PAGE_BG,
      backgroundColorBottom: CARGO_PAGE_BG,
    });
    // #endif
  } catch (e) {
    /* ignore */
  }
};

const scheduleCargoNavBarStyle = () => {
  nextTick(() => applyCargoNavBarStyle());
};

const state = reactive({
  userinfo: {},
  cargoList: [],
});

// 购物车列表数据
const cargoList = ref([]);
// 下拉刷新状态
const refreshing = ref(false);
// 总价
const totalPrice = ref("0.00");

// 格式化价格（保留2位小数）
const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) return "0.00";
  return price.toFixed(2);
};

// 计算单个购物车商品的总价（用于统计全局总价）
const calculateSingleCargoPrice = (cargo) => {
  const { productInfo, buyamount = 1 } = cargo;
  const { packageinfo, status } = productInfo;
  // 禁用商品不参与总价计算
  if (status === "disable") return 0;

  const { pricetype, pricefactor, originalprice } = productInfo;
  const priceType = parseInt(pricetype, 10) || 0;
  const amount = parseInt(buyamount, 10) || 1;

  switch (priceType) {
    case 0:
      return (originalprice || 0) * (pricefactor || 0) * amount;
    case 1:
      return (pricefactor || 0) * amount;
    case 2:
      try {
        const packageData = JSON.parse(packageinfo || "{}");
        const packageValue = parseFloat(packageData.value) || 0;
        return packageValue * amount;
      } catch (error) {
        return 0;
      }
    default:
      return 0;
  }
};

// 计算选中商品的总价
const calculateTotalPrice = () => {
  let total = 0;
  state.cargoList.forEach((item) => {
    if (item.checked && item.productInfo.status !== "disable") {
      total += calculateSingleCargoPrice(item);
    }
  });
  totalPrice.value = formatPrice(total);
};

// 全选状态（计算属性：判断所有可用商品是否都被选中）
const isAllSelected = computed(() => {
  const availableCargo = state.cargoList.filter(
    (item) => item.status !== "disable",
  );
  if (availableCargo.length === 0) return false;
  return availableCargo.every((item) => item.checked === true);
});

// 加载购物车数据
const getCargoInfo = (userId) => {
  refreshing.value = true;
  let payload = {
    cuserid: userId,
  };
  uni.request({
    url: "https://mvpme82.cloud/api/getcargoinfoforminiapp", // 目标接口地址
    method: "POST", // 接口请求方式（默认POST，若接口要求GET可修改）
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      refreshing.value = false;
      uni.stopPullDownRefresh();
      // 接口返回格式：retcode=200 为成功
      if (res && res.data && res.data.retcode === "200") {
        // 获取数据成功：处理返回的数据
        state.cargoList = res.data.data.map((item) => ({
          productInfo: item,
          buyamount: item.buyamount || 1,
          checked: false, // 初始化勾选状态为未选中
        }));
        console.info("state.cargoList", state.cargoList);
        // 重新计算总价
        calculateTotalPrice();
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "加载购物车数据失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      refreshing.value = false;
      uni.stopPullDownRefresh();
      console.error("加载购物车数据失败：", err);
      uni.showToast({ title: "加载购物车数据失败", icon: "none" });
    },
  });
};

// 下拉刷新重新加载购物车
const onPullDownRefresh = () => {
  if (state.userinfo && state.userinfo.id) {
    getCargoInfo(state.userinfo.id);
  } else {
    refreshing.value = false;
    uni.stopPullDownRefresh();
  }
};

// 单个购物车商品勾选状态变更
const handleCargoCheckChange = () => {
  // 重新计算总价
  calculateTotalPrice();
};

// 修改数据库中购物车商品数量的函数
const handleCargoDelete = (cargoId) => {
  let payload = {
    cargoid: cargoId,
  };
  uni.request({
    url: "https://mvpme82.cloud/api/deletecargorecord", // 目标接口地址
    method: "POST", // 接口请求方式（默认POST，若接口要求GET可修改）
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      // 接口返回格式：retcode=200 为成功
      if (res && res.data && res.data.retcode === "200") {
        getCargoInfo(state.userinfo.id);
        // 重新计算总价
        calculateTotalPrice();
        uni.showToast({ title: "商品已从购物车删除", icon: "success" });
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "更新购物车商品数量失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      console.error("更新购物车商品数量失败：", err);
      uni.showToast({ title: "更新购物车商品数量失败", icon: "none" });
    },
  });
};

// 修改数据库中购物车商品数量的函数
const reviseCargoAmountByID = (cargoId, newAmount) => {
  let payload = {
    cargoid: cargoId,
    buyamount: newAmount,
  };
  uni.request({
    url: "https://mvpme82.cloud/api/updatecargobuyamount", // 目标接口地址
    method: "POST", // 接口请求方式（默认POST，若接口要求GET可修改）
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      // 接口返回格式：retcode=200 为成功
      if (res && res.data && res.data.retcode === "200") {
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "更新购物车商品数量失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      console.error("更新购物车商品数量失败：", err);
      uni.showToast({ title: "更新购物车商品数量失败", icon: "none" });
    },
  });
};

// 处理购物车商品数量变更
const handleCargoAmountChange = (data) => {
  const { cargoId, buyamount } = data;
  reviseCargoAmountByID(cargoId, buyamount);
  // 找到对应商品并更新数量
  const targetCargo = state.cargoList.find(
    (item) => item.productInfo.id === cargoId,
  );
  if (targetCargo) {
    targetCargo.buyamount = buyamount;
    // 若该商品已勾选，重新计算总价
    if (targetCargo.checked) {
      calculateTotalPrice();
    }
  }
};

// 切换全选/取消全选
const toggleSelectAll = () => {
  const isAllCheck = isAllSelected.value;
  // 批量修改所有可用商品的勾选状态（禁用商品跳过）
  state.cargoList = state.cargoList.map((item) => {
    if (item.status === "disable") {
      return item;
    }
    return {
      ...item,
      checked: !isAllCheck,
    };
  });
  // 重新计算总价
  calculateTotalPrice();
};

// 发起订单
const handleCreateOrder = async () => {
  // 筛选选中的可用商品
  const selectedCargo = state.cargoList.filter(
    (item) => item.checked && item.status !== "disable",
  );
  if (selectedCargo.length === 0) {
    uni.showToast({ title: "请先选择要下单的商品", icon: "none" });
    return;
  }

  let data = [];
  for (let i = 0; i < selectedCargo.length; i++) {
    data.push(selectedCargo[i].productInfo.id);
  }
  let payload = {
    cargoids: data,
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
  };
  console.info("payload", payload);

  // 调用createorderfromminiapp接口
  uni.request({
    url: "https://mvpme82.cloud/api/createorderfromminiapp", // 目标接口地址
    method: "POST", // 接口请求方式（默认POST，若接口要求GET可修改）
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      // 接口返回格式：retcode=200 为成功
      if (res && res.data && res.data.retcode === "200") {
        uni.showToast({
          title: "订单已创建，请前往订单页面查看",
          icon: "success",
        });
        // 跳转到订单页面
        setTimeout(() => {
          uni.switchTab({ url: "/pages/order/order-list" });
        }, 1500);
        getCargoInfo(state.userinfo.id);
        calculateTotalPrice();
      } else {
        uni.showToast({
          title: res.data?.str_err_code || "创建订单失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      console.error("创建订单失败：", err);
      uni.showToast({ title: "创建订单失败", icon: "none" });
    },
  });
};

// 监听购物车列表变化，同步更新总价（兜底）
watch(
  state.cargoList,
  () => {
    calculateTotalPrice();
  },
  { deep: true },
);

onReady(() => {
  scheduleCargoNavBarStyle();
});

// 页面加载时初始化
onLoad(() => {
  scheduleCargoNavBarStyle();
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getCargoInfo(state.userinfo.id);
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
  scheduleCargoNavBarStyle();
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id) {
        getCargoInfo(state.userinfo.id);
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

<style scoped>
/* 整页原色 #020713；有内容的列表块为 rgba(48,83,156,.14) */
.cargo-list-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #020713;
  box-sizing: border-box;
}

.scroll-container {
  flex: 1;
  height: 0;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #020713;
  /* 仅预留自定义底栏高度；tab 页勿再加 safe-area，否则会与原生 tabBar 之间出现黑缝 */
  padding-bottom: 108rpx;
}

/* 购物车为空 */
.cargo-empty {
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  box-sizing: border-box;
}

.empty-img {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 40rpx;
  opacity: 0.85;
}

.empty-tip {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.45);
}

/* 列表区含条目间距：与稿 .34 条同色 rgba(48,83,156,.14)，间隔区与条连续 */
.cargo-list {
  width: 100%;
 /* padding: 0 0 24rpx; */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: rgba(48, 83, 156, 0.14);
}

/* 吸底：贴紧原生 tabBar 上沿；底栏安全区由系统 tabBar 承担，此处再加 inset 会挤出可视缝隙 */
.bottom-dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  padding-bottom: 0;
  box-sizing: border-box;
}

/*
 * 稿 .23-4：750×108；描边 linear-gradient 0deg（稿为 border-image；各端用双背景实现「仅边框渐变」）
 * opacity 0.83 → 内区底色 rgba(2,7,19,0.83)，勿对整栏设 opacity 以免压暗文案
 */
.bottom-bar {
  width: 750rpx;
  max-width: 100%;
  height: 108rpx;
  margin: 0 auto;
  padding: 1rpx;
  box-sizing: border-box;
  border: none;
  	border-style: solid;
  	border-width: 1rpx;
  	border-image-source: linear-gradient(0deg, 
  		#faebcc 0%, 
  		#1e4e97 53%, 
  		#ddb877 100%);
  	border-image-slice: 1;
  	opacity: 0.83;
}

.bottom-bar-inner {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-sizing: border-box;
  background: transparent;
}

.bottom-select-all {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
}

/* 勾选：36×37，描边渐变 0° #faebcc → #ddb877 */
.select-all-check {
  width: 36rpx;
  height: 37rpx;
  border-radius: 50%;
  padding: 1rpx;
  box-sizing: border-box;
  background: linear-gradient(0deg, #faebcc 0%, #ddb877 100%);
  margin-right: 12rpx;
}

.select-all-check-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(2, 7, 19, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-all-check-inner--on {
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
}

.select-all-text {
  font-size: 28rpx;
  color: #ffffff;
}

.bottom-total-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  padding: 0 12rpx;
}

.total-label {
  font-size: 26rpx;
  color: #ffffff;
}

.total-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #e8c87c;
}

/* 发起订单：230×63；文案 PingFangSC-Medium 34rpx #061730 */
.create-order-btn {
  flex-shrink: 0;
  width: 230rpx;
  height: 63rpx;
  line-height: 63rpx;
  padding: 0;
  margin: 0;
  font-family:
    PingFang SC,
    PingFangSC-Medium,
    -apple-system,
    sans-serif;
  font-size: 34rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0;
  color: #061730;
  border: none;
  border-radius: 32rpx;
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
  box-sizing: border-box;
}

.create-order-btn::after {
  border: none;
}
</style>
