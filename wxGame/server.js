/**
 * Created by Administrator on 2016/9/26.
 */
var express = require("./node_modules/express");
var crypto = require("crypto");
var request = require("request");     //http请求模块
var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname+("/app")));
app.use(express.methodOverride());
app.use(app.router);
var token = "weixin" ,         //token
    appID = "wx3ba18d0ad0e1471d",       //app id
    appSecret ="f8dd188ec219eefe27c01ff1c944db4f";  //秘钥
var headImg = [];
// app.get("/",function( req,res ){
//     // res.redirect("home.html");
//     //微信服务器发过来的数据
//     var signature = req.query.signature,        //加密签名
//         timestamp = req.query.timestamp,         //时间戳
//         nonce = req.query.nonce,                 //随机数
//         echostr = req.query.echostr;            //随机字符串
//     /*  加密/校验流程如下： */
//     //1. 将token、timestamp、nonce三个参数进行字典序排序
//     var array = [token,timestamp,nonce];
//     array.sort();
//     var str = array.toString().replace(/,/g,"");
//
//     //2. 将三个参数字符串拼接成一个字符串进行sha1加密
//     var sha1Code = crypto.createHash("sha1");
//     var code = sha1Code.update(str,'utf-8').digest("hex");
//     console.log("请求的微信加密签名："+signature);
//     console.log("服务器加密签名："+code);
//
//     //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//     if(code===signature){
//         res.send(echostr)
//
//     }else{
//         res.send("请求来源不是微信的~");
//     }
// });
app.get("/",function(req,res){
    res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appID+"&redirect_uri=http://q158i32573.iask.in/getWXheaderimgurl.do&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect")
});
app.get("/souquan.do",function( req,res ){
    //第一步
    //用户同意授权后  返回一个 授权之后的地址 返回一个 code 通过code换取网页授权access_token
    //state 是重定向之后的参数  可不填
    res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appID+"&redirect_uri=http://q158i32573.iask.in/getWXheaderimgurl.do&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect")

});
app.get("/getWXheaderimgurl.do",function(req,res){
    //第二步
    //通过code换取网页授权access_token       code5分钟失效
    var code = req.query.code;           //因为授权是get请求 通过 req.query.code  可以拿到code
    request.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appID+"&secret="+appSecret+"&code="+code+"&grant_type=authorization_code",function(error,ress,data){
        var dataJson = JSON.parse(data);      //转换成json
        var access_token = dataJson.access_token,       //access_token  令牌
            openId = dataJson.openid;                   //唯一标识  openId

        //第三部
        //获取用户信息
        request.get("https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openId+"&lang=zh_CN ",function(err,ress,data){
            var userInfo = JSON.parse(data);
            var nickname = userInfo.nickname,          //昵称
                headimgurl = userInfo.headimgurl;      //头像
                headImg.push(headimgurl);
            res.redirect("home.html")
        })
    })
});
app.get("/sendHeadImg",function(req,res){
    var headImgUrl =[],      //数组去重后的
        obj ={};
    for(var i=0; i<headImg.length; i++){
        if(!obj[headImg[i]]){
            headImgUrl.push(headImg[i]);
            obj[headImg[i]] = 1;
        }
    }
    res.send(headImgUrl.join(","));
});
app.listen(80,function(){
    console.log("来不及解释了,快上车~");
});