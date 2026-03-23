<template>
  <!-- 左滑删除容器：uni-swipe-action 实现左滑露出删除按钮 -->
  <uni-swipe-action
    :options="swipeOptions"
    @click="handleSwipeDelete"
    :disabled="cargo.status === 'disable'"
  >
    <uni-swipe-action-item>
      <!-- 购物车卡片 - 左勾选 + 左图右文布局（自适应高度） -->
      <view
        class="cargo-item-container"
        :class="{ 'cargo-disabled': cargo.status === 'disable' }"
      >
        <!-- 禁用蒙层（仅status=disable时显示） -->
        <view
          v-if="cargo.status === 'disable'"
          class="cargo-disable-mask"
        ></view>

        <!-- 左侧勾选按钮（disable状态下不可点击） -->
        <view class="cargo-check-wrapper" @click="!isDisabled && toggleCheck()">
          <view
            class="cargo-check-box"
            :class="{ 'cargo-check-active': isChecked && !isDisabled }"
          >
            <uni-icons
              v-if="isChecked && !isDisabled"
              type="checkmarkempty"
              size="16"
              color="#ffffff"
            ></uni-icons>
          </view>
        </view>

        <!-- 商品图片（自适应高度，保持宽高比） -->
        <view class="cargo-img-wrapper">
          <image
            class="cargo-img"
            :src="getFirstProductImage()"
            mode="aspectFill"
            lazy-load="true"
          ></image>
        </view>

        <!-- 右侧商品信息（高度随内容自适应） -->
        <view class="cargo-info-wrapper">
          <!-- 商品标题 -->
          <view class="cargo-title">{{
            cargo.productInfo.producttitle || "未命名商品"
          }}</view>

          <!-- 供应商名称 -->
          <view class="cargo-supplier">{{
            cargo.productInfo.bcompanyname || "未知供应商"
          }}</view>

          <!-- 套餐信息（仅pricetype=2时显示） -->
          <view v-if="showPackageInfo" class="cargo-package">
            所选套餐：{{ getPackageTitle() }}
          </view>

          <!-- 商品价格（含购买数量计算） -->
          <view class="cargo-price">{{ getCargoPrice() }}</view>

          <!-- 购买数量：uni-number-box 组件 -->
          <view class="cargo-amount-wrapper" v-if="!isDisabled">
            <view class="amount-label">兑换数量：</view>
            <uni-number-box
              :min="0"
              :max="100"
              v-model="currentAmount"
              @change="handleAmountChange"
            ></uni-number-box>
          </view>
          <view class="cargo-amount-disabled" v-else>
            兑换数量：{{ cargo.buyamount || 1 }}
          </view>
        </view>
      </view>
    </uni-swipe-action-item>
  </uni-swipe-action>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// 接收父组件传递的购物车数据和选中状态
const props = defineProps({
  cargo: {
    type: Object,
    required: true,
    default: () => ({
      productInfo: {},
      buyamount: 1,
      packageinfo: "",
      status: "normal", // normal: 正常, disable: 禁用
    }),
  },
  checked: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// 向父组件传递事件
const emit = defineEmits([
  "checkChange",
  "update:checked",
  "cargoDelete", // 购物车删除事件
  "amountChange", // 数量变更事件
]);

// 左滑删除配置
const swipeOptions = ref([
  {
    text: "删除",
    style: {
      backgroundColor: "#e53935",
      color: "#ffffff",
      width: "25px", // 要求宽度25px
      height: "100%", // 充满卡片高度（跟随自适应后的卡片高度）
    },
  },
]);

// 是否禁用（status=disable）
const isDisabled = computed(() => props.cargo.status === "disable");

// 选中状态（双向绑定，禁用状态下不可修改）
const isChecked = computed({
  get() {
    return !isDisabled.value && props.checked;
  },
  set(value) {
    if (!isDisabled.value) {
      emit("update:checked", value);
      emit("checkChange", {
        cargoId: props.cargo.id,
        checked: value,
      });
    }
  },
});

// 当前购买数量（绑定uni-number-box）
const currentAmount = ref(props.cargo.buyamount || 1);

// 是否显示套餐信息（pricetype=2时显示）
const showPackageInfo = computed(() => {
  const pricetype = parseInt(props.cargo.productInfo.pricetype, 10) || 0;
  return (
    !isDisabled.value && pricetype === 2 && props.cargo.productInfo.packageinfo
  );
});

// 监听cargo.buyamount变化，同步更新currentAmount
watch(
  () => props.cargo.buyamount,
  (newVal) => {
    currentAmount.value = newVal || 1;
  },
  { immediate: true },
);

// 格式化价格（保留2位小数）
const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) return "0.00";
  return price.toFixed(2);
};

// 切换勾选状态
const toggleCheck = () => {
  if (!isDisabled.value) {
    isChecked.value = !isChecked.value;
  }
};

// 处理商品图片：获取imagelist(json字符串)的第一个子对象的图片
const getFirstProductImage = () => {
  const defaultImg = "/static/images/default-product.png";
  const { imagelist } = props.cargo.productInfo;

  if (!imagelist) {
    return defaultImg;
  }

  try {
    const imageList = JSON.parse(imagelist);
    if (Array.isArray(imageList) && imageList.length > 0 && imageList[0]) {
      return imageList[0].url || defaultImg;
    } else {
      return defaultImg;
    }
  } catch (error) {
    console.error("购物车商品图片解析失败：", error);
    return defaultImg;
  }
};

// 解析套餐标题（仅pricetype=2时使用）
const getPackageTitle = () => {
  const { packageinfo } = props.cargo.productInfo;

  if (!packageinfo) {
    return "未选择套餐";
  }

  try {
    const packageData = JSON.parse(packageinfo);
    return packageData.title || "未命名套餐";
  } catch (error) {
    console.error("购物车套餐信息解析失败：", error);
    return "套餐信息异常";
  }
};

// 解析套餐价格（仅pricetype=2时使用）
const getPackageValue = () => {
  const { packageinfo } = props.cargo.productInfo;

  if (!packageinfo) {
    return 0;
  }

  try {
    const packageData = JSON.parse(packageinfo);
    return parseFloat(packageData.value) || 0;
  } catch (error) {
    console.error("购物车套餐分数解析失败：", error);
    return 0;
  }
};

// 处理购物车商品价格（含buyamount计算，适配3种pricetype）
const getCargoPrice = () => {
  const { productInfo, buyamount = 1 } = props.cargo;
  const { pricetype, pricefactor, originalprice } = productInfo;
  const priceType = parseInt(pricetype, 10) || 0;
  const amount = parseInt(buyamount, 10) || 1;

  switch (priceType) {
    case 0:
      // 0：比例折扣 - 折扣比例 + 折后价格 * 购买数量
      const discount = formatPrice(pricefactor || 0);
      const discountPrice = formatPrice(
        (originalprice || 0) * (pricefactor || 0) * amount,
      );
      return `${discount}折 · 折后${discountPrice}分`;
    case 1:
      // 1：金额计价 - 优惠价格 * 购买数量
      const finalPrice = formatPrice((pricefactor || 0) * amount);
      return `优惠分数 ${finalPrice}`;
    case 2:
      // 2：套餐计价 - 套餐value * 购买数量
      const packagePrice = formatPrice(getPackageValue() * amount);
      return `套餐总分 ${packagePrice}`;
    default:
      return "沟通面议";
  }
};

// 处理购买数量变更
const handleAmountChange = (newAmount) => {
  const oldAmount = props.cargo.buyamount || 1;
  const newVal = parseInt(newAmount, 10) || 0;

  // 当从大于0调整到0时，弹出确认删除提示
  if (oldAmount > 0 && newVal === 0) {
    uni.showModal({
      title: "提示",
      content: "是否要从购物车中删除该商品？",
      success: (res) => {
        if (res.confirm) {
          // 确认删除：向父组件传递删除事件
          emit("cargoDelete", props.cargo.productInfo.id);
        } else {
          // 取消删除：恢复数量为1
          currentAmount.value = 1;
          emit("amountChange", {
            cargoId: props.cargo.productInfo.id,
            buyamount: 1,
          });
        }
      },
    });
  } else {
    // 其他情况：数量最小为1（避免0值，除了触发删除的情况）
    const finalAmount = newVal < 1 ? 1 : newVal;
    currentAmount.value = finalAmount;
    emit("amountChange", {
      cargoId: props.cargo.productInfo.id,
      buyamount: finalAmount,
    });
  }
};

// 处理左滑删除按钮点击
const handleSwipeDelete = () => {
  uni.showModal({
    title: "提示",
    content: "是否要从购物车中删除该商品？",
    success: (res) => {
      if (res.confirm) {
        emit("cargoDelete", props.cargo.productInfo.id);
      }
    },
  });
};
</script>

<style scoped>
/* 购物车卡片容器（移除固定高度，自适应内容） */
.cargo-item-container {
  display: flex;
  align-items: flex-start; /* 改为顶部对齐，适配内容高度 */
  padding: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
  background-color: #ffffff;
  position: relative; /* 作为禁用蒙层的父容器 */
  min-height: 160rpx; /* 保留最小高度，避免内容过少时布局塌陷 */
}

/* 禁用状态样式 */
.cargo-disabled {
  opacity: 0.7;
}

/* 禁用蒙层（淡灰色，不可点击，跟随卡片自适应高度） */
.cargo-disable-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(245, 245, 245, 0.8);
  z-index: 10;
  pointer-events: auto; /* 阻止下层元素点击 */
}

/* 勾选按钮容器（移除固定高度，跟随卡片自适应） */
.cargo-check-wrapper {
  width: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 16rpx; /* 与图片顶部对齐，优化视觉 */
  z-index: 5;
}

/* 勾选框样式 */
.cargo-check-box {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

/* 勾选激活状态 */
.cargo-check-active {
  background-color: #e53935;
  border-color: #e53935;
}

/* 商品图片容器（移除固定高度，保持宽高比，自适应） */
.cargo-img-wrapper {
  width: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f9f9f9;
  z-index: 5;
  flex-shrink: 0; /* 防止图片被挤压 */
}

.cargo-img {
  width: 100%;
  height: 160rpx; /* 图片保留固定高度，保证视觉统一，卡片高度随右侧内容延伸 */
  object-fit: cover; /* 防止图片变形 */
}

/* 商品信息容器（移除固定高度，高度随内容自适应） */
.cargo-info-wrapper {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx; /* 使用gap控制内容间距，替代margin，布局更整洁 */
  z-index: 5;
}

/* 商品标题 */
.cargo-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 供应商名称 */
.cargo-supplier {
  font-size: 24rpx;
  color: #999999;
}

/* 套餐信息 */
.cargo-package {
  font-size: 24rpx;
  color: #666666;
}

/* 商品价格 */
.cargo-price {
  font-size: 28rpx;
  color: #e53935;
  font-weight: 500;
  margin-top: 4rpx;
}

/* 数量选择容器 */
.cargo-amount-wrapper {
  display: flex;
  align-items: center;
  margin-top: 4rpx;
}

.amount-label {
  font-size: 24rpx;
  color: #999999;
  margin-right: 16rpx;
}

/* 禁用状态下的数量展示 */
.cargo-amount-disabled {
  font-size: 24rpx;
  color: #999999;
  margin-top: 4rpx;
}

/* 勾选框样式 */
.cargo-check-box {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

/* 勾选激活状态：红色背景 + 白色对钩 */
.cargo-check-active {
  background-color: #e53935;
  border-color: #e53935;
}

/* 对钩图标颜色 */
.cargo-check-active uni-icons {
  color: #ffffff !important;
}
</style>
