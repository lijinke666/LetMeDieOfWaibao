/**
 * Created by Administrator on 2016/4/14.
 */
$(function(){

/**
 * 弹出层
 * 调用：popup
 */
(function($) {
    function init($d){
        var $dom = $('<div class="jmcpopup modal"><div class="mask"></div><div class="jmcpopup-wrap modal-wrap"><div class="btn-close"><span class="icon-cross"></span></div></div></div>');
        $('body').append( $dom );
        
        $dom.find('.btn-close').on('click', function(){
            $dom.fadeOut('fast');
        });
        
        $dom.find('.jmcpopup-wrap').on('click', function(e){
            e.stopPropagation();
        }).append( $d );
        
        $d.addClass('initd');
        
        return $dom;
    }
    
    $.fn.popup = function(type, options) {
        return this.each(function() {
            var $this = $(this);
            if( type == 'show' ){
                var $dom,$wrap;
                if( ! $this.hasClass('initd') ){
                    $dom    = init( $this );
                    $wrap   = $dom.find('.jmcpopup-wrap');
                }else{
                    $wrap   = $this.parent();
                    $dom    = $wrap.parent();
                }
                if( options && options.width && options.height ){
                    $wrap.css({'width':options.width, 'height':options.height});
                }
                $dom.fadeIn('fast');
                $this.css('display', 'block');
            }else if( type=='hide' ){
                $this.css('display', 'none').parent().parent().fadeOut('fast');
            }
        });     
    };  
})(jQuery);

/**
 * 提示框
 * @param   string      msg             消息
 * @param   function    onHideHandler   隐藏后回调
 * @param   int         showTime        显示时间
 * @param   string      desc            描述
 * @param   boolean     issuccess       是否是成功类型
 */
window.Alert = function(msg, issuccess, onHideHandler, showTime, desc){
    var typestr;
    if ( issuccess == true){
        typestr = '<div class="gou"><span class="icon-zhengque"></span></div>';
    }else if(issuccess == false){
        typestr = '<div class="cha"><span class="icon-cuowu"></span></div>';
    }else{
        typestr = '<div class="tanhao"><span class="icon-gantanhao"></span></div>';
    }
    desc = desc ? '<p class="fz16">'+desc+'</p>' : '';
    var $dom = $('<div class="jmcpopup modal" style="display:block"><div class="mask"></div><div class="jmcpopup-wrap modal-wrap ctrl-modal"><table><tr><td>'+typestr+'<h1 class="none mt20">'+msg+'</h1>'+desc+'</td></tr></table></div></div>');
    $('body').append($dom);

    if( typeof showTime == 'undefined' ){
        showTime = 1500;
    }else{
        showTime = Math.max( parseInt(showTime), 1500 );
    }
    var i=setTimeout(function(){
        clearTimeout(i);
        setTimeout(function(){
            $dom.remove();
            if( typeof(onHideHandler) == 'function'){
                onHideHandler();
            }
        }, 500);
        $dom.css('opacity', 0);
    }, showTime);
}

/**
 * 确认框
 * @param   string      msg             消息
 * @param   function    onHideHandler   隐藏后回调
 * @param   object      btns            按钮: 例 {'取消':'btn-default', '确认':'btn-primary'}
 * @param   string      desc            描述
 * @param   boolean     issuccess       是否是成功类型
 */

window.Confirm = function(msg, onHideHandler, btns, desc, issuccess){
    if( typeof btns !== 'object' ){
        btns = {'确定':'btn-primary'};
    }
    var btnstr = '';
    for( var key in btns){
        btnstr += '<button type="button" class="btn '+btns[key]+'">'+key+'</button>';
    }

    var typestr = '<div class="tanhao"><span class="iconfont icon-gantanhao"></span></div>';
    desc = desc ? '<p class="fz16">'+desc+'</p>' : '';
    var $dom = $('<div class="jmcpopup modal" style="display:block"><div class="mask"></div><div class="jmcpopup-wrap modal-wrap ctrl-modal"><table><tr><td>'+typestr+'<h1 class="none mt30">'+msg+'</h1>'+desc+'</td></tr><tr><td class="btnbox">'+btnstr+'</td></tr></table></div></div>');
    $('body').append($dom);
    $dom.find('button').on('click', function(){
        var $btn = $(this);
        setTimeout(function(){
            $dom.remove();
            if( typeof onHideHandler == 'function' ){
                onHideHandler( $btn.index() + 1 );
            }
        }, 500);
        $dom.css('opacity', 0);
    });
}

/**
 * 未登录提示
 */
window.notloginConfirm = function(){
    Confirm('您还未登录', function(index){
        if(index==2){
            $('#login-popup').popup('show');
        }
    }, {'暂不登录':'btn-default','立即登录':'btn-primary'})
}

//刷新登录验证码
function refirshVerify(img){
    var $img = $(img);
    $img.parents('fieldset').removeClass('hidden');
    var url = $img.data('url');
    $(img).attr("src", url+"?"+Math.random());
}


})