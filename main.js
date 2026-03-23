import App from "./App";

const REQUEST_AUTH_HEADER = {
  user: "mvpme82",
  pass: "chaoqitong",
};

let hasSetupRequestInterceptor = false;

const DEFAULT_SHARE_TITLE = "朝阳企业服务平台";
const DEFAULT_SHARE_PATH = "/pages/mainpage/mainpage";

function getCurrentSharePath() {
  try {
    const pageStack = getCurrentPages();
    const currentPage = pageStack[pageStack.length - 1];
    if (currentPage && currentPage.route) {
      return `/${currentPage.route}`;
    }
  } catch (error) {
    console.warn("获取当前分享路径失败，使用默认路径");
  }
  return DEFAULT_SHARE_PATH;
}

const globalShareMixin = {
  onShareAppMessage() {
    return {
      title: DEFAULT_SHARE_TITLE,
      path: getCurrentSharePath(),
    };
  },
  onShareTimeline() {
    return {
      title: DEFAULT_SHARE_TITLE,
      query: "",
    };
  },
};

function getHttpIdFromSession() {
  try {
    const session = uni.getStorageSync("userSessionChaoqitong");
    if (!session) return "";

    if (session.id !== undefined && session.id !== null) {
      return String(session.id);
    }

    if (
      session.data &&
      Array.isArray(session.data) &&
      session.data[0] &&
      session.data[0].id !== undefined &&
      session.data[0].id !== null
    ) {
      return String(session.data[0].id);
    }

    return "";
  } catch (error) {
    return "";
  }
}

function setupRequestAuthHeader() {
  if (
    hasSetupRequestInterceptor ||
    typeof uni === "undefined" ||
    !uni.addInterceptor
  ) {
    return;
  }

  uni.addInterceptor("request", {
    invoke(args = {}) {
      const header = args.header || {};
      const httpid = getHttpIdFromSession();
      args.header = {
        ...header,
        ...REQUEST_AUTH_HEADER,
        httpid: httpid || "",
      };
    },
  });

  hasSetupRequestInterceptor = true;
}

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
Vue.config.productionTip = false;
App.mpType = "app";
Vue.mixin(globalShareMixin);
setupRequestAuthHeader();
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  setupRequestAuthHeader();
  const app = createSSRApp(App);
  app.mixin(globalShareMixin);
  return {
    app,
  };
}
// #endif
