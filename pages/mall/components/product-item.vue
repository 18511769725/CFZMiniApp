<template>
  <!-- 益企·安居 / 益企·悦享：同一深色卡片壳；悦享中间区仍为原标题+供应商+计价文案（非房源网格） -->
  <view
    v-if="variant === 'anju' || variant === 'yuexiang'"
    class="anju-card-outer"
    :class="{ 'anju-card-outer--yuexiang': variant === 'yuexiang' }"
    @click="toProductDetail"
  >
    <image
      class="anju-card-bg"
      :src="listDarkCardBgSrc"
      mode="scaleToFill"
    />
    <view class="anju-card-inner">
      <view class="anju-thumb-wrap">
        <!-- 外框：模拟 border-image 渐变边（小程序不用 border-image） -->
        <view
          class="anju-thumb-border"
          :class="{ 'anju-thumb-border--yuexiang': variant === 'yuexiang' }"
        >
          <view class="anju-thumb-inner">
            <image
              class="anju-thumb"
              :src="getFirstProductImage()"
              mode="aspectFill"
              lazy-load="true"
            />
          </view>
        </view>
      </view>
      <view class="anju-main">
        <view class="anju-title">{{
          product.producttitle || "未命名商品"
        }}</view>
        <view class="anju-sub">{{
          product.bcompanyname || "未知供应商"
        }}</view>
        <view v-if="variant === 'anju'" class="anju-grid">
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
        <view v-else class="anju-yuexiang-price-wrap">
          <text class="anju-yuexiang-price">{{ getProductPrice() }}</text>
        </view>
        <view
          class="anju-footer-row"
          :class="{ 'anju-footer-row--actions-only': variant === 'yuexiang' }"
        >
          <view v-if="variant === 'anju'" class="anju-tags">
            <view class="anju-tag-discount-wrap">
              <image
                class="anju-tag-discount-bg"
                :src="anjuTagDiscountBgSrc"
                mode="scaleToFill"
              />
              <text class="anju-tag-discount-label">折扣抵用</text>
            </view>
            <view class="anju-tag-audit-wrap">
              <image
                class="anju-tag-audit-bg"
                :src="anjuTagAuditBgSrc"
                mode="scaleToFill"
              />
              <text class="anju-tag-audit-label">需审核</text>
            </view>
          </view>
          <view class="anju-actions" @click.stop>
            <view class="anju-btn-detail-wrap" @click="toProductDetail">
              <image
                class="anju-btn-detail-bg"
                :src="listDetailBtnBgSrc"
                mode="scaleToFill"
              />
              <view class="anju-btn-detail-label">查看详情</view>
            </view>
            <view
              v-if="variant === 'yuexiang'"
              class="anju-btn-primary-wrap"
              @click="toProductDetail"
            >
              <image
                class="anju-btn-primary-bg"
                :src="yuexiangApplyBtnBgSrc"
                mode="scaleToFill"
              />
              <view class="anju-btn-primary-label">立即申请</view>
            </view>
            <view
              v-else
              class="anju-btn anju-btn-primary"
              @click="toProductDetail"
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
  /** default | anju（房源字段网格）| yuexiang（深色壳 + 原价/折扣/套餐计分等原文案） */
  variant: {
    type: String,
    default: "default",
  },
});

const emit = defineEmits(["toDetail", "addCart"]);

/** 益企·安居列表卡片整图底（688×252，描边圆角在切图内） */
const anjuCardBgSrc =
  "https://mvpme82.cloud/data/012873f5-90cc-444e-a41a-64aa74767595_1774545749708.png";

/** 益企·悦享列表卡片整图底 */
const yuexiangCardBgSrc =
  "https://mvpme82.cloud/data/c15b39b0-903a-4e72-9940-b6c2e46378b0_1774589983213.png";

const listDarkCardBgSrc = computed(() =>
  props.variant === "yuexiang" ? yuexiangCardBgSrc : anjuCardBgSrc,
);

/** 益企·安居列表「查看详情」按钮底图 */
const anjuDetailBtnBgSrc =
  "https://mvpme82.cloud/data/87edb7e3-00ac-4f48-9c2c-2589f9f802ac_1774546014161.png";

/** 益企·悦享列表「查看详情」按钮底图 */
const yuexiangDetailBtnBgSrc =
  "https://mvpme82.cloud/data/a1f67fa9-9360-4a0e-9053-a82c06290caa_1774590142491.png";

const listDetailBtnBgSrc = computed(() =>
  props.variant === "yuexiang" ? yuexiangDetailBtnBgSrc : anjuDetailBtnBgSrc,
);

/** 益企·悦享列表「立即申请」按钮底图 */
const yuexiangApplyBtnBgSrc =
  "https://mvpme82.cloud/data/6db32a65-d908-40b4-9271-dfdbaa2d6103_1774590232920.png";

/** 益企·安居列表「折扣抵用」标签底图 */
const anjuTagDiscountBgSrc =
  "https://mvpme82.cloud/data/2bac1f23-af75-4b88-bb2a-9aec2b8e1dcf_1774546263764.png";

/** 益企·安居列表「需审核」标签底图 */
const anjuTagAuditBgSrc =
  "https://mvpme82.cloud/data/4e754266-1c0d-4508-a174-03a2381a6241_1774546888649.png";

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
/* ========== 益企·安居：688×252 整图底 + 叠字；列表间距 product-list gap 24rpx ========== */
.anju-card-outer {
  position: relative;
  width: 688rpx;
  max-width: 100%;
  height: 252rpx;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 40rpx;
}

/* 益企·悦享：688×217 */
.anju-card-outer--yuexiang {
  width: 688rpx;
  height: 217rpx;
}

/* 悦享：底 30rpx、右 24rpx（至「立即申请」右缘） */
.anju-card-outer--yuexiang .anju-card-inner {
  padding-bottom: 30rpx;
  padding-right: 24rpx;
}

.anju-card-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.anju-card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
  padding: 20rpx 22rpx 18rpx 20rpx;
  box-sizing: border-box;
  background: transparent;
}

/* 缩略图整体 144×145，含 3rpx 渐变外框 */
.anju-thumb-wrap {
  width: 144rpx;
  height: 145rpx;
  flex-shrink: 0;
  box-sizing: border-box;
}

.anju-thumb-border {
  width: 144rpx;
  height: 145rpx;
  box-sizing: border-box;
  padding: 3rpx;
  border-radius: 18rpx;
  overflow: hidden;
  background: linear-gradient(
    178deg,
    #5e97d2 0%,
    #2c5f8f 49%,
    #6a9ccf 100%
  );
}

/* 悦享稿 .24：3rpx 等效描边用 padding+渐变（小程序 border-image 不可靠）；内层仍为 #1b4163→#76aadf */
.anju-thumb-border--yuexiang {
  background: linear-gradient(
    178deg,
    #957c84 0%,
    #593750 49%,
    #c79ba9 100%
  );
}

.anju-thumb-inner {
  width: 100%;
  height: 100%;
  border-radius: 15rpx;
  overflow: hidden;
  background: linear-gradient(0deg, #1b4163 0%, #76aadf 100%);
}

.anju-thumb {
  width: 100%;
  height: 100%;
  display: block;
}

.anju-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  margin-left: 20rpx;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 设计稿：标题 34rpx PingFangSC-Semibold #fff */
.anju-title {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 设计稿：地址/副标题 22rpx PingFangSC-Regular #b8dced */
.anju-sub {
  margin-top: 6rpx;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 22rpx;
  font-weight: 400;
  color: #b8dced;
  line-height: 1.2;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anju-grid {
  margin-top: 8rpx;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.anju-grid-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 4rpx;
}

.anju-grid-row-full .anju-grid-cell {
  flex: 1;
}

/* 设计稿：详情区 17rpx / 行高 23rpx PingFangSC-Regular #fff */
.anju-grid-cell {
  flex: 1;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 23rpx;
  letter-spacing: 0;
}

.anju-grid-cell-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 悦享：沿用 getProductPrice()（如 9折·折后810.00分、套餐计分） */
.anju-yuexiang-price-wrap {
  margin-top: 8rpx;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}

.anju-yuexiang-price {
  font-size: 28rpx;
  font-weight: 500;
  color: #e53935;
  line-height: 1.35;
  word-break: break-all;
}

.anju-footer-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 6rpx;
  flex-shrink: 0;
}

.anju-footer-row--actions-only {
  justify-content: flex-end;
}

.anju-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.anju-tag-discount-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28rpx;
  min-width: 100rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 6rpx;
  flex-shrink: 0;
}

.anju-tag-discount-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.anju-tag-discount-label {
  position: relative;
  z-index: 1;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.95);
  line-height: 24rpx;
}

.anju-tag-audit-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28rpx;
  min-width: 76rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 6rpx;
  flex-shrink: 0;
}

.anju-tag-audit-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.anju-tag-audit-label {
  position: relative;
  z-index: 1;
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

.anju-btn-detail-wrap {
  position: relative;
  width: 112rpx;
  height: 35rpx;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 18rpx;
  box-sizing: border-box;
}

.anju-btn-detail-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.anju-btn-detail-label {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  box-sizing: border-box;
}

.anju-btn-primary-wrap {
  position: relative;
  width: 112rpx;
  height: 35rpx;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 18rpx;
  box-sizing: border-box;
}

.anju-btn-primary-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.anju-btn-primary-label {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  line-height: 1;
  color: rgba(255, 255, 255, 0.95);
  box-sizing: border-box;
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
