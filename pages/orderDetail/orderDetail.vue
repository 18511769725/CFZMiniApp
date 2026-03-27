<template>
  <view class="detail-container">
    <scroll-view class="detail-scroll" scroll-y :show-scrollbar="false">
      <view class="panel-7">
        <!-- 页面头部（设计稿：42rpx 白字居中） -->
        <view class="page-header">
          <text class="header-title">订单详情</text>
        </view>

        <!-- 采购方企业信息 -->
        <view class="info-card-wrap">
          <view class="info-card-inner">
            <view class="card-title">采购方企业信息</view>
            <view class="info-item">
              <text class="label">企业名称：</text>
              <text class="value">{{ state.orderInfo.ccompanyname }}</text>
            </view>
          </view>
        </view>

        <!-- 采购方接口人信息 -->
        <view class="info-card-wrap">
          <view class="info-card-inner">
            <view class="card-title">采购方接口人信息</view>
            <view class="info-item">
              <text class="label">姓名：</text>
              <text class="value">{{ state.orderInfo.cusername }}</text>
            </view>
            <view class="info-item">
              <text class="label">职位：</text>
              <text class="value">{{ state.orderInfo.cusertitle }}</text>
            </view>
            <view class="info-item">
              <text class="label">联系方式：</text>
              <text class="value">{{ state.orderInfo.cuserphone }}</text>
            </view>
          </view>
        </view>

        <!-- 订单基础信息 -->
        <view class="info-card-wrap">
          <view class="info-card-inner">
            <view class="card-title">订单基础信息</view>
            <view class="info-item">
              <text class="label">订单编码：</text>
              <text class="value">{{ state.orderInfo.contractid }}</text>
            </view>
            <view class="info-item">
              <text class="label">发起时间：</text>
              <text class="value">{{
                formatTime(state.orderInfo.createtime)
              }}</text>
            </view>
            <view class="info-item">
              <text class="label">订单总额：</text>
              <text class="value">{{ state.orderInfo.contractprice }}积分</text>
            </view>
            <view class="info-item">
              <text class="label">订单状态：</text>
              <text
                class="value"
                :class="getStatusClass(state.orderInfo.status)"
                >{{ getStatusText(state.orderInfo.status) }}</text
              >
            </view>
            <view class="info-item">
              <text class="label">供应商名称：</text>
              <text class="value">{{ state.orderInfo.bcompanyname }}</text>
            </view>
          </view>
        </view>

        <!-- 承租人信息（仅安居类订单展示） -->
        <view class="info-card-wrap" v-if="state.orderInfo.categoryaid === 0">
          <view class="info-card-inner">
            <view class="card-title">承租人信息</view>
            <view class="info-item">
              <text class="label">姓名：</text>
              <text class="value">{{ state.tenantInfo.name || "-" }}</text>
            </view>
            <view class="info-item">
              <text class="label">身份证号：</text>
              <text class="value">{{ state.tenantInfo.idCard || "-" }}</text>
            </view>
            <view class="info-item">
              <text class="label">职务：</text>
              <text class="value">{{ state.tenantInfo.title || "-" }}</text>
            </view>
            <view class="info-item">
              <text class="label">手机号：</text>
              <text class="value">{{ state.tenantInfo.phone || "-" }}</text>
            </view>
          </view>
        </view>

        <!-- 支付信息（仅安居类订单展示）：两列栅格 -->
        <view class="info-card-wrap" v-if="state.orderInfo.categoryaid === 0">
          <view class="info-card-inner">
            <view class="card-title">付款计划详情</view>
            <view class="payment-grid">
              <view class="payment-col">
                <view class="info-item info-item--compact">
                  <text class="label">订单总额：</text>
                  <text class="value"
                    >{{ state.paymentPlan.totalprice || "-" }}积分</text
                  >
                </view>
                <view
                  class="info-item info-item--compact"
                  v-if="state.paymentPlan.subsidytype === 'discount'"
                >
                  <text class="label">折扣比例：</text>
                  <text class="value">{{
                    state.paymentPlan.face_value || "-"
                  }}</text>
                </view>
                <view
                  class="info-item info-item--compact"
                  v-else-if="state.paymentPlan.subsidytype === 'deduction'"
                >
                  <text class="label">积分补贴：</text>
                  <text class="value">{{
                    state.paymentPlan.face_value || "-"
                  }}</text>
                </view>
                <view class="info-item info-item--compact" v-else>
                  <text class="label">积分补贴：</text>
                  <text class="value">-</text>
                </view>
                <view class="info-item info-item--compact">
                  <text class="label">平台补贴：</text>
                  <text class="value"
                    >{{ state.paymentPlan.totalSubsidyAmount || "-" }}积分</text
                  >
                </view>
              </view>
              <view class="payment-col">
                <view class="info-item info-item--compact">
                  <text class="label">补贴方式：</text>
                  <text class="value">{{
                    showsubsidytype(state.paymentPlan.subsidytype)
                  }}</text>
                </view>
                <view
                  class="info-item info-item--compact"
                  v-if="state.paymentPlan.subsidytype === 'discount'"
                >
                  <text class="label">折扣限额：</text>
                  <text class="value"
                    >{{ state.paymentPlan.limitamount || "-" }}积分</text
                  >
                </view>
                <view class="info-item info-item--compact" v-else>
                  <text class="label">折扣限额：</text>
                  <text class="value">-</text>
                </view>
                <view class="info-item info-item--compact">
                  <text class="label">租户自付：</text>
                  <text class="value"
                    >{{ state.paymentPlan.userPayAmount || "-" }}积分</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单商品内容：外框与其它信息卡一致，内框（图+标题+明细）单独背景 -->
        <view class="info-card-wrap">
          <view class="info-card-inner">
            <view class="card-title">订单商品明细</view>
            <view class="product-list">
              <view
                class="product-card"
                v-for="(product, index) in state.productList"
                :key="index"
              >
                <view class="product-card-inner">
                  <!-- 商品图片（设计稿 .24：129×129 渐变底+描边） -->
                  <view class="product-img">
                    <view class="product-img-frame">
                      <image
                        :src="getFirstProductImage(product.imagelist)"
                        mode="aspectFill"
                      ></image>
                    </view>
                  </view>
                  <!-- 商品信息 -->
                  <view class="product-info">
                    <text class="product-name">{{ product.producttitle }}</text>
                    <view class="product-metric-grid">
                      <text class="product-metric-key">单价：</text>
                      <view class="product-metric-val">
                        <text class="product-metric-base"
                          >{{ product.singleprice }}积分</text
                        >
                      </view>
                      <text class="product-metric-key">数量：</text>
                      <view class="product-metric-val">
                        <text class="product-metric-base">{{
                          product.buyamount
                        }}</text>
                      </view>
                      <text class="product-metric-key">小计：</text>
                      <view
                        class="product-metric-val product-metric-val--inline"
                      >
                        <text class="product-metric-base">{{
                          product.singleamount
                        }}</text>
                        <text class="product-metric-jifen">积分</text>
                      </view>
                      <template v-if="product.categoryaid === 0">
                        <text class="product-metric-key">说明：</text>
                        <text class="product-metric-base product-metric-desc">{{
                          product.packagetitle
                        }}</text>
                      </template>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作按钮（设计稿 .33 / 底部条 .34） -->
    <view
      class="bottom-actions"
      v-if="state.orderInfo && state.orderInfo.status !== undefined"
    >
      <!-- status = 0 或 1 显示 取消订单 -->
      <button
        v-if="
          state.orderInfo.cuserid === state.userinfo.id &&
          (state.orderInfo.status === 0 ||
            state.orderInfo.status === 1 ||
            state.orderInfo.status === 4)
        "
        class="action-btn action-cancel"
        @click="cancelOrder"
      >
        取消订单
      </button>

      <!-- status = 2 显示 确认结项 -->
      <button
        v-if="
          state.orderInfo.status === 2 &&
          state.orderInfo.cuserid === state.userinfo.id
        "
        class="action-btn action-confirm"
        @click="confirmClose"
      >
        确认结项
      </button>
      <button
        v-if="state.userinfo.isadmin === 1 && state.orderInfo.status === 0"
        class="action-btn action-cancel"
        @click="rejectorder"
      >
        驳回申请
      </button>
      <button
        v-if="state.userinfo.isadmin === 1 && state.orderInfo.status === 0"
        class="action-btn action-confirm"
        @click="approvalorder"
      >
        审批通过
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const state = reactive({
  orderInfo: {},
  productList: [],
  userinfo: {},
  tenantInfo: {
    name: "",
    idCard: "",
    title: "",
    phone: "",
  },
  paymentPlan: {},
});

// 页面加载时获取订单ID并请求详情
onLoad((options) => {
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      state.userinfo = res.data.data[0];
      if (state.userinfo.id && state.userinfo.id !== "" && options.id) {
        getOrderDetail(options.id);
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

const showsubsidytype = (type) => {
  const map = {
    deduction: "积分补贴",
    discount: "折扣补贴",
  };
  return map[type] || "未知";
};

// 模拟获取订单详情接口
const getOrderDetail = (orderId) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getorderdetailsforminiapp", // 目标接口地址
    method: "POST",
    data: {
      id: orderId,
    },
    success: (res) => {
      console.info("订单详情接口返回：", res);
      if (
        res &&
        res.data &&
        res.data.retcode === "200" &&
        res.data.data.length > 0
      ) {
        console.info("res.data.data[0]", res.data.data[0]);
        state.orderInfo = res.data.data[0];
        state.orderInfo.categoryaid = Number(state.orderInfo.categoryaid);
        // 解析订单商品内容
        state.productList = JSON.parse(state.orderInfo.ordercontent);
        console.info("state.productList", state.productList);

        // 安居类订单异步查询承租人信息
        if (state.orderInfo.categoryaid === 0) {
          getTenantInfoByOrderId(orderId);
        } else {
          state.tenantInfo = {
            name: "",
            idCard: "",
            title: "",
            phone: "",
          };
        }
        // 安居类订单异步查询支付计划
        if (state.orderInfo.categoryaid === 0) {
          getPaymentPlanByOrderId(orderId);
        } else {
          state.paymentPlan = {};
        }
      } else {
        uni.showToast({
          title: "获取订单信息失败！",
          icon: "none",
          duration: 1000,
        });
      }
    },
    fail: (err) => {
      // 网络错误处理（如接口不可达、超时等）
      uni.showToast({
        title: "网络异常，无法连接订单列表接口",
        icon: "none",
        duration: 1000,
      });
    },
  });
};

const pickFirstString = (source, keys = []) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
};

// 异步拉取承租人信息
const getTenantInfoByOrderId = (orderId) => {
  uni.request({
    url: "https://mvpme82.cloud/api/gettanentinfobyorderid",
    method: "POST",
    data: {
      orderId: orderId,
    },
    success: (res) => {
      if (
        res &&
        res.data &&
        res.data.retcode === "200" &&
        Array.isArray(res.data.data) &&
        res.data.data.length > 0
      ) {
        const raw = res.data.data[0] || {};
        state.tenantInfo = {
          name: pickFirstString(raw, [
            "tanentname",
            "tenantname",
            "rentername",
          ]),
          idCard: pickFirstString(raw, ["tanentid", "tenantidcard", "idcard"]),
          title: pickFirstString(raw, ["tenantTitle", "tenanttitle", "title"]),
          phone: pickFirstString(raw, ["tenantPhone", "tenantphone", "phone"]),
        };
      } else {
        state.tenantInfo = {
          name: "",
          idCard: "",
          title: "",
          phone: "",
        };
      }
    },
    fail: () => {
      state.tenantInfo = {
        name: "",
        idCard: "",
        title: "",
        phone: "",
      };
    },
  });
};

// 异步获取订单的支付计划（仅针对安居类订单）
const getPaymentPlanByOrderId = (orderid) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getpaymentplanbyorderid",
    method: "POST",
    data: {
      orderid: orderid,
    },
    success: (res) => {
      console.info("支付计划接口返回：", res);
      if (
        res &&
        res.data &&
        res.data.retcode === "200" &&
        Array.isArray(res.data.data)
      ) {
        state.paymentPlan = res.data.data[0];
        console.info("state.paymentPlan：", state.paymentPlan);
      } else {
        state.paymentPlan = [];
      }
    },
    fail: () => {
      state.paymentPlan = [];
    },
  });
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取状态文字
const getStatusText = (status) => {
  const statusMap = {
    0: "待主管审批",
    1: "待签约",
    2: "已签约",
    3: "已结项",
    4: "待后台审核",
    "-1": "已取消",
    "-2": "审批拒绝",
    "-3": "后台终止",
    "-4": "主管驳回",
  };
  return statusMap[status] || "未知状态";
};

// 获取状态样式类
const getStatusClass = (status) => {
  const classMap = {
    0: "status-pending",
    1: "status-negotiate",
    2: "status-signed",
    3: "status-finished",
    4: "status-pending",
    "-1": "status-terminated",
    "-2": "status-terminated",
    "-3": "status-terminated",
    "-4": "status-terminated",
  };
  return classMap[status] || "";
};

// 处理商品图片：获取imagelist(json字符串)的第一个子对象的图片
const getFirstProductImage = (imagelist) => {
  const defaultImg = "/static/images/default-product.png";

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

// 取消订单（示例实现）
const cancelOrder = () => {
  const status = state.orderInfo.status;
  if (!(status === 0 || status === 1 || status === 4)) return;
  let payload = {
    id: state.orderInfo.id,
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
  };

  uni.showModal({
    title: "确认",
    content: "确定要取消该订单吗？",
    success: (res) => {
      if (res.confirm) {
        uni.request({
          url: "https://mvpme82.cloud/api/cancelorderfromminiapp",
          method: "POST",
          header: { "Content-Type": "application/json" },
          data: payload,
          success: (resp) => {
            if (resp && resp.data && resp.data.retcode === "200") {
              uni.showToast({ title: "订单已取消", icon: "none" });
              // 刷新详情
              getOrderDetail(state.orderInfo.id);
            } else {
              uni.showToast({ title: "取消失败", icon: "none" });
            }
          },
          fail: () => {
            uni.showToast({ title: "请求失败，请稍后重试", icon: "none" });
          },
        });
      }
    },
  });
};

// 确认结项（示例实现）
const confirmClose = () => {
  if (state.orderInfo.status !== 2) return;

  let payload = {
    id: state.orderInfo.id,
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
  };
  uni.showModal({
    title: "确认",
    content: "确认结项后将无法再操作，是否继续？",
    success: (res) => {
      if (res.confirm) {
        const orderId = state.orderInfo.id;
        uni.request({
          url: "https://mvpme82.cloud/api/confirmcloseorderfromminiapp",
          method: "POST",
          header: { "Content-Type": "application/json" },
          data: payload,
          success: (resp) => {
            if (resp && resp.data && resp.data.retcode === "200") {
              uni.showToast({ title: "已确认结项", icon: "none" });
              // 刷新详情
              getOrderDetail(orderId);
            } else {
              uni.showToast({ title: "确认失败", icon: "none" });
            }
          },
          fail: () => {
            uni.showToast({ title: "请求失败，请稍后重试", icon: "none" });
          },
        });
      }
    },
  });
};

// 驳回申请
const rejectorder = () => {
  if (state.orderInfo.status !== 0) return;
  let payload = {
    id: state.orderInfo.id,
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
    opertype: "reject",
  };
  uni.showModal({
    title: "确认",
    content: "您将驳回该订单申请，是否继续？",
    success: (res) => {
      if (res.confirm) {
        const orderId = state.orderInfo.id;
        uni.request({
          url: "https://mvpme82.cloud/api/approveorderfromminiapp",
          method: "POST",
          header: { "Content-Type": "application/json" },
          data: payload,
          success: (resp) => {
            if (resp && resp.data && resp.data.retcode === "200") {
              uni.showToast({ title: "已驳回订单申请", icon: "none" });
              // 刷新详情
              getOrderDetail(orderId);
            } else {
              uni.showToast({ title: "驳回操作失败", icon: "none" });
            }
          },
          fail: () => {
            uni.showToast({ title: "请求失败，请稍后重试", icon: "none" });
          },
        });
      }
    },
  });
};

const approvalorder = () => {
  if (state.orderInfo.status !== 0) return;
  let payload = {
    id: state.orderInfo.id,
    userid: state.userinfo.id,
    username: state.userinfo.name,
    userphone: state.userinfo.phone,
    opertype: "approve",
  };
  uni.showModal({
    title: "确认",
    content: "您将审批通过该订单申请，是否继续？",
    success: (res) => {
      if (res.confirm) {
        const orderId = state.orderInfo.id;
        uni.request({
          url: "https://mvpme82.cloud/api/approveorderfromminiapp",
          method: "POST",
          header: { "Content-Type": "application/json" },
          data: payload,
          success: (resp) => {
            if (resp && resp.data && resp.data.retcode === "200") {
              uni.showToast({ title: "已通过订单申请", icon: "none" });
              // 刷新详情
              getOrderDetail(orderId);
            } else {
              uni.showToast({ title: "审批操作失败", icon: "none" });
            }
          },
          fail: () => {
            uni.showToast({ title: "请求失败，请稍后重试", icon: "none" });
          },
        });
      }
    },
  });
};
</script>

<style scoped lang="scss">
$order-card-bg: "https://mvpme82.cloud/data/1955628e-c81e-4475-80d6-85b769cfdac7_1774583803536.png";
/* 单条商品内框：缩略图 + 商品名 + 单价数量小计说明 */
$order-product-row-bg: "https://mvpme82.cloud/data/a480b220-ffb8-4240-b1e9-ade6f859f7fb_1774584644088.png";

/* 页面底色 */
.detail-container {
  height: 100vh;
  min-height: 100vh;
  background-color: #020713;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-scroll {
  flex: 1;
  height: 0;
  min-height: 0;
  padding: 15rpx 15rpx 24rpx;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

/* 设计稿 .7：720×1655，#31456b @73% — 用 rgba 避免子元素一起透明 */
.panel-7 {
  width: 720rpx;
  max-width: 100%;
  min-height: 1655rpx;
  margin: 0 auto;
  padding: 24rpx 16rpx 40rpx;
  box-sizing: border-box;
  border-radius: 34rpx;
  overflow: hidden;
  background-image: url("https://mvpme82.cloud/data/d1cd0bc9-7743-4a3a-b7d7-9f533e918148_1774557860287.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}

.page-header {
  padding: 16rpx 0 32rpx;
  text-align: center;

  .header-title {
    font-size: 42rpx;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0;
  }
}

/* 内部信息卡：统一使用设计稿切片背景 */
.info-card-wrap {
  width: 100%;
  max-width: 688rpx;
  margin: 0 auto 24rpx;
  box-sizing: border-box;
  border-radius: 34rpx;
  overflow: hidden;
}

.info-card-inner {
  border-radius: 34rpx;
  padding: 28rpx 24rpx 30rpx;
  box-sizing: border-box;
  overflow: hidden;
  background-image: url(#{$order-card-bg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #e3ae68;
  padding-bottom: 16rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(156, 205, 240, 0.22);
}

/* 内容区正文：设计稿 .138-1234，PingFangSC-Regular 28rpx #fff（行高不用 164rpx 以免多行叠行） */
.info-item {
  display: flex;
  align-items: flex-start;
  padding: 12rpx 0;
  font-family:
    "PingFang SC",
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 28rpx;
  font-weight: normal;
  line-height: 1.64;
  letter-spacing: 0;

  .label {
    color: #ffffff;
    width: 200rpx;
    flex-shrink: 0;
  }

  .value {
    color: #ffffff;
    flex: 1;
    word-break: break-all;
  }
}

.info-item--compact {
  padding: 10rpx 0;

  .label {
    width: 160rpx;
    font-size: 28rpx;
  }

  .value {
    font-size: 28rpx;
  }
}

.payment-grid {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 24rpx;
}

.payment-col {
  flex: 1;
  min-width: 0;
}

/* 内容区状态与正文同色（白） */
.status-pending,
.status-negotiate,
.status-signed,
.status-finished,
.status-terminated {
  color: #ffffff !important;
}

/* 订单商品：外框同 info-card；内框（图+标题+明细）铺专用底图 */
.product-list {
  width: 100%;
}

.product-card {
  width: 100%;
  max-width: 634rpx;
  margin: 0 auto 20rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.product-card-inner {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 200rpx;
  padding: 20rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  overflow: hidden;
  background-image: url(#{$order-product-row-bg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}

.product-img {
  width: 129rpx;
  height: 129rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
  padding: 1rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(178deg, #5e97d2 0%, #2c5f8f 49%, #6a9ccf 100%);
}

.product-img-frame {
  width: 100%;
  height: 100%;
  border-radius: 17rpx;
  overflow: hidden;
  background: linear-gradient(0deg, #1b4163 0%, #76aaff 100%);

  image {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-family:
    "PingFang SC",
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 28rpx;
  font-weight: normal;
  color: #ffffff;
  margin-bottom: 12rpx;
  line-height: 1.64;
  letter-spacing: 0;
}

/* 商品明细：Grid 第一列 max-content，与数值列仅 20rpx 间距，避免定宽 120rpx 留空 */
.product-metric-grid {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 20rpx;
  row-gap: 6rpx;
  align-items: start;
  width: 100%;
  max-width: 100%;
}

.product-metric-key {
  font-family:
    "PingFang SC",
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 21rpx;
  font-weight: normal;
  line-height: 28rpx;
  letter-spacing: 0;
  color: #ffffff;
  white-space: nowrap;
}

.product-metric-val {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.product-metric-val--inline {
  flex-wrap: nowrap;
  align-items: baseline;
}

.product-metric-base {
  font-family:
    "PingFang SC",
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 21rpx;
  font-weight: normal;
  line-height: 28rpx;
  letter-spacing: 0;
  color: #ffffff;
}

/* 仅小计行的「积分」 */
.product-metric-jifen {
  font-family:
    "PingFang SC",
    PingFangSC-Regular,
    -apple-system,
    sans-serif;
  font-size: 21rpx;
  font-weight: normal;
  line-height: 28rpx;
  letter-spacing: 0;
  color: #f6d69f;
}

.product-metric-desc {
  min-width: 0;
  word-break: break-all;
}

/* 底部 .34：750×123 浅金渐变 @0.15 + 1rpx 描边；按钮 .33：665×71 #f45d5d */
.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  min-height: 123rpx;
  padding: 26rpx 42rpx;
  padding-bottom: calc(26rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  background-color: #020713;
  border-top: 1rpx solid rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.bottom-actions::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 123rpx;
  background: linear-gradient(0deg, #dab26b 0%, #fcefd4 100%);
  opacity: 0.15;
  pointer-events: none;
}

.action-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 200rpx;
  max-width: 665rpx;
  height: 71rpx;
  line-height: 71rpx;
  border-radius: 35rpx;
  border: none;
  margin: 0;
  padding: 0;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
}

.action-btn::after {
  border: none;
}

.action-cancel {
  background-color: #f45d5d;
}

.action-confirm {
  background-color: #3d9b95;
}
</style>
