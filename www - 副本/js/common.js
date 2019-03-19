/******************应用跳转使用的公共方法************************/
var storage = window.localStorage;
var agentCode = storage.getItem('agentCode');
var organCode = storage.getItem('organCode');
//var agentCode ='8611018517';
var id = 0;
 var API_URL = "http://10.0.22.112:7003";//测试环境ip
 //var API_URL = "http://10.8.17.82:8080/esales_center_rp";
 //var API_URL = "http://esales2.minshenglife.com:8001";//生产环境ip

/****************Li jie operCode start********************************/
var bankScope ='';
var bankActionSheet ='';
var online_apply_id = ''; //保单的ID
var relationList =[];//受益人关系list

var isSiagn = 1; //是否选择电子签名 1--电子签名  2---纸质签名  0--未选中状态
var smsCode =''; //---短信验证码
var signMap = {}; //电子签名所有图片的URL
var c_apply_id ='';
var c_proposal_id ='';
var commonIonicPopup = '';

//电子签名短信验证通过标示
var  isPassSign = false; 
var pageSignCtrlTime = 900; //15分钟

var mianIsureId = ''; //主线的ID
var code = '';
var allIsuresArray = [];
var kneeScope ='';
var baseList = '';

//设备类型（'phone':手机，'pad'：平板）
var DEVICE_TYPE = "";

//影像录入模块中全局变量定义
var bankTransferAmount = "200000";

//去除受益人系被保人关系列表的‘本人’选项
var benefitRelationList = new Array();

//判断当前险种是否允许抄录声明
var copystatementState = false;

//问题件对象  add by lishuang 2016-10-23
var questionObj = {};

/****************Li jie operCode end********************************/
/**
 * load建议书的数据
 * @param data 建议书的数据
 */
function loadAnotherJs1(data){
	
	try{
		 if(brows().iphone) {
			document.addEventListener('deviceready', function() { 
				loadQueryApp();
			});
		 } else if(brows().android) {
			setTimeout(
			/*set time out start*/
				function (){
					loadQueryApp();
				}
			/*set time out end*/
			,2000);
		 }
	}catch(e){
		console.log("json解析出错！"+e);
	}
}

/**
 * load Action - 区分ios,android 遍历所有匹配到的元素，进行json重新组装
 */
function loadQueryApp(){
//	alert("loadQueryApp()");
	/*queryApp start*/
	queryAppSaveData(function (datas) {
//		alert("datas:"+datas);
		/*success*/
		var jsonR = eval('(' + datas + ')'); 
//		alert("jsonR:"+jsonR);
		console.log(datas);
		//alert("datas:" + datas)
		jsonR = jsonR.data;
		if ('recommend' == jsonR.flag) {
	
			var recommendName = jsonR.recommendName; //建议书名称
			var productid = jsonR.productid; //险种的ID
			//alert("productid:"+productid);
			if(productid){
					mianIsureId = productid.split(",")[0]; 
					allIsuresArray = productid.split(",");
			}
			var url = "xml/product.xml";
			var isShow = checkProductInfoIsHasFn(url,mianIsureId);  
			//判断当前险种是否可以抄录申明
			initCopyStatementState(mianIsureId);
			kneeScope.$apply(function (){
				if(isShow){ //产品说明书显示 
					kneeScope.cpsm_li = true;  
				    document.getElementById("product_info_li").style.display ="block"; 
				    if((mianIsureId=='112406' || mianIsureId=='112407') && jsonR.isRelated == '03'){
						kneeScope.glbd_li=true;
						document.getElementById("releated_info_li").style.display ="block"; 
					}else{
						kneeScope.glbd_li=false;
						document.getElementById("releated_info_li").style.display ="none";
					}
				}else{	

					kneeScope.cpsm_li = false;  
					document.getElementById("product_info_li").style.display ="none"; 
					
					if((mianIsureId == '111408' || mianIsureId == '111406' || mianIsureId == '111901') && jsonR.isRelated == '03' || mianIsureId == '114403'){
						kneeScope.glbd_li=true;
						document.getElementById("releated_info_li").style.display ="block"; 
					}else{
						kneeScope.glbd_li=false;
						document.getElementById("releated_info_li").style.display ="none";
					}
					
				}									
			});

			var prosalId = jsonR.PROPOSAL_ID; //建议书ID
//			var ID = new Date().getTime();//生成保单ID 
			var ID = "";//保单ID 
			
			//根据当前建议书ID查询未提交保单中是否存在该建议书转投的保单，如果存在则更新关联的保单，否则新建保单
			var key = {
					"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
					"tableName": "T_APPLY",
					"conditions": {"PROPOSAL_ID": prosalId}//建议书ID
				};
			queryTableDataByConditions(key, function (data) {
				if(data && data.length > 0){
					ID = data[0].ID;
				}else{
					ID = generatePrimaryKey();
				}
				//表单预览会使用到 add by genglan
				document.getElementById("applicantID").value = jsonR.applicantID;
				document.getElementById("recognizeeID").value = jsonR.recognizeeID;
				document.getElementById("formID").value = ID; //保单ID 
				document.getElementById("propsalID").value = prosalId; //建议书ID
				document.getElementById("mainProductID").value = productid; //主险ID
				var omap = {};
				omap["PROSAL_JSON"] = JSON.stringify(jsonR);
				omap["PROPOSAL_ID"] = prosalId;
				omap["ID"] = ID;
				omap["CREATE_TIME"] = new Date();
				omap["UPDATE_TIME"] = new Date();
				omap["AGENT_CODE"] = agentCode;
				//omap["PRINT_NO"] = '';
				//omap["APPLY_NO"] = ''
				omap["APPLICANT_ID"] = jsonR.applicantID;
				omap["APPLICANT_NAME"] = jsonR.applicantName;
				omap["INSURANT_ID"] = jsonR.recognizeeID;
				omap["INSURANT_NAME"] = jsonR.recognizeeName;
				omap["IS_RELEATED"] = jsonR.isRelated;
				//omap["SUM_AMOUNT"] = jsonR.recognizeeName;
	
				//omap["APPLY_DETAIL"] = "{\"agentImpartList\":[{\"customerType\":\"\",\"impartCode\":\"A0151\",\"impartContent\":\"\",\"impartFlag\":\"\",\"impartVersion\":\"A03\"},{\"customerType\":\"\",\"impartCode\":\"A0152\",\"impartContent\":\"\",\"impartFlag\":\"\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0153\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0154\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0155\",\"impartContent\":\"业务员推销\",\"impartFlag\":\"2\",\"impartVersion\":\"A03\"},{\"customerType\":\"\",\"impartCode\":\"A0156\",\"impartContent\":\"\",\"impartFlag\":\"\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0157\",\"impartContent\":\"10\",\"impartFlag\":\"2\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0158\",\"impartContent\":\"\",\"impartFlag\":\"\",\"impartVersion\":\"A03\"}],\"applicant\":{\"postalAddress\":\"\",\"postalCity\":\"\",\"postalCounty\":\"\",\"postalProvince\":\"\",\"postalZipCode\":\"\",\"weiboType\":\"\",\"birthday\":\"\",\"customerId\":\"\",\"email\":\"\",\"grpName\":\"\",\"homeAddress\":\"\",\"homeCity\":\"\",\"homeCounty\":\"\",\"homeProvince\":\"\",\"homeZipCode\":\"\",\"idEndDate\":\"\",\"idNo\":\"\",\"idType\":\"\",\"income\":\"\",\"incomeWay\":\"\",\"marriage\":\"\",\"mobile\":\"\",\"msn\":\"\",\"nativePlace\":\"\",\"occupationCode\":\"\",\"otherIncomeWay\":\"\",\"phone\":\"\",\"pluralityOccupationCode\":\"\",\"qq\":\"\",\"realName\":\"\",\"relationToMainInsured\":\"\",\"rgtCity\":\"\",\"rgtProvince\":\"\",\"sex\":\"\",\"weiboNo\":\"\",\"age\":},\"baseInfo\":{\"accName\":\"\",\"agentCode\":\"\",\"autoPayFlag\":\"\",\"bankAccNo\":\"\",\"bankCode\":\"\",\"blessing\":\"\",\"electronicContFlag\":\"\",\"electronicContPhone\":\"\",\"payIntv\":\"\",\"payMode\":\"\",\"printNo\":\"\",\"renewAccName\":\"\",\"renewBankAccNo\":\"\",\"renewBankCode\":\"\",\"renewPayMode\":\"\",\"renewRemindFlag\":\"\",\"\":\"\"},\"id\":\"\",\"insurantImpartList\":[{\"customerType\":\"0\",\"impartCode\":\"A0501\",\"impartContent\":\"\",\"impartFlag\":\"2\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0502\",\"impartContent\":\"1/1\",\"impartFlag\":\"1\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0503\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0504\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0505\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0506\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0507\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0508\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0509\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0510\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0511\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0512\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0513\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0514\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0515\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0516\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0517\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0518\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0519\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0520\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0525\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0526\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0527\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0528\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0529\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0530\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0531\",\"impartContent\":\"//C照///\",\"impartFlag\":\"1\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0532\",\"impartContent\":\"2次闯红灯\",\"impartFlag\":\"1\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0533\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"}],\"insuredList\":[{\"beneficiaryList\":[],\"insuranceList\":[{\"amount\":\"1000000\",\"insuYears\":\"70\",\"insuYearsFlag\":\"A\",\"insurantSeq\":\"1\",\"jobAddFee\":\"\",\"payEndYear\":\"1000\",\"payEndYearFlag\":\"Y\",\"payIntv\":\"0\",\"prem\":\"141540.00\",\"productCode\":\"111301\",\"productDetail\":\"\",\"proposalId\":\"018611018517141128153510380901\",\"seq\":\"1\",\"createTime\":\"2014-11-2815:36:34\",\"id\":128,\"updateTime\":\"2014-11-2815:37:04\"}],\"insurant\":{\"relationToAppnt\":\"00\",\"weiboType\":\"\",\"birthday\":\"1990-11-20\",\"customerId\":\"\",\"email\":\"\",\"grpName\":\"\",\"homeAddress\":\"\",\"homeCity\":\"\",\"homeCounty\":\"\",\"homeProvince\":\"\",\"homeZipCode\":\"\",\"id\":" + ID + ",\"idEndDate\":\"\",\"idNo\":\"\",\"idType\":\"\",\"income\":\"\",\"incomeWay\":\"\",\"marriage\":\"\",\"mobile\":\"\",\"msn\":\"\",\"nativePlace\":\"CHN\",\"occupationCode\":\"\",\"otherIncomeWay\":\"\",\"phone\":\"\",\"pluralityOccupationCode\":\"\",\"qq\":\"\",\"realName\":\"\",\"rgtCity\":\"\",\"rgtProvince\":\"\",\"sex\":\"\",\"weiboNo\":\"\",\"age\":''}}],\"proposalId\":'" + prosalId + "'}";
				//omap["APPLY_DETAIL"] = {};
				
				//将建议书的数据进行保存
				var updateJson = {
					"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
					"tableName": "T_APPLY",
//					"conditions": [{"PROPOSAL_ID": prosalId}],
					"conditions": [{"ID": ID}],
					"data": [omap]
				}; 
				updateORInsertTableDataByConditions(updateJson, function (str) { 
					if(str == 1){
						console.log('建议书数据保存成功！')
						
						/*1 start*/
							//将投保人信息保存到客户表
							var cstmdata = {};
							cstmdata["AGENT_CODE"] = agentCode;
							cstmdata['CUSTOMER_ID'] = jsonR.applicantID;
							cstmdata['APPLY_ID'] = ID;
							cstmdata['NAME'] = jsonR.applicantName;
							cstmdata['SEX'] = jsonR.applicantSex;
							cstmdata['BIRTHDAY'] = jsonR.applicantBirthday;
							cstmdata['RELATION'] = jsonR.relation;
							cstmdata['OCCUPATION'] = jsonR.applicantOccupationName;
							cstmdata['OCCUPATION_CODE'] = jsonR.applicantOccupationCode;
							cstmdata['IS_BENEFIT'] = "0";
							cstmdata["CREATE_TIME"] = new Date();
							cstmdata["UPDATE_TIME"] = new Date(); 
							var updateJsontocstm = {
								"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
								"tableName": "T_CUSTOMER",
								"conditions": [{"CUSTOMER_ID": jsonR.applicantID,"IS_BENEFIT":"0","APPLY_ID":ID}],
								"data": [cstmdata]
							};
							updateORInsertTableDataByConditions(updateJsontocstm, function (str) { 
								/*2 start*/
								//将被保人信息保存到客户表
								var bbrdata = {};
								bbrdata["AGENT_CODE"] = agentCode;
								bbrdata['CUSTOMER_ID'] = jsonR.recognizeeID;
								bbrdata['APPLY_ID'] = ID;
								bbrdata['NAME'] = jsonR.recognizeeName;
								bbrdata['SEX'] = jsonR.recognizeeSex;
								bbrdata['BIRTHDAY'] = jsonR.recognizeeBirthday;
								bbrdata['OCCUPATION'] = jsonR.recognizeeOccupationName;
								bbrdata['OCCUPATION_CODE'] = jsonR.recognizeeOccupationCode;
								bbrdata['IS_BENEFIT'] = "1";
								bbrdata["CREATE_TIME"] = new Date();
								bbrdata["UPDATE_TIME"] = new Date(); 
								var updateJsontobbr = {
									"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
									"tableName": "T_CUSTOMER",
									"conditions": [{"CUSTOMER_ID": jsonR.recognizeeID,"IS_BENEFIT":"1","APPLY_ID":ID}],
									"data": [bbrdata]
								};
								updateORInsertTableDataByConditions(updateJsontobbr, function (str) { 
								}, function () {
									console.log("被保人信息保存失败！"); 
								});
								/*2 end*/
							}, function () {
								console.log("投保人信息保存失败！");
								//alert("555555");
							});
						/*1 end*/
	
					}
				}, function () {
					console.log("险种设计信息保存失败！");
					//alert("3333");
				});
			});
		}

	},function(error){
	/*error*/
		alert("error:"+error);
	
	});
	/*querApp end*/
}

/**
 * load客户的数据
 * @param data 客户的数据
 */
function loadAnotherJs(data){
	try{
		/** 数据加载Start **/
		//CommonFn.alertPopupFun(commonIonicPopup,'loading','页面数据加载中！...',0);
		document.addEventListener('deviceready', function() {
//			if(null != Variables.alertPopup){
//				Variables.alertPopup.close();
//			}
			/** 数据加载End **/

//			alert("customer.relationList.length:"+relationList.length);
			//去除受益人系被保人关系列表的‘本人’选项
			if(benefitRelationList.length == 0){
				for(var i = 0 ; i < relationList.length ; i++){
					var relationName = relationList[i].CODE_NAME;
					if(relationName == "本人"){
						continue;
					}
					benefitRelationList.push(relationList[i]);
				}
			}
			 
			var json = eval('(' + data + ')');
			var pctype = document.getElementById("pctype").value;
			if (json.recommend == '1') {
				var dataFromCustomer = json.info;
				saveToDB(dataFromCustomer,'tbr');
				//投保人通信地址和邮编
				// var mailingAddress = "";
				// var mailingZipCode = "";
				// if(dataFromCustomer.MAILING_ADDRESS == "0"){
				// 	mailingAddress = dataFromCustomer.COMPANY_PROVINCE +dataFromCustomer.COMPANY_CITY+dataFromCustomer.COMPANY_COUNTY+dataFromCustomer.COMPANY_ADDRESS;
				// 	mailingZipCode = dataFromCustomer.COMPANY_ZIP_CODE;
				// }else{
				// 	mailingAddress = dataFromCustomer.HOME_PROVINCE +dataFromCustomer.HOME_CITY+dataFromCustomer.HOME_COUNTY+dataFromCustomer.HOME_ADDRESS;
				// 	mailingZipCode = dataFromCustomer.HOME_ZIP_CODE;
				// }
				if(pctype == 'phone'){
					setCodeNameByCode('marriage', dataFromCustomer.MARRI_STATUS, 'phone_a_marry');
					document.getElementById("phone_a_name").innerText = dataFromCustomer.REAL_NAME;
					document.getElementById("phone_a_sex").innerText = dataFromCustomer.SEX == 0 ? '男' : '女';
					document.getElementById("phone_a_birthday").innerText = dataFromCustomer.BIRTHDAY;
					//document.getElementById("a_relation").innerText = dataFromCustomer.recognizeeName;
					// document.getElementById("a_id_name").innerText = dataFromCustomer.IDTYPE;
					setCodeNameByCode('idtype', dataFromCustomer.IDTYPE, 'phone_a_id_name');
					document.getElementById("phone_a_id_no").innerText = dataFromCustomer.IDNO;
					document.getElementById("phone_a_id_end_date").innerText = dataFromCustomer.ID_END_DATE;
					// document.getElementById("a_nation_place").innerText = dataFromCustomer.NATIVE_PLACE;
					setCodeNameByCode('nativeplace', dataFromCustomer.NATIVE_PLACE, 'phone_a_nation_place');
					//document.getElementById("phone_a_rgt_address").innerText = dataFromCustomer.HOUSEHOLD_ADRESS;
					document.getElementById("phone_a_rgt_address").innerText = dataFromCustomer.RGT_PROVINCE + dataFromCustomer.RGT_CITY;//+dataFromCustomer.HOUSEHOLD_COUNTY;
					//document.getElementById("a_marry").innerText = dataFromCustomer.MARRI_STATUS;
					document.getElementById("phone_a_income").innerText = dataFromCustomer.INCOME;
					//document.getElementById("a_income_way").innerText = dataFromCustomer.INCOME_WAY;
					// setCodeNameByCode('incomeway', dataFromCustomer.INCOME_WAY, 'phone_a_income_way');
					var codeList  = dataFromCustomer.INCOME_WAY.split(",");
					var incomewayTotal = [];
					for(var cd = 0;cd < codeList.length; cd++){
						getCodeName('incomeway',codeList[cd],function(msg){
							incomewayTotal.push(msg)
						})
					}
					setTimeout(function(){
						codeResult = incomewayTotal.join(",");
						document.getElementById("phone_a_income_way").innerText = codeResult;
					},1000)
					document.getElementById("phone_a_work_unit").innerText = dataFromCustomer.WORK_UNIT;
					document.getElementById("phone_a_occupation").innerText = dataFromCustomer.OCCUPATION_CODE_NAME;
					document.getElementById("phone_a_occupation_code").innerText = dataFromCustomer.OCCUPATION_CODE;
					document.getElementById("phone_a_occupation_other").innerText = dataFromCustomer.PLURALITY_OCCUPATION_CODE_NAME;
					document.getElementById("phone_a_mobile").innerText = dataFromCustomer.MOBILE;
					document.getElementById("phone_a_email").innerText = dataFromCustomer.EMAIL;
					//document.getElementById("phone_a_mailing_address").innerText = dataFromCustomer.MAILING_ADDRESS;
					document.getElementById("phone_a_mailing_address").innerText = dataFromCustomer.COMPANY_PROVINCE +dataFromCustomer.COMPANY_CITY+dataFromCustomer.COMPANY_COUNTY+dataFromCustomer.COMPANY_ADDRESS;
					document.getElementById("phone_a_mailing_zip_code").innerText = dataFromCustomer.COMPANY_ZIP_CODE;
					document.getElementById("phone_a_home_address").innerText = dataFromCustomer.HOME_PROVINCE +dataFromCustomer.HOME_CITY+dataFromCustomer.HOME_COUNTY+dataFromCustomer.HOME_ADDRESS;
					document.getElementById("phone_a_home_zip_code").innerText = dataFromCustomer.HOME_ZIP_CODE;
					if (document.getElementById("a_relation").innerText == '本人') {
						document.getElementById("phone_i_name").innerText = dataFromCustomer.REAL_NAME;
						document.getElementById("phone_i_sex").innerText = dataFromCustomer.SEX == 0 ? '男' : '女';
						document.getElementById("phone_i_birthday").innerText = dataFromCustomer.BIRTHDAY;
						setCodeNameByCode('idtype', dataFromCustomer.IDTYPE, 'phone_i_id_name');
						document.getElementById("phone_i_id_no").innerText = dataFromCustomer.IDNO;
						document.getElementById("phone_i_id_end_date").innerText = dataFromCustomer.ID_END_DATE;
						setCodeNameByCode('nativeplace', dataFromCustomer.NATIVE_PLACE, 'phone_i_nation_place');
						document.getElementById("phone_i_rgt_address").innerText = dataFromCustomer.RGT_PROVINCE + dataFromCustomer.RGT_CITY;//+dataBbr.HOUSEHOLD_COUNTY;
						setCodeNameByCode('marriage', dataFromCustomer.MARRI_STATUS, 'phone_i_marry');
						document.getElementById("phone_i_income").innerText = dataFromCustomer.INCOME;
						// setCodeNameByCode('incomeway', dataFromCustomer.INCOME_WAY, 'phone_i_income_way');
						var codeList2  = dataFromCustomer.INCOME_WAY.split(",");
						var incomewayTotal2 = [];
						for(var cd = 0;cd < codeList2.length; cd++){
							getCodeName('incomeway',codeList2[cd],function(msg){
								incomewayTotal2.push(msg)
							})
						}
						setTimeout(function(){
							codeResult2 = incomewayTotal2.join(",");
							document.getElementById("phone_i_income_way").innerText = codeResult2;
						},1000)
						document.getElementById("phone_i_work_unit").innerText = dataFromCustomer.WORK_UNIT;
						document.getElementById("phone_i_occupation_code").innerText = dataFromCustomer.OCCUPATION_CODE;
						document.getElementById("phone_i_occupation").innerText = dataFromCustomer.OCCUPATION_CODE_NAME;
						document.getElementById("phone_i_occupation_other").innerText = dataFromCustomer.PLURALITY_OCCUPATION_CODE_NAME;
						document.getElementById("phone_i_mobile").innerText = dataFromCustomer.MOBILE;
						document.getElementById("phone_i_email").innerText = dataFromCustomer.EMAIL;
						document.getElementById("phone_i_phone").innerText = dataFromCustomer.COMPANY_PHONE;
						document.getElementById("phone_i_mailing_address").innerText = dataFromCustomer.COMPANY_PROVINCE +dataFromCustomer.COMPANY_CITY+dataFromCustomer.COMPANY_COUNTY+dataFromCustomer.COMPANY_ADDRESS;
						document.getElementById("phone_i_mailing_zip_code").innerText = dataFromCustomer.COMPANY_ZIP_CODE;
						document.getElementById("phone_i_home_address").innerText = dataFromCustomer.HOME_PROVINCE +dataFromCustomer.HOME_CITY+dataFromCustomer.HOME_COUNTY+dataFromCustomer.HOME_ADDRESS;
						document.getElementById("phone_i_home_zip_code").innerText = dataFromCustomer.HOME_ZIP_CODE;
						
					}
				}else{
					setCodeNameByCode('marriage', dataFromCustomer.MARRI_STATUS, 'a_marry');
					document.getElementById("a_name").innerText = dataFromCustomer.REAL_NAME;
					document.getElementById("a_sex").innerText = dataFromCustomer.SEX == 0 ? '男' : '女';
					document.getElementById("a_birthday").innerText = dataFromCustomer.BIRTHDAY;
					//document.getElementById("a_relation").innerText = dataFromCustomer.recognizeeName;
					// document.getElementById("a_id_name").innerText = dataFromCustomer.IDTYPE;
					setCodeNameByCode('idtype', dataFromCustomer.IDTYPE, 'a_id_name');
					document.getElementById("a_id_no").innerText = dataFromCustomer.IDNO;
					document.getElementById("a_id_end_date").innerText = dataFromCustomer.ID_END_DATE;
					// document.getElementById("a_nation_place").innerText = dataFromCustomer.NATIVE_PLACE;
					setCodeNameByCode('nativeplace', dataFromCustomer.NATIVE_PLACE, 'a_nation_place');
					document.getElementById("a_rgt_address").innerText = dataFromCustomer.RGT_PROVINCE + dataFromCustomer.RGT_CITY;//+dataFromCustomer.HOUSEHOLD_COUNTY;
					//document.getElementById("a_marry").innerText = dataFromCustomer.MARRI_STATUS;
					document.getElementById("a_income").innerText = dataFromCustomer.INCOME;
					//document.getElementById("a_income_way").innerText = dataFromCustomer.INCOME_WAY;
					var codeList  = dataFromCustomer.INCOME_WAY.split(",");
					var incomewayTotal = [];
					for(var cd = 0;cd < codeList.length; cd++){
						getCodeName('incomeway',codeList[cd],function(msg){
							incomewayTotal.push(msg)
						})
					}
					setTimeout(function(){
						codeResult = incomewayTotal.join(",");
						document.getElementById("a_income_way").innerText = codeResult;
					},1000)
					document.getElementById("a_work_unit").innerText = dataFromCustomer.WORK_UNIT;
					document.getElementById("a_occupation").innerText = dataFromCustomer.OCCUPATION_CODE_NAME;
					document.getElementById("a_occupation_code").innerText = dataFromCustomer.OCCUPATION_CODE;
					document.getElementById("a_occupation_other").innerText = dataFromCustomer.PLURALITY_OCCUPATION_CODE_NAME;
					document.getElementById("a_mobile").innerText = dataFromCustomer.MOBILE;
					document.getElementById("a_email").innerText = dataFromCustomer.EMAIL;
					document.getElementById("a_mailing_address").innerText = dataFromCustomer.COMPANY_PROVINCE +dataFromCustomer.COMPANY_CITY+dataFromCustomer.COMPANY_COUNTY+dataFromCustomer.COMPANY_ADDRESS;
					document.getElementById("a_mailing_zip_code").innerText = dataFromCustomer.COMPANY_ZIP_CODE;
					document.getElementById("a_home_address").innerText = dataFromCustomer.HOME_PROVINCE +dataFromCustomer.HOME_CITY+dataFromCustomer.HOME_COUNTY+dataFromCustomer.HOME_ADDRESS;
					document.getElementById("a_home_zip_code").innerText = dataFromCustomer.HOME_ZIP_CODE;
					if(document.getElementById("phone_a_relation").innerText == '本人'){
						setCodeNameByCode('marriage', dataFromCustomer.MARRI_STATUS, 'i_marry');
						document.getElementById("i_name").innerText = dataFromCustomer.REAL_NAME;
						document.getElementById("i_sex").innerText = dataFromCustomer.SEX == 0 ? '男' : '女';
						document.getElementById("i_birthday").innerText = dataFromCustomer.BIRTHDAY;
						//document.getElementById("a_relation").innerText = dataFromCustomer.recognizeeName;
						// document.getElementById("a_id_name").innerText = dataFromCustomer.IDTYPE;
						setCodeNameByCode('idtype', dataFromCustomer.IDTYPE, 'i_id_name');
						document.getElementById("i_id_no").innerText = dataFromCustomer.IDNO;
						document.getElementById("i_id_end_date").innerText = dataFromCustomer.ID_END_DATE;
						// document.getElementById("a_nation_place").innerText = dataFromCustomer.NATIVE_PLACE;
						setCodeNameByCode('nativeplace', dataFromCustomer.NATIVE_PLACE, 'i_nation_place');
						document.getElementById("i_rgt_address").innerText = dataFromCustomer.RGT_PROVINCE + dataFromCustomer.RGT_CITY;//+dataFromCustomer.HOUSEHOLD_COUNTY;
						//document.getElementById("a_marry").innerText = dataFromCustomer.MARRI_STATUS;
						document.getElementById("i_income").innerText = dataFromCustomer.INCOME;
						//document.getElementById("a_income_way").innerText = dataFromCustomer.INCOME_WAY;
						var codeList2  = dataFromCustomer.INCOME_WAY.split(",");
						var incomewayTotal2 = [];
						for(var cd = 0;cd < codeList2.length; cd++){
							getCodeName('incomeway',codeList2[cd],function(msg){
								incomewayTotal2.push(msg)
							})
						}
						setTimeout(function(){
							codeResult2 = incomewayTotal2.join(",");
							document.getElementById("i_income_way").innerText = codeResult2;
						},1000)
						document.getElementById("i_work_unit").innerText = dataFromCustomer.WORK_UNIT;
						document.getElementById("i_occupation").innerText = dataFromCustomer.OCCUPATION_CODE_NAME;
						document.getElementById("i_occupation_code").innerText = dataFromCustomer.OCCUPATION_CODE;
						document.getElementById("i_occupation_other").innerText = dataFromCustomer.PLURALITY_OCCUPATION_CODE_NAME;
						document.getElementById("i_mobile").innerText = dataFromCustomer.MOBILE;
						document.getElementById("i_email").innerText = dataFromCustomer.EMAIL;
						document.getElementById("i_mailing_address").innerText = dataFromCustomer.COMPANY_PROVINCE +dataFromCustomer.COMPANY_CITY+dataFromCustomer.COMPANY_COUNTY+dataFromCustomer.COMPANY_ADDRESS;
						document.getElementById("i_mailing_zip_code").innerText = dataFromCustomer.COMPANY_ZIP_CODE;
						document.getElementById("i_home_address").innerText = dataFromCustomer.HOME_PROVINCE +dataFromCustomer.HOME_CITY+dataFromCustomer.HOME_COUNTY+dataFromCustomer.HOME_ADDRESS;
						document.getElementById("i_home_zip_code").innerText = dataFromCustomer.HOME_ZIP_CODE;
					}
				}

			} else if (json.recommend == '2') {
				var dataBbr = json.info;
				saveToDB(dataBbr,'bbr');
				if(pctype == 'phone'){
					document.getElementById("phone_i_name").innerText = dataBbr.REAL_NAME;
					document.getElementById("phone_i_sex").innerText = dataBbr.SEX == 0 ? '男' : '女';
					document.getElementById("phone_i_birthday").innerText = dataBbr.BIRTHDAY;
					//document.getElementById("i_relation").innerText = dataBbr.recognizeeName;
					// document.getElementById("i_id_name").innerText = dataBbr.IDTYPE;
					setCodeNameByCode('idtype', dataBbr.IDTYPE, 'phone_i_id_name');
					document.getElementById("phone_i_id_no").innerText = dataBbr.IDNO;
					document.getElementById("phone_i_id_end_date").innerText = dataBbr.ID_END_DATE;
					// document.getElementById("i_nation_place").innerText = dataBbr.NATIVE_PLACE;
					setCodeNameByCode('nativeplace', dataBbr.NATIVE_PLACE, 'phone_i_nation_place');
					//document.getElementById("phone_i_rgt_address").innerText = dataBbr.HOUSEHOLD_ADRESS;
					document.getElementById("phone_i_rgt_address").innerText = dataBbr.RGT_PROVINCE + dataBbr.RGT_CITY;//+dataBbr.HOUSEHOLD_COUNTY;
					// document.getElementById("i_marry").innerText = dataBbr.MARRI_STATUS;
					setCodeNameByCode('marriage', dataBbr.MARRI_STATUS, 'phone_i_marry');
					document.getElementById("phone_i_income").innerText = dataBbr.INCOME;
					// document.getElementById("i_income_way").innerText = dataBbr.INCOME_WAY;
					// setCodeNameByCode('incomeway', dataBbr.INCOME_WAY, 'phone_i_income_way');
					var codeList  = dataBbr.INCOME_WAY.split(",");
					var incomewayTotal = [];
					for(var cd = 0;cd < codeList.length; cd++){
						getCodeName('incomeway',codeList[cd],function(msg){
							incomewayTotal.push(msg)
						})
					}
					setTimeout(function(){
						codeResult = incomewayTotal.join(",");
						document.getElementById("phone_i_income_way").innerText = codeResult;
					},1000)
					document.getElementById("phone_i_work_unit").innerText = dataBbr.WORK_UNIT;
					//document.getElementById("phone_i_occupation").innerText = dataBbr.OCCUPATION_CODE_NAME;
					document.getElementById("phone_i_occupation_code").innerText = dataBbr.OCCUPATION_CODE;
					document.getElementById("phone_i_occupation").innerText = dataBbr.OCCUPATION_CODE_NAME;
					document.getElementById("phone_i_occupation_other").innerText = dataBbr.PLURALITY_OCCUPATION_CODE_NAME;
					document.getElementById("phone_i_mobile").innerText = dataBbr.MOBILE;
					document.getElementById("phone_i_email").innerText = dataBbr.EMAIL;
					document.getElementById("phone_i_phone").innerText = dataBbr.COMPANY_PHONE;
					//document.getElementById("phone_i_home_address").innerText = dataBbr.HOME_ADDRESS;
					
					document.getElementById("phone_i_mailing_address").innerText = dataBbr.COMPANY_PROVINCE +dataBbr.COMPANY_CITY+dataBbr.COMPANY_COUNTY+dataBbr.COMPANY_ADDRESS;
					document.getElementById("phone_i_mailing_zip_code").innerText = dataBbr.COMPANY_ZIP_CODE;
				
					document.getElementById("phone_i_home_address").innerText = dataBbr.HOME_PROVINCE +dataBbr.HOME_CITY+dataBbr.HOME_COUNTY+dataBbr.HOME_ADDRESS;
					document.getElementById("phone_i_home_zip_code").innerText = dataBbr.HOME_ZIP_CODE;
					if (document.getElementById("a_relation").innerText == "本人") {
						document.getElementById("phone_a_name").innerText = dataBbr.REAL_NAME;
						document.getElementById("phone_a_sex").innerText = dataBbr.SEX == 0 ? '男' : '女';
						document.getElementById("phone_a_birthday").innerText = dataBbr.BIRTHDAY;
						setCodeNameByCode('idtype', dataBbr.IDTYPE, 'phone_a_id_name');
						document.getElementById("phone_a_id_no").innerText = dataBbr.IDNO;
						document.getElementById("phone_a_id_end_date").innerText = dataBbr.ID_END_DATE;
						setCodeNameByCode('nativeplace', dataBbr.NATIVE_PLACE, 'phone_a_nation_place');
						document.getElementById("phone_a_rgt_address").innerText = dataBbr.RGT_PROVINCE + dataBbr.RGT_CITY;//+dataFromCustomer.HOUSEHOLD_COUNTY;
						document.getElementById("phone_a_income").innerText = dataBbr.INCOME;
						// setCodeNameByCode('incomeway', dataBbr.INCOME_WAY, 'phone_a_income_way');
						var codeList2  = dataBbr.INCOME_WAY.split(",");
						var incomewayTotal2 = [];
						for(var cd = 0;cd < codeList2.length; cd++){
							getCodeName('incomeway',codeList2[cd],function(msg){
								incomewayTotal2.push(msg)
							})
						}
						setTimeout(function(){
							codeResult2 = incomewayTotal2.join(",");
							document.getElementById("phone_a_income_way").innerText = codeResult2;
						},1000)
						document.getElementById("phone_a_work_unit").innerText = dataBbr.WORK_UNIT;
						document.getElementById("phone_a_occupation").innerText = dataBbr.OCCUPATION_CODE_NAME;
						document.getElementById("phone_a_occupation_code").innerText = dataBbr.OCCUPATION_CODE;
						document.getElementById("phone_a_occupation_other").innerText = dataBbr.PLURALITY_OCCUPATION_CODE_NAME;
						document.getElementById("phone_a_mobile").innerText = dataBbr.MOBILE;
						document.getElementById("phone_a_email").innerText = dataBbr.EMAIL;
						document.getElementById("phone_a_home_address").innerText = dataBbr.HOME_PROVINCE +dataBbr.HOME_CITY+dataBbr.HOME_COUNTY+dataBbr.HOME_ADDRESS;
						document.getElementById("phone_a_home_zip_code").innerText = dataBbr.HOME_ZIP_CODE;
						document.getElementById("phone_a_mailing_address").innerText = dataBbr.COMPANY_PROVINCE +dataBbr.COMPANY_CITY+dataBbr.COMPANY_COUNTY+dataBbr.COMPANY_ADDRESS;
						document.getElementById("phone_a_mailing_zip_code").innerText = dataBbr.COMPANY_ZIP_CODE;
	
					}
				}else{
					document.getElementById("i_name").innerText = dataBbr.REAL_NAME;
					document.getElementById("i_sex").innerText = dataBbr.SEX == 0 ? '男' : '女';
					document.getElementById("i_birthday").innerText = dataBbr.BIRTHDAY;
					//document.getElementById("i_relation").innerText = dataBbr.recognizeeName;
					// document.getElementById("i_id_name").innerText = dataBbr.IDTYPE;
					setCodeNameByCode('idtype', dataBbr.IDTYPE, 'i_id_name');
					document.getElementById("i_id_no").innerText = dataBbr.IDNO;
					document.getElementById("i_id_end_date").innerText = dataBbr.ID_END_DATE;
					// document.getElementById("i_nation_place").innerText = dataBbr.NATIVE_PLACE;
					setCodeNameByCode('nativeplace', dataBbr.NATIVE_PLACE, 'i_nation_place');
					document.getElementById("i_rgt_address").innerText = dataBbr.RGT_PROVINCE + dataBbr.RGT_CITY;//+dataBbr.HOUSEHOLD_COUNTY;
					// document.getElementById("i_marry").innerText = dataBbr.MARRI_STATUS;
					setCodeNameByCode('marriage', dataBbr.MARRI_STATUS, 'i_marry');
					document.getElementById("i_income").innerText = dataBbr.INCOME;
					// document.getElementById("i_income_way").innerText = dataBbr.INCOME_WAY;
					// setCodeNameByCode('incomeway', dataBbr.INCOME_WAY, 'i_income_way');
					var codeList  = dataBbr.INCOME_WAY.split(",");
					var incomewayTotal = [];
					for(var cd = 0;cd < codeList.length; cd++){
						getCodeName('incomeway',codeList[cd],function(msg){
							incomewayTotal.push(msg)
						})
					}
					setTimeout(function(){
						codeResult = incomewayTotal.join(",");
						document.getElementById("i_income_way").innerText = codeResult;
					},1000)
					document.getElementById("i_work_unit").innerText = dataBbr.WORK_UNIT;
					document.getElementById("i_occupation").innerText = dataBbr.OCCUPATION_CODE_NAME;
					document.getElementById("i_occupation_code").innerText = dataBbr.OCCUPATION_CODE;
					document.getElementById("i_occupation_other").innerText = dataBbr.PLURALITY_OCCUPATION_CODE_NAME;
					document.getElementById("i_mobile").innerText = dataBbr.MOBILE;
					document.getElementById("i_phone").innerText = dataBbr.COMPANY_PHONE;
					document.getElementById("i_email").innerText = dataBbr.EMAIL;
					//document.getElementById("i_home_address").innerText = dataBbr.HOME_ADDRESS;
					// 通讯地址2017/3/24
					document.getElementById("i_mailing_address").innerText = dataBbr.COMPANY_PROVINCE +dataBbr.COMPANY_CITY+dataBbr.COMPANY_COUNTY+dataBbr.COMPANY_ADDRESS;
					document.getElementById("i_mailing_zip_code").innerText = dataBbr.COMPANY_ZIP_CODE;
					// 家庭地址
					document.getElementById("i_home_address").innerText = dataBbr.HOME_PROVINCE +dataBbr.HOME_CITY+dataBbr.HOME_COUNTY+dataBbr.HOME_ADDRESS;
					document.getElementById("i_home_zip_code").innerText = dataBbr.HOME_ZIP_CODE;
					if (document.getElementById("phone_a_relation").innerText == "本人") {
						document.getElementById("a_name").innerText = dataBbr.REAL_NAME;
						document.getElementById("a_sex").innerText = dataBbr.SEX == 0 ? '男' : '女';
						document.getElementById("a_birthday").innerText = dataBbr.BIRTHDAY;
						//document.getElementById("i_relation").innerText = dataBbr.recognizeeName;
						// document.getElementById("i_id_name").innerText = dataBbr.IDTYPE;
						setCodeNameByCode('idtype', dataBbr.IDTYPE, 'a_id_name');
						document.getElementById("a_id_no").innerText = dataBbr.IDNO;
						document.getElementById("a_id_end_date").innerText = dataBbr.ID_END_DATE;
						// document.getElementById("i_nation_place").innerText = dataBbr.NATIVE_PLACE;
						setCodeNameByCode('nativeplace', dataBbr.NATIVE_PLACE, 'a_nation_place');
						document.getElementById("a_rgt_address").innerText = dataBbr.RGT_PROVINCE + dataBbr.RGT_CITY;//+dataBbr.HOUSEHOLD_COUNTY;
						// document.getElementById("i_marry").innerText = dataBbr.MARRI_STATUS;
						setCodeNameByCode('marriage', dataBbr.MARRI_STATUS, 'a_marry');
						document.getElementById("a_income").innerText = dataBbr.INCOME;
						// document.getElementById("i_income_way").innerText = dataBbr.INCOME_WAY;
						// setCodeNameByCode('incomeway', dataBbr.INCOME_WAY, 'i_income_way');
						var codeList2  = dataBbr.INCOME_WAY.split(",");
						var incomewayTotal2 = [];
						for(var cd = 0;cd < codeList2.length; cd++){
							getCodeName('incomeway',codeList2[cd],function(msg){
								incomewayTotal2.push(msg)
							})
						}
						setTimeout(function(){
							codeResult2 = incomewayTotal2.join(",");
							document.getElementById("a_income_way").innerText = codeResult2;
						},1000)
						document.getElementById("a_work_unit").innerText = dataBbr.WORK_UNIT;
						document.getElementById("a_occupation").innerText = dataBbr.OCCUPATION_CODE_NAME;
						document.getElementById("a_occupation_code").innerText = dataBbr.OCCUPATION_CODE;
						document.getElementById("a_occupation_other").innerText = dataBbr.PLURALITY_OCCUPATION_CODE_NAME;
						document.getElementById("a_mobile").innerText = dataBbr.MOBILE;
						document.getElementById("a_phone").innerText = dataBbr.COMPANY_PHONE;
						document.getElementById("a_email").innerText = dataBbr.EMAIL;
						//document.getElementById("i_home_address").innerText = dataBbr.HOME_ADDRESS;
						// 通讯地址2017/3/24
						document.getElementById("a_mailing_address").innerText = dataBbr.COMPANY_PROVINCE +dataBbr.COMPANY_CITY+dataBbr.COMPANY_COUNTY+dataBbr.COMPANY_ADDRESS;
						document.getElementById("a_mailing_zip_code").innerText = dataBbr.COMPANY_ZIP_CODE;
						// 家庭地址
						document.getElementById("a_home_address").innerText = dataBbr.HOME_PROVINCE +dataBbr.HOME_CITY+dataBbr.HOME_COUNTY+dataBbr.HOME_ADDRESS;
						document.getElementById("a_home_zip_code").innerText = dataBbr.HOME_ZIP_CODE;
					}
				} 
			} else if (json.recommend == '3'&&json.favoreetype == '0') { //受益人信息跳转
				var favoreeDate = json.info;
				
				//被保人ID
				var recognizeeID = document.getElementById('recognizeeID').value;
				//添加的受益人ID
				var benefitId = favoreeDate.ID;
				//身故受益人不可以是被保人
				if(benefitId == recognizeeID){
					myAlert("身故受益人不允许是被保人，请重新选择！");
					return;
				}
				//身故受益人不允许重复添加同一个客户
				var benefitList = bankScope.benefitOneData;
				for(var i = 0 ; i < benefitList.length ; i++){
					var tempCustomerId = benefitList[i]["CUSTOMER_ID"];
					if(favoreeDate["ID"] == tempCustomerId){
						myAlert("受益人不允许重复添加同一客户，请重新选择！");
						return;
					}
				}
				
				saveToDB(favoreeDate,'benefit');
				//身故受益人列表对象     
				favoreeDate["IDNAME"] = favoreeDate["IDTYPE"];
				favoreeDate["CUSTOMER_ID"] = favoreeDate.ID; 
				favoreeDate["APPLY_ID"] = document.getElementById("formID").value;;
				favoreeDate["PROPOSAL_ID"] = document.getElementById("propsalID").value;
				favoreeDate["AGENT_CODE"] = agentCode;
				favoreeDate["CREATE_TIME"] = new Date();
				favoreeDate["UPDATE_TIME"] = new Date();
				favoreeDate["NAME"] = favoreeDate.REAL_NAME;  
				favoreeDate["IS_BENEFIT"] = 2;
				favoreeDate["BENEFIT_TYPE"] = 0;
				favoreeDate["RELATION"] = "";
				
				var sgList = bankScope.benefitOneData;
				if(sgList != null){ 
					 favoreeDate["relationList"] = benefitRelationList;
					 sgList.push(favoreeDate); 
					 bankScope.$apply(function (){
						 bankScope.benefitOneData = sgList;
					 });
				} 
				 
			}else if (json.recommend == '3'&&json.favoreetype == '1') {
				var favoreeDate = json.info;

				//受益人不允许重复添加同一个客户
				var benefitList = bankScope.benefitTwoData;
				for(var i = 0 ; i < benefitList.length ; i++){
					var tempCustomerId = benefitList[i]["CUSTOMER_ID"];
					if(favoreeDate["ID"] == tempCustomerId){
						myAlert("受益人不允许重复添加同一客户，请重新选择！");
						return;
					}
				}
				
				saveToDB(favoreeDate,'benefit');
				//身故受益人列表对象     
				favoreeDate["IDNAME"] = favoreeDate["IDTYPE"];
				favoreeDate["CUSTOMER_ID"] = favoreeDate.ID;
				favoreeDate["APPLY_ID"] = document.getElementById("formID").value;
				favoreeDate["PROPOSAL_ID"] = document.getElementById("propsalID").value;
				favoreeDate["AGENT_CODE"] = agentCode;
				favoreeDate["CREATE_TIME"] = new Date();
				favoreeDate["UPDATE_TIME"] = new Date();
				favoreeDate["NAME"] = favoreeDate.REAL_NAME; 
				favoreeDate["IS_BENEFIT"] = 2;
				favoreeDate["BENEFIT_TYPE"] = 1;
				favoreeDate["RELATION"] = "";
				
				var fsgList = bankScope.benefitTwoData;
				if(fsgList != null){ 
					 favoreeDate["relationList"] = benefitRelationList; 
					 fsgList.push(favoreeDate); 
					 bankScope.$apply(function (){
						 bankScope.benefitTwoData = fsgList;
					 });
				} 
			}
		});
	}catch(e){
		console.log("json解析出错！"+e);
	}
}

/**
 * @功能:根据码表的值返回名称
 * @param {codeType:类型，codeVal值，tatgetID映射表单ID}
 * @Author:Li Jie
 * @Date 2015-02-13
 */
function setCodeNameByCode(codeType,codeVal,tatgetID){
	var bycode = {
		"databaseName": 'promodel/10005/www/db/t_code.sqlite',
		"tableName": "T_CODE",
		"conditions": {"CODE_TYPE": codeType,"code":codeVal}
	};
	queryTableDataByConditions(bycode, function (data) {
		if(data){ 
			document.getElementById(tatgetID).innerText = data[0].CODE_NAME;
		}
	});
}
function getCodeName(codeType,codeVal, fn){
	var bycode = {
		"databaseName": 'promodel/10005/www/db/t_code.sqlite',
		"tableName": "T_CODE",
		"conditions": {"CODE_TYPE": codeType,"code":codeVal}
	};
	queryTableDataByConditions(bycode, function (data) {
		if(data){
			fn(data[0].CODE_NAME);
			//document.getElementById(tatgetID).innerText = data[0].CODE_NAME;
		}
	});
}
function getRelation(codeType,obj){
	//查询关系code
	var option = '';
	var bycode = {
		"databaseName": 'promodel/10005/www/db/t_code.sqlite',
		"tableName": "T_CODE",
		"conditions": {"CODE_TYPE": codeType}
	};
	queryTableDataByConditions(bycode, function (data) {
		if(data){
			for(var i = 0;i<data.length;i++){
				option += '<option>'+data[i].CODE_NAME+'</option>';
			}
			console.log('关系：----'+option);
			document.getElementById(obj).innerHTML = option;
		}
	});
}

function saveToDB(dataFromCustomer,customerType){
	var customerId = dataFromCustomer.ID ;
	var applyId = document.getElementById("formID").value;
	var propsalID = document.getElementById("propsalID").value;

	var cstm = {};
	cstm["CUSTOMER_ID"] = customerId;
	cstm["APPLY_ID"] = applyId;
	cstm["PROPOSAL_ID"] = propsalID;
	cstm["AGENT_CODE"] = agentCode;
	cstm["NAME"] = dataFromCustomer.REAL_NAME;
	cstm["SEX"] = dataFromCustomer.SEX;
	cstm["BIRTHDAY"] = dataFromCustomer.BIRTHDAY;
	cstm["IDNAME"] = dataFromCustomer.IDTYPE;
	cstm["IDNO"] = dataFromCustomer.IDNO;
	cstm["ID_END_DATE"] = dataFromCustomer.ID_END_DATE;
	//cstm["IS_FOREVER"] = dataFromCustomer.BIRTHDAY;
	cstm["MARRIY"] = dataFromCustomer.MARRI_STATUS;
	cstm["NATIVE_PLACE"] = dataFromCustomer.NATIVE_PLACE;
	cstm["RGT_ADDRESS"] = dataFromCustomer.HOUSEHOLD_ADRESS;
	cstm["INCOME"] = dataFromCustomer.INCOME;
	cstm["INCOME_WAY"] = dataFromCustomer.INCOME_WAY;
	cstm["WORK_UNIT"] = dataFromCustomer.WORK_UNIT;
	cstm["HOME_ADDRESS"] = dataFromCustomer.HOME_ADDRESS;
	cstm["HOME_ZIP_CODE"] = dataFromCustomer.HOME_ZIP_CODE;
	cstm["OCCUPATION"] = dataFromCustomer.OCCUPATION_CODE_NAME;
	cstm["OCCUPATION_CODE"] = dataFromCustomer.OCCUPATION_CODE;
	cstm["PLURALITY_OCCUPATION_CODE_NAME"] = dataFromCustomer.PLURALITY_OCCUPATION_CODE_NAME;
	cstm["PHONE"] = dataFromCustomer.COMPANY_PHONE;
	cstm["MOBILE"] = dataFromCustomer.MOBILE;
	cstm["EMAIL"] = dataFromCustomer.EMAIL;
	cstm["CREATE_TIME"] = new Date();
	cstm["UPDATE_TIME"] = new Date();

	if(customerType=='tbr'){
		var relationCode = document.getElementById('a_relation').getElementsByTagName('input').value;
		cstm["RELATION"] = relationCode;
		cstm["MAILING_ADDRESS"] = dataFromCustomer.MAILING_ADDRESS;
		cstm["MAILING_ ZIP_CODE"] = dataFromCustomer.COMPANY_ZIP_CODE;
	}else if(customerType=='benefit'){
		cstm["IS_BENEFIT"] = 2;
	}
	if(syrUserType == '3'){
		cstm["BENEFIT_TYPE"] = 0;
	}else if(syrUserType == '4'){
		cstm["BENEFIT_TYPE"] = 1;
	}
	//cstm["BENEFIT_RATE"] = dataFromCustomer.BIRTHDAY;
	//cstm["BENEFIT_ORDER"] = dataFromCustomer.BIRTHDAY;
	//证件照片
	/*cstm["CARD_FRONT"] = dataFromCustomer.BIRTHDAY;
	 cstm["CARD_REVERSE"] = dataFromCustomer.BIRTHDAY;*/
	//alert(applyId+':'+propsalID+':'+relationCode);
	syrUserBeanList.push(cstm);
//	var addCstm = {
//		"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
//		"tableName": "T_CUSTOMER",
//		"conditions": [{"CUSTOMER_ID": customerId}],
//		"data": [cstm]
//	};
//	updateORInsertTableDataByConditions(addCstm, function (str) {
//		if(str==1){
//			console.log('数据插入成功！')
//		}else{
//			console.log('数据插入失败！')
//		}
//	}, function () {
//		console.log("客户信息保存失败！");
//	});
}
/**
 * 控制输入百分比
 * @param objs
 */
function getPercent(id,objs){
	var reg = /(^[1-9]\d?$)|(^100$)/;
	var inputs = document.getElementById(id).getElementsByClassName(objs);
	for(var i = 0;i<inputs.length;i++){
		inputs[i].onblur= function () {
			console.log(this.value);
			if (!reg.test(this.value)) {
				myAlert('请输入大于0小于100的数');
			}
		}

	}
}
function replaceNull(temp){
	for(var key in temp){
		if(temp[key] == '' || temp[key] == null || temp[key] == 'null' || temp[key] == 'undefined' ){
//			temp[key] = '无';
			temp[key] = '';
		}
	}
}
function replaceNull2(temp){
	if(temp == '' || temp == null || temp == 'null' || temp == 'undefined' ){
		return ''
	}
	return temp;
}
function findCustomer(applyId){
	/*var sql = "select * from T_APPLY WHERE ID = '"+applyID+"'";
	if("" != opts.applicantID && !!opts.applicantID){//查询的是投保人
		sql += " and APPLICANT_ID = '"+opts.applicantID+"'";
	}else if ("" != opts.recognizeeID && !!opts.recognizeeID){//查询的是被保人
		sql += " and INSURANT_ID = '"+opts.recognizeeID+"'";
	}else if("" != opts.benefit && !!opts.benefit){//查询的是受益人 benefit == 1 的时候
		sql += " and IS_BENEFIT = "+opts.benefit;
	}*/
	var json = {
		"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
		"tableName": "T_APPLY",
		"conditions":{'ID':applyId}
	};
	queryTableDataByConditions(json,function(data){
		document.getElementById('applicantID').value = data[0].APPLICANT_ID;
		document.getElementById('recognizeeID').value = data[0].INSURANT_ID;
	},function (){
		console.log('查询出错！');
	});
}

//根据生日计算周岁年龄，xiyawen add，2015-03-16
// function getAgeByBirthday(birthday){
// 	var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
// 	if(r==null){
// 		return 0;
// 	}
// 	var d = new Date(r[1],r[3]-1,r[4]);
// 	var nowDate = new Date();
// 	nowDate.setFullYear(r[1]);
// 	var years= new Date();
	
// 	if(d.getTime()> nowDate.getTime()){
// 		return  years.getFullYear()-d.getFullYear()-1;
// 	}else{
// 		return  years.getFullYear()-d.getFullYear();
// 	}
// }

//根据生日计算周岁年龄，renxiaomin 2017-7-20
function getAgeByBirthday (birthday) {
	var birthdayArr = birthday.split('-');
	var birthdayDate = new Date();
	var dateNow = new Date();

	birthdayDate.setFullYear(parseInt(birthdayArr[0], 10));
	birthdayDate.setMonth(parseInt(birthdayArr[1], 10) - 1);
	birthdayDate.setDate(parseInt(birthdayArr[2], 10));

	dateNow.setFullYear(parseInt(birthdayArr[0], 10));

	if(dateNow.getTime() >= birthdayDate.getTime()){
		var newDateNow = new Date();

		return newDateNow.getFullYear() - parseInt(birthdayArr[0], 10); 	
	}else{
		var newDateNow = new Date();

		return (newDateNow.getFullYear() - parseInt(birthdayArr[0], 10)) - 1; 	
	};
}

//获取当前日期，xiyawen add，2015-03-19
function getDateString(value){
	 var d ;
	 if(value!=null&&value!=undefined&&value!=""){
		 d=new Date(value.replace(/-/g,"\/"));
	 }else{
		d= new Date();
	 }
	 var years = d.getFullYear();
	 var month = add_zero(d.getMonth()+1);
	 var days = add_zero(d.getDate());
	 var hours = add_zero(d.getHours());
	 var minutes = add_zero(d.getMinutes());
	 var seconds=add_zero(d.getSeconds());
	 var ndate = years+"年"+month+"月"+days+"日 ";
	 return  ndate;
}
//日期前加‘0’
function add_zero(temp)
{
	if(temp<10) return "0"+temp;
	else return temp;
}
//承保保单预览从本地数据库日期转换
function getDataYears(value){
	var d;
	var t;
	if(value!=null && value!= undefined && value!=""){
		 d=value.split("T");
		 t=d[0].split("-")
	}
	for(i=0; i < t.length; i++){
		var ydate=t[0]+"年"+t[1]+"月"+t[2]+"日";
	}
	return ydate;
}
//承保保单预览从服务器日期转换
function getDateToYears(dataYears){
	var t;
	if(dataYears!=null && dataYears!= undefined && dataYears!=""){		 
		t=dataYears.split("-")
	}
	for(i=0; i < t.length; i++){
		var ydate=t[0]+"年"+t[1]+"月"+t[2]+"日";
	}
	return ydate;
	
}
//{"CONTENT":{"recommendName":"海阔天空","backgroundImage":"201304221145070066.jpg","isThanksNote":"感谢您使用民生保险","isOpeningWords":"","isEndingWords":"","endingWords":"undefined","customerMap":{"NAME":"Egon","SEX":"男","AGE":"47","JOB":"2","SEXCALL":"先生"},"agentMap":{"AGENTCODE":"8611018517","NAME":"mrzhou","PHONE":"15923003477","ORGANIZATION":"北京分公司"},"isThanksNote":"感谢您使用民生保险","isCompanyIntroduction":"民生保险创建于XXXX年XX月XX日","insureProductsMap":{"tableTitleList":["产品名称","基本保险金额/档次/份数","保险期间","交费年期","首年保险费"],"tableDataList":[["民生安康定期寿险","1000000","至70周岁","一次交清","208360"]]},"interestDemonstrationTableMap":{"tableTitleList":[{"title":"保单年度","isLeaf":"false"},{"title":"年末已达年龄","isLeaf":"false"},{"title":"期交保费","isLeaf":"false"},{"title":"累计已交保费","isLeaf":"false"},{"title":"疾病身故保险金","isLeaf":"false"},{"title":"意外身故保险金","isLeaf":"false"},{"title":"现金价值","isLeaf":"false"}],"tableDataList":[[1,48,208360,208360,208360,1000000,165120],[2,49,0,208360,1000000,1000000,166940],[3,50,0,208360,1000000,1000000,168520],[4,51,0,208360,1000000,1000000,169830],[5,52,0,208360,1000000,1000000,170820],[6,53,0,208360,1000000,1000000,171420],[7,54,0,208360,1000000,1000000,171560],[8,55,0,208360,1000000,1000000,171200],[9,56,0,208360,1000000,1000000,170220],[10,57,0,208360,1000000,1000000,168530],[11,58,0,208360,1000000,1000000,166030],[12,59,0,208360,1000000,1000000,162590],[13,60,0,208360,1000000,1000000,158040],[14,61,0,208360,1000000,1000000,152220],[15,62,0,208360,1000000,1000000,144950],[16,63,0,208360,1000000,1000000,136040],[17,64,0,208360,1000000,1000000,125210],[18,65,0,208360,1000000,1000000,112180],[19,66,0,208360,1000000,1000000,96600],[20,67,0,208360,1000000,1000000,78520],[21,68,0,208360,1000000,1000000,56580],[22,69,0,208360,1000000,1000000,30640],[23,70,0,208360,1000000,1000000,0]]}},"applicantID":"C67E533FB660000183F718B0134B19C9","relation":"00","applicantOccupationType":"4","applicantOccupationName":"油漆工、喷漆工","applicantName":"Tom","applicantSex":"0","applicantBirthday":"1983-04-08","applicantOccupationCode":"070111","recognizeeID":"C67E53273A800001798CC0F037DA1F35","recognizeeOccupationType":"5","recognizeeOccupationName":"铁牛车驾驶、混凝土预拌车驾驶员`","recognizeeName":"Egon","recognizeeSex":"0","recognizeeBirthday":"1967-03-05","recognizeeOccupationCode":"050111","productid":"111301","flag":"recommend","PROPOSAL_ID":"1423728722931","CREATE_TIME":"Thu Mar 05 2015 14:54:50 GMT+0800 (CST)"}


/**
 * 添加银行信息参数:applyId-保单ID,bankVal-当前选择的银行,cardNumber-银行卡号,name-投保人姓名,appliantID-投保人ID,bankName--银行名称,$scope--$scope对象
 */
function saveBankInfo(applyId,bankVal,cardNumber,name,appliantID,bankName,$scope){
	var sql="update T_APP_BANK set isChecked = (case when isChecked ='true' "+
			" then  'false'  else  case when bankCode = '"+bankCode+"' and cardNum ='"+cardNo+"' "+ 
   			" then 'true'    else 'false'    end  end)  where applyId ='"+online_apply_id+"' ";
	var bank_List = {
        "databaseName":"promodel/10005/www/db/t_bank.sqlite",
        "sql": sql
    }; 
	queryTableDataUseSql(bank_List,function(data){ 
		     var pctype = document.getElementById("pctype").value;
		     if('phone' == pctype){
		     	var formID = document.getElementById("formID").value;
				//更新页面的对象
				var bank_List = {
					"databaseName":"promodel/10005/www/db/t_bank.sqlite",
					"sql": "select a.[applyId],a.[appliantName],a.[appliantId],a.[bankCode],a.isChecked, a.[cardNum],a.[createTime],(select b.BANK_NAME from t_bank b where b.BANK_CODE = a.[bankCode]) as   BANK_NAME  from T_APP_BANK a where a.applyId ='"+formID+"'  order by a.createTime desc "
				};  
				queryTableDataUseSql(bank_List,function(data){
						if(data){ 
							var domBankDiv = document.getElementById("bank_info_div_pc"); 
							var phone_html ='';
							var isCheckHtml ='';
							for(var i = 0; i<data.length; i++){ 
								if(data[i].isChecked == 'true'){
									isCheckHtml+='<span></span>';
								}else{
									isCheckHtml ='';
								}  
								phone_html+='<div class="table_list">';
								phone_html+='<p>'+ data[i].BANK_NAME + '</p>';
								phone_html+='<p>'+ data[i].appliantName + '</p>';
								phone_html+='<p>'+ data[i].cardNum+ '</p>';
								if(data[i].isChecked != 'true'){
									phone_html+='<button class="button button-stable" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')">选中</button>';
								} 
								phone_html+='<button  class="button button-stable" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')">删除</button>';
								phone_html+=''+isCheckHtml+'</div>'; 
	
							}
							domBankDiv.innerHTML = phone_html; 
						} 
						bankScope.listBank = data;
				});  
		     } 
	}); 
	resetClearBankForm(bankScope);
}

/***
 * 清空银行卡号的表单
 */
function validateBankForm(bankVal,bankCardNumber){
	var returnFalg = true;
	if(bankVal && bankVal != 'undefined'){
		myAlert("请选择银行!");
		returnFalg = false;
	}
	
	if(bankCardNumber  && bankCardNumber != 'undefined'){
		myAlert("请填写银行卡号!");
		returnFalg = false;
	}
	//alert("returnFalg:" + returnFalg)
	return returnFalg;
}

/***
 * 验证银行的
 */
function resetClearBankForm($scope){
	$scope.bankCardNumber = "";
//	$scope.bankData = ""; 
	if(document.getElementById("phone-num")){
		document.getElementById("phone-num").value  ="";
	} 

	if(document.getElementById("phone-num2")){
		document.getElementById("phone-num2").value  ="";
	} 
	
	if(document.getElementById("phone-num-pc")){
		document.getElementById("phone-num-pc").value  ="";
	} 
	if(document.getElementById("phone-num-pc2")){
		document.getElementById("phone-num-pc2").value  ="";
	} 
//	document.getElementById("bank_select").value  ="";
	
//	var agent ='';
//	if(storage.getItem('agentCode')){
//		agent = storage.getItem('agentCode').slice(0,4);
//	}else{
//		agent = "8611018517".slice(0,4);
//	} 
//    var sql = "select * from T_BANK where COM_CODE = " + agent;
//    var json = {
//        "databaseName":Variables.bankBaseName,
//        "sql": sql
//    }; 
//    queryTableDataUseSql(json,function(data){
//      	 $scope.$apply(function (){
//			 $scope.bankData = data;
//		 });
//    },function (){
//        console.log('查询code出错！');
//    });
}
/***
 *选中银行卡
 */
function chooseBank(bankCode,bankName,cardNo,applynum){  
	//----------------------------begin-----------------------------------
	//alert(bankCode+bankName+cardNo+"---保费总额---"+applynum);
	//超额转线下 add  2016.9.10   wuwei
	var applicantID = document.getElementById('applicantID').value;
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm");
	if(bankName.indexOf("农业") > 0 ){
		if(cardNo.length == 19 && applynum >= 20000){//银行卡
			var confirms = confirm("您的保费超出了"+bankName+"收费限额,您可选择'取消'更换其他银行卡，或选择'确认'将此单转为线下收费。");
			if(!confirms){return ;}	
		}else if(cardNo.length == 17 && applynum >= 10000){//存折
			var confirms = confirm("您的保费超出了"+bankName+"收费限额,您可选择'取消'更换其他银行卡，或选择'确认'将此单转为线下收费。");
			if(!confirms){return ;}
		}			
	}else if(bankName.indexOf("中国银行") >= 0 ){
		if(applynum > 10000){
			var confirms = confirm("您的保费超出了"+bankName+"收费限额,您可选择'取消'更换其他银行卡，或选择'确认'将此单转为线下收费。");
			if(!confirms){return ;}							
		}					
	}else if(bankName.indexOf("邮政储汇局") > 0 || bankName.indexOf("邮储") > 0 || bankName.indexOf("邮政") > 0){
		if(applynum > 10000){
			myAlert("您的保费超出了"+bankName+"收费限额,此单不能转线下，请您更换其他银行。");
			return;					
		}
	}
//-----------------------------------end-------------------------------------------------
	var sql="update T_APP_BANK set isChecked = (case when isChecked ='true' "+
			" then  'false'  else  case when bankCode = '"+bankCode+"' and cardNum ='"+cardNo+"' "+ 
   			" then 'true'    else 'false'    end  end)  where appliantId ='"+applicantID+"' ";
	var bank_List = {
        "databaseName":"promodel/10005/www/db/t_bank.sqlite",
        "sql": sql
    }; 
	queryTableDataUseSql(bank_List,function(str){  
			 bankScope.$apply(function (){
					var init_josn = {
				        "databaseName":"promodel/10005/www/db/t_bank.sqlite",
				        "sql": "select a.[applyId],a.[appliantName],a.[appliantId],a.[bankCode],a.isChecked, a.[cardNum],a.[createTime],a.[BANK_PROVINCE],a.[BANK_CITY],a.[bankSubType],a.[bankPhoneNum],(select b.BANK_NAME from t_bank b where b.BANK_CODE = a.[bankCode]) as   BANK_NAME  from T_APP_BANK a where a.appliantId ='"+applicantID+"' and isChecked='true'  order by a.createTime desc "
				    }; 
			   		queryTableDataUseSql(init_josn,function(data){
				   			var pctype = document.getElementById("pctype").value;
				   			data = deleteRepeat(data)
				   			if(data){ 
								var domBankDiv = pctype == 'phone'?document.getElementById("bank_info_div_pc"):document.getElementById("bank_info_div");
								var cur_html ='';
								var phone_html ='';
								var isCheckHtml ='';
								for(var i = 0; i<data.length; i++){
									if(data[i].isChecked == 'true'){										
										cur_html +='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" checked="checked" name="bank" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')" value=\''+data[i].bankCode+'\'></input></td><td width="20%">'+ data[i].BANK_NAME + '</td><td  width="10%">' + data[i].appliantName + '</td><td  width="20%">' +  data[i].cardNum+ '</td><td  width="10%">' +  data[i].BANK_PROVINCE+ '</td><td  width="10%">' +  data[i].BANK_CITY+ '</td><td  width="10%">' +  data[i].bankPhoneNum+ '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')"></input></td></tr></table>';
										isCheckHtml+='<span></span>';
									}else{
										cur_html +='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" name="bank" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')" value=\''+data[i].bankCode+'\'></input></td><td width="20%">'+ data[i].BANK_NAME + '</td><td  width="10%">' + data[i].appliantName + '</td><td  width="20%">' +  data[i].cardNum+ '</td><td  width="10%">' +  data[i].BANK_PROVINCE+ '</td><td  width="10%">' +  data[i].BANK_CITY+ '</td><td  width="10%">' +  data[i].bankPhoneNum+ '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')"></input></td></tr></table>';
										isCheckHtml ='';
									}
									phone_html+='<div class="table_list">';
									phone_html+='<p>'+ data[i].BANK_NAME + '</p>';
									phone_html+='<p>'+ data[i].appliantName + '</p>';
									phone_html+='<p>'+ data[i].cardNum+ '</p>';
                                    if(data[i].bankSubType==1){
                                        phone_html+='<p>存折</p>';
                                    }else if(data[i].bankSubType==2){
                                        phone_html+='<p>银行卡</p>';
                                    }
									phone_html+='<p>'+ data[i].BANK_PROVINCE+ '</p>';
									phone_html+='<p>'+ data[i].BANK_CITY+ '</p>';
									phone_html+='<p>'+ data[i].bankPhoneNum+ '</p>';
									
									if(data[i].isChecked != 'true'){
										phone_html+='<button class="button button-stable" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\',\''+applynum+'\')">选中</button>';
									} 
									phone_html+='<button  class="button button-stable" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\',\''+applynum+'\')">删除</button>';
									phone_html+=''+isCheckHtml+'</div>';  
								}
								domBankDiv.innerHTML = pctype == 'phone'?phone_html:phone_html; 
							}
							bankScope.listBank = data;
							resetClearBankForm(bankScope); //清空表单
							//myAlert("银行卡选中成功");
			   		}); 
			 });
	}); 
	resetClearBankForm(bankScope);
}


/***
 * 删除银行卡的信息
 */
function deleteBankByCode(applicantID,banCode,cardNum,applynum,$scope){
		var applicantID = document.getElementById('applicantID').value;
		//alert('applicantID=='+applicantID)
		var sql = "delete  from T_APP_BANK where appliantId ='"+applicantID+"' and bankCode ='"+banCode+"' and cardNum = '"+cardNum+"'";
	    var json = {
	        "databaseName":"promodel/10005/www/db/t_bank.sqlite",
	        "sql": sql
	    };
	    queryTableDataUseSql(json,function(str){ 
		  	 bankScope.$apply(function (){
					var bank_List = {
				        "databaseName":"promodel/10005/www/db/t_bank.sqlite",
				        "sql": "select a.[applyId],a.[appliantName],a.[appliantId],a.[bankCode],a.isChecked, a.[cardNum],a.[createTime],a.[BANK_PROVINCE],a.[BANK_CITY],a.[bankSubType],a.[bankPhoneNum],(select b.BANK_NAME from t_bank b where b.BANK_CODE = a.[bankCode]) as   BANK_NAME  from T_APP_BANK a where a.appliantId ='"+applicantID+"' and a.isChecked='true'  order by a.createTime desc "
				    }; 
			   		queryTableDataUseSql(bank_List,function(data){
			   			    var pctype = document.getElementById("pctype").value;
				   			data = deleteRepeat(data)
				   			if(data){
								var domBankDiv = pctype == 'phone'?document.getElementById("bank_info_div_pc"):document.getElementById("bank_info_div");
								var cur_html ='';
								var phone_html ='';
								var isCheckHtml ='';
								for(var i = 0; i<data.length; i++){
									if(data[i].isChecked == 'true'){
										cur_html +='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" checked="checked" name="bank" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')" value=\''+data[i].bankCode+'\'></input></td><td width="20%">'+ data[i].BANK_NAME + '</td><td  width="10%">' + data[i].appliantName + '</td><td  width="20%">' +  data[i].cardNum+ '</td><td  width="10%">' +  data[i].BANK_PROVINCE+ '</td><td  width="10%">' +  data[i].BANK_CITY+ '</td><td  width="10%">' +  data[i].bankPhoneNum+ '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')"></input></td></tr></table>';
										isCheckHtml+='<span></span>';
									}else{
										cur_html +='<table width="100%" height="30px"><tr><td width="5%"><input type="radio" style="width:20px;height:20px" name="bank" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\')" value=\''+data[i].bankCode+'\'></input></td><td width="20%">'+ data[i].BANK_NAME + '</td><td  width="10%">' + data[i].appliantName + '</td><td  width="20%">' +  data[i].cardNum+ '</td><td  width="10%">' +  data[i].BANK_PROVINCE+ '</td><td  width="10%">' +  data[i].BANK_CITY+ '</td><td  width="10%">' +  data[i].bankPhoneNum+ '</td><td width="10%"><input class="push-button" type="button" value="删除" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\')"></input></td></tr></table>';
										isCheckHtml ='';
									}  
									phone_html+='<div class="table_list">';
									phone_html+='<p>'+ data[i].BANK_NAME + '</p>';
									phone_html+='<p>'+ data[i].appliantName + '</p>';
									phone_html+='<p>'+ data[i].cardNum+ '</p>';
                                    if(data[i].bankSubType==1){
                                        phone_html+='<p>存折</p>';
                                    }else if(data[i].bankSubType==2){
                                        phone_html+='<p>银行卡</p>';
                                    }
									phone_html+='<p>'+ data[i].BANK_PROVINCE+ '</p>';
									phone_html+='<p>'+ data[i].BANK_CITY+ '</p>';
									phone_html+='<p>'+ data[i].bankPhoneNum+ '</p>';
									
									if(data[i].isChecked != 'true'){
										phone_html+='<button class="button button-stable" onclick="chooseBank(\''+data[i].bankCode+'\',\''+data[i].BANK_NAME+'\',\''+data[i].cardNum+'\',\''+applynum+'\')">选中</button>';
									} 
									phone_html+='<button  class="button button-stable" onclick="deleteBankByCode(\''+data[i].applyId+'\',\''+data[i].bankCode+'\',\''+data[i].cardNum+'\',\''+applynum+'\')">删除</button>';
									phone_html+=''+isCheckHtml+'</div>';  
								}
								domBankDiv.innerHTML = pctype == 'phone'?phone_html:phone_html; 
							}
							
							bankScope.listBank = data;
							resetClearBankForm(bankScope); //清空表单
							myAlert("数据删除成功");
			   		}); 
			 });
	  });
}

var syrUserBeanList = []; //受益人LIST
var syrUserType = 0; //受益人类型 

function iterRatorSyrUserData(benefitMan){
	var cstm = benefitMan; 
	var addCstm = {
		"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
		"tableName": "T_CUSTOMER",
		"conditions": [{"CUSTOMER_ID": cstm["CUSTOMER_ID"],"APPLY_ID":cstm["APPLY_ID"],"BENEFIT_TYPE":cstm["BENEFIT_TYPE"]}],
		"data": [cstm]
	};
	updateORInsertTableDataByConditions(addCstm, function (str) {
		if(str==1){
			for_index++;
			iterRatorSyrUserData(for_index)	 
		}else{
			myAlert("数据插入失败！")
			console.log('数据插入失败！')
		}
	}, function () {
		console.log("客户信息保存失败！");
	});
}

/**
 * 初始化关系列表
 * @param {} relationList
 * @param {} id
 */
function initRelationCommon(relationList,id){
	if(relationList != null && relationList.length > 0){
		var option_html ='';
		for(var i = 0; i<relationList.length; i++){
			option_html+='<option value="'+relationList[i]["CODE"]+'">'+relationList[i]["CODE_NAME"]+'</option>';
		}
		document.getElementById(id).innerHTML = option_html;
	}
}


/**
 * 循环控制按钮
 * @param {}  
 */ 
 
var indexHour = 180;
function whileThridHoursBTN(){
	 if(indexHour <= 0){  
	 		indexHour = 180;
	 		document.getElementById("hourRecord_input").disabled = false;
	 		document.getElementById("hourRecord_input").value ="倒计时三分钟";
	 		document.getElementById("getSms_input").disabled = false;
	 		document.getElementById("getSms_input").value ="获取验证码";  
	 }else{  
	 		document.getElementById("getSms_input").disabled = true;
	 		document.getElementById("getSms_input").value ="已发送";
	 		document.getElementById("hourRecord_input").value =indexHour;
	 		document.getElementById("hourRecord_input").disabled = true; 
	 		indexHour-- ;
			setTimeout("whileThridHoursBTN()",1000);
	 } 
}

var SignHour = 120;
var timer;
function whileThridHoursSign(){
	 if(SignHour <= 0){  
	 		SignHour = 120;	 		
			document.getElementById("sign_info").innerHTML ="获取验证码";	
			document.getElementById("sign_info").disabled = false; 		 
	 }else{  
	 		
	 		document.getElementById("sign_info").innerHTML =SignHour+"秒";	 		
			SignHour-- ;
			document.getElementById("sign_info").disabled = true;
			timer=setTimeout("whileThridHoursSign()",1000);
	 } 
}
function whileThridHoursProblem(){
	if(indexHour <= 0){  
	 		indexHour = 180;
	 		document.getElementById("hourRecord_input").disabled = false;
	 		document.getElementById("hourRecord_input").value ="倒计时三分钟";
	 		document.getElementById("getSms_input").disabled = false;
	 		document.getElementById("getSms_input").value ="获取验证码";  
	}else{  
	 		document.getElementById("getSms_input").disabled = true;
	 		document.getElementById("getSms_input").value ="已发送";
	 		document.getElementById("hourRecord_input").value =indexHour;
	 		document.getElementById("hourRecord_input").disabled = true; 
	 		indexHour-- ;
			setTimeout("whileThridHoursProblem()",1000);
	 } 
}
function whileThridHoursHuizhi(){
	if(indexHour <= 0){  
	 		indexHour = 180;
	 		document.getElementById("hourRecord_input").disabled = false;
	 		document.getElementById("hourRecord_input").value ="倒计时三分钟";
	 		document.getElementById("getSms_input").disabled = false;
	 		document.getElementById("getSms_input").value ="获取验证码";  
	}else{  
	 		document.getElementById("getSms_input").disabled = true;
	 		document.getElementById("getSms_input").value ="已发送";
	 		document.getElementById("hourRecord_input").value =indexHour;
	 		document.getElementById("hourRecord_input").disabled = true; 
	 		indexHour-- ;
			setTimeout("whileThridHoursHuizhi()",1000);
	 } 
}

/**
 * 签名文件上传txt文件
 * @param {}  
 */ 
function uploadSignTxtFolder(){
	 var IMG_UPLOAD_URL = 'http://10.0.22.112:7003/app/agent/uploadphoto';
    //var IMG_UPLOAD_URL = 'http://esales2.minshenglife.com:8001/app/agent/uploadphoto';
	getEncFile(function(str){
		if(str){
			var folderJson = eval("("+str+")");
			var applyEncodePath = folderJson["applyEncodePath"];
			var insurnoticeEncodePath = folderJson["insurnoticeEncodePath"];
			uploadImage(IMG_UPLOAD_URL, applyEncodePath, '8611018517', '111111',
				function (webImgUrl) {
						if(webImgUrl){//再次上传另一个签名文件
							uploadImage(IMG_UPLOAD_URL, insurnoticeEncodePath, '8611018517', '111111',
								function (data) {});
						}
				}
			);
		}
	},function(){
		myAlert("失败");
	});
}

/**************************************************手机版页面Logo控制*****************************************************/
/**
 * 设置LogoCss文字样式
 * @param {}  
 */ 
function setPageIndexLogoCss(currentID){

		//将所有标题设置隐藏
		hiddenAllLogo();

		document.getElementById(currentID).style.display ="block"; 
}

 

function hiddenAllLogo(){  
	document.getElementById("index_one").style.display ="none";
	document.getElementById("index_two").style.display ="none";
	document.getElementById("index_three").style.display ="none";
	document.getElementById("index_four").style.display ="none";
	document.getElementById("index_five").style.display ="none";

}

/**
 * 同意后进行下一步操作，验证表单是否选中同意,传入List<Map>
 * param {List<Map>}
 */
function agreeNextValidateFn(listMap,$ionicPopup){
	var isPass = true;
	if(listMap){
		for(var i = 0; i<listMap.length; i++){
			var cid = listMap[i]["id"];
			var msg = listMap[i]["msg"];
			var domObj = document.getElementById(cid);
			if(domObj){
					if(domObj.value == 'false'){
						isPass = false;
						var ionicAlert = $ionicPopup.alert({
				            template: '<div class="pop_up_box"><span class="loser"></span>'+msg+'</div>'
				        });
						setTimeout(function (){
				                if(null != ionicAlert){
				                    ionicAlert.close(); 
				                } 
			            },2000);
						break;
					}
			}else{
				isPass = false;
				var ionicAlert = $ionicPopup.alert({
		            template: '<div class="pop_up_box"><span class="loser"></span>'+msg+'</div>'
		        });
				setTimeout(function (){
		                if(null != ionicAlert){
		                    ionicAlert.close(); 
		                } 
	            },2000);
				break;
			}
		} 
	}else{
		isPass = false;
		CommonFn.alertPopupFun($ionicPopup,'loading',"传入参数为空，确认是否传入参数！",3000); 
	}
	return isPass;
}


 
function pageSignCtrlTimeFn(){ 
	if(pageSignCtrlTime <= 0){  
//			alert("pageSignCtrlTime:"+pageSignCtrlTime);
	 		pageSignCtrlTime = 900;  
	 		//进行页面的控制
	 		if(bankScope && bankScope.step8){
	 			bankScope.$apply(function (){
				 	bankScope.step8 = {activeTab : 1};
			    }); 
			    document.getElementById("mobile").value ="";
	 			document.getElementById("smsCode").value ="";
	 		}
	 		
	 		isPassSign = false;
	 }else{    
	 		pageSignCtrlTime-- ;
			setTimeout("pageSignCtrlTimeFn()",1000);
	 } 
}

/**
 * 验证并保存影像录入中证件照片
 * @param $scope
 * @return
 */
function validateCardImage($scope){
	//证件照片验证信息
	var applicantCardMessage = {
			"idCardFront":"符合反洗钱法规定，请拍摄投保人身份证正面影像！",
			"idCardReverse":"符合反洗钱法规定，请拍摄投保人身份证反面影像！",
			"papersFront":"符合反洗钱法规定，请拍摄投保人有效证件影像！",
			"residenceBookletFront":"投保人提供的身份证件为“户口簿”，需上传其户口簿中“常住人口登记卡页”影像。",
			"suzhouCustomerImage":"按照苏州保监局要求，请拍摄与投保人合影照"
		};
	var insurantCardMessage = {
			"idCardFront":"符合反洗钱法规定，请拍摄被保人身份证正面影像！",
			"idCardReverse":"符合反洗钱法规定，请拍摄被保人身份证反面影像！",
			"papersFront":"符合反洗钱法规定，请拍摄被保人有效证件影像！",
			"residenceBookletFront":"被保人提供的身份证件为“户口簿”，需上传其户口簿中“常住人口登记卡页”影像。",
			"birthCertificateFront":"因您提供的被保险人身份证件为“出生医学证明”，根据我公司规定，需同时上传其“出生医学证明”影像，便于我们进行信息核对。"
		};
	var benefitCardMessage = {
			"idCardFront":"符合反洗钱法规定，受益人[benefitName]证件为身份证，请拍摄受益人身份正面影像！",
			"idCardReverse":"符合反洗钱法规定，受益人[benefitName]证件为身份证，请拍摄受益人身份证反面影像！",
			"papersFront":"符合反洗钱法规定，请拍摄受益人[benefitName]有效证件影像！"
		};
	
	//当前选项卡（切换之前的选项卡）序号
	var activeTab = $scope.step3.activeTab;
	//获取总保费
	var totalPremium = $scope.totalPremium;
	var alltotalPremium = $scope.alltotalPremium;
	//投保人证件照验证
	if(activeTab == 1){
		//投保人证件类型及正反面影像
		var idType = $scope.applicantData.IDNAME;
		var applicantCardFront = $scope.applicantInfo.CARD_FRONT;
		var applicantCardReverse = $scope.applicantInfo.CARD_REVERSE;
		var CUSTOM_FRONT = $scope.applicantInfo.CUSTOM_FRONT;
		var CUSTOM_REVERSE = $scope.applicantInfo.CUSTOM_REVERSE;
		//银行转账，总保费大于等于200000时，投保人被保人需要拍摄证件照（如果是身份证需要拍摄正反两面）
		//原本使用totalPremium，现修改为累积总保费alltotalPremium --add by wangzj 20160813
		if(alltotalPremium >= bankTransferAmount){
			if(idType == "0"){	//身份证
				if(!applicantCardFront){
					myAlert(applicantCardMessage["idCardFront"]);
					$scope.step3.activeTab = activeTab;
					return false;
				}
				if(!applicantCardReverse){
					myAlert(applicantCardMessage["idCardReverse"]);
					$scope.step3.activeTab = activeTab;
					return false;
				}
			}else{	//其它证件
				if((!applicantCardFront) && (!applicantCardReverse)){
					myAlert(applicantCardMessage["papersFront"]);
					$scope.step3.activeTab = activeTab;
					return false;
				}
			}
		}
		//投保人证件类型为‘居民户口簿’时，需拍摄照片
		if(idType == "4"){
			if((!applicantCardFront) && (!applicantCardReverse)){
				myAlert(applicantCardMessage["residenceBookletFront"]);
				$scope.step3.activeTab = activeTab;
				return false;
			}
		}
		//苏州保监要求要有保险代理人与投保人持相关资料影像件 2017/12/12 dcr
		if(organCode.substr(0,6) == '863205'){
			if((!CUSTOM_FRONT) && (!CUSTOM_REVERSE)){
				myAlert(applicantCardMessage["suzhouCustomerImage"]);
				$scope.step3.activeTab = activeTab;
				return false;
			}		
		}
	}
	//被保人证件照验证
	else if(activeTab == 2){
		//被保人证件类型及正反面影像
		var idType = $scope.recognizeeData.IDNAME;
		var insurantCardFront = $scope.insurantInfo.CARD_FRONT;
		var insurantCardReverse = $scope.insurantInfo.CARD_REVERSE;
		
		//银行转账，总保费大于等于200000时，投保人被保人需要拍摄证件照（如果是身份证需要拍摄正反两面）
		if(alltotalPremium >= bankTransferAmount){
			if(idType == "0"){	//身份证
				if(!insurantCardFront){
					myAlert(insurantCardMessage["idCardFront"]);
					$scope.step3.activeTab = activeTab;
					return false;
				}
				if(!insurantCardReverse){
					myAlert(insurantCardMessage["idCardReverse"]);
					$scope.step3.activeTab = activeTab;
					return false;
				}
			}else{	//其它证件
				if((!insurantCardFront) && (!insurantCardReverse)){
					myAlert(insurantCardMessage["papersFront"]);
					$scope.step3.activeTab = activeTab;
					return false;
				}
			}
		}
		//被保人证件类型为‘居民户口簿’时，需拍摄照片
		if(idType == "4"){	//户口簿
			if((!insurantCardFront) && (!insurantCardReverse)){
				myAlert(insurantCardMessage["residenceBookletFront"]);
				$scope.step3.activeTab = activeTab;
				return false;
			}
		}
		//被保人证件类型为‘出生证’时，需同时上传其“出生医学证明”影像，便于我们进行信息核对
		if(idType == "7"){	//出生证
			if((!insurantCardFront) && (!insurantCardReverse)){
				myAlert(insurantCardMessage["birthCertificateFront"]);
				$scope.step3.activeTab = activeTab;
				return false;
			}
		}
	}
	//受益人证件照验证
	else if(activeTab == 3){
		
		//银行转账，总保费大于等于200000时，受益人需要拍摄证件照（如果是身份证需要拍摄正反两面）
		if(alltotalPremium >= bankTransferAmount){
			//受益人列表
			var benefitList = $scope.BfList;
			for(var i = 0 ; i < benefitList.length ; i++){
				var benefitInfo = benefitList[i];
				
				//受益人类型
				var benefitType = benefitInfo.BENEFIT_TYPE;
				//判断是否是直系亲属
				var immediateFamilyFlag = isImmediateFamily(benefitInfo.RELATION);
				//受益人证件类型及正反面影像
				var idType = benefitInfo.IDNAME;
				var benefitCardFront = benefitInfo.CARD_FRONT;
				var benefitCardReverse = benefitInfo.CARD_REVERSE;
				
				//身故受益人与被保人关系不为直系亲属（父亲、母亲、丈夫、妻子、儿子、女儿）；需要拍摄证件照（如果是身份证需要拍摄正反两面）				
				if(idType == "0"){	//身份证
					if(!benefitCardFront){
						myAlert(benefitCardMessage["idCardFront"].replace("benefitName",benefitInfo.NAME));
						$scope.step3.activeTab = activeTab;
						return false;
					}
					if(!benefitCardReverse){
						myAlert(benefitCardMessage["idCardReverse"].replace("benefitName",benefitInfo.NAME));
						$scope.step3.activeTab = activeTab;
						return false;
					}
				}else{	//其它证件
					if((!benefitCardFront) && (!benefitCardReverse)){
						myAlert(benefitCardMessage["papersFront"].replace("benefitName",benefitInfo.NAME));
						$scope.step3.activeTab = activeTab;
						return false;
					}
				}
			}
		}
	}
	
	//保存当前选项卡中的证件照片
//	$scope.saveCardImage();
	
	/* ‘下一步’按钮控制影像录入中的选项卡切换 */
	//当前选项卡（切换之前的选项卡）序号
	var activeTab = $scope.step3.activeTab;
	var nextTab = activeTab + 1;
	if(nextTab <= 3){
		$scope.step3.activeTab = nextTab;
		return false;
	}
	$scope.step3.activeTab = 1;
	return true;
}
/**
 * 影像录入中的‘上一步’按钮控制tab切换
 * @param $scope
 * @return
 */
function tabChangeOfCardImage($scope){
	//当前选项卡（切换之前的选项卡）序号
	var activeTab = $scope.step3.activeTab;
	var prevTab = activeTab - 1;
	if(prevTab >= 1){
		$scope.step3.activeTab = prevTab;
		return false;
	}
	return true;
}

/**
 * 显示加载提示框
 * @return
 */
function loadingWait(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivText = document.getElementById("mengceng_div_text");
	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivText.style.top = "45%";
    	mengcengDivText.style.left = "30%";
    	mengcengDivText.style.width = "40%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivText.style.display = "block";
}
function childrenloadingWait(){
	var mengcengDiv = document.getElementById("children_div");
	var mengcengDivText = document.getElementById("children_div_text");
	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivText.style.top = "45%";
    	mengcengDivText.style.left = "30%";
    	mengcengDivText.style.width = "40%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivText.style.display = "block";
}

/**
 * 隐藏加载提示框
 * @return
 */
function closeLoadingWait(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivText = document.getElementById("mengceng_div_text");
	mengcengDiv.style.display = "none";
	mengcengDivText.style.display = "none";
}
function childrencloseLoadingWait(){
	var mengcengDiv = document.getElementById("children_div");
	var mengcengDivText = document.getElementById("children_div_text");
	mengcengDiv.style.display = "none";
	mengcengDivText.style.display = "none";
}

/**
 * 显示alert提示框 受益人详情子页面
 * @return
 */
function childrenMyAlert(message){
	var mengcengDiv = document.getElementById("children_div");
	var mengcengDivAlert = document.getElementById("children_div_alert");
	var messageContainer = document.getElementById("children_messageContainer");
	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivAlert.style.top = "40%";
    	mengcengDivAlert.style.left = "10%";
    	mengcengDivAlert.style.width = "80%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivAlert.style.display = "block";
	messageContainer.innerHTML = message;
}
/**
 * 关闭alert提示框   受益人详情子页面
 * @return
 */
function children_closeMyAlert(){
	var mengcengDiv = document.getElementById("children_div");
	var mengcengDivAlert = document.getElementById("children_div_alert");
	var messageContainer = document.getElementById("children_messageContainer");
	mengcengDiv.style.display = "none";
	mengcengDivAlert.style.display = "none";
	messageContainer.innerHTML = "";
}


/**
 * 显示alert提示框
 * @return
 */
function myAlert(message){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivAlert = document.getElementById("mengceng_div_alert");
	var messageContainer = document.getElementById("messageContainer");
	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivAlert.style.top = "40%";
    	mengcengDivAlert.style.left = "10%";
    	mengcengDivAlert.style.width = "80%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivAlert.style.display = "block";
	messageContainer.innerHTML = message;
}
/**
 * 关闭alert提示框
 * @return
 */
function closeMyAlert(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivAlert = document.getElementById("mengceng_div_alert");
	var messageContainer = document.getElementById("messageContainer");
	mengcengDiv.style.display = "none";
	mengcengDivAlert.style.display = "none";
	messageContainer.innerHTML = "";
}
/**
 *  myalert方法提示框  
 * @return
 */ 
function myAlertOkFun(okFun){
	var mengcengDiv = document.getElementById("mengceng_div");
	var shade_Myalert = document.getElementById("shade_Myalert");
	var myAlertOkFun = document.getElementById("myAlertOkFun");
	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	shade_Myalert.style.top = "20%";
    	shade_Myalert.style.left = "10%";
    	shade_Myalert.style.width = "80%";
    }
    mengcengDiv.style.display = "block";
	shade_Myalert.style.display = "block";
	//绑定确定按钮事件
	myAlertOkFun.onclick = okFun;//点击确定后把选择的是否值传给后台	
	
}

/**
 * 关闭myAlert方法提示框
 * @return
 */ 
 function closemyAlertOkFun(name){
	//var mengcengDiv = document.getElementById("mengceng_div");
	var shade_Myalert = document.getElementById("shade_Myalert");
	if(name=="choice_0"){
		var messageRecognizee = document.getElementById("message_0");
		messageRecognizee.innerHTML = "";
		clearName(name);
		clearCheck(name);
	}else if(name=="choice_1"){
		var messageApplicant = document.getElementById("message_1");		
		messageApplicant.innerHTML = "";
		clearName(name);
		clearCheck(name);
	}else if(name == "choice_2"){
		var messageRecognizee = document.getElementById("message_0");
		messageRecognizee.innerHTML = "";
		var messageApplicant = document.getElementById("message_1");		
		messageApplicant.innerHTML = "";
		clearName('choice_0');
		clearName('choice_1');
		clearCheck('choice_0');
		clearCheck('choice_1');
	}	
	//mengcengDiv.style.display = "none";
	shade_Myalert.style.display = "none";	
}
// 清除input=radio样式
function clearName(name){ 
	var els = document.getElementsByName(name);
	for(var i = 0; i < els.length; i++){
		els[i].parentNode.className = "input_style";
	}
};
// 清除input=radio选中状态
function clearCheck(name){
	var check = document.getElementsByName(name);
	for(var i=0; i< check.length; i++){
		check[i].checked = false;
	}
}
// 获取选中的radio的value值
function radioValue(name){
	var val = document.getElementsByName(name);
	for(vals in val){
		if (val[vals].checked) {
			var yes_no = val[vals].value;
		}
	}
	return yes_no;
}
//  input=radio绑定事件
function bind_radio(id){
	var the_raido=document.getElementById(id);     
	var isCheck = the_raido.checked;
	var name = the_raido.name;
	clearName(name);
	if(isCheck){ //设置选中样式
		the_raido.parentNode.className = "select_input_style";			
	}else{	
		  //未选中清除样式
		the_raido.parentNode.className = "input_style";			
	}  

}
//自主垫交myalert方法
function Pay_myAlertOkFun(title,okFun){
	var mengcengDiv = document.getElementById("mengceng_div");
	var Pay_Myalert = document.getElementById("Pay_Myalert");
	var Pay_messageContainer = document.getElementById("Pay_messageContainer");
	var Pay_myAlertOkBut = document.getElementById("Pay_myAlertOkBut");
	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	Pay_Myalert.style.top = "40%";
    	Pay_Myalert.style.left = "10%";
    	Pay_Myalert.style.width = "80%";
    }
    mengcengDiv.style.display = "block";
	Pay_Myalert.style.display = "block";
	Pay_messageContainer.innerText=title;
	//绑定确定按钮事件
	Pay_myAlertOkBut.onclick = okFun;	
	
}
//关闭自主垫交myalert方法
function Pay_closemyAlertOkFun(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var Pay_Myalert = document.getElementById("Pay_Myalert");
	var Pay_messageContainer = document.getElementById("Pay_messageContainer");

	mengcengDiv.style.display = "none";
	Pay_Myalert.style.display = "none";	
	Pay_messageContainer.innerText="";
}
/**
 * 显示confirm提示框
 * @return
 */
function myConfirm(title,text,okFunc){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm");
	var messageContainer = document.getElementById("messageContainerOfConfirm");
	var confirmOkButton = document.getElementById("confirmOkButton");
	var confirmCancelButton = document.getElementById("confirmCancelButton");

	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivConfirm.style.top = "40%";
    	mengcengDivConfirm.style.left = "10%";
    	mengcengDivConfirm.style.width = "80%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivConfirm.style.display = "block";
	messageContainer.innerHTML = text;

	//绑定按钮事件
	confirmOkButton.onclick = okFunc;
	confirmCancelButton.onclick = cancelMyConfirm;
}
function myConfirm2(title,text,cancelFunc,okFunc){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm2");
	var messageContainer = document.getElementById("messageContainerOfConfirm2");
	var confirmOkButton = document.getElementById("confirmOkButton2");
	var confirmCancelButton = document.getElementById("confirmCancelButton2");

	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivConfirm.style.top = "40%";
    	mengcengDivConfirm.style.left = "10%";
    	mengcengDivConfirm.style.width = "80%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivConfirm.style.display = "block";
	messageContainer.innerHTML = text;

	//绑定按钮事件
	confirmOkButton.onclick = okFunc;
	confirmCancelButton.onclick = cancelFunc;
}
//取消按钮功能的确认窗口
function myConfirm3(title,text,cancelFunc,okFunc){
	var mengcengDiv = document.getElementById("children_div");
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm3");
	var messageContainer = document.getElementById("messageContainerOfConfirm3");
	var confirmOkButton = document.getElementById("confirmOkButton3");
	var confirmCancelButton = document.getElementById("confirmCancelButton3");

	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivConfirm.style.top = "40%";
    	mengcengDivConfirm.style.left = "10%";
    	mengcengDivConfirm.style.width = "80%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivConfirm.style.display = "block";
	messageContainer.innerHTML = text;

	//绑定按钮事件
	confirmOkButton.onclick = okFunc;
	confirmCancelButton.onclick = cancelFunc;
}
/**
 * 关闭confirm提示框
 * @return
 */
function cancelMyConfirm(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm");
	var messageContainer = document.getElementById("messageContainerOfConfirm");

	mengcengDiv.style.display = "none";
	mengcengDivConfirm.style.display = "none";
	messageContainer.innerHTML = "";
}
function cancelMyConfirm2(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm2");
	var messageContainer = document.getElementById("messageContainerOfConfirm2");

	mengcengDiv.style.display = "none";
	mengcengDivConfirm.style.display = "none";
	messageContainer.innerHTML = "";
}
function cancelMyConfirm3(){
	var mengcengDiv = document.getElementById("children_div");
	var mengcengDivConfirm = document.getElementById("mengceng_div_confirm3");
	var messageContainer = document.getElementById("messageContainerOfConfirm3");

	mengcengDiv.style.display = "none";
	mengcengDivConfirm.style.display = "none";
	messageContainer.innerHTML = "";
}
//--------------------------------------begin---------------------------------------------
//带取消按钮功能的确认窗口    wuwei  2016.9.29
function myConfirm_PO(title,text,cancelFunc,okFunc){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivConfirm = document.getElementById("mengceng_PO_confirm_PO");
	var messageContainer = document.getElementById("messageContainerOfConfirm_PO");
	var confirmOkButton = document.getElementById("confirmOkButton_PO");
	var confirmCancelButton = document.getElementById("confirmCancelButton_PO");

	//设备类别('phone':手机版)
    if(DEVICE_TYPE == "phone"){
    	mengcengDivConfirm.style.top = "20%";
    	mengcengDivConfirm.style.left = "10%";
    	mengcengDivConfirm.style.width = "80%";
    }
	mengcengDiv.style.display = "block";
	mengcengDivConfirm.style.display = "block";
	messageContainer.innerHTML = text;

	//绑定按钮事件
	confirmOkButton.onclick = okFunc;
	confirmCancelButton.onclick = cancelFunc;
}
//关闭confirm提示框
function cancelMyConfirm_PO(){
	var mengcengDiv = document.getElementById("mengceng_div");
	var mengcengDivConfirm = document.getElementById("mengceng_PO_confirm_PO");
	var messageContainer = document.getElementById("messageContainerOfConfirm_PO");

	mengcengDiv.style.display = "none";
	mengcengDivConfirm.style.display = "none";
	messageContainer.innerHTML = "";
}
//--------------------------------------------end------------------------------


/**
 * 获取超时毫秒数
 * @param key
 * @return
 */
function getMilliSecondOfTimeout(key){
	var milliSecond = 0;
	var configDom = getNativeXml('xml/config.xml'); 
	if(configDom){
		 //获取当前接口需要延迟的时间
		var item = configDom.getElementById(key); 
		if(item){
			var second = item.getElementsByTagName("second")[0].childNodes[0].nodeValue;
			milliSecond = second * 1000;
		}
	}
	return milliSecond;
}
/**
 * 判断字符串是否为空
 * @param str
 * @return
 */
function isNull(str){
	if(str == null || str == "" || str == "null" || str == "undefined" || str == undefined){
		return true;
	}
	return false;
}

/**
 * 根据关系编码判断该关系是否是直系亲属
 * @param relationCode
 * @return
 */
function isImmediateFamily(relationCode){
	//关系名称
	var relationName = "";
	//直系关系名称列表
	var immediateFamilyNameList = ["父亲","母亲","丈夫","妻子","儿子","女儿"];
	var immediateFamilyNameStr = immediateFamilyNameList.join(",");
	if(relationList){
		for(var k = 0 ; k < relationList.length ; k++){
			if(relationCode == relationList[k].CODE){
				relationName = relationList[k].CODE_NAME;
				break;
			}
		}
	}
	if(relationName && immediateFamilyNameStr.indexOf(relationName) >= 0){
		return true;
	}else{
		return false;
	}
}
/**
 * 初始化关系列表
 * @return
 */
function initRelationList(){
	var relationKey = {
		"databaseName": "promodel/10005/www/db/t_code.sqlite",
		"tableName": "T_CODE",
		"conditions": {"CODE_TYPE": "relation"}
	};
	queryTableDataByConditions(relationKey, function (data) {
		if(data){
			relationList = data;
		}
	});
}
/**
 * 生成主键ID
 * @return
 */
function generatePrimaryKey(){
	//主键ID
	var primaryKey = "";
	//客户端类型（ios系统为04、android为05）
	var clientType = brows().iphone ? "04" : "05";
	//当前指定格式的时间
	var formatTime = formatDate(new Date(),"yyMMddhhmmssSSS");
	//三位随机数
	var randomNum = generateRandomNumOfCount(3);
	primaryKey = clientType + agentCode + formatTime + randomNum;
	return primaryKey;
}
/**
 * 格式化日期
 * @param date：日期（如：new Date()）
 * @param format：日期格式（如：'yyyy-MM-dd hh:mm:ss SSS'）
 * @return
 */
function formatDate(date,format){
	var z = {y:date.getFullYear(),M:date.getMonth()+1,d:date.getDate(),h:date.getHours(),m:date.getMinutes(),s:date.getSeconds(),S:date.getMilliseconds()};
	return format.replace(/(y+|M+|d+|h+|m+|s+|S+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
}
/**
 * 生成指定位数的随机整数
 * @param count：随机数的位数
 * @return
 */
function generateRandomNumOfCount(count){
	var randomNum = "";
	for(var i = 0 ; i < count ; i++){
		var tempNum = Math.floor(Math.random()*10);
		randomNum += tempNum;
	}
	return randomNum;
}
/**
 * 将数据库中类型为‘datetime’的字段的字符串类型转换成指定格式的字符串
 * @param datetimeStr，如：2015-5-28T14:00:26.000Z
 * @return
 */
function convertDatetimeToStringByFormat(datetimeStr,format){
	var newDate = new Date(datetimeStr);
	var newFormatDate = formatDate(newDate,format);
	return newFormatDate;
}
/**
 * 将datetime类型的字符串转换成时间戳
 * @param datetimeStr
 * @return
 */
function convertDatetimeToTimestamp(datetimeStr){
	var newDate = new Date(datetimeStr);
	var timestamp = newDate.getTime();
	return timestamp;
}
/**
 * 判断指定险种是否允许抄录申明
 */
function initCopyStatementState(insuranceId,$scope){
	var bycode = {
		"databaseName": 'promodel/10005/www/db/t_code.sqlite',
		"tableName": "T_CODE",
		"conditions": {"CODE_TYPE": 'signture'}
	};
	queryTableDataByConditions(bycode, function (data) {
		if(data && data.length > 0){
			for(var i = 0 ; i < data.length ; i++){
				var tempCode = data[i]["CODE"];
				if(tempCode == insuranceId){
					$scope.copystatementState = true;
					break;
				}
			}
		}
	});
}
/**
	保留2位小数
*/
function numAdd(num1, num2) { 
	var baseNum, baseNum1, baseNum2; 
	try { 
		baseNum1 = num1.toString().split(".")[1].length; 
	} catch (e) { 
		baseNum1 = 0; 
	} 
	try { 
		baseNum2 = num2.toString().split(".")[1].length; 
	} catch (e) { 
		baseNum2 = 0; 
	} 
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2)); 
	return (num1 * baseNum + num2 * baseNum) / baseNum; 
}; 

/* ================================================================ */

/**
 * @功能:返回xml DOM对象
 * @param {xmlUrl:文件url路径}
 * @Author:Li Jie
 * @Date 2015-02-10
*/
function getXmlDom(xmlUrl){ 
   var xmlDoc;  
   if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
        xmlDoc.async = false;
        xmlDoc.load(xmlUrl);
    }
    else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器 
        xmlDoc = document.implementation.createDocument('', '', null);
        xmlDoc.load(xmlUrl);
    }
    else{ //谷歌浏览器
           var xmlhttp = new window.XMLHttpRequest();  
            xmlhttp.open("GET",xmlUrl,false);  
            xmlhttp.send(null);  
            xmlDoc = xmlhttp.responseXML;  
        }  
	return xmlDoc;
}

/**********************在线投保资料出示 2015-4-28 Li Jie start**********************************/
/**@param xml路径 险种ID*/

function checkProductInfoIsHasFn(url,productID){
	    var hasFlag = false; 
		var productDom = getXmlDom(url);  
		if(productDom){ //获取xml对象
				var insursList = productDom.getElementsByTagName("insurs");
				if(insursList && insursList.length > 0){
						var insursEl = insursList[0];
						var insurList = insursEl.getElementsByTagName("insur");
						if(insurList && insurList.length > 0){
							for(var i = 0; i<insurList.length; i++){
								var id = insurList[i].getAttribute("id");
								var hasProductSpec = insurList[i].getAttribute("hasProductSpec");
								if(id == productID){
										if(hasProductSpec != 'false'){
												hasFlag = true;
										}
								}
							}
						}
				}
		} 
		return hasFlag;
}
/*
银行卡去重
 */
function deleteRepeat(arr) {
    for(var i=0;i<arr.length-1;i++){
        var old=arr[i]
        for(var j=i+1;j<arr.length;j++){
            if(old.cardNum==arr[j].cardNum){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
};
//银行编码去重
function deleteRepeatBC(arr) {
    for(var i=0;i<arr.length-1;i++){
        var old=arr[i]
        for(var j=i+1;j<arr.length;j++){
            if(old.BANK_CODE==arr[j].BANK_CODE){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
};

/**
	 * 校验身份证最后一位
	 * @return
	 */
	function IdentityCodeValid(id){			  
		/*1、从第一位到第十七位的系数分别为：
		   7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2 
		    将这17位数字和系数相乘的结果相加。
		*/
		var arr = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
		var sum = 0;
		for(var i=0; i<arr.length; i++){
			sum += parseInt(id.charAt(i)) * arr[i];
		}
		//2、用加出来和除以11，看余数，
		var c = sum%11;
		//3、分别对应的最后一位身份证的号码为：1－0－X－9－8－7－6－5－4－3－2
		var ch = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		var code = ch[c];
		var last = id.charAt(17);
		last = last=='x' ? 'X': last;
		return last==code;
	};
/**********************在线投保资料出示 2015-4-28 Li Jie end**********************************/



function loadQuestionData(questionObj,type,$scope,$state,code,prtNo,manageCom,appntTel){
		var prtSeq=questionObj.prtSeq;
		console.log(questionObj);		
		if(type=='1'){
			var key = {
					"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
					"tableName": "T_QUESTION_PIECES",
					"conditions": {"PRT_SEQ": prtSeq}//合同号ID
				};
			queryTableDataByConditions(key, function (data) {
				if(data && data.length > 0){
					var jsonData=eval("("+data[0].NOTICE_DETAIL+")");
					$scope.questionList=jsonData;
					if($scope.questionList.changepolrow[0].changepolcol1!==" "){
						$scope.hasPlan=true;
					}
					$scope.goQuestionWrite=function(){
						var prtSeq=jsonData.prtseq;
						var lcquestionnaire=JSON.stringify(jsonData.lcquestionnaire);
						window.localStorage.setItem("prtSeq"+prtSeq,lcquestionnaire);;
						$state.go('question_menu.question_main',{'prtSeq':prtSeq});
					}				
				}else{
					
				}
			});
		}else if(type=='2'){
			var omap = {};
			omap["PRT_SEQ"] =prtSeq;
			//omap["ANSWER"] = questionObj.answer;
			//omap["QUESTION_PIECE_DETAIL"] = questionObj.questionPiectDetail;
			omap["NOTICE_DETAIL"] = questionObj.noticeDetail;							
			//将问题件的数据进行保存
			var updateJson = {
				"databaseName": "promodel/10005/www/db/insurance_online.sqlite",
				"tableName": "T_QUESTION_PIECES",
				"conditions": [{"PRT_SEQ":prtSeq}],
				"data": [omap]
			}; 
			//alert('updateJson=='+JSON.stringify(updateJson));
			updateORInsertTableDataByConditions(updateJson, function (str) { 
				if(str == 1){
					console.log('问题件保存成功！')
					// alert('问题件保存成功！');
					var pctype = document.getElementById("pctype").value;
					if(pctype == '' || pctype == 'pad'){
						$state.go('menu.question.underwirting',{'prtSeq':questionObj.prtSeq,'appntTel':appntTel,'code':code,'prtNo':prtNo,'manageCom':manageCom});						
					}else{//手机版的此后页面全部横屏
						$state.go('underwirting',{'prtSeq':questionObj.prtSeq,'appntTel':appntTel,'code':code,'prtNo':prtNo,'manageCom':manageCom});
					}
					
				}
			}, function () {
				console.log('问题件保存失败！');
				//alert('问题件保存失败！');
			});
		}		
}

//得到保融所需要的时间
		function getBaoRongTime(){
			var myDate = new Date();
			var temp = myDate.getFullYear()+"";
			if(((myDate.getMonth()+1)+"").length == 2){
				temp+=(myDate.getMonth()+1);
			}else{
				temp+="0"+(myDate.getMonth()+1);
			}

			if((myDate.getDate()+"").length == 2){
				temp+=myDate.getDate();
			}else{
				temp+="0"+myDate.getDate();
			}

			if((myDate.getHours()+"").length == 2){
				temp+=myDate.getHours();
			}else{
				temp+="0"+myDate.getHours();
			}
			
			if((myDate.getMinutes()+"").length == 2){
				temp+=myDate.getMinutes();
			}else{
				temp+="0"+myDate.getMinutes();
			}

			if((myDate.getSeconds()+"").length == 2){
				temp+=myDate.getSeconds();
			}else{
				temp+="0"+myDate.getSeconds();
			}

			var mill = myDate.getMilliseconds();

			if((mill+"").length == 3){
				temp+=mill;
			}else if((mill+"").length == 2){
				temp+="0"+mill;
			}else{
				temp+="00"+mill;
			}
			return temp;
		}
	//从核心证件类型 转到 保融所需要的证件类型
	function getCartType(name){
		if(name == "0"){
			return "0";
		}else if(name == "2"){
			return "3";
		}else if(name == "4"){
			return "1";
		}else if(name == "A"){
			return "4";
		}else if(name == 'B'){
			return "5";
		}else if(name == 'D'){
			return "9";
		}else if(name == 'E'){
			return "6";
		}else if(name == 'H'){
			return "2";
		}else if(name == 'I'){
			return "8";
		}else{
			return "99";
		}
	}
function getNowDate(){
	 // 给input  date设置默认值
	var now = new Date();
	var years = now.getFullYear();
	var month = add_zero(now.getMonth()+1);
	var days = add_zero(now.getDate());
	var today = (years+60)+"-"+(month)+"-"+(days) ;
	return today;
}