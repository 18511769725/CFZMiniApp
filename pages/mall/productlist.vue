<template>
  <view class="product-list-page">
    <!-- 下拉刷新容器 -->
    <scroll-view scroll-y class="scroll-container">
      <!-- 产品列表：循环渲染product-item组件 -->
      <view class="product-list">
        <product-item
          v-for="item in state.productList"
          :key="item.id"
          :product="item"
          @toDetail="handleToDetail"
          @addCart="handleAddCart"
        ></product-item>
      </view>

      <!-- 空数据提示 -->
      <view
        v-if="state.productList.length === 0 && !refreshing"
        class="empty-tip"
      >
        暂无商品数据
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import productItem from "./components/product-item.vue";

// 引入产品列表项组件
const state = reactive({
  userinfo: {},
  searchValue: "",
  loading: false,
  productList: [],
  errorMsg: "", // 错误提示
  categorya: 0, // 一级分类ID
  categoryb: 0, // 二级分类ID
});

// 商品列表数据
const productList = ref([]);
// 下拉刷新状态
const refreshing = ref(false);

// 加载商品列表数据（isSubMenu：是否是子菜单筛选）
const loadProductList = async () => {
  refreshing.value = true;

  let res = await getStorageAsync("userSessionChaoqitong");

  console.info("storage userSessionChaoqitong:", res);
  state.userinfo = res?.data[0];

  console.info("userinfo:", state.userinfo);

  let payload = {
    categorya: state.categorya || 0, // 一级分类ID，默认为0
    categoryb: state.categoryb || 0, // 二级分类ID，默认为
    pageSize: 20,
    currentPage: 1,
    ccompanyid: state.userinfo?.ccompanyid || "", // 从用户信息中获取companyid，若无则传空字符串
  };
  console.info("userinfo2:", state.userinfo);

  uni.request({
    url: "https://mvpme82.cloud/api/getproductsforminiapp",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      state.loading = false;
      if (res.data?.retcode === "200") {
        state.productList = res.data.data;
        refreshing.value = false;
      } else {
        state.errorMsg = res.str_err_code || "获取数据失败，请检查网络！";
        state.productList = [];
        refreshing.value = false;
      }
    },
    fail: (err) => {
      state.loading = false;
      state.errorMsg = "网络异常，无法连接登录接口";
      state.productList = [];
      refreshing.value = false;
    },
  });
};

// 下拉刷新触发事件
const onPullDownRefresh = () => {
  refreshing.value = false;
  if (state.activeTab === 1) {
    loadProductList(true);
  } else {
    loadProductList();
  }
};

// 获取数据表t_prodyc的全部数据
const findnewproduct = (news) => {
  let payload = {};
};

// 处理跳转商品详情页
const handleToDetail = (productId) => {
  uni.navigateTo({
    url: `/pages/product/product-detail?id=${productId}`,
  });
};

// 处理加入购物车
const handleAddCart = (product) => {
  console.log("加入购物车的商品信息：", product);
};

// 获取一级分类标签信息
const getTablist = () => {
  uni.request({
    url: "https://mvpme82.cloud/api/getcategories",
    method: "POST",
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        state.tablist = res.data.data.arr_category_a;
      } else {
        uni.showToast({
          title: "获取分类失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      uni.showToast({
        title: "网络异常，无法连接分类接口",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

const getStorageAsync = (key) => {
  return new Promise((resolve) => {
    uni.getStorage({
      key,
      success: (res) => resolve(res?.data ?? null),
      fail: () => resolve(null),
    });
  });
};

onLoad((options) => {
  state.categorya = options.categorya || 0; // 从页面参数获取一级分类ID，默认为0
  state.categoryb = options.categoryb || 0; // 从页面参数获取二级分类ID，默认为0
  loadProductList();
});

// onShow((options) => {
//   state.categorya = options.categorya || 0; // 从页面参数获取一级分类ID，默认为0
//   state.categoryb = options.categoryb || 0; // 从页面参数获取二级分类ID，默认为0
//   loadProductList();
// });
</script>

<style scoped lang="scss">
.product-list-page {
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-scroll {
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #fff;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.04);
  .tab-bar {
    display: flex;
    padding-bottom: 10px;
    .tab-item {
      padding: 8px 20px;
      font-size: 16px;
      color: #333;
      position: relative;
      &.active {
        color: #2d7cf9;
        font-weight: bold;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 3px;
          background-color: #2d7cf9;
          border-radius: 2px;
        }
      }
    }
  }
}

// 子菜单样式
.sub-menu {
  display: flex;
  flex-wrap: nowrap;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  flex-shrink: 0;

  .sub-menu-item {
    padding: 6px 15px;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    margin-right: 10px;
    border-radius: 20px;
    background-color: #f5f5f5;

    &.active {
      color: #fff;
      background-color: #2d7cf9;
    }
  }
}

.scroll-container {
  width: 100%;
  flex: 1;
  min-height: 0;
}

.product-list {
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

/* 空数据提示 */
.empty-tip {
  width: 100%;
  padding: 100rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #999999;
}
</style>
