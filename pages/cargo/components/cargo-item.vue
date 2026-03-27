<template>
  <!-- 列表底色在父级 .cargo-list；单条 .34 外层条 -->
  <view class="cargo-item-root" :class="{ 'cargo-item-root--last': isLast }">
    <uni-swipe-action
      :options="swipeOptions"
      @click="handleSwipeDelete"
      :disabled="cargo.status === 'disable'"
    >
      <uni-swipe-action-item>
        <!-- 稿 .34：750×240；#30539c @0.14 + 金描边；底色用 rgba -->
        <view class="cargo-row-strip">
          <view
            class="cargo-row"
            :class="{ 'cargo-disabled': cargo.status === 'disable' }"
          >
            <view
              class="cargo-check-wrapper"
              @click="!isDisabled && toggleCheck()"
            >
              <view class="cargo-check-outer">
                <view
                  class="cargo-check-inner"
                  :class="{
                    'cargo-check-inner--on': isChecked && !isDisabled,
                  }"
                >
                  <uni-icons
                    v-if="isChecked && !isDisabled"
                    type="checkmarkempty"
                    size="14"
                    color="#020713"
                  ></uni-icons>
                </view>
              </view>
            </view>

            <view class="cargo-card-shell">
              <image
                class="cargo-card-bg"
                src="https://mvpme82.cloud/data/2b1ce32e-bde0-457d-9cbe-9ad5c56932f0_1774552961107.png"
                mode="scaleToFill"
              />
              <view class="cargo-card-inner">
                <view
                  v-if="cargo.status === 'disable'"
                  class="cargo-disable-mask"
                ></view>

                <view class="cargo-img-frame">
                  <view class="cargo-img-inner">
                    <image
                      class="cargo-img"
                      :src="getFirstProductImage()"
                      mode="aspectFill"
                      lazy-load="true"
                    ></image>
                  </view>
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

                  <!-- 套餐总分 + 兑换数量：稿同一行，左右分布 -->
                  <view class="cargo-price-qty-row">
                    <view class="cargo-price">{{ getCargoPrice() }}</view>
                    <view class="cargo-amount-wrapper" v-if="!isDisabled">
                      <view class="amount-label">兑换数量：</view>
                      <view class="qty-stepper">
                        <view class="qty-cell qty-btn" @click="stepMinus">
                          <view class="qty-btn-fill" />
                          <text class="qty-btn-text">−</text>
                        </view>
                        <view class="qty-cell qty-input-outer">
                          <view class="qty-input-fill" />
                          <view class="qty-input-center">
                            <input
                              class="qty-input-inner"
                              type="number"
                              :value="String(currentAmount)"
                              @blur="onQtyInputBlur"
                            />
                          </view>
                        </view>
                        <view class="qty-cell qty-btn" @click="stepPlus">
                          <view class="qty-btn-fill" />
                          <text class="qty-btn-text">+</text>
                        </view>
                      </view>
                    </view>
                    <view class="cargo-amount-disabled" v-else>
                      兑换数量：{{ cargo.buyamount || 1 }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>
  </view>
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
  isLast: {
    type: Boolean,
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

// 当前购买数量（自绘步进器）
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
      return `套餐总分：${packagePrice}`;
    default:
      return "沟通面议";
  }
};

const stepMinus = () => {
  handleAmountChange(currentAmount.value - 1);
};

const stepPlus = () => {
  handleAmountChange(Math.min(100, currentAmount.value + 1));
};

const onQtyInputBlur = (e) => {
  const raw = e.detail.value;
  let v = parseInt(String(raw).trim(), 10);
  if (Number.isNaN(v)) {
    v = currentAmount.value;
  } else {
    v = Math.max(0, Math.min(100, v));
  }
  handleAmountChange(v);
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

<style scoped lang="scss">
/* 底色在父级 .cargo-list；此处只负责布局与上下间距 */
.cargo-item-root {
  width: 100%;
  margin: 0;
  padding: 24rpx 0;
  box-sizing: border-box;
  border-bottom: 1rpx solid rgba(227, 211, 181, 0.14);
}
.cargo-item-root--last {
  border-bottom: none;
}

/* 稿 .34 尺寸；内底透明，沿用根节点同色底 */
.cargo-row-strip {
  width: 750rpx;
  max-width: 100%;
  height: 240rpx;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: transparent;
  overflow: hidden;
}

.cargo-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  padding: 0 20rpx;
  box-sizing: border-box;
  gap: 16rpx;
}

/* 稿：每条卡片固定 635×192 */

.cargo-card-shell {
  position: relative;
  width: 635rpx;
  flex-shrink: 0;
  box-sizing: border-box;
  border-radius: 24rpx;
  overflow: hidden;
}

.cargo-card-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  border-width: 0;
}

.cargo-card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  /* 封面距卡片上边 20rpx、左边 22rpx；底边留白仍 27rpx */
  padding: 20rpx 14rpx 27rpx 22rpx;
  border-radius: 23rpx;
  box-sizing: border-box;
  background: transparent;
}

.cargo-row.cargo-disabled .cargo-card-shell {
  filter: saturate(0.65) brightness(0.88);
}

.cargo-disable-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 7, 19, 0.45);
  z-index: 10;
  border-radius: 23rpx;
  pointer-events: auto;
}

.cargo-check-wrapper {
  width: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
  flex-shrink: 0;
  align-self: center;
}

/* 稿 .3-2：36×37、1rpx 金渐变描边。设计稿 border-image 与圆角在小程序不可靠，用 padding 模拟 1rpx 边 */
.cargo-check-outer {
  width: 36rpx;
  height: 37rpx;
  padding: 1rpx;
  border-radius: 50%;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(0deg, #faebcc 0%, #ddb877 100%);
}

.cargo-check-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(2, 7, 19, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cargo-check-inner--on {
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
}

/* 封面 129×129，圆角 18，底与描边见稿 */
.cargo-img-frame {
  width: 129rpx;
  height: 129rpx;
  flex-shrink: 0;
  padding: 1rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  background: linear-gradient(178deg, #5e97d2 0%, #2c5f8f 49%, #6a9ccf 100%);
  z-index: 5;
}

.cargo-img-inner {
  width: 100%;
  height: 100%;
  border-radius: 17rpx;
  overflow: hidden;
  background: linear-gradient(0deg, #1b4163 0%, #76aadf 100%);
}

.cargo-img {
  width: 100%;
  height: 100%;
  display: block;
}

.cargo-info-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 0;
  margin-left: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  z-index: 5;
  justify-content: flex-start;
  overflow: hidden;
}

/* 商品名称行 */
.cargo-title {
  font-family:
    PingFangSC-Semibold,
    "PingFang SC",
    -apple-system,
    sans-serif;
  font-size: 35rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cargo-supplier {
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 23rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #b8dced;
}

.cargo-package {
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 21rpx;
  font-weight: normal;
  font-stretch: normal;
  line-height: 23rpx;
  letter-spacing: 0rpx;
  color: #ffffff;
}

.cargo-price-qty-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 12rpx;
  margin-top: 4rpx;
  min-width: 0;
  width: 100%;
}

.cargo-price {
  flex: 1;
  min-width: 0;
  font-family: PingFangSC-Medium, "PingFang SC", -apple-system, sans-serif;
  font-size: 25rpx;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rpx;
  color: #e9d591;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cargo-amount-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
}

.amount-label {
  margin-right: 12rpx;
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 18rpx;
  font-weight: normal;
  font-stretch: normal;
  line-height: 23rpx;
  letter-spacing: 0rpx;
  color: #ffffff;
}

.cargo-amount-disabled {
  flex-shrink: 0;
  font-family: PingFangSC-Regular, "PingFang SC", -apple-system, sans-serif;
  font-size: 18rpx;
  font-weight: normal;
  font-stretch: normal;
  line-height: 23rpx;
  letter-spacing: 0rpx;
  color: #ffffff;
  white-space: nowrap;
}

/* 金边仅外圈 1rpx：外层金渐变；内区绝对定位蓝底；数字区外包一层 flex 居中，避免 input 贴底 */
.qty-stepper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

.qty-cell {
  box-sizing: border-box;
  flex-shrink: 0;
}

.qty-btn {
  position: relative;
  z-index: 0;
  width: 24rpx;
  height: 26rpx;
  border-radius: 5rpx;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(178deg, #fcefd4 0%, #dab26b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn-fill {
  position: absolute;
  left: 1rpx;
  top: 1rpx;
  right: 1rpx;
  bottom: 1rpx;
  z-index: 0;
  border-radius: 4rpx;
  pointer-events: none;
  /* 内区用实色蓝渐变，避免 0.4 透明叠在金底上整格发金 */
  background: linear-gradient(0deg, #1b4163 0%, #76aadf 100%);
}

.qty-btn-text {
  position: relative;
  z-index: 1;
  font-size: 16rpx;
  font-weight: 300;
  color: #ffffff;
  /* 与内区可视高度 24rpx（26−2）一致，避免符号贴底 */
  line-height: 24rpx;
  height: 24rpx;
  text-align: center;
}

.qty-input-outer {
  position: relative;
  z-index: 0;
  min-width: 24rpx;
  width: 44rpx;
  height: 26rpx;
  border-radius: 5rpx;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(178deg, #fcefd4 0%, #dab26b 100%);
}

.qty-input-fill {
  position: absolute;
  left: 1rpx;
  top: 1rpx;
  right: 1rpx;
  bottom: 1rpx;
  z-index: 0;
  border-radius: 4rpx;
  pointer-events: none;
  background: linear-gradient(0deg, #1b4163 0%, #76aadf 100%);
}

/* 小程序 input 绝对定位时易贴底，用 flex 容器做垂直居中 */
.qty-input-center {
  position: absolute;
  left: 1rpx;
  top: 1rpx;
  right: 1rpx;
  bottom: 1rpx;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.qty-input-inner {
  width: 100%;
  height: 24rpx;
  min-height: 24rpx;
  padding: 0 4rpx;
  margin: 0;
  box-sizing: border-box;
  border: none;
  border-radius: 4rpx;
  font-size: 16rpx;
  line-height: 24rpx;
  text-align: center;
  color: #ffffff;
  background-color: transparent;
}
</style>
