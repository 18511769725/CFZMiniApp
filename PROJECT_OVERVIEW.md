# 朝企通小程序项目梳理

## 1. 项目简介

本项目是基于 uni-app 和 Vue 3 开发的“朝阳企业服务平台”客户端，主要面向企业用户提供企业权益查看、服务申请、商品/服务浏览、购物车与订单管理等功能。项目以微信小程序为主要运行目标，同时在 `manifest.json` 中配置了 App、支付宝、百度和头条等平台选项。

## 2. 技术栈与运行方式

- **框架**：uni-app、Vue 3、Vue 单文件组件（`.vue`）
- **界面组件**：`@dcloudio/uni-ui`，并启用 easycom 自动组件扫描
- **其他依赖**：`xlsx`
- **后端服务**：`https://mvpme82.cloud/api`
- **构建配置**：项目使用 DCloud/uni-app 配置文件；`package.json` 当前仅声明依赖，没有定义 npm scripts。请使用项目现有的 HBuilderX 或 uni-app CLI 工作流构建目标平台。

## 3. 目录结构

| 路径 | 用途 |
|---|---|
| `App.vue` | 应用生命周期、微信小程序分享菜单和截屏事件处理 |
| `main.js` | Vue 应用入口、全局分享行为和请求拦截器 |
| `pages.json` | 页面注册、导航栏样式和底部 Tab 配置 |
| `manifest.json` | 应用 ID、Vue 版本及各端构建配置 |
| `pages/` | 登录、首页、服务大厅、购物车、订单和详情等页面 |
| `pages/mall/components/` | 安居、悦享、康护等服务模块及其展示组件 |
| `components/` | 跨页面复用组件 |
| `store/` | 简单的共享状态，例如截屏提示状态 |
| `utils/` | 通用工具函数 |
| `static/` | 图标、插图和静态图片 |
| `server/` | 示例服务端辅助代码 |
| `unpackage/` | uni-app 构建输出目录，不属于主要源码目录 |

## 4. 页面与导航

底部 Tab 页面（定义于 `pages.json`）：

1. **首页**：`pages/mainpage/mainpage`，展示企业权益、额度/使用情况和平台资讯。
2. **服务大厅**：`pages/mall/mall`，在安居、悦享、康护服务间切换。
3. **购物车**：`pages/cargo/cargo-list`，查看和维护购物车、发起订单。
4. **我的**：`pages/homepage/homepage`，展示企业/账户信息、订单状态及快捷入口。

其他主要页面：

- **登录与账户**：`pages/login/login`、`pages/login/pickaccount`、`pages/moreinfo/moreinfo`
- **服务与商品**：`pages/mall/productlist`、`pages/mall/bcompanylist`、`pages/product/product-detail`
- **订单**：`pages/order/order`、`pages/orderDetail/orderDetail`
- **业务表单**：`pages/askForTenantInfo/askForTenantInfo`、`pages/addUser/addUser`
- **内容与通用展示**：`pages/article/article`、`pages/video/video-player`、`pages/webview/webview`
- **协议页面**：`pages/login/agreement`、`pages/login/copyright`

部分源码文件带有 `copy` 或日期后缀，或不在 `pages.json` 注册；修改页面前应先确认实际注册路由和引用关系。

## 5. 主要业务流程

### 登录

登录页通过手机号查询用户信息。若手机号关联多个账户，进入账户选择页；符合正常登录状态的用户信息存入本地 `userSessionChaoqitong`，之后进入首页。其他状态可能进入补充信息页面或显示审核提示。

### 企业首页与我的

首页根据登录用户加载企业资料、额度/权益、资讯和订单等信息；“我的”页提供个人/企业信息、订单列表、热线和账户操作等入口。登录会话保存在 uni-app 本地 storage 中，多个页面会在加载或显示时读取会话。

### 服务与下单

服务大厅按安居、悦享、康护组织内容。用户可浏览服务或商品、查看详情、加入购物车，并从购物车提交订单。安居等服务也有各自的申请表单和创建订单接口。

### 订单处理

订单列表和订单详情展示订单、租户信息及付款计划，并提供取消申请、确认关闭、审批等操作；可用操作受页面逻辑和用户角色/订单状态影响。

## 6. 后端接口分组

页面通过 `uni.request` 直接调用后端 API，接口目前按业务分散在页面和服务组件中：

- **登录与用户**：`getuserinfobyphone`、`decryptphone`、`submituserinfobyphone`、`adduserforminiapp`
- **企业、额度与配置**：`getccompanyinfobycuserid`、`getcreditinfobyccompanyidforminiapp`、`getanjucreditstatusbyccompanyid`、`getkanghucreditstatusbyccompanyid`、`getShowHideMoudles`、`gethotlineconfigs`
- **服务与商品**：`getcategories`、`getsubmenuitemsforminiapp`、`getproductsforminiapp`、`getproductdetailsforminiapp`、`getfeedproductlistforminiapp`、`getkanghuproductlist`、`getcompanylistbyproductcategory`、`getbcompanyshortnameandphone`
- **购物车与订单**：`getcargoinfoforminiapp`、`addtocartforminiapp`、`updatecargobuyamount`、`deletecargorecord`、`createorderfromminiapp`、`getordersforminiapp`、`getorderdetailsforminiapp`、`gettanentinfobyorderid`、`getpaymentplanbyorderid`、`submitcancelorderrequestfromminiapp`、`confirmcloseorderfromminiapp`、`approveorderfromminiapp`
- **专项业务与内容**：`createanjuorderfromminiapp`、`createkanghuorderfromminiapp`、`getnewslistforminiapp`、`getarticlecontentbyid`、`getzylbwjbyuserid`

`main.js` 为请求添加全局身份相关请求头；具体认证信息由运行时代码处理，不应复制到文档或提交到版本库。各接口的请求方法、参数名和响应格式应以对应页面的调用及后端契约为准。

## 7. 状态与公共行为

- 用户会话 key：`userSessionChaoqitong`
- 服务大厅用于跨 Tab 传递目标服务分类的 key：`mall_pending_tab_id`
- `main.js` 配置统一的应用分享标题和分享路径，并为请求设置身份相关请求头。
- `App.vue` 在微信小程序端开启分享菜单，并监听截屏事件；截屏提示共享状态位于 `store/screenshotState.js`。

## 8. 开发和维护建议

1. 新增页面时同步更新 `pages.json`；Tab 页面应同时检查 `tabBar` 配置。
2. API 调用目前没有统一 service 层。修改接口时应核对真实请求方法、请求体、认证头、响应字段和错误处理。
3. 当前 `package.json` 没有测试、lint 或 build 脚本；提交前请使用目标平台的 uni-app 构建流程验证。
4. `unpackage/` 下是构建产物；通常应优先修改 `pages/`、`components/`、`store/` 和 `utils/` 中的源码。
5. 路由、接口和页面功能会随代码变化；本梳理文件应与 `pages.json` 和对应页面实现一起维护。
