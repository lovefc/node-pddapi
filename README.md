# 拼多多开放平台API类库-node

node封装的拼多多api类库，简单好用，配合文档食用，不用再去记函数名以及参数

### 安装

````
npm install pddapi
````

### 食用方法

````
const _pddapi = require('pddapi');
// 实例化这个类库,传参数,实际使用中,要用到access_token,refresh_token
// 这两个参数是授权后得到的,参考auto.js授权案例,得到后的token的json字符串,自己去解析,自己去保存,我这里不在写死保存在文件里面了
let pddapi = new _pddapi({
    "client_id": 'xxx',
    "client_secret": 'xxxx',
    "backurl": 'xxxx',
    "access_token": 'xxxx',
    "refresh_token": 'xxxx',
});

// 获取拼多多订单
// 文档链接:https://open.pinduoduo.com/application/document/api?id=pdd.order.list.get
let stime = (new Date("2020/10/21 00:00:00")).getTime() / 1000;
let etime = (new Date("2020/10/21 23:00:00")).getTime() / 1000;

// 要传递的参数,请参考文档,里面有可以不填的,必填的必须要填
let data = {
    "order_status": 5,
    "refund_status": 5,
    "start_confirm_at": stime,
    "end_confirm_at": etime,
    "page": 1,
    "page_size": 100
};

// 使用async,await可以同步操作,可以放在其它异步函数里面使用,或者匿名的async回调里面
(async function result(data) {
    // 这里使用的方法就是拼多多的api接口名
    // 注意把api接口名中的点号换成下划线即可，传参请参考文档
    let result = await pddapi.pdd_order_list_get(data);
    result = JSON.parse(result.trim());
    console.log(result.order_list_get_response);
})(data)

````

### 交流讨论

QQ群号：474310505

![avatar](/qq.png)
