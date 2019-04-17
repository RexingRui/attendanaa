#### 组件概览
![](https://ws4.sinaimg.cn/large/006tKfTcly1g1qgbvhsgij30ix0aet96.jpg)
#### 操作流程
![](https://ws2.sinaimg.cn/large/006tKfTcly1g1qgceouq9j31gm0pawg6.jpg)
#### 动态组件
is属性为组件名
```html
<component :is="view" @change="handleChange" @login="handleToLogin"></component>
```
- 登陆页面与注册页面
- 主页面中所有的功能展示页面

#### storage
- 账号信息、员工信息通过localeStorage存储
- 登陆状态、登陆信息通过sessionStorage存储
- 使用webstoragecache库作为storage的接口

#### 组件中的路由钩子
beforeRouterEnter
```js
  beforeRouteEnter(to, from, next) {
    if ( mySessionSt.get('loginState')) {
      next();
    } else {
    next({ path: '/' });
    }
  }
```
- 防止直接输入url不通过登陆进入主页面
- 登出后，跳转

#### 账号信息
- 账号信息不支持增删，只能修改登陆密码
- 由 id、name、 password 、region四个字段组成
- 简单的验证，相同的账号名不可重复注册
- 登陆时确保账号、密码、等级输入一致
- 页面加载时，通过localeStorage中存的userNum来判断是否需要读入账号数据文件

#### 员工信息
- 支持增删改查，修改和删除需要选择相应的复选框，能删除多个员工信息
- 由id, name, gender, phone,attendId(考勤号), email, date, select(是否被选择), attendance(考勤记录)
- 增加与修改员工信息，使用的是同一个组件addStaff，在进入对话框和确认时都需要判断是修改还是新增信息
- 员工信息表使用的vuetable包，修改样式引入了bootstrap和font-awesome

#### 员工考勤
- 可导入数据，可手动考勤数据，考勤的数据依赖于员工录入的信息，如果没有录入员工信息，则不会显示考勤信息
- focus表单中的单元格数据，可以显示考勤异常的原因和迟到、早退信息
- 假期，周末突出显示，且在该时间段手动考勤只能考勤加班
- 考勤对话框，更具不同的工共、请假、休假显示不同的界面
- 表头和分页配合显示，分页对应12个月数据，可切换不同月的考勤数据
- 单击导出按钮可导出当月考勤表的数据，自动命名文件
- 手动考勤，只能对当前的日期进行操作
- 统计当月正常上班的天数


#### 假期录入
- 自动生成当年的周末数据
- 手动添加当年的假期与调班日期
- 可删除添加的信息
- 重复导入时显示提示信息，是否需要重新导入
- 在没有导入假期数据前是不能打开考勤页面的，若打开会提示添加假期数据，单击确定后会跳转到假期录入页面

#### 导入指纹考勤数据
- 可导入csv文件的考勤数据，事先需将指纹打卡器生成的execl文件另存为csv文件
- 处理单日多次考勤，只保留第一次和最后一次
- 对于只考勤一次的情况，保存考勤信息，做异常显示
- 处理迟到、早退、一天只打一次卡的情况

#### 修改密码
- 验证： 旧密码正确，两次输入的密码一致

#### 读入数据
- 公共组件，用于读取账号信息与指纹考勤数据
- format属性设定读入文件格式，v-slot: hint设定提示信息

#### vuex
- 用户信息: user：{userNum: 0, userData: []} ->initialUser  changeUser
    1. 登陆页面加载时，initialUser
    2. 从文件中读取账号信息，initialUser
    3. 注册账号，changeUser
    4. 修改密码通过updateLoginUser来修改storage中的user和vuex中的user

- 登陆的账号: loginUser，三个状态登陆，修改密码，登出

- 登陆状态: loginState, 登陆中，登出

- 员工数量: staffNum ->initialStaffNum  changeStaffNum
    1. 考勤页面加载时，initialStaffNum
    2. 增加员工、删除员工 changeStaffNum

- 员工数据: staffDatas:[], ->initialStaffData changeStaffData
    1. 考勤页面加载时, initialStaffData
    2. 导入考勤数据时, initialStaffData
    3. 手动考勤，changeStaffData

- 被删除员工的数量: deleteNum -> changeDeleteNum

- 主页中当前展示的页面: pageIndex -> changeCurrentPage,考勤界面需要录入假期信息才能查看

- 当年的节假日：dateDataOfYear -> getDateDataOfYear 存当前年份的节假日与周末信息

-