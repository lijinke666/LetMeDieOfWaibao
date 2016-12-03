/**
 * Created by Wangnanping on 2016/4/20.
 */
var turnplate={
    restaraunts:[],				//大转盘奖品名称
    colors:[],					//大转盘奖品区块对应背景颜色
    outsideRadius:192,			//大转盘外圆的半径
    textRadius:155,				//大转盘奖品位置距离圆心的距离
    insideRadius:60,			//大转盘内圆的半径
    startAngle:0,				//开始角度

    bRotate:false				//false:停止;ture:旋转
};
var playersArray = [];       //玩家个数
var playersMax ={            //最大玩家数量
    playerMax:10,
    playerMin:2
};
$(function(){
    pushPlayer( playersArray );
    setPlayerActive(0);       //默认激活第一个玩家
    //模拟10秒后进来一个新玩家
    // setTimeout(function(){
    //     createPlayer()
    // },10000)
});
//有新玩家进来 添加到界面上
function createPlayer( options ){
    var defaults = {
        wxHeadImg:"images/headImg.jpg"
    };
    var options = $.extend(defaults,options);
    var $playerList = $('<li class="box-flex-1 item scale0"><img src="'+options.wxHeadImg+'" alt="loading.."></li>'),
        $ListShowBox = $(".game-player-items");
    $playerList.addClass("scale1");
    $ListShowBox.append($playerList);
    playersArray.push($playerList)
}
//获得当前哪个玩家处于激活状态
function getActiveIndex(){
    var index = null;
    $(".game-player-items").find("li.item").each(function(){
        var $this = $(this);
        if($this.hasClass("active")){
            index = $this.index()+1;
        }
    });
    return index;
}
//随机一个游戏玩家
function randomPlayerActive(){
    setPlayerActive( rnd(1,playersArray.length) )
}
//显示当前玩家
function setPlayerActive( index ){
    $(".game-player-items").find("li.item").removeClass("active")
        .eq(index).addClass("active")
}
//获取当前有多少个玩家
function pushPlayer( playersArray ){
    var players = $(".game-player-items").find("li.item");
    players.each(function( i,item ){
        playersArray.push(item)
    })
}
$(document).ready(function(){
    //动态添加大转盘的奖品与奖品区域背景颜色
    //文案
    turnplate.restaraunts =
        ["自己喝一指", "自己喝一半", "自己全干",
            "对面喝一指", "对面喝一半", "对面全干",
            "左边喝一指","左边喝一半","左边全干",
            "右边喝一指","右边喝一半","右边全干"
        ,"左右边干一杯","指定一人喝","选择二人交杯"];
    //文案对应背景色
    turnplate.colors =
        ["#55B6BE", "#ECECEC", "#FF9700",
            "#55B6BE","#ECECEC", "#FF9700",
            "#55B6BE","#ECECEC", "#FF9700",
            "#55B6BE","#ECECEC", "#FF9700",
            "#55B6BE","#ECECEC","#FF9700"
        ];


    var rotateTimeOut = function (){
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:2160,
            duration:8000,
            callback:function (){
                popup('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt){
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        var randomIndex = rnd(1,playersArray.length),         //随机被选中的下标
             index = getActiveIndex(),    //当前玩家active状态的下标     //从这个下标开始跑马灯
            endTime = 0;        //用来判断是否停止计时器
        var endSet = setInterval(function(){
                setPlayerActive(index);
                if( index== playersArray.length-1){
                    index=0;
                }else{
                    index++
                }
                if(endTime== 67){
                    setPlayerActive(randomIndex-1);
                    clearInterval(endSet);
                    endTime = 0;
                }
                endTime ++;
             },100);

        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:angles+1800,
            duration:8000,             //转多久
            callback:function (){
                // togglePlayerActive( getActiveIndex() );
                //这里的index  指的弹出匡的按钮的下标  从1开始
                popup(txt,function( index ){
                    //如果点击了确定则开始下一轮
                    if(index ==1){

                    }
                },{"喝完了":"btn-yellow"});
                turnplate.bRotate = !turnplate.bRotate;
            }
        });
    };



    //点击开始喝酒触发  转盘
    $('.pointer').on('click',function (){
        if( playersArray.length<playersMax.playerMin){
            return popup('2人以上才能开始游戏',function(){

            },'提示',{'确定':'btn-primary'})
        }else{
            if(turnplate.bRotate)return;
            turnplate.bRotate = !turnplate.bRotate;
            //获取随机数(奖品个数范围内)
            var item = rnd(1,turnplate.restaraunts.length);
            //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]

            rotateFn(item, turnplate.restaraunts[item-1]);
        }


    });
});
//获取随机数
function rnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;

}


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
    drawRouletteWheel();
};

function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFF";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';
        for(var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----

            //如果是白色底色 绘制较深的颜色
            if(turnplate.colors[i] == "#ECECEC"){
                ctx.fillStyle = "#A44404"
            }else{
                ctx.fillStyle = "#FFF";
            }
            var text = turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            // if(text.indexOf("M")>0){//流量包
            //     var texts = text.split("M");
            //     for(var j = 0; j<texts.length; j++){
            //         ctx.font = j == 0?'bold 20px Microsoft YaHei':'16px Microsoft YaHei';
            //         if(j == 0){
            //             ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
            //         }else{
            //             ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
            //         }
            //     }
            // }else if(text.indexOf("M") == -1 && text.length>6){//奖品名称长度超过一定范围
            //     text = text.substring(0,6)+"||"+text.substring(6);
            //     var texts = text.split("||");
            //     for(var j = 0; j<texts.length; j++){
            //         ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
            //     }
            // }else{
            //     //在画布上绘制填色的文本。文本的默认颜色是黑色
            //     //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.save();
                ctx.translate(-10,15);
                ctx.rotate( 90/180*Math.PI );
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                ctx.restore();
            // }
            //
            // //添加对应图标
            // if(text.indexOf("闪币")>0){
            //     var img= document.getElementById("shan-img");
            //     img.onload=function(){
            //         ctx.drawImage(img,-15,10);
            //     };
            //     ctx.drawImage(img,-15,10);
            // }else if(text.indexOf("谢谢参与")>=0){
            //     var img= document.getElementById("sorry-img");
            //     img.onload=function(){
            //         ctx.drawImage(img,-15,10);
            //     };
            //     ctx.drawImage(img,-15,10);
            // }
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}

