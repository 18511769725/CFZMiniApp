<template>
  <view class="product-list-page">
    <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
      <view class="tab-bar">
        <view
          v-for="(item, index) in state.tablist"
          :key="item.id"
          class="tab-item"
          :class="{ active: state.activeTab === item.id }"
          @click="switchTab(item.id)"
        >
          {{ item.title }}
        </view>
      </view>
    </scroll-view>

    <!-- 子菜单：仅当activeTab=1时显示 -->
    <view v-if="state.activeTab === 1" class="sub-menu">
      <view
        v-for="(item, index) in state.subMenuItems"
        :key="item.id"
        class="sub-menu-item"
        :class="{ active: state.activeSubMenu === item.id }"
        @click="switchSubMenu(item.id)"
      >
        {{ item.title }}
      </view>
    </view>

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
  tablist: [],
  activeTab: 0,
  subMenuItems: [], // id,title
  activeSubMenu: 0, // 选中的子菜单ID
  errorMsg: "", // 错误提示
});

// 商品列表数据
const productList = ref([]);
// 下拉刷新状态
const refreshing = ref(false);

// 切换一级标签
const switchTab = (index) => {
  state.activeTab = index;
  uni.setStorage({
    key: "mallTabIndex",
    data: index,
    success: () => {
      // 切换到一级标签1时，先加载子菜单，再默认选中第一项加载列表
      if (index === 1) {
        getSubMenuItems().then(() => {
          if (state.subMenuItems.length > 0) {
            state.activeSubMenu = state.subMenuItems[0].id;
            loadProductList(true); // 传入子菜单标识
          } else {
            state.productList = [];
          }
        });
      } else {
        // 其他一级标签直接加载列表
        loadProductList();
      }
    },
    fail: () => {
      if (index === 1) {
        getSubMenuItems().then(() => {
          if (state.subMenuItems.length > 0) {
            state.activeSubMenu = state.subMenuItems[0].id;
            loadProductList(true);
          } else {
            state.productList = [];
          }
        });
      } else {
        loadProductList();
      }
    },
  });
};

// 切换子菜单
const switchSubMenu = (subMenuId) => {
  state.activeSubMenu = subMenuId;
  loadProductList(true); // 加载当前子菜单对应的商品列表
};

// 通过接口获取二级子菜单项（返回Promise方便异步处理）
const getSubMenuItems = () => {
  return new Promise((resolve, reject) => {
    let payload = {
      categoryaid: state.activeTab,
    };
    uni.request({
      url: "https://mvpme82.cloud/api/getsubmenuitemsforminiapp",
      method: "POST",
      header: { "Content-Type": "application/json" },
      data: payload,
      success: (res) => {
        state.loading = false;
        if (res.data?.retcode === "200") {
          state.subMenuItems = res.data.data;
          resolve(res.data.data);
        } else {
          state.subMenuItems = [];
          reject(res);
        }
      },
      fail: (err) => {
        state.loading = false;
        state.subMenuItems = [];
        reject(err);
      },
    });
  });
};

// 加载商品列表数据（isSubMenu：是否是子菜单筛选）
const loadProductList = async (isSubMenu = false) => {
  refreshing.value = true;

  const localuserinfo = await getStorageAsync("userSessionChaoqitong");
  state.userinfo = localuserinfo?.data[0] || {};

  console.log("获取产品列表时获取当前用户信息：", state.userinfo);

  let payload = {
    categorya: state.activeTab,
    pageSize: 20,
    currentPage: 1,
    ccompanyid: state.userinfo?.ccompanyid || "", // 从用户信息中获取companyid，若无则传空字符串
  };

  // 如果是子菜单筛选，添加子菜单ID参数
  if (isSubMenu) {
    payload.categoryb = state.activeSubMenu; // 假设接口用categoryb接收子菜单ID，需根据实际接口调整
  }

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

// 页面加载时初始化数据
onLoad((options) => {
  getTablist();
  // 获取缓存的一级标签
  uni.getStorage({
    key: "mallTabIndex",
    success: (res) => {
      state.activeTab = res.data;
      // 如果缓存的是标签1，初始化子菜单
      if (res.data === 1) {
        getSubMenuItems().then(() => {
          if (state.subMenuItems.length > 0) {
            state.activeSubMenu = state.subMenuItems[0].id;
            setTimeout(() => {
              loadProductList(true);
            }, 300);
          }
        });
      } else {
        setTimeout(() => {
          loadProductList();
        }, 300);
      }
    },
    fail: () => {
      // 无缓存时默认加载一级标签0的列表
      setTimeout(() => {
        loadProductList();
      }, 300);
    },
  });
});

onShow((options) => {
  getTablist();
  uni.getStorage({
    key: "mallTabIndex",
    success: (res) => {
      state.activeTab = res.data;
      if (res.data === 1) {
        getSubMenuItems().then(() => {
          if (state.subMenuItems.length > 0) {
            // 保持当前选中的子菜单，若无则选第一项
            if (!state.activeSubMenu) {
              state.activeSubMenu = state.subMenuItems[0].id;
            }
            setTimeout(() => {
              loadProductList(true);
            }, 300);
          }
        });
      } else {
        setTimeout(() => {
          loadProductList();
        }, 300);
      }
    },
  });
});

// 监听activeTab变化，处理子菜单逻辑（可选增强）
watch(
  () => state.activeTab,
  (newVal) => {
    if (newVal === 1 && state.subMenuItems.length === 0) {
      getSubMenuItems().then(() => {
        if (state.subMenuItems.length > 0) {
          state.activeSubMenu = state.subMenuItems[0].id;
          loadProductList(true);
        }
      });
    }
  },
);
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
