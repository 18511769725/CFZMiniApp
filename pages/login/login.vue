<template>
  <view class="login-container">
    <image
      class="bg-image"
      src="https://mvpme82.cloud/data/fc40e6c4-e178-4c26-9837-b79c108a52da_1774528166249.png"
      mode="aspectFill"
    ></image>

    <view class="content-overlay">
      <view :style="{ height: state.statusBarHeight + 'px' }"></view>

      <!-- <view class="header-section">
        <text class="welcome-text">欢迎进入</text>
        <view class="brand-title">
          <text class="cn">朝阳企业服务平台</text>
          <text class="en">Chaoyang Enterprise Service Platform</text>
        </view>

        <view class="slogan-section">
          <view class="slogan-item">
            <text class="slogan-cn">连接城市资源</text>
            <text class="slogan-cn">开启企业服务体验</text>
          </view>
          <view class="slogan-en">
            <text>Connecting City Resources,</text>
            <text>Elevating the Enterprise Service Experience</text>
          </view>
        </view>
      </view> -->

      <view class="action-section">
        <view
          class="audit-notice-and-btn"
          :class="{ 'has-audit-notice': state.showAuditNotice }"
        >
        <view v-if="state.showAuditNotice" class="audit-notice-wrap">
          <image
            class="audit-notice-slice"
            src="https://mvpme82.cloud/data/ea2bc9b5-1c47-4da5-a738-ffa05758135e_1774525831621.png"
            mode="widthFix"
          />
          <view class="audit-notice-content">
            <view class="audit-notice-title">企业认证审核中</view>
            <view class="audit-notice-sub">Verification Under Review</view>
            <view class="audit-notice-line-cn"
              >已提交申请，预计1-2个工作日完成审核</view
            >
            <view class="audit-notice-line-en"
              >Application submitted, 1-2 business days expected</view
            >
            <view class="audit-notice-hint-cn"
              >审核通过后即可进入平台使用完整服务</view
            >
            <view class="audit-notice-hint-en"
              >Access full services after approval</view
            >
          </view>
        </view>

        <!-- 审核态用 view 代替原生 button，避免微信默认 padding/min-height 把切图与间距撑乱 -->
        <view
          v-if="state.showAuditNotice"
          class="glass-login-btn is-audit-mode audit-fake-btn"
        >
          <image
            class="audit-btn-bg-img"
            src="https://mvpme82.cloud/data/9e4ce967-0a25-413b-82d0-9eaf16683fd6_1774525878022.png"
            mode="scaleToFill"
          />
          <view class="audit-btn-inner">
            <view class="glass-login-btn-line-cn">{{
              state.loginButtonTextCN
            }}</view>
            <view class="glass-login-btn-line-en">{{
              state.loginButtonTextEN
            }}</view>
          </view>
        </view>
        <button
          v-else
          class="glass-login-btn"
          :class="{ disabled: state.loginButtonDisabled }"
          :disabled="state.loginButtonDisabled"
          @getphonenumber="handleGetPhoneNumber"
          open-type="getPhoneNumber"
        >
          <view class="glass-login-btn-line-cn">{{
            state.loginButtonTextCN
          }}</view>
          <view class="glass-login-btn-line-en">{{
            state.loginButtonTextEN
          }}</view>
        </button>
        </view>

        <!-- 协议和提示区域 -->
        <view class="footer-content">
          <!-- 协议勾选区域 -->
          <view class="agreement-section">
            <view class="agreement-wrapper" @click="handleAgreementCheck">
              <view
                class="checkbox-circle"
                :class="{ 'is-checked': state.checked === 1 }"
              >
                <view v-if="state.checked === 1" class="inner-dot"></view>
              </view>
              <view class="agreement-texts">
                <view class="agreement-text-box">
                  <text class="white-text">我已阅读并同意</text>
                  <text class="gold-text" @click.stop="goToAgreementPage"
                    >《用户注册协议》</text
                  >
                </view>
              </view>
            </view>
            <view class="agreement-text-en">
              <text class="white-text">I have read and agree to the </text>
              <text class="gold-text" @click.stop="goToAgreementPage"
                >User Registration Agreement</text
              >
            </view>
          </view>

          <!-- 底部提示区域 -->
          <view class="notice-section">
            <view class="bottom-notice">
              <text>当前系统平台仅支持受邀用户登录体验</text>
            </view>
            <view class="bottom-notice-en">
              <text
                >The platform currently only supports login for invited
                users</text
              >
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from "vue";

const state = reactive({
  checked: 0,
  statusBarHeight: 20, // 初始预设值
  userinfo: {},
  loginButtonDisabled: false,
  loginButtonTextCN: "一键授权登录平台",
  loginButtonTextEN: "One-Click Authorized Login",
  showAuditNotice: false,
});

// --- 原有业务逻辑保持不变 ---

const handleAgreementCheck = () => {
  state.checked = state.checked === 0 ? 1 : 0;
};

const goToAgreementPage = () => {
  uni.navigateTo({ url: "/pages/login/agreement" });
};

// 通过手机号查询用户信息
const getUserInfoByPhone = (phoneNumber) => {
  uni.request({
    url: "https://mvpme82.cloud/api/getuserinfobyphone",
    method: "POST",
    header: { "Content-Type": "application/json" },
    data: { phone: phoneNumber },
    success: (res) => {
      if (res && res.data && res.data.retcode === "200") {
        const userData = res.data.data[0];
        // 状态2：正常登录进入主页
        if (userData.status === 2) {
          uni.setStorage({ key: "userSessionChaoqitong", data: res.data });
          uni.switchTab({ url: "/pages/mainpage/mainpage" });
        }
        // 状态0或-1：去补充信息
        else if (userData.status === 0 || userData.status === -1) {
          uni.navigateTo({
            url: `/pages/moreinfo/moreinfo?phone=${phoneNumber}`,
          });
        }
        // 状态1：等待审批
        else if (userData.status === 1) {
          state.loginButtonDisabled = true;
          state.loginButtonTextCN = "审核中，请稍候";
          state.loginButtonTextEN = "Auditing, Please Wait";
          state.showAuditNotice = true;
          uni.showToast({
            title: "审核中，请稍候",
            icon: "none",
            duration: 2000,
          });
        }
      }
    },
  });
};

// 处理微信授权回调
const handleGetPhoneNumber = (e) => {
  if (state.checked !== 1) {
    uni.showToast({ title: "请先同意用户注册协议", icon: "none" });
    return;
  }
  const detail = e && e.detail ? e.detail : {};
  if (!detail || (detail.errMsg && detail.errMsg.indexOf("ok") === -1)) {
    uni.showToast({ title: "未授权获取手机号", icon: "none" });
    return;
  }

  uni.login({
    provider: "weixin",
    success: (loginRes) => {
      uni.request({
        url: "https://mvpme82.cloud/api/decryptphone",
        method: "POST",
        header: { "Content-Type": "application/json" },
        data: {
          code: loginRes.code,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        },
        success: (res) => {
          if (res?.data?.data?.[0]?.phoneNumber) {
            getUserInfoByPhone(res.data.data[0].phoneNumber);
          }
        },
      });
    },
  });
};

onMounted(() => {
  // 获取系统状态栏高度以适配沉浸式顶部
  const sysInfo = uni.getSystemInfoSync();
  state.statusBarHeight = sysInfo.statusBarHeight || 20;

  // 检查本地缓存
  uni.getStorage({
    key: "userSessionChaoqitong",
    success: (res) => {
      const phone = res.data.data[0].phone;
      if (phone) getUserInfoByPhone(phone);
    },
  });
});
</script>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #00122a; /* 兜底色 */
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 60rpx 80rpx;
  box-sizing: border-box;
  /* 极轻渐变：略压顶部方便读状态栏，底部略压衬字；过重会像整屏蒙灰 */
  /* 先注释掉，便于对比无底图蒙版效果
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.12) 0%,
    rgba(0, 0, 0, 0) 22%,
    rgba(0, 0, 0, 0.18) 100%
  );
  */
}

.header-section {
  margin-top: 40rpx;

  .welcome-text {
    font-size: 34rpx;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 2rpx;
  }

  .brand-title {
    margin-top: 16rpx;
    .cn {
      display: block;
      font-size: 54rpx;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 4rpx;
    }
    .en {
      display: block;
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 8rpx;
      text-transform: uppercase;
    }
  }

  .slogan-section {
    margin-top: 100rpx;
    .slogan-item {
      .slogan-cn {
        display: block;
        font-size: 30rpx;
        color: #ffffff;
        line-height: 1.6;
        letter-spacing: 2rpx;
      }
    }
    .slogan-en {
      margin-top: 12rpx;
      text {
        display: block;
        font-size: 18rpx;
        color: rgba(255, 255, 255, 0.4);
        line-height: 1.4;
      }
    }
  }
}

.action-section {
  width: 100%;

  /* 玻璃拟态按钮：透视感与正式感并存 */
  .glass-login-btn {
    width: 100%;
    height: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.12);
    border: 1rpx solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    border-radius: 50rpx;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 500;
    letter-spacing: 4rpx;
    box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.3);

    &[disabled],
    &.disabled {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.6);
      box-shadow: none;
    }

    &::after {
      border: none;
    }
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .glass-login-btn-line-cn,
  .glass-login-btn-line-en {
    display: block;
    text-align: center;
    width: 100%;
  }

  .glass-login-btn-line-cn {
    font-size: 32rpx;
    color: #ffffff;
    line-height: 1.2;
    font-weight: 500;
  }

  .glass-login-btn-line-en {
    font-size: 18rpx;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.1;
    margin-top: 6rpx;
  }

  .audit-notice-and-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* 审核态：弹窗与按钮同宽（与设计稿 612 一致） */
  .audit-notice-and-btn.has-audit-notice {
    width: 612rpx;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    align-items: stretch;
  }

  .audit-notice-wrap {
    position: relative;
    z-index: 2;
    width: 100%;
    /* 略下移 + 多叠一点，消掉底图与按钮顶之间的细缝 */
    margin-top: 0;
    margin-bottom: -36rpx;
    overflow: visible;
  }

  /* 审核按钮底图（远程）；与弹窗同宽时高度约 111rpx；用 image 避免部分机型 background 缩放发糊 */
  .glass-login-btn.is-audit-mode {
    position: relative;
    z-index: 1;
    margin-top: 0;
    width: 100%;
    box-sizing: border-box;
    height: 111rpx;
    min-height: 111rpx;
    padding: 0;
    line-height: normal;
    background: none;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
    filter: none;
    color: #0a0a0a;

    &.disabled,
    &[disabled] {
      background: none;
      border: none;
      color: #0a0a0a;
      opacity: 1;
    }

    &:active {
      opacity: 1;
    }

    .glass-login-btn-line-cn {
      width: auto;
      max-width: 100%;
      height: auto;
      min-height: 42rpx;
      font-family: PingFang SC, PingFangSC-Medium, sans-serif;
      font-size: 40rpx;
      font-weight: normal;
      line-height: 44rpx;
      letter-spacing: 0;
      color: #0a0a0a;
      white-space: nowrap;
    }

    .glass-login-btn-line-en {
      width: auto;
      max-width: 100%;
      height: auto;
      min-height: 25rpx;
      margin-top: 0;
      font-family: PingFang SC, PingFangSC-Regular, sans-serif;
      font-size: 26rpx;
      font-weight: normal;
      line-height: 28rpx;
      letter-spacing: 0;
      color: #0a0a0a;
      opacity: 1;
      white-space: nowrap;
    }
  }

  .audit-fake-btn {
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 56rpx;
  }

  .audit-btn-bg-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    display: block;
    pointer-events: none;
  }

  .audit-btn-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .audit-notice-slice {
    width: 100%;
    display: block;
  }

  /* 叠字只在圆角矩形内排版，底部多留内边距避开三角，勿在整个位图内垂直居中 */
  .audit-notice-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    padding: 26rpx 14rpx 52rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
  }

  .audit-notice-title {
    width: auto;
    max-width: none;
    min-height: 40rpx;
    font-family: PingFang SC, PingFangSC-Medium, sans-serif;
    font-size: 43rpx;
    font-weight: normal;
    letter-spacing: 0;
    color: #0a0a0a;
    line-height: 1.12;
    margin-bottom: 4rpx;
    white-space: nowrap;
  }

  .audit-notice-sub {
    width: auto;
    max-width: none;
    min-height: 24rpx;
    font-family: PingFang SC, PingFangSC-Medium, sans-serif;
    font-size: 32rpx;
    font-weight: normal;
    letter-spacing: 0;
    color: #0a0a0a;
    line-height: 1.15;
    margin-bottom: 6rpx;
    white-space: nowrap;
  }

  .audit-notice-line-cn {
    width: auto;
    max-width: none;
    min-height: 28rpx;
    font-family: PingFang SC, PingFangSC-Medium, sans-serif;
    font-size: 27rpx;
    font-weight: normal;
    letter-spacing: 0;
    color: #0a0a0a;
    line-height: 1.22;
    margin-top: 2rpx;
    white-space: nowrap;
  }

  .audit-notice-line-en {
    width: auto;
    max-width: none;
    min-height: 22rpx;
    font-family: PingFang SC, PingFangSC-Medium, sans-serif;
    font-size: 23rpx;
    font-weight: normal;
    letter-spacing: 0;
    color: #0a0a0a;
    line-height: 1.22;
    margin-top: 4rpx;
    white-space: nowrap;
  }

  .audit-notice-hint-cn {
    width: auto;
    max-width: none;
    font-family: PingFang SC, PingFangSC-Medium, sans-serif;
    font-size: 27rpx;
    font-weight: normal;
    letter-spacing: 0;
    color: #0a0a0a;
    line-height: 1.22;
    margin-top: 8rpx;
    white-space: nowrap;
  }

  .audit-notice-hint-en {
    width: auto;
    max-width: none;
    font-family: PingFang SC, PingFangSC-Medium, sans-serif;
    font-size: 23rpx;
    font-weight: normal;
    letter-spacing: 0;
    color: #0a0a0a;
    line-height: 1.22;
    margin-top: 4rpx;
    white-space: nowrap;
  }

  .footer-content {
    margin-top: 40rpx;
  }

  .agreement-section {
    margin-bottom: 32rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .agreement-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .checkbox-circle {
      width: 30rpx;
      height: 30rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      margin-right: 14rpx;
      margin-top: 4rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.is-checked {
        border-color: #d4af37;
        .inner-dot {
          width: 16rpx;
          height: 16rpx;
          background-color: #d4af37;
          border-radius: 50%;
        }
      }
    }

    .agreement-texts {
      text-align: left;
    }

    .agreement-text-box {
      font-size: 24rpx;
      line-height: 1.4;
      margin-top: 4rpx;
      .white-text {
        color: rgba(255, 255, 255, 0.6);
      }
      .gold-text {
        color: #d4af37;
        margin-left: 6rpx;
      }
    }
  }

  .agreement-text-en {
    text-align: center;
    margin-top: 12rpx;
    font-size: 18rpx;
    line-height: 1.3;
    .white-text {
      color: rgba(255, 255, 255, 0.7);
    }
    .gold-text {
      color: #d4af37;
    }
  }

  .notice-section {
    .bottom-notice {
      text-align: center;
      text {
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.35);
        line-height: 1;
      }
    }

    .bottom-notice-en {
      text-align: center;
      margin-top: -4rpx;
      text {
        font-size: 18rpx;
        color: rgba(255, 255, 255, 0.3);
        line-height: 1;
      }
    }
  }
}
</style>
