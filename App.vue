<script>
import { screenshotState } from "./store/screenshotState";

export default {
  onLaunch() {
    // #ifdef MP-WEIXIN
    uni.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
    // 监听截屏事件（iOS支持）
    wx.onUserCaptureScreen(() => {
      this.handleScreenshot();
    });
    // #endif
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
    screenshotState.show = false;
  },
  onHide() {
    console.log("App Hide");
    screenshotState.show = false;
  },
  methods: {
    handleScreenshot() {
      screenshotState.show = true;
      uni.$emit("screenshot-detected");

      console.log("Screenshot detected, showing cover");
      setTimeout(() => {
        screenshotState.show = false;
      }, 1000);
    },
  },
};
</script>

<style>
.uni-searchbar {
  padding: 0 !important;
}
</style>
