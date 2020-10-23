/**
 * @author lovefc <fcphp@qq.com>
 * @copyright 2020
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * @namespace pddapi
 */
const _https = require('https');
const _url = require('url');
const _querystring = require("querystring");
const _magic = require("./lib/magic");
const _md5 = require('./lib/md5');

class PddApi {
    /**
     * 构造函数
     * 
     * @param {*} config 
     * @param {*} token_json 
     */
    constructor(config = '') {
        this.config = config;
        /*
        this.client_id; // 编号id

        this.client_secret; // 应用密钥

        this.backurl; // 回调地址

        this.access_token; // token
		*/
        this.data_type = 'JSON'; // 接口返回数据格式

        this.api_url = 'https://gw-api.pinduoduo.com/api/router'; // api接口
    }

    /**
     * 生成登录链接
     * @param {string} type 
     */
    getHref(type = '') {
        let query = 'response_type=code&client_id=' + this.client_id + '&redirect_uri=' + this.urlencode(this.backurl) + '&state=1212';
        let url = 'https://mms.pinduoduo.com/open.html?' + query; // pc端
        if (type == 'h5') {
            url = 'https://mai.pinduoduo.com/h5-login.html?' + query + '&view=h5'; // 手机端
        }
        if (type == 'ddk') {
            url = 'https://jinbao.pinduoduo.com/open.html?' + query; // 拼客客
        }
        return url;
    }

    /**
     * 根据code取登录token
     * @param {int} code 
     */
    getToken(code) {
        let url = 'https://open-api.pinduoduo.com/oauth/token';
        let data = {
            "client_id": this.client_id,
            "code": code,
            "grant_type": "authorization_code",
            "client_secret": this.client_secret,
        };
        data = JSON.stringify(data);
        let head = 'application/json';
        return this.post(url, data, head);
    }

    /**
     * 刷新token
     * @param {int} state 
     */
    getNewToken(state = 1212) {
        let url = 'http://open-api.pinduoduo.com/oauth/token';
        let data = {
            "client_id": this.client_id,
            "client_secret": this.client_secret,
            "grant_type": "refresh_token",
            "refresh_token": this.refresh_token,
            "state": state,
        };
        data = JSON.stringify(data);
        let head = 'application/json';
        return this.post(url, data, head);
    }

    /**
     * 构建方法
     * @param {string} prop 
     */
    __get(prop) {
        try {
            if (prop in this) {
                return this[prop];
            } else {
                if (prop.indexOf("pdd_") == 0) {
                    this.pddApiName = prop.replace(/_/g, ".");
                    return this[prop] = this.submit;
                }
                this[prop] = this.config[prop];
                return this[prop];
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * 构建post函数
     * @param {string} url 
     * @param {array}  requestData 
     * @param {string} header
     */
    post(url, requestData = '', header = 'application/x-www-form-urlencoded') {
        let post_option = _url.parse(url);
        let post_data = _querystring.stringify(requestData);
        post_option.method = 'POST';
        post_option.port = 443;
        post_option.headers = {
            'Content-Type': header,
            'Content-Length': post_data.length
        };
        return new Promise((resolve, reject) => {
            let body = '';
            let req = _https.request(post_option, function (res) {
                if (res.statusCode != 200) {
                    reject(res);
                    return;
                }
                res.on('data', function (buffer) {
                    body += buffer;
                });
                res.on('end', function () {
                    resolve(body);
                });
            });
            req.write(post_data);
            req.on('error', (e) => {
                reject(e);
            });
            req.end();
        });

    }

    /**
     * 生成query参数
     * @param {object} data 
     */
    creQuery(data) {
        let arr = {
            'data_type': this.data_type,
            'timestamp': Date.now(),
            'client_id': this.client_id,
            'access_token': this.access_token
        };
        data = Object.assign(data, arr);
        let sign = this.creSign(data);
        data.sign = sign;
        return this.ksort(data);
    }

    /**
     * 生成sign
     * @param {object} query 
     */
    creSign(query) {
        let str = '';
        query = this.ksort(query);
        for (let key in query) {
            str += key + query[key];
        };
        return this.strtoupper(_md5(this.client_secret + str + this.client_secret));
    }

    /**
     * 提交请求
     * @param {object} $data 
     */
    submit(data = '') {
        try {
            let type = {
                'type': this.pddApiName,
            };
            data = Object.assign(data, type);
            data = this.creQuery(data);
            let res = this.post(this.api_url, data);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * ksort
     * @param {object} o 
     */
    ksort(o) {
        let sorted = {},
            keys = Object.keys(o);
        keys.sort();
        keys.forEach((key) => {
            sorted[key] = o[key];
        })
        return sorted;
    }

    /**
     * strtoupper
     * @param {string} str 
     */
    strtoupper(str) {
        return (str + '').toUpperCase();
    }

    /**
     * urlencode
     * @param {*} str 
     */
    urlencode(str) {
        str = (str + '');
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/~/g, '%7E')
            .replace(/%20/g, '+');
    }
}

let pddApi = _magic.applyMagic(PddApi);

module.exports = pddApi;