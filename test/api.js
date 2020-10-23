"use strict"
// 导入pddapi模块
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

/*
// 这里是直接调用,抛出promise对象
let result = pddapi.pdd_order_list_get(data);
console.log(result);
result.then((body) => {
	console.log(body);
}).catch((err) => {
	console.log(err);
});
*/

// 获取拼多多时间
// 文档链接:https://open.pinduoduo.com/application/document/api?id=pdd.time.get

(async function () {
    // 注意把api接口名中的点号换成下划线即可,传参请参考文档,没有参数就不用传
    let result = await pddapi.pdd_time_get();
    result = JSON.parse(result.trim());
    console.log(result);
})();

/*
// 如果要使用http服务的话,是这样的写的

const http = require('http')

const hostname = '127.0.0.1'

const port = 8888

// 这里匿名函数要使用async
const server = http.createServer(async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  // 别忘了 await
  let result = await pddapi.pdd_time_get();
  res.end(result+'\n')
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
*/