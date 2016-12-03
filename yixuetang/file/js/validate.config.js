/*
 * validate的配置：自定义验证、中文提示消息等
 */


//英文字母、数字及下划线
jQuery.validator.addMethod("alphanumeric", function(value, element) {
    var length = value.length;
    var tel = /^[a-zA-Z0-9_]+$/;
    return this.optional(element) || tel.test(value);
}, "必须是英文字母、数字及下划线组成");


//两值不相同
jQuery.validator.addMethod("notEqualTo", function(value, element, params) {
	var flag = true;
	if ($(element).val() == $(params).val()) {
		flag = false;
	}
	return this.optional(element) || flag;
}, "不能输入相同值");


//座机和手机 验证
jQuery.validator.addMethod("phone", function(value, element) {
    var length = value.length;
    var tel = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$|^[0-9]{3,4}-[0-9]{7,8}(-[0-9]{1,4})?$/;
    return this.optional(element) || tel.test(value);
}, "电话格式不正确");


//座机 验证
jQuery.validator.addMethod("phone_fix", function(value, element) {
    var length = value.length;
    var tel = /^[0-9]{3,4}-[0-9]{7,8}(-[0-9]{1,4})?$/;
    return this.optional(element) || tel.test(value);
}, "座机格式不正确");


//手机 验证
jQuery.validator.addMethod("mobile", function(value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
}, "手机号格式不正确");


//邮箱 表单验证规则
jQuery.validator.addMethod("email", function (value, element) {
	var mail = /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
	return this.optional(element) || (mail.test(value));
}, "电子邮箱格式不正确");

//正整数 验证
jQuery.validator.addMethod("positiveinteger", function(value, element) {
	var aint=parseInt(value);	
	return aint>0&& (aint+"")==value;   
}, "请输入一个正整数"); 

	  
//整数和浮点数 验证
jQuery.validator.addMethod("isNumber", function(value, element) {       
	return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
}, "请输入正确的数字");


//文件类型 验证
$.validator.addMethod("accept", function(value, element, param) {
	// Split mime on commas in case we have multiple types we can accept
	var typeParam = typeof param === "string" ? param.replace(/\s/g, "").replace(/,/g, "|") : "image/*",
	optionalValue = this.optional(element),
	i, file;

	// Element is optional
	if (optionalValue) {
		return optionalValue;
	}

	if ($(element).attr("type") === "file") {
		// If we are using a wildcard, make it regex friendly
		typeParam = typeParam.replace(/\*/g, ".*");

		// Check if the element has a FileList before checking each file
		if (element.files && element.files.length) {
			for (i = 0; i < element.files.length; i++) {
				file = element.files[i];

				// Grab the mimetype from the loaded file, verify it matches
				if (!file.type.match(new RegExp( ".?(" + typeParam + ")$", "i"))) {
					return false;
				}
			}
		}
	}

	// Either return true because we've validated each file, or because the
	// browser does not support element.files and the FileList feature
	return true;
}, $.validator.format("文件类型不正确"));

//不能只为数字或字母
jQuery.validator.addMethod("notOnly", function(value, element) {
	return this.optional(element) || /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,16}$/.test(value);
}, "密码不能只包含数字或者字母");


jQuery.extend(jQuery.validator.messages, {
    required: "必须填写",
	remote: "请修正此栏位",
	email: "请输入有效的电子邮件" ,
	url: "请输入有效的网址",
	date: "请输入有效的日期",
	dateISO: "请输入有效的日期 (YYYY-MM-DD)" ,
	number: "请输入正确的数字",
	digits: "只可输入数字",
	creditcard: "请输入有效的信用卡号码" ,
	equalTo: "你的输入不相同",
	extension: "请输入有效的后缀" ,
	maxlength: $.validator.format( "最多 {0} 个字符" ),
	minlength: $.validator.format( "最少 {0} 个字符" ),
	rangelength: $.validator.format( "请输入长度为 {0} 至 {1} 之間的字串" ),
	range: $.validator.format( "请输入 {0} 至 {1} 之间的数值" ),
	max: $.validator.format( "请输入不大于 {0} 的数值" ),
	min: $.validator.format( "请输入不小于 {0} 的数值" ),
     
    //自定义验证方法的提示信息
    stringCheck: "用户名只能包括中文字、英文字母、数字和下划线",  
    byteRangeLength: "用户名必须在4-15个字符之间(一个中文字算2个字符)",
    isIdCardNo: "请正确输入您的身份证号码"
});


//自动验证
$("form.auto-validate").validate({
	errorClass: 'v-error',
	errorElement: 'em',
	submitHandler: function(form) {
		$(form).trigger('validate-success');
	}
});