/**
 * Created by Administrator on 2016/4/14.
 */
$(function(){

    /*返回顶部*/
    var come_back = $(".come-back");
    var body = $("body");
    var $window = $(window);
    $window.scroll(function(){
        var top = $(document).scrollTop();
        if(top>=300){
            come_back.fadeIn();
        }else{
            come_back.fadeOut();
        }
    });
    come_back.click(function(){
        body.animate({"scrollTop":0},300)
    });

    /*后退*/
    window.back=function(url){
        if(history.length>1){
            history.back();
        }else{
            if(typeof url =="undefined" || !url){
                url="/"
            }
            history.href=url;
        }
    };

    /*提示框*/
    //msg  提示信息    showTime  显示时间   type  类型  true为叉叉  false为勾勾
    window.Alert=function(msg,showTime,type){
        if(typeof msg=='undefined'){
            msg="错误"
        }
        if(typeof showTime=="undefined"){
            showTime=1500
        }else{
            showTime= Math.max(parseInt(showTime),1500);
        }
        if(typeof type=="undefined"){
            type=false;
        }
        var div="";
        if(type){
            div= $("<div class='err-tip'><span class='icon-true color-green'></span>"+msg+"</div>");
        }else{
            div= $("<div class='err-tip'><span class='icon-error color-red'></span>"+msg+"</div>");
        }
        var body = $("body");
        body.append(div);
        var remove=setTimeout(function(){         //先执行动画  再移除
            clearTimeout(remove);
            setTimeout(function(){
                div.remove();
            },500);
            div.fadeOut();
        },showTime)
    };
    /*购物车*/
    //数量增减
        var num_down = $(".num-down"),   //减少
            num_up = $(".num-up"),       //增加
            num = $(".num"),        //当前数量
            price= $(".price"),    //当前金额
            AllPriceShow = $(".AllPrice"),  //总价显示框
             AllPrice=null;//总价
        function each(){
            price.each(function(){
                AllPrice+=parseInt($(this).html());

            });
            AllPriceShow.html(AllPrice);
        }
        each();
        num_down.click(function(){
            AllPrice=null;
            var $this= $(this),
             thisNum = $this.parent().find(".num"),         //当前数量
             thisNumber = thisNum.html(),
             thisAllPrice=$(this).parent().parent().siblings().find(price), //当前价格
            thisPrice = thisNum.data("price");    //当前单价
            if(thisNumber=="0"){
                thisNum.html(thisNumber);
                $this.addClass("color-c").attr("disabled",true);
            }else{
                thisAllPrice.html(thisAllPrice.html()-thisPrice);
                thisNum.html(parseInt(thisNumber)-1);
                $this.removeClass("color-c")
            }
            each();
        });
        num_up.click(function(){
            AllPrice=null;
            var $this= $(this),
                 thisNum = $this.parent().find(".num"),        //当前数量
                 thisNumber = thisNum.html(),
                 thisAllPrice=$(this).parent().parent().siblings().find(price), //当前价格
                thisPrice = thisNum.data("price");     //当前单价
            thisAllPrice.html(parseInt(thisAllPrice.html())+thisPrice);
            thisNum.html(parseInt(thisNumber)+1);
            $this.removeClass("color-c");
            each();
        });



})