/**
 * Created by Administrator on 2016/6/4.
 */
var filechooser =document.getElementById("choose");

// 用于压缩图片的canvas

var canvas =document.createElement("canvas");

var ctx =canvas.getContext('2d');

// 瓦片canvas

var tCanvas =document.createElement("canvas");

var tctx =tCanvas.getContext("2d");

var maxsize =100*1024;
//var upload=$("#upload");

$("#upload").on("click", function () {

    filechooser.click();

})

    .on("touchstart", function () {

        $(this).addClass("touch")

    })

    .on("touchend", function () {

        $(this).removeClass("touch")

    });

filechooser.onchange=function () {

    if (!this.files.length) return;

    var files =Array.prototype.slice.call(this.files);

    if (files.length>2) {

        alert("最多同时只可上传2张图片");

        return;

    }

    files.forEach(function (file, i) {

        if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;

        var reader =new FileReader();

        var li =document.createElement("li");

        // 获取图片大小

        var size =file.size/1024>1024? (~~(10*file.size/1024/1024))/10+"MB":~~(file.size/1024) +"KB";

        li.innerHTML='<div class="progress"><span></span></div><div class="size">'+size+'</div>';

        $(".img-list").append($(li));

        reader.onload=function () {

            var result =this.result;

            var img =new Image();

            img.src= result;

            $(li).css("background-image", "url("+ result +")");

            //如果图片大小小于100kb，则直接上传

            if (result.length<= maxsize) {

                img =null;

                //upload(result, file.type, $(li));

                return;

            }

            // 图片加载完毕之后进行压缩，然后上传

            if (img.complete) {

                callback();

            } else {

                img.onload= callback;

            }

            function callback() {

                var data =compress(img);

                //upload(data, file.type, $(li));

                img =null;

            }

        };

        reader.readAsDataURL(file);

    })

};

// 使用canvas对大图片进行压缩

function compress(img) {

    var initSize = img.src.length;

    var width = img.width;

    var height = img.height;

    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下

    var ratio;

    if ((ratio = width * height / 4000000) > 1) {

        ratio = Math.sqrt(ratio);

        width /= ratio;

        height /= ratio;

    } else {

        ratio = 1;

    }

    canvas.width = width;

    canvas.height = height;

    // 铺底色

    ctx.fillStyle = "#fff";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //如果图片像素大于100万则使用瓦片绘制

    var count;

    if ((count = width * height / 1000000) > 1) {

        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

        // 计算每块瓦片的宽和高

        var nw = ~~(width / count);

        var nh = ~~(height / count);

        tCanvas.width = nw;

        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {

            for (var j = 0; j < count; j++) {

                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);

            }

        }

    } else {

        ctx.drawImage(img, 0, 0, width, height)
    }
    ;
};