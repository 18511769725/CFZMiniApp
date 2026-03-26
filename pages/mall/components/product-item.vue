<template>
  <!-- 益企·安居产品列表：深色卡片 + 双标记 + 双按钮 -->
  <view
    v-if="variant === 'anju'"
    class="anju-card-outer"
    @click="toProductDetail"
  >
    <view class="anju-card-inner">
      <view class="anju-thumb-wrap">
        <image
          class="anju-thumb"
          :src="getFirstProductImage()"
          mode="aspectFill"
          lazy-load="true"
        />
      </view>
      <view class="anju-main">
        <view class="anju-title">{{
          product.producttitle || "未命名商品"
        }}</view>
        <view class="anju-sub">{{
          product.bcompanyname || "未知供应商"
        }}</view>
        <view class="anju-grid">
          <view class="anju-grid-row">
            <text class="anju-grid-cell anju-grid-cell-nowrap"
              >房源类型：{{ housingTypeLabel }}</text
            >
            <text class="anju-grid-cell anju-grid-cell-nowrap"
              >房源面积：{{ housingAreaLabel }}</text
            >
          </view>
          <view class="anju-grid-row">
            <text class="anju-grid-cell anju-grid-cell-nowrap"
              >市场价格：{{ marketPriceLabel }}</text
            >
            <text class="anju-grid-cell anju-grid-cell-nowrap"
              >适用权益：{{ benefitLabel }}</text
            >
          </view>
          <view class="anju-grid-row anju-grid-row-full">
            <text class="anju-grid-cell anju-grid-cell-nowrap"
              >使用方式：{{ useMethodLabel }}</text
            >
          </view>
        </view>
        <view class="anju-footer-row">
          <view class="anju-tags">
            <view class="anju-tag anju-tag-discount">
              <text class="anju-tag-text">折扣抵用</text>
            </view>
            <view class="anju-tag anju-tag-audit-shell">
              <view class="anju-tag-audit-inner">
                <text class="anju-tag-text">需审核</text>
              </view>
            </view>
          </view>
          <view class="anju-actions" @click.stop>
            <view class="anju-btn anju-btn-ghost" @click="toProductDetail"
              >查看详情</view
            >
            <view class="anju-btn anju-btn-primary" @click="toProductDetail"
              >立即申请</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 默认：左图右文（悦享等分类） -->
  <view
    v-else
    class="product-item-container"
    @click="toProductDetail"
  >
    <view class="product-img-wrapper">
      <image
        class="product-img"
        :src="getFirstProductImage()"
        mode="aspectFill"
        lazy-load="true"
      ></image>
    </view>
    <view class="product-info-wrapper">
      <view class="product-title">{{
        product.producttitle || "未命名商品"
      }}</view>
      <view class="product-supplier">{{
        product.bcompanyname || "未知供应商"
      }}</view>
      <view class="product-price">{{ getProductPrice() }}</view>
    </view>
    <view class="cart-btn-wrapper" @click.stop="toProductDetail">
      <button class="add-cart-btn">点击查看</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  /** default | anju — 仅安居列表用深色稿 */
  variant: {
    type: String,
    default: "default",
  },
});

const emit = defineEmits(["toDetail", "addCart"]);

const getFirstProductImage = () => {
  if (!props.product.imagelist) {
    return "/static/images/default-product.png";
  }
  try {
    const imageList = JSON.parse(props.product.imagelist);
    if (Array.isArray(imageList) && imageList.length > 0 && imageList[0]) {
      return imageList[0].url || "/static/images/default-product.png";
    }
    return "/static/images/default-product.png";
  } catch (error) {
    console.error("商品图片列表解析失败：", error);
    return "/static/images/default-product.png";
  }
};

const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) return "0.00";
  return price.toFixed(2);
};

const getProductPrice = () => {
  const { pricetype, pricefactor, originalprice } = props.product;
  const priceType = parseInt(pricetype, 10) || 0;
  switch (priceType) {
    case 0: {
      const discount = formatPrice(pricefactor || 0) * 10;
      const discountPrice = formatPrice(
        (originalprice || 0) * (pricefactor || 0),
      );
      return `${discount}折 · 折后${discountPrice}分`;
    }
    case 1:
      return `优惠扣减 ${formatPrice(pricefactor || 0)}分`;
    case 2:
      return "套餐计分";
    default:
      return "商谈面议";
  }
};

/** 安居列表：不再展示「套餐计分」，市场价格用中性文案或数值 */
const marketPriceLabel = computed(() => {
  const p = props.product;
  const mp = p.monthprice ?? p.marketprice ?? p.rentprice;
  if (mp !== undefined && mp !== null && mp !== "") {
    return `¥${formatPrice(Number(mp))}/月`;
  }
  const pt = parseInt(p.pricetype, 10) || 0;
  if (pt === 2) {
    return "详询";
  }
  const { pricefactor, originalprice } = p;
  if (pt === 0 && originalprice) {
    return `¥${formatPrice((originalprice || 0) * (pricefactor || 0))}起`;
  }
  if (pt === 1 && pricefactor) {
    return `${formatPrice(pricefactor || 0)}分`;
  }
  return "详询";
});

const housingTypeLabel = computed(() => {
  const p = props.product;
  return (
    p.housingtype ||
    p.house_typename ||
    p.propertytypename ||
    p.housingtypelabel ||
    "—"
  );
});

const housingAreaLabel = computed(() => {
  const p = props.product;
  const a = p.housingarea ?? p.area ?? p.housesqm;
  if (a === undefined || a === null || a === "") return "—";
  return `${a}㎡`;
});

const benefitLabel = computed(() => {
  return props.product.equitylabel || props.product.benefitlabel || "补贴抵用";
});

const useMethodLabel = computed(() => {
  return (
    props.product.usemethod ||
    props.product.usagemethod ||
    "资格预审+签约备案"
  );
});

const toProductDetail = () => {
  emit("toDetail", props.product.id);
};
</script>

<style scoped lang="scss">
/* ========== 益企·安居深色卡片（688×252、圆角 41；列表竖向间距由 product-list gap 24 统一） ========== */
.anju-card-outer {
  width: 688rpx;
  max-width: calc(100% - 64rpx);
  margin: 0 auto;
  padding: 2rpx;
  border-radius: 41rpx;
  box-sizing: border-box;
  background: linear-gradient(
    171deg,
    #80c3f6 0%,
    #244368 48%,
    #9ccdf0 100%
  );
}

.anju-card-inner {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 248rpx;
  padding: 20rpx 22rpx 18rpx 20rpx;
  border-radius: 39rpx;
  box-sizing: border-box;
  background: rgba(13, 28, 52, 0.74);
}

.anju-thumb-wrap {
  width: 148rpx;
  height: 196rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
}

.anju-thumb {
  width: 100%;
  height: 100%;
  display: block;
}

.anju-main {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.anju-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.anju-sub {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anju-grid {
  margin-top: 12rpx;
  flex: 1;
  min-height: 0;
}

.anju-grid-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 6rpx;
}

.anju-grid-row-full .anju-grid-cell {
  flex: 1;
}

.anju-grid-cell {
  flex: 1;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.4;
}

.anju-grid-cell-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.anju-footer-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10rpx;
}

.anju-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

/* 折扣抵用：描边 #f6a47f */
.anju-tag-discount {
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  border: 1rpx solid #f6a47f;
  background: rgba(246, 164, 127, 0.18);
}

/* 需审核：渐变描边壳 + 内底（小程序不用 border-image） */
.anju-tag-audit-shell {
  padding: 1rpx;
  border-radius: 6rpx;
  background: linear-gradient(157deg, #e7a3f6 0%, #df65b2 100%);
}

.anju-tag-audit-inner {
  padding: 1rpx 8rpx;
  border-radius: 5rpx;
  background: rgba(20, 24, 40, 0.92);
}

.anju-tag-text {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.95);
  line-height: 24rpx;
}

.anju-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.anju-btn {
  width: 112rpx;
  height: 35rpx;
  border-radius: 18rpx;
  font-size: 20rpx;
  line-height: 35rpx;
  text-align: center;
  box-sizing: border-box;
}

.anju-btn-ghost {
  color: rgba(255, 255, 255, 0.92);
  background: linear-gradient(
    0deg,
    #5c92d8 0%,
    rgba(92, 146, 216, 0.95) 33%,
    rgba(103, 152, 214, 0.93) 55%,
    rgba(110, 156, 213, 0.9) 71%,
    rgba(113, 157, 212, 0.9) 77%
  );
  box-shadow:
    inset 0 -3rpx 2rpx 0 rgba(255, 255, 255, 0.45),
    inset 0 4rpx 6rpx 0 rgba(255, 255, 255, 0.25);
  border: 1rpx solid rgba(162, 195, 230, 0.65);
  opacity: 0.92;
}

.anju-btn-primary {
  color: #ffffff;
  background: linear-gradient(
    0deg,
    #1178ff 0%,
    rgba(17, 120, 255, 0.94) 43%,
    rgba(113, 173, 252, 0.9) 71%,
    rgba(195, 218, 249, 0.9) 96%
  );
  box-shadow: inset 0 -3rpx 3rpx 0 rgba(255, 255, 255, 0.53);
  border: 1rpx solid rgba(130, 168, 214, 0.8);
  opacity: 0.95;
}

/* ========== 默认列表项 ========== */
.product-item-container {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
  background-color: #ffffff;
  position: relative;
  box-sizing: border-box;
}

.product-img-wrapper {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f9f9f9;
}

.product-img {
  width: 100%;
  height: 100%;
}

.product-info-wrapper {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160rpx;
}

.product-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-supplier {
  font-size: 26rpx;
  color: #999999;
  margin: 8rpx 0;
}

.product-price {
  font-size: 28rpx;
  color: #e53935;
  font-weight: 500;
}

.cart-btn-wrapper {
  position: absolute;
  right: 16rpx;
  bottom: 16rpx;
  z-index: 10;
}

.add-cart-btn {
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  background-color: #e53935;
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  height: auto;
  line-height: 1.4;
}

.add-cart-btn::after {
  border: none;
}
</style>
