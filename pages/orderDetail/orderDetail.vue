<template>
  <view class="detail-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="header-title">订单详情</text>
    </view>

    <!-- 采购方企业信息 -->
    <view class="info-card">
      <view class="card-title">采购方企业信息</view>
      <view class="info-item">
        <text class="label">企业名称：</text>
        <text class="value">{{ state.orderInfo.ccompanyname }}</text>
      </view>
    </view>

    <!-- 采购方接口人信息 -->
    <view class="info-card">
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

    <!-- 订单基础信息 -->
    <view class="info-card">
      <view class="card-title">订单基础信息</view>
      <view class="info-item">
        <text class="label">订单编码：</text>
        <text class="value">{{ state.orderInfo.contractid }}</text>
      </view>
      <view class="info-item">
        <text class="label">发起时间：</text>
        <text class="value">{{ formatTime(state.orderInfo.createtime) }}</text>
      </view>
      <view class="info-item">
        <text class="label">订单总额：</text>
        <text class="value">{{ state.orderInfo.contractprice }}积分</text>
      </view>
      <view class="info-item">
        <text class="label">订单状态：</text>
        <text class="value" :class="getStatusClass(state.orderInfo.status)">{{
          getStatusText(state.orderInfo.status)
        }}</text>
      </view>
      <view class="info-item">
        <text class="label">供应商名称：</text>
        <text class="value">{{ state.orderInfo.bcompanyname }}</text>
      </view>
    </view>

    <!-- 承租人信息（仅安居类订单展示） -->
    <view class="info-card" v-if="state.orderInfo.categoryaid === 0">
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

    <!-- 支付信息（仅安居类订单展示） -->
    <view class="info-card" v-if="state.orderInfo.categoryaid === 0">
      <view class="card-title">付款计划详情</view>
      <view class="info-item">
        <text class="label">订单总额：</text>
        <text class="value">{{ state.paymentPlan.totalprice || "-" }}积分</text>
      </view>
      <view class="info-item">
        <text class="label">补贴方式：</text>
        <text class="value">{{
          showsubsidytype(state.paymentPlan.subsidytype)
        }}</text>
      </view>
      <view
        class="info-item"
        v-if="state.paymentPlan.subsidytype === 'deduction'"
      >
        <text class="label">积分补贴：</text>
        <text class="value">{{ state.paymentPlan.face_value || "-" }}</text>
      </view>
      <view
        class="info-item"
        v-if="state.paymentPlan.subsidytype === 'discount'"
      >
        <text class="label">折扣比例：</text>
        <text class="value">{{ state.paymentPlan.face_value || "-" }}</text>
      </view>
      <view
        class="info-item"
        v-if="state.paymentPlan.subsidytype === 'discount'"
      >
        <text class="label">折扣限额：</text>
        <text class="value"
          >{{ state.paymentPlan.limitamount || "-" }}积分</text
        >
      </view>
      <view class="info-item">
        <text class="label">平台补贴：</text>
        <text class="value"
          >{{ state.paymentPlan.totalSubsidyAmount || "-" }}积分</text
        >
      </view>
      <view class="info-item">
        <text class="label">租户自付：</text>
        <text class="value"
          >{{ state.paymentPlan.userPayAmount || "-" }}积分</text
        >
      </view>
    </view>

    <!-- 订单商品内容 -->
    <view class="info-card">
      <view class="card-title">订单商品明细</view>
      <view class="product-list">
        <view
          class="product-card"
          v-for="(product, index) in state.productList"
          :key="index"
        >
          <!-- 商品图片 -->
          <view class="product-img">
            <image
              :src="getFirstProductImage(product.imagelist)"
              mode="widthFix"
            ></image>
          </view>
          <!-- 商品信息 -->
          <view class="product-info">
            <text class="product-name">{{ product.producttitle }}</text>
            <view class="product-price">
              <text class="label">单价：</text>
              <text class="value">{{ product.singleprice }}积分</text>
            </view>
            <view class="product-count">
              <text class="label">数量：</text>
              <text class="value">{{ product.buyamount }}</text>
            </view>
            <view class="product-subtotal">
              <text class="label">小计：</text>
              <text class="value">{{ product.singleamount }}积分</text>
            </view>
            <view class="product-price" v-if="product.categoryaid === 0">
              <text class="label">说明：</text>
              <text class="value">{{ product.packagetitle }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
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
.detail-container {
  padding: 20rpx;
  padding-bottom: 170rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-header {
  padding: 20rpx 0;
  text-align: center;
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;

  .header-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.info-card {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  padding-bottom: 15rpx;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15rpx;
}

.info-item {
  display: flex;
  padding: 10rpx 0;
  font-size: 28rpx;

  .label {
    color: #666;
    width: 180rpx;
    flex-shrink: 0;
  }

  .value {
    color: #333;
    flex: 1;
  }
}

/* 状态样式 */
.status-pending {
  color: #ff9800;
}
.status-negotiate {
  color: #4299e1;
}
.status-signed {
  color: #38b2ac;
}
.status-finished {
  color: #48bb78;
}
.status-terminated {
  color: #e53e3e;
}

/* 商品列表样式 */
.product-list {
  width: 100%;
}

.product-card {
  display: flex;
  padding: 20rpx;
  border: 1px solid #f0f0f0;
  border-radius: 8rpx;
  margin-bottom: 15rpx;
  align-items: flex-start;
}

.product-img {
  width: 120rpx;
  flex-shrink: 0;
  margin-right: 20rpx;

  image {
    display: block;
    width: 100%;
    border-radius: 8rpx;
  }
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.product-price,
.product-count,
.product-subtotal {
  display: flex;
  font-size: 26rpx;
  margin-bottom: 5rpx;

  .label {
    color: #666;
    width: 80rpx;
    flex-shrink: 0;
  }

  .value {
    color: #333;
  }
}

.product-subtotal .value {
  color: #e53e3e;
  font-weight: 600;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  border-top: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}

.action-btn {
  flex: 1;
  min-width: 0;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  border: none;
  margin: 0;
  color: #fff;
  font-size: 30rpx;
}

.action-cancel {
  background: #e53e3e;
}

.action-confirm {
  background: #38b2ac;
}
</style>
