var gulp = require("gulp"),
	autoprefixer = require("./node_modules/gulp-autoprefixer");
gulp.task("autoadd",function(){
	gulp.src("app/css/style.css")
        .pipe(autoprefixer({
            browsers:['last 2 version','ie>=8','Android>=4.0'],    //浏览器兼容
            cascade:true,        //是否美化属性
            remove:false          //是否去掉不必要的前缀
        }))
		.pipe(gulp.dest("app/css"))
})