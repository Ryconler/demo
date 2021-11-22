function initUserInfoForm(obj){
	obj.userInfoFormInit = {
		showSex: false,
		sexOptions: ['男', '女'],
		showBirthday: false,
		minDate: new Date(1900, 0, 1),
		maxDate: new Date(),
		currentDate: new Date(),
		showArea:false,
		areaList:areaList,
	}
}
function getUserInfo(obj) {
	let url = obj.baseApiUcenter + "/user/query?userId=" + obj.openId
	let that = obj
	$.ajax({
		type : "get",
		url : url,
		success : function(data) {
			if (data.status == 200) {
				let user = data.result;
				that.userWechat = user;

				let sex = ""
				if (user.sex == 1) {
					sex = "男"
				} else if (user.sex == 2) {
					sex = "女"
				}
				that.sexLocal = sex
				
				that.birthdayLocal = formatYyyyMMdd(user.birthday, "/")

				that.area = user.location
				that.birthdayTimestamp = user.birthdday

        that.userInfo.avatar = data.result.avator;
        that.userInfo.nickname = data.result.nickname;
			}
		}
	})
}

function updateUserInfo(obj) {
	obj.hideUserInfo();
	let url = obj.baseApiUcenter + "/user/update?userId=" + obj.openId
	let sexInt = 0;
	if (obj.sexLocal == '男') {
		sexInt = 1
	} else if (obj.sexLocal == '女') {
		sexInt = 2
	}

	let userWechat = obj.userWechat;
	userWechat.sex = sexInt;
	userWechat.location = obj.area;
	userWechat.birthday = obj.birthdayTimestamp

	$.ajax({
		type : "post",
		url : url,
		contentType : "application/json",
		data : JSON.stringify(userWechat),
		success : function(data) {
			if (data.status == 200) {
				console.log("updateUserInfo success")
			}
		}
	})
}

function hideUserInfo(obj) {
	obj.toggle('personInfo');
}

function onConfirmArea(obj,values) {
	obj.area = values.map((item) => item.name).join('|');
	obj.userInfoFormInit.showArea = false;
}
function onConfirmBirthday(obj,date) {
	obj.birthdayLocal = formatYyyyMMdd(date.getTime(),"/")
	obj.birthdayTimestamp = date.getTime()
	obj.userInfoFormInit.showBirthday = false;
}
function onConfirmSex(obj,value) {
	obj.sexLocal = value;
	obj.userInfoFormInit.showSex = false;
}
function formatYyyyMMdd(timestamp,split){
	
	let date = new Date(timestamp);
	let year = date.getFullYear();
	
	let month = date.getMonth()+1;
	month = month<10?'0'+month:month;
	
	let day = date.getDate();
	day = day<10?'0'+day:day;

	return year+split+month+split+day;
}

function formatYyyyMMdd2Long(yyyyMMdd){
	yyyyMMdd = yyyyMMdd.replace(/-/g,'/'); 
	return new Date(yyyyMMdd).getTime();
}