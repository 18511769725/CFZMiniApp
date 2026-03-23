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
          :cargo="item"
          v-model:checked="item.checked"
          @checkChange="handleCargoCheckChange"
          @cargoDelete="handleCargoDelete"
          @amountChange="handleCargoAmountChange"
        ></cargo-item>
      </view>
    </scroll-view>

    <!-- 底部吸底操作栏（仅购物车非空时显示） -->
    <view v-if="state.cargoList.length > 0" class="bottom-bar">
      <!-- 左侧全选 -->
      <view class="bottom-select-all" @click="toggleSelectAll">
        <view
          class="select-all-check"
          :class="{ 'cargo-check-active': isAllSelected }"
        >
          <uni-icons
            v-if="isAllSelected"
            type="checkmarkempty"
            size="16"
            color="#ffffff"
          ></uni-icons>
        </view>
        <view class="select-all-text">全选</view>
      </view>

      <!-- 右侧总价 + 发起订单 -->
      <view class="bottom-order">
        <view class="total-price">
          总积分：<span class="total-price-value">{{ totalPrice }}积分</span>
        </view>
        <button class="create-order-btn" @click="handleCreateOrder">
          发起订单
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
// 引入购物车卡片组件
import cargoItem from "./components/cargo-item.vue";
// 引入uni-ui组件
//import { UniIcons, onLoad } from '@dcloudio/uni-ui';
import { onLoad, onShow } from "@dcloudio/uni-app";

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

// 页面加载时初始化
onLoad(() => {
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
.cargo-list-page {
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
}

.scroll-container {
  width: 100%;
  height: 100%;
}

/* 购物车为空样式 */
.cargo-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 rpx;
}

.empty-img {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 40rpx;
}

.empty-tip {
  font-size: 28rpx;
  color: #999999;
}

/* 购物车列表 */
.cargo-list {
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 100rpx; /* 预留底部操作栏空间 */
}

/* 底部吸底操作栏 */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 98rpx;
  background-color: #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-sizing: border-box;
  z-index: 99;
}

/* 左侧全选 */
.bottom-select-all {
  display: flex;
  align-items: center;
}

.select-all-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  margin-right: 16rpx;
}

.select-all-text {
  font-size: 28rpx;
  color: #ffffff;
}

/* 右侧总价 + 发起订单 */
.bottom-order {
  display: flex;
  align-items: center;
}

.total-price {
  font-size: 26rpx;
  color: #ffffff;
  margin-right: 24rpx;
}

.total-price-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #e53935;
}

.create-order-btn {
  width: 200rpx;
  height: 64rpx;
  line-height: 64rpx;
  background-color: #e53935;
  color: #ffffff;
  font-size: 28rpx;
  border: none;
  border-radius: 32rpx;
}

.create-order-btn::after {
  border: none;
}

.select-all-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  margin-right: 16rpx;
  transition: all 0.3s ease;
}

/* 全选激活状态：红色背景 + 白色对钩 */
.select-all-check.cargo-check-active {
  background-color: #e53935;
  border-color: #e53935;
}

/* 全选对钩图标颜色 */
.select-all-check.cargo-check-active uni-icons {
  color: #ffffff !important;
}
</style>
