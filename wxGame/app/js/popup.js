/**
 * Created by Administrator on 2016/9/24.
 * 金珂小弹窗
 */
/**
 *
 * @param msg  loading动画 文字信息
 */
window.loadingPopup = function( msg ){
    msg = msg ? msg :'请稍后';
    var list ="";
    for(var i=1; i<=12; i++){
        list+= "<div class='sk-circle"+i+" sk-child'></div>";
    }
    var doms = $("<div class='removeLoading jmcpopup modal' style='display: block'><div class='mask'><div class='loading'>" +
        "<div class='sk-circle'>" + list+ "</div><p class='text-center fz18 color-white mt30'>"+msg+"</p></div></div>");
    $("body").append(doms);
    this.delete = function(){
        doms.remove();
    }
};


/**
 *
 * @param msg             提示信息
 * @param onHideHandler   回调函数
 * @param title            标题
 * @param btns        按钮          obj
 */
window.popup = function (msg, onHideHandler , btns){
    if(typeof  btns != "object"){
        btns = {
            "确定":"btn-yellow"
        }
    }
    var button = '';
    for(var i in btns){
        button += "<button type='button' class='btn "+btns[i]+"'>"+i+"</button>";
    }
    var $dom = $('<div class="jmcpopup modal" style="display:block"><div class="mask"></div><div class="jmcpopup-wrap modal-wrap ctrl-modal"><table><tr><td><h1 class="none mt20">'+msg+'</h1></td></tr><tr><td>'+button+'</td></tr></table></div></div>');
    $('body').append($dom);

    $dom.find("button.btn").on('click',function(){
        var $this = $(this);
        setTimeout(function(){
            $dom.remove();
            if(typeof (onHideHandler) == "function"){
                onHideHandler($this.index()+1)
            }
        },500);
        $dom.remove();
    })
};
/**
 *
 * @param tabNum        桌号
 * @param callback      回调函数 返回用户输入的密码
 * @param btns          按钮
 */
window.writePopup = function(  tabNum,callback,btns){
    if(typeof  btns != "object"){
        btns = {
            "确认":"btn-yellow"
        }
    }
    var button = '';
    for(var i in btns){
        button += "<button type='button' class='btn "+btns[i]+"'>"+i+"</button>";
    }

    var $dom = $('<div class="jmcpopup modal" style="display:block"><div class="mask"></div><div class="jmcpopup-wrap modal-wrap ctrl-modal"><table><tr><td><h1 class="none mt20">请输入 <strong class="color-yellow">'+tabNum+' </strong> 号桌的密码</h1></td></tr><tr><td><input type="password" class="popup-input"></td></tr><tr><td>'+button+'</td></tr></table></div></div>');
    $('body').append($dom);
    $dom.find("button.btn").on('click',function(){
        var $this = $(this),
            $password = $dom.find(".popup-input").val();
        setTimeout(function(){
            $dom.remove();
            if(typeof (callback) == "function"){
                callback($this.index()+1,$password )
            }
        },500);
        $dom.remove();
    })
};