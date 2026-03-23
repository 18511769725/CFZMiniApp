<template>
  <!-- 产品列表项 - 左图右文布局（外层包裹跳转详情的点击区域） -->
  <view class="product-item-container" @click="toProductDetail">
    <!-- 左侧商品图片 -->
    <view class="product-img-wrapper">
      <image
        class="product-img"
        :src="getFirstProductImage()"
        mode="aspectFill"
        lazy-load="true"
      ></image>
    </view>

    <!-- 右侧商品信息 -->
    <view class="product-info-wrapper">
      <!-- 商品标题 -->
      <view class="product-title">{{
        product.producttitle || "未命名商品"
      }}</view>

      <!-- 供应商名称 -->
      <view class="product-supplier">{{
        product.bcompanyname || "未知供应商"
      }}</view>

      <!-- 商品价格（根据pricetype展示不同格式） -->
      <view class="product-price">{{ getProductPrice() }}</view>
    </view>

    <!-- 卡片右下角：加入购物车按钮（阻止事件冒泡，避免触发详情跳转） -->
    <view class="cart-btn-wrapper" @click.stop="toProductDetail">
      <button class="add-cart-btn">点击查看</button>
    </view>
  </view>
</template>

<script setup>
// 接收父组件传递的单个产品数据
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

// 定义事件：向父组件传递跳转详情和加入购物车的事件
const emit = defineEmits(["toDetail", "addCart"]);

// 处理商品图片：获取imagelist(json字符串)的第一个子对象的图片
const getFirstProductImage = () => {
  // 容错处理：避免imagelist格式错误导致报错
  if (!props.product.imagelist) {
    // 返回uniapp默认占位图（可替换为自定义图片）
    return "/static/images/default-product.png";
  }

  try {
    // 解析json字符串为数组
    const imageList = JSON.parse(props.product.imagelist);
    // 判断数组是否有效且有数据
    if (Array.isArray(imageList) && imageList.length > 0 && imageList[0]) {
      // 返回第一个子对象的图片（默认取image字段，可根据实际接口调整）
      return imageList[0].url || "/static/images/default-product.png";
    } else {
      return "/static/images/default-product.png";
    }
  } catch (error) {
    console.error("商品图片列表解析失败：", error);
    return "/static/images/default-product.png";
  }
};

// 处理商品价格：根据pricetype展示不同格式
const getProductPrice = () => {
  const { pricetype, pricefactor, originalprice } = props.product;
  // 格式化数字为保留2位小数的字符串
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "0.00";
    return price.toFixed(2);
  };

  // 转换pricetype为数字（容错处理）
  const priceType = parseInt(pricetype, 10) || 0;

  switch (priceType) {
    case 0:
      // 0：比例折扣 - 显示折扣比例 + 折后价格（originalprice * pricefactor）
      const discount = formatPrice(pricefactor || 0) * 10;
      const discountPrice = formatPrice(
        (originalprice || 0) * (pricefactor || 0),
      );
      return `${discount}折 · 折后${discountPrice}分`;
    case 1:
      // 1：金额计价 - 显示优惠后价格
      const finalPrice = formatPrice(pricefactor || 0);
      return `优惠扣减 ${finalPrice}分`;
    case 2:
      // 2：套餐计价 - 显示固定文字
      return "套餐计分";
    default:
      // 默认情况（未知类型）
      return "商谈面议";
  }
};

// 点击卡片（除购物车按钮外）：进入商品详情页
const toProductDetail = () => {
  emit("toDetail", props.product.id); // 传递商品id给父组件
};

// 从列表页不提供添加购物车功能
// const addToCart = () => {
//   // 简单校验商品有效性
//   if (!props.product.id) {
//     uni.showToast({ title: "商品信息异常", icon: "none" });
//     return;
//   }

//   // 向父组件传递加入购物车的商品信息
//   emit("addCart", props.product);

//   // 提示加入成功
//   uni.showToast({ title: "已加入购物车", icon: "success" });
// };
</script>

<style scoped>
/* 列表项容器 - 弹性布局实现左图右文，相对定位用于购物车按钮定位 */
.product-item-container {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
  background-color: #ffffff;
  position: relative; /* 相对定位，作为购物车按钮的父容器 */
  box-sizing: border-box;
}

/* 左侧图片容器 */
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

/* 右侧信息容器 */
.product-info-wrapper {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160rpx;
}

/* 商品标题 */
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

/* 供应商名称 */
.product-supplier {
  font-size: 26rpx;
  color: #999999;
  margin: 8rpx 0;
}

/* 商品价格 */
.product-price {
  font-size: 28rpx;
  color: #e53935;
  font-weight: 500;
}

/* 购物车按钮容器 - 绝对定位到卡片右下角 */
.cart-btn-wrapper {
  position: absolute;
  right: 16rpx;
  bottom: 16rpx;
  z-index: 10;
}

/* 加入购物车按钮样式 */
.add-cart-btn {
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  background-color: #e53935;
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  height: auto; /* 取消uni按钮默认高度 */
  line-height: 1.4; /* 行高适配 */
}

/* 取消按钮点击默认高亮样式 */
.add-cart-btn::after {
  border: none;
}
</style>
