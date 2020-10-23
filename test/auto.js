"use strict"
// 导入pddapi模块
const _pddapi = require('pddapi');
// 导入http模块
const _http = require('http');
// url模块,解析url
const _url = require("url");

// 实例化这个类,需要这三个参数(在开发平台申请应用后得到的)
let pddapi = new _pddapi({
    "client_id": 'xxx',
    "client_secret": 'xxxx',
    "backurl": 'xxxx'
});

// 创建http server，并传入回调函数:
let server = _http.createServer(async function (request, response) {
	let href = pddapi.getHref();
	// 将HTTP响应200写入response, 同时设置Content-Type: text/html:
	response.writeHead(200, {
		'Content-Type': 'text/html'
	});
	// 这个请求是请求ico文件的,可屏蔽
	if (request.url === '/favicon.ico') {
		return;
	}
	// 解析url,如果作为回调地址,会传回一个code值,这里就是取值判断
	let params = _url.parse(request.url, true);
	let code = params.query.code;
	// 有这个值的话,就来取token
	console.log(code);
	if (code) {
		let token = await pddapi.getToken(code);
		console.log(token);
		response.end(token);
	} else {
		response.end('<a href="' + href + '">登录授权地址</a>')
	}
});
// 让服务器监听8080端口(端口号是可以自己改的,端口范围:1024-65535,1024以下是系统保留的端口)
// 记得在实际使用中,要去开启端口,防火墙要放行,如果是云服务器,记得去配置安全规则,放行这个端口,不要说代码出bug了,打不开页面
// 如果你安装了nginx,可以配置下转发
server.listen(8080);


/** 
 * 案例注释很全,跑不起来就是你的问题了哦,上面没有除了pddapi模块,基本上不依赖任何其它的外置模块了
 * 遇到bug记得向我反馈哦
 */