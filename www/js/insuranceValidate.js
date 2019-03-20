
/* 在线投保——信息录入  表单验证，奚亚文 */

//静态tab页验证信息
var staticValidateInfo = new Array();
//告知tab页验证信息
var impartValidateInfo = new Array();
//告知内容所在的div Id
var impartDivIdArray = ["applicant_know", "recognizee_know", "agent_know", "customer_know"];

//静态表单内容验证信息
staticValidateInfo[0] = {"needValidateDiv":{"pad":"applicantInfoTable","phone":"applicantInfoTableOfPhone"},"validateMessage":"投保人信息录入不全，请完善！","noValidateIds":{"pad":"a_occupation_other,a_phone,a_email","phone":"phone_a_occupation_other,phone_a_phone,phone_a_email"}};
staticValidateInfo[1] = {"needValidateDiv":{"pad":"recognizeeInfoTable","phone":"recognizeeInfoTableOfPhone"},"validateMessage":"被保人信息录入不全，请完善！","noValidateIds":{"pad":"i_occupation_other,i_phone,i_email","phone":"phone_i_occupation_other,phone_i_phone,phone_i_email"}};
staticValidateInfo[2] = {
	"relation":"受益人[benefitName]的系被保人关系为必填项，请选择！",
	"order":"受益人[benefitName]的受益顺序不能为空，请选择！",
	"rate":"受益人[benefitName]的受益比例不能为空，请输入！",
	"rateTotal":"受益人的受益比例之和不能超过100%，请重新输入！"
};
//投保事项
staticValidateInfo[3] = {"bankInfoRadioName":"bank","selectBankcardInfo":"请选中银行卡信息！","addBankcardMessage":"请添加银行卡信息！"};
//告知验证信息
impartValidateInfo = ["投保人告知均为必填项，请填写！","被保人告知均为必填项，请填写！","业务员告知均为必填项，请填写！","客户尽职调查问卷内容录入不完整，请检查！"];

//点击下一步按钮时判断‘信息录入’中tab页位置，若当前tab页在最后一个，则跳转至下一步对应页面，否则切换‘信息录入’中的tab页
function validateTabChangeOfNextStep($scope){
	
	var isShowAppntImpart = $scope.showAppntImpart;	//是否显示投保人告知tab页
	var activeTab = $scope.step2.activeTab;			//当前选项卡（切换之前的选项卡）序号
	
	var pcType = document.getElementById("pctype").value;	//设备类型('phone':手机版)

	//验证当前tab页内容,若验证不通过则停留当前tab页
	var validateResult = insuranceFormValidateOfTab($scope,activeTab);
	if(!validateResult){
		return false;
	}
	//若当前tab页内容验证通过，则跳转到下一个tab页
	var nextTab = activeTab + 1;
	//若‘投保人告知’tab页不显示，则跳过该tab页
	if(nextTab == 5 && (!isShowAppntImpart)){
		nextTab += 1;
	}
	//若‘信息录入’模块中所有tab页内容均验证通过，则跳转至下一个模块
	if(nextTab == 8){
		//‘信息录入’中，到最后一个tab页时验证所有tab页内容
		var validateAllResult = insuranceFormValidateAll($scope);
		if(!validateAllResult){
			return false;
		}
		nextTab = 1;
		//切换到第一个tab页
		$scope.clickTab2(nextTab);
		return true;
	}
	$scope.clickTab2(nextTab);
	return false;
}

//点击上一步按钮时判断‘信息录入’中tab页位置，若当前tab页在第一个则跳转至上一步对应页面，否则切换‘信息录入’中的tab页
function validateTabChangeOfPrevStep($scope){
	var isShowAppntImpart = $scope.showAppntImpart;	//是否显示投保人告知tab页
	var activeTab = $scope.step2.activeTab;			//当前选项卡（切换之前的选项卡）序号
	var prevTab = activeTab - 1;
	if(prevTab == 5 && (!isShowAppntImpart)){
		prevTab -= 1;
	}
	if(prevTab == 0){
//		prevTab = 1;
//		$scope.clickTab2(prevTab);
		return true;
	}
	$scope.clickTab2(prevTab);
	return false;
}

/**
 * 信息录入中表单验证，验证全部tab页内容
 * @param $scope
 * @return
 */
function insuranceFormValidateAll($scope){
//alert("insuranceFormValidateAll");
	//验证结果
	var validateResult = true;
	//是否显示投保人告知tab页
	var isShowAppntImpart = $scope.showAppntImpart;
	
	//验证静态表单
	for(var i = 1 ; i <= 7 ; i++){
		if(i == 5 && (!isShowAppntImpart)){
			continue;
		}
		validateResult = insuranceFormValidateOfTab($scope,i);
		if(!validateResult){
			return false;
		}
	}
	return true;
}

/**
 * 信息录入中表单验证，单个选项卡验证，仅适合静态表单
 * @param $scope
 * @param currentTabIndex:当前tab页索引
 * @return
 */
function insuranceFormValidateOfTab($scope,activeTab){
//alert("insuranceFormValidateOfTab:"+activeTab);
	//验证结果
	var validateResult = true;
	//验证信息录入中静态tab页内容
	if(activeTab >= 1 && activeTab <= 4){
		//静态tab页索引
		var staticTabIndex = activeTab - 1;
		//当前tab页的验证信息
		var validateInfo = staticValidateInfo[staticTabIndex];
		if(!validateInfo){
			return validateResult;
		}

		//设备类型('phone':手机版)
		var pcType = document.getElementById("pctype").value;
		var pcName = (pcType == "phone") ? "phone" : "pad";
		

		//投保人和被保人信息验证
		if(activeTab == 1 || activeTab == 2){
			//获取页面投被保人的值
			//var a_nation_place=document.getElementById('a_nation_place').innerText;//国籍
			//var a_rgt_address=document.getElementById('a_rgt_address').innerText;//户籍所在地
			var phone_a_id_name = document.getElementById('phone_a_id_name').innerText; //投保人证件类型phone
			var a_id_name = document.getElementById('a_id_name').innerText;
			var a_id_no = document.getElementById('a_id_no').innerText; //投保人证件号码
			var phone_a_id_no = document.getElementById('phone_a_id_no').innerText;
			var phone_a_id_end_date = document.getElementById('phone_a_id_end_date').innerText;//投保人证件有效期
			var a_id_end_date = document.getElementById('a_id_end_date').innerText;
			var i_id_name = document.getElementById('i_id_name').innerText;//被保人证件类型pad
			var phone_i_id_name = document.getElementById('phone_i_id_name').innerText;
			var i_id_no = document.getElementById('i_id_no').innerText;//被保人证件号码
			var phone_i_id_no = document.getElementById('phone_i_id_no').innerText;
			var phone_i_id_end_date = document.getElementById('phone_i_id_end_date').innerText;//投保人证件有效期 
			var i_id_end_date = document.getElementById('i_id_end_date').innerText; 
			var phone_a_nation_place = document.getElementById('phone_a_nation_place').innerText;//投保人国籍phone
			var a_nation_place = document.getElementById('a_nation_place').innerText;
			var phone_i_nation_place = document.getElementById('phone_i_nation_place').innerText;//被保人国籍phone
			var i_nation_place = document.getElementById('i_nation_place').innerText;
			//var phone_a_id_end_date=document.getElementById('phone_a_id_end_date').innerText;
			//被保人年龄小于18，年收入，收入来源，工作单位不应填写
			var r_age = document.getElementById('phone_i_birthday').innerText; //被保人出生日期
			var r_age_pc = document.getElementById('i_birthday').innerText;
			var phone_i_occupation = document.getElementById('phone_i_occupation').innerText;//被保人职业
            var phone_i_occupation_code = document.getElementById('phone_i_occupation_code').innerText;//被保人职业代码
			var i_occupation = document.getElementById('i_occupation').innerText;
            var i_occupation_code = document.getElementById('i_occupation_code').innerText;
			var phone_a_occupation = document.getElementById('phone_a_occupation').innerText;//投保人职业
            var phone_a_occupation_code = document.getElementById('phone_a_occupation_code').innerText;//投保人职业代码
			var a_occupation = document.getElementById('a_occupation').innerText;
            var a_occupation_code = document.getElementById('a_occupation_code').innerText;
			var rages = getAgeByBirthday(r_age);
			var rages_pc = getAgeByBirthday(r_age_pc);
			//验证内容所在的外层div
			var validateDiv = document.getElementById(validateInfo["needValidateDiv"][pcName]);
			//不需要验证的元素ID数组
			var noValidateIds = validateInfo["noValidateIds"][pcName];
			//alert("validateDiv.id:"+validateDiv.id);
			//alert("noValidateIds:"+noValidateIds);
			//验证的提示信息
			//var validateMessage = validateInfo["validateMessage"];		

			if(validateDiv){
				var spanElements = validateDiv.getElementsByTagName("span");
				for(var i = 0 ; i < spanElements.length ; i++){
					var eachSpan = spanElements[i];
					//不需要验证的内容则无需校验
					if(noValidateIds.indexOf(eachSpan.id) >= 0){
						continue;
					}
					//国籍不为中国国籍时，户籍所在地可不填写
					if(phone_i_nation_place!='中国' && eachSpan.id == 'phone_i_rgt_address'){
						continue;
					}
					if(phone_a_nation_place!='中国' && eachSpan.id == 'phone_a_rgt_address'){
						continue;
					}
					if(a_nation_place!='中国' && eachSpan.id == 'a_rgt_address'){
						continue;
					}
					if(i_nation_place!='中国' && eachSpan.id == 'i_nation_place'){
						continue;
					}
					//被保人年龄小于18，年收入，收入来源，工作单位不应填写  add by renxiaomin 2017/3/28
					if(rages<=18 || rages_pc<=18 || phone_i_occupation.indexOf('学生') > -1 || i_occupation.indexOf('学生') > -1){
						if(pcName == 'phone'){
							if(eachSpan.id == 'phone_i_marry' || eachSpan.id == 'phone_i_income' || eachSpan.id == 'phone_i_income_way' || eachSpan.id == 'phone_i_work_unit'){//手机端被保人
								continue;
							} 
						}else{
							if(eachSpan.id == 'i_marry' || eachSpan.id == 'i_income' || eachSpan.id == 'i_income_way' || eachSpan.id == 'i_work_unit'){ //pc端被保人
								continue;
							}
						}
					}
                    //被保人为农民、家庭主妇、无业人员工作单位可不填
                    if(phone_i_occupation_code=="8010104"||phone_i_occupation_code=="8010102"||phone_i_occupation_code=="8010101"||phone_i_occupation_code=="5010101"||
                        i_occupation_code=="8010104"||i_occupation_code=="8010102"||i_occupation_code=="8010101"||i_occupation_code=="5010101"){
                        if(pcName == 'phone'){
                            if(eachSpan.id == 'phone_i_work_unit'){//手机端被保人
                                continue;
                            }
                        }else{
                            if(eachSpan.id == 'i_work_unit'){ //pc端被保人
                                continue;
                            }
                        }
                    }
                    //投保人为农民、家庭主妇、无业人员工作单位可不填
                    if(phone_a_occupation_code=="8010104"||phone_a_occupation_code=="8010102"||phone_a_occupation_code=="8010101"||phone_a_occupation_code=="5010101"||
                        a_occupation_code=="8010104"||a_occupation_code=="8010102"||a_occupation_code=="8010101"||a_occupation_code=="5010101"){
                        if(pcName == 'phone'){
                            if(eachSpan.id == 'phone_a_work_unit'){//手机端投保人
                                continue;
                            }
                        }else{
                            if(eachSpan.id == 'a_work_unit'){ //pc端投保人
                                continue;
                            }
                        }
                    }
					if(phone_a_occupation.indexOf('学生') > -1 || a_occupation.indexOf('学生') > -1){
						if(pcName == 'phone'){
							if(eachSpan.id == 'phone_a_marry' || eachSpan.id == 'phone_a_income' || eachSpan.id == 'phone_a_income_way' || eachSpan.id == 'phone_a_work_unit'){//手机端投保人
								continue;
							} 
						}else{
							if(eachSpan.id == 'a_marry' || eachSpan.id == 'a_income' || eachSpan.id == 'a_income_way' || eachSpan.id == 'a_work_unit'){ //pc端投保人
								continue;
							}
						}
					}
					//证件类型为护口本和出生证的有效期可以为空phone和pad	by add renxiaomin
					if((phone_a_id_name =='居民户口簿'||phone_a_id_name=='出生证')&& eachSpan.id == 'phone_a_id_end_date'){
						continue;
					}

					if((phone_i_id_name== '出生证' || phone_i_id_name== '居民户口簿') && eachSpan.id == 'phone_i_id_end_date'){
						continue;
					}

					if((a_id_name =='出生证' || a_id_name =='居民户口簿') && eachSpan.id == 'a_id_end_date'){
						continue;
					}

					if((i_id_name=='出生证' || i_id_name=='居民户口簿') && eachSpan.id == 'i_id_end_date'){
						continue;	
					}
					//工作单位可以填“无”
					if(pcName == 'phone'){
						if((eachSpan.id == 'phone_a_work_unit' || eachSpan.id == 'phone_i_work_unit') && eachSpan.innerText == "无"){
							continue;
						} 
					}else{
						if((eachSpan.id == 'a_work_unit' || eachSpan.id == 'i_work_unit') && eachSpan.innerText == "无"){
							continue;
						}
					}
					if(eachSpan.innerText == "" || eachSpan.innerText == "无" || eachSpan.innerText == "万元"){
						$scope.step2 = {activeTab: activeTab};
						var eachTitle = "";
						var eachItem = eachSpan.parentElement.children[0];//i
						if(eachItem){  //不为空
							eachTitle = eachItem.innerText.replace("：","");
						}
						var eachValidateMessage = eachTitle + "，不能为空，请点击编辑按钮录入！";
						myAlert(eachValidateMessage);
						//eachSpan.focus();
						return false;
					}
								
				}
			}

			// 校验投被保人的出生证可选与否  ---add by renxiaomin 2016.8.1				
				if(activeTab == 1){
					if(pcName == 'phone'){					
						// alert("是不是第一步"+pcName);
						if(phone_a_id_name =='出生证'){
							var eachValidateMessage = "投保人证件类型不能为出生证，请点击编辑按钮录入！";
							myAlert(eachValidateMessage);
							return false;
						}
						// 校验投被人的国籍是中国，证件类型为“外国护照”的
						if(phone_a_id_name =='外国护照' && phone_a_nation_place =='中国'){
							var eachValidateMessage = "国籍是中国，证件类型不可为外国护照";
							myAlert(eachValidateMessage);
							return false;
						}
						if(phone_a_id_name == '居民身份证' || phone_a_id_name == '居民户口簿'){
							if(phone_a_id_no.length == 18 && !IdentityCodeValid(phone_a_id_no)){
								myAlert("投保人的"+phone_a_id_name+"号码有误，请仔细核对，并返回客户管理模块找到相应的客户进行证件号码修改")
								return false;
							}
						}
						if(phone_a_id_end_date != '长期有效' && !isNull(phone_a_id_end_date)){
							var currentData = new Date();
      						var currentTime = currentData.getFullYear()+'/'+(currentData.getMonth()+1)+'/'+currentData.getDate();
				        	var d = new Date(phone_a_id_end_date.replace(/-/g,"\/"))
				        	var c = new Date(currentTime)
					        if(d<=c){
					            myAlert('投保人证件有效期不得小于等于当前日期，请返回确认')
						        return false;
						    }
						}	
					}else{
						if(a_id_name =='出生证'){
							var eachValidateMessage = "投保人证件类型不能为出生证，请点击编辑按钮录入！";
							myAlert(eachValidateMessage);
							return false;
						}
						// 校验投被人的国籍是中国，证件类型为“外国护照”的
						if(a_id_name =='外国护照' && a_nation_place =='中国'){
							var eachValidateMessage = "国籍是中国，证件类型不可为外国护照";
							myAlert(eachValidateMessage);
							return false;
						}
						if((a_id_name == '居民身份证' || a_id_name == '居民户口簿')){
							if(a_id_no.length == 18 && !IdentityCodeValid(a_id_no)){
								myAlert("投保人的"+a_id_name+"号码有误，请仔细核对，并返回客户管理模块找到相应的客户进行证件号码修改")
								return false;
							}
						}
						if(a_id_end_date != '长期有效' && !isNull(a_id_end_date)){
							var currentData = new Date();
      						var currentTime = currentData.getFullYear()+'/'+(currentData.getMonth()+1)+'/'+currentData.getDate();
				        	var d = new Date(a_id_end_date.replace(/-/g,"\/"))
				        	var c = new Date(currentTime)
					        if(d<=c){
					            myAlert('投保人证件有效期不得小于等于当前日期，请返回确认')
						        return false;
						    }
						}	
					}						
				}
				if(activeTab == 2){
					if(pcName == 'phone'){
						//alert('是不是第二步')
						if(rages > 4 && phone_i_id_name =='出生证'){
							var eachValidateMessage = "被保人年龄大于4岁，证件类型不能为出生证，请点击编辑按钮录入！";
							myAlert(eachValidateMessage);
							return false;
						}
						if(phone_i_id_name =='外国护照' && phone_i_nation_place =='中国'){				
							var eachValidateMessage = "国籍是中国，证件类型不可为外国护照";
							myAlert(eachValidateMessage);
							return false;
						}
						if((phone_i_id_name == '居民身份证' || phone_i_id_name == '居民户口簿')){
							if(phone_i_id_no.length == 18 && !IdentityCodeValid(phone_i_id_no)){
								myAlert("被保人的"+phone_i_id_name+"号码有误，请仔细核对，并返回客户管理模块找到相应的客户进行证件号码修改")
								return false;
							}
						}
						if(phone_i_id_end_date != '长期有效' && !isNull(phone_i_id_end_date)){
							var currentData = new Date();
      						var currentTime = currentData.getFullYear()+'/'+(currentData.getMonth()+1)+'/'+currentData.getDate();
				        	var d = new Date(phone_i_id_end_date.replace(/-/g,"\/"))
				        	var c = new Date(currentTime)
					        if(d<=c){
					            myAlert('被保人证件有效期不得小于等于当前日期，请返回确认')
						        return false;
						    }
						}		
					}else{
						//alert('是不是第二步'+pcName)
						if(rages_pc >= 4 && i_id_name =='出生证'){
							var eachValidateMessage = "被保人年龄大于4岁，证件类型不能为出生证，请点击编辑按钮录入！";
							myAlert(eachValidateMessage);
							return false;
						}
						if(i_id_name =='外国护照' && phone_i_nation_place =='中国'){				
							var eachValidateMessage = "国籍是中国，证件类型不可为外国护照";
							myAlert(eachValidateMessage);
							return false;
						}
						if((i_id_name == '居民身份证' || i_id_name == '居民户口簿')){
							if(i_id_no.length == 18 && !IdentityCodeValid(i_id_no)){
								myAlert("被保人的"+i_id_name+"号码有误，请仔细核对，并返回客户管理模块找到相应的客户进行证件号码修改")
								return false;
							}
						}

						if(i_id_end_date != '长期有效' && !isNull(i_id_end_date)){
							var currentData = new Date();
      						var currentTime = currentData.getFullYear()+'/'+(currentData.getMonth()+1)+'/'+currentData.getDate();
				        	var d = new Date(i_id_end_date.replace(/-/g,"\/"))
				        	var c = new Date(currentTime)
					        if(d<=c){
					            myAlert('被保人证件有效期不得小于等于当前日期，请返回确认')
						        return false;
						    }
						}
					}	
				}
	
		}else if(activeTab == 3){	//受益人信息tab页验证
			//验证受益人信息非空及合法性
			//受益人列表
			var benefitList = new Array();
			var oneData = $scope.benefitOneData;
			var twoData = $scope.benefitTwoData;
			if(oneData && oneData.length > 0){
				benefitList = benefitList.concat(oneData);
			}
			if(twoData && twoData.length > 0){
				benefitList = benefitList.concat(twoData);
			}
			for(var i = 0 ; i < benefitList.length ; i++){
				var tempBenefit = benefitList[i];
				var benefitName = tempBenefit["NAME"]; //受益人的姓名
				var message = "";
				if(!tempBenefit.RELATION){
					message = validateInfo["relation"].replace("benefitName",benefitName);
					myAlert(message);
					return false;
				}
				if(!tempBenefit.BENEFIT_ORDER){
					message = validateInfo["order"].replace("benefitName",benefitName);
					myAlert(message);
					return false;
				}
				if(!tempBenefit.BENEFIT_RATE){
					message = validateInfo["rate"].replace("benefitName",benefitName);
					myAlert(message);
					return false;
				}
			}
	/*		//受益人的受益比例验证
			var oneRateTotal = 0;
			var twoRateTotal = 0;
			for(var i = 0 ; i < oneData.length ; i++){
				var tempRate = oneData[i]["BENEFIT_RATE"];
				var tempRateNum = parseFloat(tempRate);
				if(!isNaN(tempRateNum)){
					oneRateTotal += tempRateNum;
				}
			}
			for(var i = 0 ; i < twoData.length ; i++){
				var tempRate = twoData[i]["BENEFIT_RATE"];
				var tempRateNum = parseFloat(tempRate);
				if(!isNaN(tempRateNum)){
					twoRateTotal += tempRateNum;
				}
			}
			//判断受益比例是否大于100%
			if(oneRateTotal > 100 || twoRateTotal > 100){
				myAlert(validateInfo["rateTotal"]);
				return false;
			}*/
			
//--------------------------每个受益顺序收益比例之和都为100%---3.29 zhanglei-----起---------------------			
			//受益人的受益比例验证
		
			var oneRateTotal1 = 0;          //身故受益人受益顺序中第一受益人受益比例之和
			var oneRateTotal2 = 0;          //身故受益人受益顺序中第二受益人受益比例之和
			var oneRateTotal3 = 0;
			var oneRateTotal4 = 0;
			var twoRateTotal1 = 0;          //其他保险金受益人受益顺序中第一受益人受益比例之和
			var twoRateTotal2 = 0;          //其他保险金受益人受益顺序中第二受益人受益比例之和
			var twoRateTotal3 = 0;
			var twoRateTotal4 = 0;
			
			var isoneRateTotal1 = 0;        //身故受益人受益顺序中第一受益人是否存在  是：1，否：0
			var isoneRateTotal2 = 0;        //身故受益人受益顺序中第二受益人是否存在  是：1，否：0
			var isoneRateTotal3 = 0;
			var isoneRateTotal4 = 0;
			var istwoRateTotal1 = 0;        //其他保险金受益人受益顺序中第一受益人是否存在  是：1，否：0
			var istwoRateTotal2 = 0;        //其他保险金受益人受益顺序中第二受益人是否存在  是：1，否：0
			var istwoRateTotal3 = 0;
			var istwoRateTotal4 = 0;
			 
			for(var i = 0 ; i < oneData.length ; i++){
				var tempRate = oneData[i]["BENEFIT_RATE"]; //获取受益比例
				var tempRate2 = oneData[i]["BENEFIT_ORDER"];//获取受益顺序
				var tempRateNum = parseFloat(tempRate);
				if(tempRate2 == 1){
					if(!isNaN(tempRateNum)){
						isoneRateTotal1 = 1;
					   oneRateTotal1 += tempRateNum;
				    }
				}else if(tempRate2 == 2){
					if(!isNaN(tempRateNum)){
						isoneRateTotal2 = 1;
					   oneRateTotal2 += tempRateNum;
				    }
				}else if(tempRate2 == 3){
					if(!isNaN(tempRateNum)){
						isoneRateTotal3 = 1;
					   oneRateTotal3 += tempRateNum;
				    }
				}else if(tempRate2 == 4){
					if(!isNaN(tempRateNum)){
						isoneRateTotal4 = 1;
					   oneRateTotal4 += tempRateNum;
				    }
				}
			}
			var num ="A:";
			for(var i = 0 ; i < twoData.length ; i++){
				var tempRate = twoData[i]["BENEFIT_RATE"];
				var tempRate2 = twoData[i]["BENEFIT_ORDER"];
				num = num +tempRate2+",";
				var tempRateNum = parseFloat(tempRate);
				if(tempRate2 == 1){
					if(!isNaN(tempRateNum)){
						istwoRateTotal1 = 1;
					   twoRateTotal1 += tempRateNum;
				    }
				}else if(tempRate2 == 2){
					if(!isNaN(tempRateNum)){
						istwoRateTotal2 = 1;
					   twoRateTotal2 += tempRateNum;
				    }
				}else if(tempRate2 == 3){
					if(!isNaN(tempRateNum)){
						istwoRateTotal3 = 1;
					   twoRateTotal3 += tempRateNum;
				    }
				}else if(tempRate2 == 4){
					if(!isNaN(tempRateNum)){
						istwoRateTotal4 = 1;
					   twoRateTotal4 += tempRateNum;
				    }
				}
			}
			
			//判断受益比例是否大于100%
			if(oneRateTotal1 != 100 && isoneRateTotal1 == 1){
				myAlert("身故受益人受益顺序为1的受益比例之和不为100%，请重新输入！");
				return;
			}else if(oneRateTotal2 != 100 && isoneRateTotal2 == 1){
				myAlert("身故受益人受益顺序为2的受益比例之和不为100%，请重新输入！");
				return;
			}else if(oneRateTotal3 != 100 && isoneRateTotal3 == 1){
				myAlert("身故受益人受益顺序为3的受益比例之和不为100%，请重新输入！");
				return;
			}else if(oneRateTotal4 != 100 && isoneRateTotal4 == 1){
				myAlert("身故受益人受益顺序为4的受益比例之和不为100%，请重新输入！");
				return;
			}else if(twoRateTotal1 != 100 && istwoRateTotal1 == 1){
				myAlert("其他保险金受益人受益顺序为1的受益比例之和不为100%，请重新输入！");
				return;
			}else if(twoRateTotal2 != 100 && istwoRateTotal2 == 1){
				myAlert("其他保险金受益人受益顺序为2的受益比例之和不为100%，请重新输入！");
				return;
			}else if(twoRateTotal3 != 100 && istwoRateTotal3 == 1){
				myAlert("其他保险金受益人受益顺序为3的受益比例之和不为100%，请重新输入！");
				return;
			}else if(twoRateTotal4 != 100 && istwoRateTotal4 == 1){
				myAlert("其他保险金受益人受益顺序为4的受益比例之和不为100%，请重新输入！");
				return;
			}else if(isoneRateTotal1==0 && (isoneRateTotal2==1 || isoneRateTotal3 == 1 || isoneRateTotal4 == 1 )){
				myAlert("身故受益人受益顺序中第一受益人未选择，请重新输入！");
				return;
			}else if(isoneRateTotal1==1 && isoneRateTotal2==0 && (isoneRateTotal3 == 1 || isoneRateTotal4 == 1)){
				myAlert("身故受益人受益顺序中第二受益人未选择，请重新输入！");
				return;
			}else if(isoneRateTotal1==1 && isoneRateTotal2==1 && isoneRateTotal3 == 0 && isoneRateTotal4 == 1 ){
				myAlert("身故受益人受益顺序中第三受益人未选择，请重新输入！");
				return;
			}else if(istwoRateTotal1==0 && (istwoRateTotal2==1 || istwoRateTotal3 == 1 || istwoRateTotal4 == 1 )){
				myAlert("其他保险金受益人受益顺序中第一受益人未选择，请重新输入！");
				return;
			}else if(istwoRateTotal1==1 && istwoRateTotal2==0 && (istwoRateTotal3 == 1 || istwoRateTotal4 == 1)){
				myAlert("其他保险金受益人受益顺序中第二受益人未选择，请重新输入！");
				return;
			}else if(istwoRateTotal1==1 && istwoRateTotal2==1 && istwoRateTotal3 == 0 && istwoRateTotal4 == 1 ){
				myAlert("其他保险金受益人受益顺序中第三受益人未选择，请重新输入！");
				return;
			}
//--------------------------每个受益顺序收益比例之和都为100%---3.29 zhanglei-----止---------------------



		}else if(activeTab == 4){	//投保事项tab页验证		
			//主险是年交方式==12	
			var autoPay=eval('('+$scope.applyObj.PROSAL_JSON+')').CONTENT.insureProductsMap.tableDataList[0][5];
			if(pcType == "phone"){
				var bankInfoOuterDiv = document.getElementById("bank_info_div_pc");
				var bankInfoElements = bankInfoOuterDiv.childNodes;
				if(bankInfoElements && bankInfoElements.length > 0){
					//有span标签的银行卡信息是选中项
					var checkedItem = bankInfoOuterDiv.getElementsByTagName("span");
					if(checkedItem && checkedItem.length > 0){
						//主险是年交方式校验“投保单上此栏为必选项，投保人必须选择在续期保险费超过宽限期仍未交付时，保险费是否自动垫交。”，add by renxiaomin 20170426
						if(checkedItem.length > 1){
							myAlert("银行卡信息只可添加一个，请删除多余选中的银行卡信息");
							return false;
						}
						if($scope.autoPayFlag =="N" && autoPay == "12" && $scope.applyObj.IS_PAY_FOR == false){
							myAlert("保险费是否自动垫交,投保单上此栏为必选项！");
							return false;
						}
						// 添加保单提供形式校验  add by wangzj 20160829
						if($scope.applyObj.IS_INSURE==false && $scope.applyObj.IS_INSURE_PAPER==false){
							myAlert("未选择保单提供形式，请确认！");
							return false;
						}
						// var regex =/^(\d{11})$/;
			   //    	    if (!regex.test($scope.applyObj.VALID_PHONE)){
			   //    	    	myAlert("请正确输入手机号码！"); 
	     //                	return false;
	     //            	}
						return true;
					}else{
						//选中
						$scope.step2 = {activeTab: activeTab};
						myAlert(validateInfo["selectBankcardInfo"]);
						return false;
					}
				}else{
					//定位验证tab页，提示验证详情并获取焦点
					$scope.step2 = {activeTab: activeTab};
					myAlert(validateInfo["addBankcardMessage"]);
					return false;
				}
				
			}else{
				var bankInfoOuterDiv = document.getElementById("bank_info_div");
				// var bankInfoElements = bankInfoOuterDiv.childNodes;
				// var selectFlag = false;
				// //添加银行卡信息中的name=bank
				// var bankInfoRadioElements = document.getElementsByName(validateInfo["bankInfoRadioName"]);
				// //已添加银行卡信息
				// if(bankInfoRadioElements && bankInfoRadioElements.length > 0){
				// 	for(var i = 0 ; i < bankInfoRadioElements.length ; i++){
				// 		var eachRadioElement = bankInfoRadioElements[i];
				// 		if(eachRadioElement.type == "radio" && eachRadioElement.checked){
				// 			selectFlag = true;
				// 			break;
				// 		 }
				// 	}
								
				var bankInfoElements = bankInfoOuterDiv.childNodes;
				if(bankInfoElements && bankInfoElements.length > 0){
					//有span标签的银行卡信息是选中项
					var checkedItem = bankInfoOuterDiv.getElementsByTagName("span");
					if(checkedItem && checkedItem.length > 0){
						//主险是年交方式校验“投保单上此栏为必选项，投保人必须选择在续期保险费超过宽限期仍未交付时，保险费是否自动垫交。”，add by renxiaomin 20170426
						if(checkedItem.length > 1){
							myAlert("银行卡信息只可添加一个，请删除多余选中的银行卡信息");
							return false;
						}
						if($scope.autoPayFlag =="N" && autoPay == "12" && $scope.applyObj.IS_PAY_FOR == false){
							myAlert("保险费是否自动垫交,投保单上此栏为必选项！");
							return false;
						}
						// 添加保单提供形式校验  add by wangzj 20160829
						if($scope.applyObj.IS_INSURE==false && $scope.applyObj.IS_INSURE_PAPER==false){
							myAlert("未选择保单提供形式，请确认！");
							return false;
						}
						// var regex =/^(\d{11})$/;
			   //    	    if (!regex.test($scope.applyObj.VALID_PHONE)){
			   //    	    	myAlert("请正确输入手机号码！"); 
	     //                	return false;
	     //            	}
						return true;
					}else{
						//选中
						$scope.step2 = {activeTab: activeTab};
						myAlert(validateInfo["selectBankcardInfo"]);
						return false;
					}
				}else{
					//定位验证tab页，提示验证详情并获取焦点
					$scope.step2 = {activeTab: activeTab};
					myAlert(validateInfo["addBankcardMessage"]);
					return false;
				}
			}
			
		}

	//验证信息录入中告知tab页内容
	}else if(activeTab >= 5 && activeTab <= 7){
		var impartDivIndex = activeTab - 5;
		var impartDiv = document.getElementById(impartDivIdArray[impartDivIndex]);
		if(impartDiv){
			var impartTable = impartDiv.firstChild;
			if(impartTable){
				var impartRows = impartTable.rows;	//告知内容中表格行
				for (var i = 0; i < impartRows.length; i++) {
					//获取每行第一列对象
					var cell1OfTr = impartRows[i].cells[0];
					//获取每行第二列的复选框
					var cell2OfTr = impartRows[i].cells[1];
					var checkboxOfTr = cell2OfTr.getElementsByTagName("input");
					var inputsOfCell1 = cell1OfTr.getElementsByTagName("input");
					var textareaOfTr = impartRows[i].getElementsByTagName("textarea");
					var divOfTr = impartRows[i].getElementsByTagName("div");
					//验证标识（2:未选中；1：选中是；0：选中否）
					var impartFlag = "";
					if(checkboxOfTr.length == 2){
						if(checkboxOfTr[0].checked == false && checkboxOfTr[1].checked == false){
							$scope.step2 = {activeTab: activeTab};
							myAlert(impartValidateInfo[impartDivIndex]);
							cell2OfTr.focus();
							return false;
						}else if(checkboxOfTr[0].checked){
							//选择‘是’复选框时的验证
							var radioCheckedFlag = "";
							for(var j = 0 ; j < inputsOfCell1.length ; j++){
								var eachElement = inputsOfCell1[j];
								if(eachElement.type == "text"){
									//文本款扩展属性(allowSave=false)时，不需要验证非空
									if(eachElement.getAttribute("allowSave") == "false"){
										continue;
									}
									if(eachElement.value == ""){
										// $scope.step2 = {activeTab: activeTab};
										// myAlert(impartValidateInfo[impartDivIndex]);
										// eachElement.focus();
										radioCheckedFlag='false';
										// return false;
									}
								}else if(eachElement.type == "radio"){
									radioCheckedFlag = "false";
									if(eachElement.checked){
										radioCheckedFlag = "true";
										break;
									}
								}else if(eachElement.type == "checkbox"){
									radioCheckedFlag = "false";
									if(eachElement.checked){
										radioCheckedFlag = "true";
										break;
									}
								}
							}
							for(var cl = 0;cl<textareaOfTr.length; cl++){
								var textareaval=textareaOfTr[cl];
								if(textareaval.value==''){
									radioCheckedFlag='false';
								}
							}
							if(radioCheckedFlag == "false"){
								$scope.step2 = {activeTab: activeTab};
								myAlert('如选择是，请详细告知');
								impartRows[i].focus();
								return false;
							}
						}
					}else{
						//没有复选框情况的内容验证
						var radioCheckedFlag = "";
						for(var j = 0 ; j < inputsOfCell1.length ; j++){
							var eachElement = inputsOfCell1[j];
							if(eachElement.type == "text"){
								//文本款扩展属性(allowSave=false)时，不需要验证非空
								if(eachElement.getAttribute("allowSave") == "false"){
									continue;
								}
								if(eachElement.value == ""){
									$scope.step2 = {activeTab: activeTab};
									myAlert(impartValidateInfo[impartDivIndex]);
									eachElement.focus();
									return false;
								}
								if(eachElement.value == "0"){
									$scope.step2 = {activeTab: activeTab};
									myAlert('身高或体重不可为0，请重新输入');
									return false;
								}
							}else if(eachElement.type == "radio"){
								radioCheckedFlag = "false";
								if(eachElement.checked){
									radioCheckedFlag = "true";
									break;
								}
							}
						}
						if(radioCheckedFlag == "false"){
							$scope.step2 = {activeTab: activeTab};
							myAlert(impartValidateInfo[impartDivIndex]);
							impartRows[i].focus();
							return false;
						}
					}
				}
				//部分告知内容，独立验证
				if(activeTab == 7){
					//业务员告知中第一项验证，当选择‘本人’时验证业务员与被保人的姓名是否一致
					if(impartRows.length > 0){
						var validRow = impartRows[0];
						var inputsOfTr = validRow.cells[0].getElementsByTagName("input");
						for(var k = 0 ; k < inputsOfTr.length ; k++){
							var radioElement = inputsOfTr[k];
							if(radioElement.type == "radio"){
								if(radioElement.checked && radioElement.value == "本人"){
									var recognizeeName = $scope.recognizeeData.NAME;
									var agentName = $scope.agentInfo.AGENT_NAME;
//									alert("recognizeeName:"+recognizeeName+"====agentName："+agentName);
									if(recognizeeName != agentName){
										$scope.step2 = {activeTab: activeTab};
										myAlert("业务员告知中第一项您已经勾选本人，但您的姓名跟被保人不一致，请重新确认！");
										radioElement.focus();
										return false;
									}
								}
							}
						}
					}
				}
			}else{
				$scope.clickTab2(activeTab);
				return false;
			}
		}
	}
	return validateResult;
}


