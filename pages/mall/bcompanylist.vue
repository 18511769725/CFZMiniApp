<template>
  <view
    class="product-list-page"
    :class="{ 'product-list-page--anju': useAnjuStyleProductList }"
  >
    <scroll-view scroll-y class="scroll-container">
      <view class="product-list">
        <view
          v-for="company in state.companyList"
          :key="company.bcompanyid ?? company.id"
          class="company-card"
          @tap="goCompanyDetail(company)"
        >
          <view class="company-avatar-wrap">
            <image
              :src="company.imageurl || company.imgurl || defaultAvatar"
              class="company-avatar"
              mode="aspectFill"
            />
          </view>

          <view class="company-info">
            <view class="company-title-row">
              <text class="company-name">{{ company.bcompanyname }}</text>
            </view>

            <text class="company-summary">{{
              company.productcount
                ? `提供${company.productcount}项服务`
                : "企业服务"
            }}</text>

            <view
              class="company-meta"
              v-if="company.categoryname || company.productcount"
            >
              <text class="company-flag">{{
                company.productcount ? `服务 ${company.productcount}` : "企业"
              }}</text>
              <view class="company-action">
                <text>查看</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view
        v-if="state.companyList.length === 0 && !refreshing"
        class="empty-tip"
      >
        暂无企业数据
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";

const state = reactive({
  userinfo: {},
  categorya: 0,
  categoryb: 0,
  companyList: [],
  loading: false,
  errorMsg: "",
});

const refreshing = ref(false);
const defaultAvatar = "https://mvpme82.cloud/data/default-company.png";

const useAnjuStyleProductList = computed(() => {
  const a = Number(state.categorya);
  return a === 0 || a === 1;
});

const applyNavigationStyle = () => {
  uni.setNavigationBarColor({
    frontColor: "#000000",
    backgroundColor: "#F8F8F8",
  });
};

const normalizeCompanyList = (list) => {
  if (!Array.isArray(list)) return [];

  return list.map((item, index) => ({
    id: item.id ?? item.bcompanyid ?? item.companyid ?? index,
    bcompanyid: item.bcompanyid ?? item.companyid ?? item.id ?? index,
    bcompanyname:
      item.bcompanyname ?? item.name ?? item.companyname ?? "未知企业",
    imageurl: item.imageurl ?? item.logo ?? item.avatar ?? defaultAvatar,
    summary: item.summary ?? item.description ?? item.introduce ?? "企业服务",
    categoryname:
      item.categoryname ??
      (Number(state.categorya) === 1 ? "悦享服务" : "企业服务"),
  }));
};

const loadBCompanyList = () => {
  refreshing.value = true;

  const payload = {
    categorya: state.categorya || 0,
    categoryb: state.categoryb || 0,
    pageSize: 50,
    currentPage: 1,
    ccompanyid: state.userinfo?.ccompanyid || "",
  };

  uni.request({
    url: "https://mvpme82.cloud/api/getcompanylistbyproductcategory",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: payload,
    success: (res) => {
      const data = res?.data ?? {};
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.result)
          ? data.result
          : Array.isArray(data)
            ? data
            : [];

      const ok = data?.code === "200" || data?.code === 200;

      if (ok) {
        state.companyList = list;
      } else {
        state.companyList = [];
      }
      refreshing.value = false;
    },
    fail: () => {
      state.companyList = [];
      refreshing.value = false;
    },
  });
};

const goCompanyDetail = (company) => {
  console.log("company:", company);
  console.log("company.bcompanyid", company.bcompanyid);
  uni.navigateTo({
    url: `/pages/mall/productlist?categorya=${state.categorya ?? 0}&categoryb=${state.categoryb ?? 0}&bcompanyid=${company.bcompanyid ?? 0}`,
  });
};

onLoad((options) => {
  state.categorya = Number(options.categorya);
  state.categoryb = Number(options.categoryb);
  applyNavigationStyle();
  loadBCompanyList();
});
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

.company-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 22rpx 24rpx;
  background: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  box-sizing: border-box;
}

.company-avatar-wrap {
  width: 144rpx;
  height: 144rpx;
  border-radius: 24rpx;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f1f3f8;
}

.company-avatar {
  width: 100%;
  height: 100%;
}

.company-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.company-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  width: 100%;
}

.company-name {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  font-weight: 700;
  color: #1f1f1f;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company-summary {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.company-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  flex-wrap: wrap;
  width: 100%;
}

.company-tag,
.company-flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6rpx 14rpx;
  border-radius: 18rpx;
  font-size: 20rpx;
  line-height: 1.4;
}

.company-tag {
  background-color: #edf4ff;
  color: #2d7cf9;
}

.company-flag {
  background-color: #f5f5f5;
  color: #666666;
  margin-right: auto;
}

.company-action {
  min-width: 76rpx;
  height: 44rpx;
  padding: 0 16rpx;
  background: linear-gradient(135deg, #2d7cf9, #4a9afd);
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 600;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-left: auto;
}

.product-list-page--anju {
  background-color: #020713;
}

.product-list-page--anju .scroll-container {
  background-color: #061730;
}

.product-list-page--anju .product-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  background-color: transparent;
  padding-top: 24rpx;
  padding-bottom: 40rpx;
  margin-bottom: 0;
  box-sizing: border-box;
}

.product-list-page--anju .company-card {
  width: calc(100% - 32rpx);
  background: rgba(14, 28, 49, 0.85);
  border: 1px solid rgba(122, 148, 192, 0.25);
  border-radius: 24rpx;
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.18);
}

.product-list-page--anju .company-name {
  color: rgba(255, 255, 255, 0.96);
}

.product-list-page--anju .company-summary {
  color: rgba(255, 255, 255, 0.7);
}

.product-list-page--anju .company-tag {
  background: rgba(45, 124, 249, 0.18);
  color: #9cc2ff;
}

.product-list-page--anju .company-flag {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.72);
}

.product-list-page--anju .empty-tip {
  color: rgba(255, 255, 255, 0.55);
}

.empty-tip {
  width: 100%;
  padding: 100rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #999999;
}
</style>
