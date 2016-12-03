
/**
 * 是否是正整数
 * @param str
 * @returns
 */
function isPInt(str) {
    var g = /^[1-9]*[1-9][0-9]*$/;
    return g.test(str);
}
 
/**
 * 是否是整数
 * @param str
 * @returns
 */
function isInt(str)
{
    var g=/^-?\d+$/;
    return g.test(str);
}

/**
 * IE8 placeholder
 */
if( !('placeholder' in document.createElement('input')) ){  
	$('input[placeholder],textarea[placeholder]').each(function(){   
		var that = $(this),   
		text= that.attr('placeholder');   
		if(that.val()===""){
			that.val(text).addClass('placeholder');
		}
		that.focus(function(){
			if(that.val()===text){
				that.val("").removeClass('placeholder');   
			}   
		}).blur(function(){
			if(that.val()===""){
				that.val(text).addClass('placeholder');   
			}
		}).closest('form').submit(function(){   
			if(that.val() === text){
				that.val('');
			}
		});   
	});   
}

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
					$dom	= init( $this );
					$wrap	= $dom.find('.jmcpopup-wrap');
				}else{
					$wrap	= $this.parent();
					$dom	= $wrap.parent();
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
 * @param	string		msg				消息
 * @param	function	onHideHandler	隐藏后回调
 * @param	int			showTime		显示时间
 * @param	string		desc			描述
 * @param	boolean		issuccess		是否是成功类型
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
 * @param	string		msg				消息
 * @param	function	onHideHandler	隐藏后回调
 * @param	object		btns			按钮: 例 {'取消':'btn-default', '确认':'btn-primary'}
 * @param	string		desc			描述
 * @param	boolean		issuccess		是否是成功类型
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

$(function(){
	//消息数量
	var $msgcount = $('.msg-count'),
		url = $msgcount.data('url');
	if( $msgcount.length>0 ){
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data){
				if( !data.hasOwnProperty('errcode') || data.errcode!=0 ){
					return;
				}
				$msgcount.html(data.data).removeClass('hidden');
			}
		});
	}


	//登录后下拉
	$(".header .user-nav").hover(function(){
		$(this).children(".userdownmenu").stop(true).fadeIn("fast");
	},function(){
		$(this).children(".userdownmenu").stop(true).fadeOut("fast");
	});


	//登录注册弹出框
	$("#login-btn").click(function(){
		$("#login-popup").popup('show',{width:710, height:412});
		$.ajax({
			url: $(this).data('checkverify'),
			dataType: 'json',
			success: function(data){
				if( data.data === true ){
					$('#login-popup .yzm-fieldset').removeClass('hidden');
				}
			}
		});
		return false;
	});


	//点击发送短信验证码
	$('#send_smscode').click(function(){
		var $btn = $(this);
		if( $btn.hasClass('ing') ){
			return;
		}	
		
		//验证短信
		var $form     = $btn.parents('form'),
			mobile_re = /^1\d{10}$/,
			mobile    = $form.find('input[name="mobile"]').val();
			
		//是否有验证码
		var haveverifycode = $btn.data('haveverifycode');
		if( typeof(haveverifycode) != 'undefined' && haveverifycode!='false' ){
			var verifycode = $form.find('input[name="verifycode"]').val();
			if( verifycode.length < 3 ){
				refirshVerify($form.find(".img-code").get(0));
				return jmcAlert('请填写正确的图形验证码');

			}
		}
		
		if( !mobile_re.test(mobile) ){
			return jmcAlert('请填写正确的手机号码');
		}
		
		//发送
		$.ajax({
	       	url: $btn.data('url'),
	       	type: 'post',
	       	data: {mobile:mobile, verifycode:verifycode},
	       	dataType: 'json',
	       	cache: false,
	       	error: function(){
	       		$btn.text('获取验证码').removeClass('ing');
	       	},
	       	success: function(data){
	       		if( data.errcode && data.errcode>0 ){
	       			$btn.text('获取验证码').removeClass('ing');
	       			return jmcAlert( data.errmsg ? data.errmsg : '发送失败',false );
	       		}
	       		jmcAlert('发送成功',true);
	       		var i = 120;
	       		var n = setInterval(function(){
	       			$btn.text(i+'秒后重发');
	       			if(i==0){
	       				clearInterval(n);
	       				$btn.html('获取验证码').removeClass('ing');
	       			}
	       			i--;
	       		}, 1000);
	       	}
		});
		$btn.addClass('ing');
	});

	//顶部退出个人中心
	$("#header-logout").click(function() {
		var url = $(this).data('url');
		jmcConfirm('您确定要退出吗？', function(index){
			if( index==2 ) {
				location.href = url;
			}
		}, {'暂不退出':'btn-grey','确定退出':'btn-primary'})
	});

});


//检查字符长度   中文算两个 英文算一个

function WidthCheck(str, maxLen){
	var w = 0;
	var tempCount = 0;
	for (var i=0; i<str.value.length; i++) {

		var c = str.value.charCodeAt(i);

		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			w++;
		}
		else {
			w+=2;
		}
		if (w > maxLen) {
			str.value = str.value.substr(0,i);
			break;
		}
	}
}
//  浏览器为谷歌提示

function isChrome(){
    var pattern = /^Mozilla\/5.0 \(.*\) AppleWebKit\/[0-9.]{1,} \(KHTML, like Gecko\) Chrome\/[0-9.]{1,} Safari\/[0-9.]{1,}$/;
    return pattern.test(window.navigator.userAgent);
}

// 购物车商品数量添加
/**
 *
 * @param ele    节点
 * @param numShowBox   数量显示div
 * @param operator     增加还是减少　　'up'  or 'down'
 */
function calculate_Price( ele ,numShowBox, operator ){
    if(typeof ele != "object"){
        return ;
    }
    var prize = $(".price"),
        prize_num = parseInt(prize.html()); //单价

        numShowBox.on("change",function(){
            var  num = parseInt(numShowBox.val());   //数量
            var check = /^[0-9]\d*$/.test(num);
            if(!check){
                return false;
            }
            prize.html( num * prize_num );
        });

        ele.on('click',function(){
            var num_style = numShowBox,
                num = parseInt(num_style.val());   //数量
            if(operator=="up"){
                num++;
                prize.html( parseInt(prize.html()) + prize_num );
                num_style.val(num);
            }else{
                if(num>1){
                    num--;
                    prize.html( parseInt(prize.html()) - prize_num );
                    num_style.val(num);
                }
            }
        });

}