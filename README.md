# erp-in-weixin

> 微信公众号登陆Erp系统，进行简单的业务操作

## Start
要在全局安装的包：vue-cli, webpack, webpack-dev-server gulp-cli 供编译和开发时使用

``` bash
npm install
```

## Develop

``` bash
# serve with hot reload at localhost:8080, 接口的host会根据 开发 或 生产 环境做出调整
# webpack.config.js 为 webpack-dev-server 配置了代理: devServer 对象, 开发者需在host配置登录验证后转发地址为开发/本地环境，这样在本地开发时可以获取开发环境后台数据
npm run dev
```

## Build

``` bash
# build for production with minification, 接口的host会根据 开发 或 生产 环境做出调整
npm run build
```

## 生成sprite图

``` bash
# 图片放在项目根目录下的 images 文件下，sprite.png srpite.css 会生成在 src/assets 目录下
npm run sprite
```

### 页面文件(views)分组
- plans 团期
  - plan-list.vue 团期列表
  - plan-info.vue 团期详情
  - plan-search.vue 团期筛选
  - places 占位
    - place-info.vue 占位信息
    - place-list.vue 余位列表
  - prices 价格
    - price-info.vue 价格信息
  - citys 出发城市
    - city-info.vue 出发城市信息
- orders 订单
  - order-list.vue 我的订单列表
  - order-all-list.vue 全部订单列表
  - order-info.vue 订单详情
  - order-search.vue 订单筛选
  - order-search-all.vue 全部订单筛选
  - order-search-list.vue 订单筛选结果列表
  - order-search-all-list.vue 全部订单筛选结果列表
  - order-place.vue 订单下单页
  - order-result.vue 下单成功结果
  - order-type-select.vue 订单类型选择
  - order-more.vue 订单更多操作页面
  - plan-order-list.vue 团期订单列表
  - plan-order-search-list.vue 团期订单筛选列表
  - plan-order-search.vue 团期订单筛选
  - salers 销售
    - saler-search.vue 销售搜索
    - saler-info.vue 销售信息
    - saler-assistant-search.vue 销售助理搜索
  - prices 价格
    - price-select.vue 价格选择
  - customers 客户
    - customer-search.vue 客户搜索
    - customer-company-search.vue 客户公司搜索
    - customer-add.vue 添加客户
  - citys 出发城市
    - city-select.vue 出发城市选择
  - approves 审批相关页面
    - order-approve-confirm-cancel.vue 取消确认单审批页面
    - order-approve-confirm-reserved.vue 确认转预留审批页面
    - order-approve-guarantee.vue 担保确认审批页面
    - order-approve-turn-group.vue 转团审批页面
  - plans 转团相关页面
    - order-turn-plan.vue 转团申请页面
    - order-turn-plan-list.vue 转团新团选择页面
  - receipts 订单收款功能相关页面
    - order-receipt-info.vue 收款详情
    - order-receipt-list.vue 收款信息列表
    - order-receipt-ping.vue 订单收款平账信息列表
    - order-receipt-treat.vue 收款添加与修改页面
  - bills 账单相关页面
    - bills-add.vue 添加账单页面
    - bills-cur.vue 账单币种选择页面
    - bills-detail.vue 账单详情页面
    - bills-edit.vue 修改账单页面
    - bills-type.vue 账单摘要页面
    - bills.vue 账单列表页面
  - tours 名单相关页面
    - tours.vue 名单列表页面
    - tours-edit.vue 名单编辑页面
  - confirmbook 确认书相关页面
    - confirm-base-acount.vue 收款账户页面
    - confirm-bill-desc.vue 账单备注页面
    - confirm-bill-title.vue 账单抬头页面
    - confirm-book-desc.vue 确认书备注页面
    - confirm-book.vue 确认书保存页面
    - confirm-commonly.vue 确认书常用数据页面
    - confirm-export-content.vue 导出内容页面
    - confirm-jiaotong.vue 交通数据页面
    - confirm-template.vue 模板页面
    - confirm-title-desc.vue 收款摘要页面
  - plansnotice 出团通知书页面
    - plans-bill-title.vue 账单抬头页面
    - plans-notice.vue 出团通知保存页面 
    - plans-template.vue 模板页面 
  - attachment 附件页面
    - attachment.vue 附件页面
    - attachment-add.vue 附件添加页面 
    - attachment-edit.vue 附件编辑页面 
- contacts 通讯录/联系人
  - contact-list.vue 联系人列表
  - contact-search.vue 联系人搜索列表页
  - contact.vue 联系人信息
- customers 客户管理
  - company-search.vue 公司搜索页面
  - customer-add.vue 添加客户页面
  - customer-info.vue 客户详情页面，提供字段修改功能
  - customer-search.vue 客户搜索页面
- moneys 二维码/支付收款相关页面
  - receipts 二维码收款
    - money-receipt-customer.vue 收款时客户选择页面
    - money-receipt-input.vue 收款时输入页面，选择客户，输入金额，输入备注
    - money-receipt-qrcode.vue 收款二维码展示页面
    - money-receipt-records.vue 收款记录页面
- commons 通用
  - user-info.vue 用户信息模板
  - error.vue 错误页面
  - payment.vue 首页我要交款按钮模块
  - order-list.vue 订单列表，供订单列表页面，订单搜索列表页面使用
  - order-all-list.vue 全部订单列表，供全部订单列表页面，全部订单搜索列表页面使用
  - order-show.vue 订单展示页面，供多个审批页面使用
- home.vue 首页
- mine.vue 我的
  - 设置消息开关
  - 推送消息列表
  - 意见反馈
  - 升级日志
- saler-rank.vue 销售排行榜
- notice.vue 公告信息
- bank-account.vue 银行账户列表页面
- dashang.vue 打赏页面
- permission.vue 权限验证页面

### 组件(components)文件
使用方式：<my-xxx></my-xxx>
- block.vue 用于展示信息时设置单元间隔与单元头
- bottom-box.vue 可以将内容固定在页面底部
- button-block.vue 用于固定按钮于底部和控制按钮长短
- button-panel.vue 固定位置悬浮圆形按钮组件，暂时没用到
- cell.vue 对mt-cell组件做了小调整，控制单元格右边字符长度不会破坏左边的显示
- grid-item.vue 用于九宫格布局的单元格
- grid.vue 用于网格/九宫格布局
- media-box.vue 多行字符串展示，数组每个元素显示一行
- modal.vue 遮罩组件，暂时没用到，与mt-modal组件一样
- more.vue 更多 ... 按钮组件
- navbar.vue 对mt-navbar组件进行修改，navbar每个单元长度固定，可以左右滑动，并能跟随container相应内容滚动到相应单元
- navigate-tab.vue 提供首页，团期，订单，我的底部导航按钮条
- pad.vue 用于添加空白高度，其高度与navigate-tab一样，保证navigate-tab不会遮蔽屏幕内容
- popup.vue 对mt-popup.vue的简单修改，暂时没用到
- radio.vue 单选组件，类似mt-radio
- search.vue 对mt-search进行简单修改，搜索输入框组件，可以作为搜索按钮，搜索输入框，提供搜索，取消，额外的操作功能
