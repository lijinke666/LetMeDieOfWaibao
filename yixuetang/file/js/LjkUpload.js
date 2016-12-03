/**
 * Created by lijinke on 2016/6/30.
 * By 李金珂小朋友
 * 头像上传插件 v0.1
 */
/*
    var up = new LjkUpload($(".headImg-popup"),3); // 外面大div,图片最大限制个数
     up.clipImage({
         selectBtn:$(".upload-select-btn"),        //选择按钮
         uploadBtn:$(".upload-upload-btn"),        //上传按钮
         uploadImageBox:$(".move-image"),          //拖拽区域
         clipImage:$(".clip-image"),               //裁剪区域
         range:$("#range"),                        //滑块
         success:function( Src ){                  //裁剪完成回调函数
              alert( Src );                        //Src 返回base64
         }
 })
  */
(function ($) {
    var LjkUpload = function ( element ) {
        this.element = element;
        var $range =  this.element.find("input[type='range']"),     //进度条
            $upload_image_box =  this.element.find(".move-image"),  //图片拖拽区域
            $clip_image =  this.element.find(".clip-image"),        //剪辑区域
            $file_btn =  this.element.find("#file-btn"),                  //file
            isDown = false,                                     //是否按下
            scale = 1.0;                                        //缩放比例

        var isPc = this.isPc();
        this.moveImage( $upload_image_box, isDown, isPc );
        this.showImage( $file_btn, $clip_image, $upload_image_box );
        this.rangeToScale( $range, scale, $upload_image_box );
    };
    LjkUpload.prototype = {
        //是否为PC
        isPc: function () {
            var userAgent = navigator.userAgent;
            var AgentsArray = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (var i = 0; i < AgentsArray.length; i++) {
                if (userAgent.indexOf(AgentsArray[i]) > -1) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        //拖拽图片
        moveImage: function ( ele, isdown, isPc ) {
            var mouseOffsetX = 0,
                mouseOffsetY = 0;
            //按下
            ele.on("mousedown touchstart", function ( e ) {
                var touche = isPc ? e : event.targetTouches[0];
                isdown = true;
                mouseOffsetX = touche.pageX - parseInt(ele.get(0).offsetLeft);
                mouseOffsetY = touche.pageY - parseInt(ele.get(0).offsetTop);
            });
            //离开
            ele.on("mousemove touchmove", function ( e ) {
                e.preventDefault();
                var mouseX = 0,
                    mouseY = 0;
                var touche = isPc ? e : event.targetTouches[0];
                if ( isdown === true ) {
                    mouseX = touche.pageX - mouseOffsetX;
                    mouseY = touche.pageY - mouseOffsetY;
                    ele.css({
                        top: mouseY + "px",
                        left: mouseX + "px"
                    })
                }
            });
            //弹起
            ele.on("mouseup touchend", function ( e ) {
                e.preventDefault();
                isdown = false;
            });
            //移出
            ele.on("mouseout", function ( e ) {
                e.preventDefault();
                isdown = false;
            });
        },
        showImage: function ( fileBtn, upload, showEle ) {
            //获取到文件时
            fileBtn.change(function () {
                upload.find("img").remove();
                if (this.files.length && this.files.length > 1 ) {
                    alert( "只能上传1张图片:)" );
                    return;
                }

                var files = Array.prototype.slice.call( this.files );

                files.forEach( function ( file, i ) {
                    //jpeg png gif    "/image/jpeg"     i对大小写不敏感
                    var fileType = /\/(?:jpeg|png|gif)/i;
                    if (!fileType.test(file.type)) {
                        alert("请选择正确的图片格式(jpeg || png || gif)");
                        return;
                    }
                    //HTML 5.1  新增file接口
                    var reader = new FileReader();
                    //读取失败
                    reader.onerror = function () {
                        alert("读取失败");
                    };
                    //读取中断
                    reader.onabort = function () {
                        alert("网络异常!");
                    };
                    //读取成功
                    reader.onload = function () {
                        var result = this.result;        //读取失败时  null   否则就是读取的结果
                        var image = new Image();
                        image.src = result;
                        showEle.html('').append(image).removeClass("hasImg");
                    };
                    //注入图片 转换成base64
                    reader.readAsDataURL( file );
                })
            });
        },
        //缩放
        rangeToScale: function ( range, scale, ele ) {
            range.on("mousemove touchmove", function ( e ) {
                var _this_ = $(this);
                scale = _this_.val();
                ele.css({
                    "-webkit-transform": "scale(" + scale + ")",
                    "-moz-transform": "scale(" + scale + ")",
                    "-ms-transform": "scale(" + scale + ")",
                    "-o-transform": "scale(" + scale + ")",
                    "transform": "scale(" + scale + ")"
                })
            });
        },
        //裁剪
        clipImage: function ( options ){
            var defaults = {
                selectBtn:$(".upload-select-btn"),
                uploadBtn:$(".upload-upload-btn"),
                uploadImageBox:$(".move-image"),
                clipImage:$(".clip-image"),
                range:$("#range")
            };
            var options = $.extend( defaults , options );
            //选择文件
            options.selectBtn.on("click", function () {
                $("input[type='file']").click();
            });
            options.uploadBtn.on("click",function(){
                if(options.uploadImageBox.hasClass("hasImg")){
                    alert("请选择图片：）");
                    return;
                }
                var $img = options.uploadImageBox.find("img"),
                    canvas = document.createElement("canvas"),
                    ljk = canvas.getContext("2d"),
                    $width = options.clipImage.width(),
                    $height = options.clipImage.height();
                    canvas.width = $width;
                    canvas.height = $height;

                var scale = options.range.val() || options.range.value,
                    sx = parseInt ( options.clipImage.offset().left - options.uploadImageBox.offset().left),
                    sy = parseInt ( options.clipImage.offset().top - options.uploadImageBox.offset().top );
                ljk.drawImage( $img.get(0), sx / scale, sy/ scale, $width / scale, $height / scale, 0, 0 , $width , $height );
                var Src = canvas.toDataURL( "image/png" );
                if( typeof  options.success != "function" ){
                    alert("请使用success回调函数:(");
                    return;
                }
                options.success( Src );
            })
        }
    };
    window['LjkUpload'] = LjkUpload;
})(jQuery);
