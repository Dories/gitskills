/*
 * 
 */
//建议书转投保传的json
var subAction_prosalJson = new Object();
//保单提交的参数json
var parameterJson = {};
var cardNums = "";
function apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf,benefit_i,benefit_length,c_data){
	
	if(flag == "getaplyId"){
		//alert(flag);
		var http_aply_id = opts.formID;
		var http_proposal_id = opts.propsalID;
		flag = "getapply";
		apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id);
	}
	else if(flag=="getapply"){
		//alert(flag);
		var queryApply_SQL = {
			"databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
			"tableName": "T_APPLY",
			"conditions": {"ID": applyId}//保单ID
		};
		queryTableDataByConditions(queryApply_SQL, function (data) {
//		alert("queryApply_SQL:"+data);
			var obj = data[0];

			//alert('保单数据表：'+JSON.stringify(obj));

			/**
			----------------参考-----------------
			id : obj.ID,					//保单ID	  -必要 -已核对
			proposalId : obj.PROPOSAL_ID,	//建议书ID	  -必要 -已核对
			baseInfo: new Object(),		 	//基础信息	  -必要 -已核对
			applicant: new Object(),		//投保人信息  -必要	-已核对
			insuredList : new Array(),		//被保人信息  -必要 -已核对
			appntImpartList : new Array(),	//投保人告知  -必要 - 亚文已拼接 -已核对
			insuredWrapperVO : new Object(),//投连信息-暂时未用
			imagePath : '',					//音像路径-暂时未用
			previewImpart : '',				//未知-暂时未用
			impartRemarkList : new Array(), //未知-暂时未用
			insurantImpartList : new Array(),//被保人告知 -必要 - 亚文已拼接 -已核对
			agentImpartList : new Array(),	 //业务员告知 -必要 - 亚文已拼接 -已核对
			imageList : new Array(),		//未知-暂时未用
			imageWrapperVO : new Object(),	//未知-暂时未用
			impartWrapperVO : new Object(), //未知-暂时未用
			clientImpartList : new Array()	//客户尽职调查 -必要 -亚文已拼接 -已核对
			----------------参考-----------------
			**/
		
			var pjson = eval("("+obj.PROSAL_JSON+")"); 
			
			subAction_prosalJson = pjson;	//将建议书传入的数据存到当前方法体全局
			
			var pjson_CONTENT = pjson["CONTENT"];

			var customerMap = pjson_CONTENT.customerMap;

			var agentMap = pjson_CONTENT.agentMap;

			//alert('pdfjson:'+JSON.stringify(pjson_CONTENT));
			var endImportant = "<tr><td align='left'><B>*截至2018年四季度末，我司核心偿付能力充足率290%、综合偿付能力充足率334%。公司最近一期风险综合评级结果为B类。</B></td></tr>";
			var proposalPdf = {
				"insureInterestHtmlCode" : pjson_CONTENT.insureInterestHtmlCode,	//保险利益的HTML源码
				"importantNoteHtmlCode" : pjson_CONTENT.importantNoteHtmlCode,	//重要提示的HTML源码
				"backgroundImage" : pjson_CONTENT.backgroundImage,//封面图片名称
				//"backgroundImage" : "201211211432320373.jpg",//封面图片名称
				"isThanksNote" : pjson_CONTENT.isThanksNote,//
				//"isThanksNote" : "1",//
				"isOpeningWords" : pjson_CONTENT.isOpeningWords+"",
				//"isOpeningWords" : "0",
				"openingWords": pjson_CONTENT.openingWords,
				//"openingWords": "开篇语",
				"isEndingWords" : pjson_CONTENT.isEndingWords,
				//"isEndingWords" : "0",
				"endingWords" : pjson_CONTENT.endingWords,
				"proposalName": pjson_CONTENT.recommendName,//建议书名字
				//"endingWords" : "",
				"customerMap" : {
					"NAME" : customerMap.NAME,
					"SEX" : customerMap.SEX,
					"AGE" : customerMap.AGE+"",
					"JOB" : pjson.recognizeeOccupationType,
					"SEXCALL" : customerMap.SEXCALL,
					"DELIVERYNAME" : customerMap.DELIVERYNAME,  //投保人姓名
					"DELIVERYSEXCALL" : customerMap.DELIVERYSEXCALL  //投保人称呼
				},
				"agentMap" : {
					"AGENTCODE" : agentMap.AGENTCODE,
					"NAME" : agentMap.NAME,
					"PHONE" : agentMap.PHONE,
					"ORGANIZATION" : agentMap.ORGANIZATION
				},
				"insureProductsMap" : pjson["CONTENT"].insureProductsMap,//产品信息
				"interestDemonstrationTableMap" : pjson["CONTENT"].interestDemonstrationTableMap,//利益演示
				"isCompanyIntroduction" : pjson_CONTENT.isCompanyIntroduction,
				//"isCompanyIntroduction" : "1"
				"endImportant":endImportant
			};
			//alert("proposalPdf:"+JSON.stringify(proposalPdf));
			if(proposalPdf.isOpeningWords == null || proposalPdf.isOpeningWords == "" || proposalPdf.isOpeningWords == undefined || proposalPdf.isOpeningWords == 'undefined'){
				proposalPdf.isOpeningWords = "0";
			}
			if(proposalPdf.isThanksNote == null || proposalPdf.isThanksNote == "" || proposalPdf.isThanksNote == undefined || proposalPdf.isThanksNote == 'undefined'){
				proposalPdf.isThanksNote = "0";
			}
			if(proposalPdf.isEndingWords == null || proposalPdf.isEndingWords == "" || proposalPdf.isEndingWords == undefined || proposalPdf.isEndingWords == 'undefined'){
				proposalPdf.isEndingWords = "0";
			}
			if(proposalPdf.isCompanyIntroduction == null || proposalPdf.isCompanyIntroduction == "" || proposalPdf.isCompanyIntroduction == undefined || proposalPdf.isCompanyIntroduction == 'undefined'){
				proposalPdf.isCompanyIntroduction = "0";
			}
			if(proposalPdf.openingWords == null || proposalPdf.openingWords == "" || proposalPdf.openingWords == undefined || proposalPdf.openingWords == 'undefined'){
				proposalPdf.openingWords = "";
			}
			if(proposalPdf.endingWords == null || proposalPdf.endingWords == "" || proposalPdf.endingWords == undefined || proposalPdf.endingWords == 'undefined'){
				proposalPdf.endingWords = "";
			}
			

			//alert('拼接后pdfjson:'+JSON.stringify(proposalPdf));
//alert("obj.APPLY_DETAIL:"+obj.APPLY_DETAIL);
			var applyDetail = eval('('+obj.APPLY_DETAIL+')');
			applyDetail.applicant = new Object();	//投保人信息
			applyDetail.insuredList = new Array();	//险种对象
			applyDetail.id = http_aply_id;				//保单ID --接口获取
			applyDetail.proposalId = http_proposal_id;//建议书ID 已从插件获取	
			applyDetail.baseInfo = new Object();	//
			applyDetail.presaleorder = pjson_CONTENT.orderNo;//约保订单号
			applyDetail.cq_questionJson = (pjson.CQ_JSON == undefined || pjson.CQ_JSON == 'undefined') ? null : pjson.CQ_JSON;//重庆问卷Json			
			//applyDetail.cq_questionJson = pjson.CQ_JSON;//重庆问卷Json
//alert("applyDetail:"+JSON.stringify(applyDetail) );		
			var applyInfo = {
				"agentCode": obj.AGENT_CODE,	 //业务员代码		-已核对
				"applicantName": obj.APPLICANT_NAME,//投保人姓名,	-已核对
				"applyDetail": applyDetail,//投保单明细				-已核对
				"insurantName": obj.INSURANT_NAME,//被保人姓名		-已核对
				"sumPrem": 0,//合计保费-从pdfjson获取				-已核对
				"mainProductAmount": 0,//主险保额-从pdfjson获取 -已核对
				"mainProductCode": 0,//主险编码-从pdfjson获取 -已核对
				"mainProductName": 0,//主险名称-从pdfjson获取	-已核对
				"mainProductPrem": 0,//主险保费-从pdfjson获取	-已核对
				"printNo":opts.printNo,//印刷号 -已核对
				//"proposalId":obj.PROPOSAL_ID,//建议书ID -已核对
				"proposalId":http_proposal_id,//建议书ID -已核对
				"state":-1,			 //投保状态 -已核对
				//"submitTime": obj.SUBMIT_TIME,//提交日期(时间戳), -已核对
				"sumAmount":0,//合计保额-从pdfjson获取 -已核对
				"isNew":false,//-已核对
				"id": http_aply_id //-已核对		--接口获取
			};
		
			var insured_1 = {
				"beneficiaryList" : new Array(),	//受益人
				"insuranceList" : new Array(),		//险种列表
				"insurant" : new Object()
			};
			applyDetail.insuredList.push(insured_1);
			
			var insureProductsMap = proposalPdf["insureProductsMap"];
			var tableDataList = insureProductsMap["tableDataList"];
			var insurance_Tile_List = new Array();
			var isreleated = opts.isreleated;
			if(isreleated == "03" || isreleated == "Y"){
				for(var c = 0; c < tableDataList.length; c++){
					if(tableDataList[c][0]== '114403'){
						tableDataList.splice(c,1);
					}
				}
			}else if(isreleated == '05'){
				for(var x = 0; x < tableDataList.length; x++){
					if(tableDataList[x][0]== '114403'){
						tableDataList.splice(0,x);
						tableDataList.splice(1,tableDataList.length-1);
					}
				}
			}
//			alert("tableDataList.length:"+tableDataList.length);
//			alert("proposalPdf:"+JSON.stringify(proposalPdf));
			//alert("insureProductsMap:"+JSON.stringify(insureProductsMap));
			for(var i = 0 ; i < tableDataList.length ; i ++){
				
				isMain = 1;
				var item_list = tableDataList[i];
				
				//add  by yangjialin  建议书pdf投保产品 修改‘交费期间’与‘交费方式’数据颠倒的问题
				var item5 = item_list[5];
				var item6 = item_list[6];
				var tempItem = (item5 == "12") ? "年交" : "一次交清";
				if(item_list[0] == "121716" || item_list[0] == "121717" || item_list[0] == "121718" || item_list[0] == "121719" || item_list[0] == "111808"){
					tempItem = "趸交";
				}
				item_list[5] = item6;
				item_list[6] = tempItem;
				//alert('xx'+JSON.stringify(item_list));
					//遍历[...]获取累加的保险费 
				for(var k = 0 ; k < item_list.length ; k ++){
					if( i == 0 ){
					//主险
						getAmount(k,item_list,applyInfo,'main');
					}else{
					//附加险
						getAmount(k,item_list,applyInfo,'last');
					}
					
				}
				insurance_Tile_List.push(item_list[1]);
				if( i == 0){
					isMain = 0;
				}
			}
			//alert("yjl:insureProductsMap:"+JSON.stringify(insureProductsMap));
			proposalPdf.interestDemonstrationTableMap.insuranceList =  insurance_Tile_List;
//alert("pjson[PROPOSAL_ID]"+pjson["PROPOSAL_ID"]);
			//读取建议书中险种表数据
			var isreleated = opts.isreleated;
			var queryProposal_SQL = {
					"databaseName": 'promodel/10003/www/db/esales.sqlite',
					"tableName": "T_PROPOSAL_PRODUCT",
					"conditions": {"PROPOSAL_ID": pjson["PROPOSAL_ID"]}
				};
			queryTableDataByConditions(queryProposal_SQL, function (data2) {
				var productList = data2;
				if(isreleated == 'Y' || isreleated == '03'){
					for(var c = 0; c < productList.length; c++){
						//如果关联万能，年金的红利领取方式默认为2（现金领取）
						if(productList[c].MAIN_PRODUCT_CODE == '112406' || productList[c].MAIN_PRODUCT_CODE == '112407'){
							productList[c].BONUS_GET_MODE = '2';
						}
						if(productList[c].PRODUCT_CODE == '124405'){
							productList.splice(c,1);
						}	
					}
				}else if(isreleated == '05'){
					for(var x = 0; x < productList.length; x++){
						if(productList[x].PRODUCT_CODE == '124405'){
							productList[x].PRODUCT_CODE = '';
							productList[x].MAIN_PRODUCT_CODE = '114403';
							productList.splice(0,x);
							productList.splice(1,productList.length-1);
						}
					}
				}
				for(var i = 0 ; i < productList.length ; i++){
					var tempProduct = productList[i];
					var productid = tempProduct["PRODUCT_CODE"] == "" ? tempProduct["MAIN_PRODUCT_CODE"] : tempProduct["PRODUCT_CODE"];
//				alert("productid:"+productid);					
					//查询保险期间数据
					/*var insuYearsInfo = getValueByTextOfXml(productid,"insuYears",tempProduct["INSU_YEARS"]);
				//alert("insuYearsInfo:"+insuYearsInfo);
					var insuYearsArray = insuYearsInfo.split("_");
					//查询交费年期
					var payEndYearInfo = getValueByTextOfXml(productid,"payEndYear",tempProduct["PAY_END_YEAR"]);
					var payEndYearArray = payEndYearInfo.split("_");
					//查询交费方式
					var payIntvInfo = getValueByTextOfXml(productid,"payIntv",tempProduct["PAY_INTV"]);
					var payIntvArray = payIntvInfo.split("_");
					*/
					//时间格式修改
					var currentCreateTime = convertDatetimeToStringByFormat(tempProduct["CREATE_TIME"],"yyyy-MM-dd hh:mm:ss");
					var currentUpdateTime = convertDatetimeToStringByFormat(tempProduct["UPDATE_TIME"],"yyyy-MM-dd hh:mm:ss");
//					alert("tempProduct[CREATE_TIME]:"+tempProduct["CREATE_TIME"]);
//					alert("currentCreateTime:"+currentCreateTime);
					//alert("tempProduct[JOB_ADD_FEE]"+tempProduct["JOB_ADD_FEE"]);	
					var jobAddFeeDefault = tempProduct["JOB_ADD_FEE"]==0 ?  "" : tempProduct["JOB_ADD_FEE"];
					var dealTypeJson = {
				            "bonusGetMode": tempProduct["BONUS_GET_MODE"], //红利领取方式，追对于有红利领取的险种（1：累积生息，2：现金领取，3：抵交保险费，7：进入附加万能保险账户） 
				            "getYear": tempProduct["GETYEAR"],
				            "getYearFlag": "A",
				            "getDutyKind": tempProduct["GETDUTYKIND"],
				            "getRate" : tempProduct["GETRATE"], //针对于114402加的年金领取比例
				            "getYearKind" : tempProduct["GETCOMPUTEMODE"],//111901的领取方式,0/1
				            "partReceiveMap": {}
				    } 
					var productDetailJson = {
						    "amount": tempProduct["AMOUNT"],
						    //针对于豁免险的字段,可以用 amount 代替 modify by yangjialin 2015-10-26
							//"amountWithJob": tempProduct["AMOUNT"] + tempProduct["JOB_ADD_FEE"],
						    
						    "dealType": dealTypeJson,
						    "insuYears": tempProduct["INSU_YEARS_VALUE"],
						    "insuYearsFlag": tempProduct["INSU_YEARS_FLAG"],
						    "insurantSeq": tempProduct["INSURANT_SEQ"],
						    "jobAddFee": jobAddFeeDefault,
					        "jobAddFeeWithJob": jobAddFeeDefault,//职业加费（实际）
						    "payEndYear": tempProduct["PAY_END_YEAR_VALUE"],
						    "payEndYearFlag": tempProduct["PAY_END_YEAR_FLAG"],
						    "payIntv": tempProduct["PAY_INTV"],
						    "prem": tempProduct["PREM"],
						    //"premWithJob": tempProduct["PREM"] + tempProduct["JOB_ADD_FEE"],
						    "productCode": productid,
						    "productDetail": "",
						    //"proposalId": tempProduct["PROPOSAL_ID"],//建议书ID
						    "proposalId": http_proposal_id,//建议书ID
						    "seq": tempProduct["SEQ"],//险种顺序（根据页面选择险种顺序从1开始排序）
						    //"createTime": tempProduct["CREATE_TIME"],
						    "createTime": currentCreateTime,
						    "id": tempProduct["ID"],//数据库自动生成的ID
						    //"updateTime": tempProduct["UPDATE_TIME"]
						    "updateTime": currentUpdateTime
						}

						//alert("productDetailJson:"+JSON.stringify(productDetailJson));
					//含有份数的险种需要传递MULTI字段 add by yangjialin
					if(tempProduct["MULTI"]!=0){
						//alert("yjl:into  multi");
						productDetailJson["multi"]=tempProduct["MULTI"];
					}
					var productDetailString = JSON.stringify(productDetailJson);
//					alert("productDetailString:"+productDetailString);
					var insurance = {
							"amount": tempProduct["AMOUNT"],    //保额
							//针对于豁免险的字段,可以用 amount 代替 modify by yangjialin 2015-10-26
							//"amountWithJob": tempProduct["AMOUNT"] + tempProduct["JOB_ADD_FEE"],    //保额
					        "dealType": dealTypeJson,
				            //"insuYears": insuYearsArray[0], //保险期间（5,10,15，88，105根据不同险种而异）
					        "insuYears": tempProduct["INSU_YEARS_VALUE"], //保险期间（5,10,15，88，105根据不同险种而异）
					        "insuYearsFlag": tempProduct["INSU_YEARS_FLAG"],//保险期间单位（Y：年，A：岁）
					        "insurantSeq": tempProduct["INSURANT_SEQ"],//被保人顺序（默认1）
					        "jobAddFee": jobAddFeeDefault,//职业加费
					        "jobAddFeeWithJob": jobAddFeeDefault,//职业加费（实际）
					        "payEndYear": tempProduct["PAY_END_YEAR_VALUE"],//交费年期（5,10,20，1000根据不同险种而异）
					        "payEndYearFlag": tempProduct["PAY_END_YEAR_FLAG"],//交费期间单位（Y：年，A：岁）
					        "payIntv": tempProduct["PAY_INTV"],//交费方式（0：一次交清，12：年交）
					        "prem": tempProduct["PREM"],//保费
						    //"premWithJob": tempProduct["PREM"] + tempProduct["JOB_ADD_FEE"],
					        //"prem": "32320.96",//保费
					        "productCode": productid,//险种code
					        "productDetail": productDetailString,
					        //"proposalId": tempProduct["PROPOSAL_ID"],
					        "proposalId": http_proposal_id,
					        "seq": tempProduct["SEQ"],
					        //"createTime": tempProduct["CREATE_TIME"],
						    "createTime": currentCreateTime,
					        "id": tempProduct["ID"],
					        //"updateTime": tempProduct["UPDATE_TIME"]
						    "updateTime": currentUpdateTime
					};
					//含有份数的险种需要传递MULTI字段 add by yangjialin
					if(tempProduct["MULTI"]!=0){
						insurance["multi"]=tempProduct["MULTI"];
					}
					
				//alert("insurance:"+JSON.stringify(insurance));
					insured_1.insuranceList.push(insurance);
				}
				flag = "baseinfo";
				apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo,proposalPdf);
			});
		});

	}
	else if(flag=="baseinfo"){
//		alert(flag);
		// var applicantID = document.getElementById('applicantID').value;
		var isreleated = opts.isreleated;
		var applicantID = opts.applicantID;
		var queryApply_SQL = {
			"databaseName": 'promodel/10005/www/db/t_bank.sqlite',
			"tableName": "T_APP_BANK",
			"conditions": {"appliantId": applicantID,"isChecked":"true"}
		};
//		alert("applyId:"+applyId);
		queryTableDataByConditions(queryApply_SQL, function (data) {
			//alert(JSON.stringify(data));
			var tempData = data[0];
			tempData = deleteRepeat(tempData)
			//alert("cardNum:"+cardNums)
			var relationflag = '';
			if(isreleated == '03' || isreleated == 'Y'){
				relationflag = 'FY';
			}else if(isreleated == '05'){
				relationflag = 'WY';
			}
			var baseInfo = {
				"accName" : tempData.appliantName,//首期缴费账户名,
				"agentCode" : '',//业务员代码,			已从插件获取-(flag == getagentcode)获取
				"autoPayFlag" : '',//自动垫交标记,
				"bankAccNo" : tempData.cardNum,//首期缴费账号,
				"bankCode" : tempData.bankCode,//首期缴费银行代码,
				"bankProvince":tempData.BANK_PROVINCE,//开户行省
				"bankCity":tempData.BANK_CITY,//开户行市
				"bankSubType":tempData.bankSubType,//邮储账号类型  1：存折  2：银行卡
				"bankPhone" : tempData.bankPhoneNum,
				"blessing" : '',//祝福语,
				"elecSignNameFlag":opts.elecSignNameFlag,//电子签名
				"electronicContFlag" : '',//电子保单标记,（旧标记，不再使用，默认为Y）
				"elecprintflag" : '',//电子保单新标记,
				"electronicContPhone" : '',//电子保单电话,
				"payIntv" : '',//主险缴费方式,			--从bank表中获取
				"payMode" : '',//首期缴费方式,			--从bank表中获取
				"renewAccName" : tempData.appliantName,//续期缴费账户名,		
				"renewBankAccNo" : tempData.cardNum,//续期缴费账号,
				"renewBankCode" : tempData.bankCode,//续期缴费银行代码,
				"renewBankPhone" : tempData.bankPhoneNum, //续期缴费银行预留手机
				"renewPayMode" : '0',//续期缴费方式,
				"renewRemindFlag" : '',//续期缴费提示标记,
				"state" : '-1',//状态,
				"cardno" : cardNums, // 卡单和保单的标识（保单-----空）
				"relationFlag":relationflag,//开门红关联保单 关联标记
				"rel_applyNo":"", //开门红关联保单 关联保单号
				"packageCode":"" //产品节标识
			};
			var tAddress10005_sql = {
				"databaseName":"promodel/10005/www/db/t_address.sqlite",
				"sql" : "select * from t_address where place_code != ''"
			}; 
			///根据省市名称获取对应code码
			// queryTableDataUseSql(tAddress10005_sql, function (data2) {
			// 	if(data2){
			// 		var addressArray = data2;
			// 		var newAddressJson = {};
			// 		for(var k = 0 ; k < addressArray.length ; k++){
			// 			var tempAddress = addressArray[k];
			// 			var placeCode = tempAddress["PLACE_CODE"];
			// 			var placeName = tempAddress["PLACE_NAME"];
			// 			newAddressJson[placeName] = placeCode;
			// 		}
			// 		if(!isNull(tempData.BANK_PROVINCE) && !isNull(tempData.BANK_CITY)){
			// 			baseInfo.bankProvince = newAddressJson[tempData.BANK_PROVINCE]
			// 			baseInfo.bankCity = newAddressJson[tempData.BANK_CITY]
			// 		}
			// 	}
				applyInfo_A.applyDetail.baseInfo = baseInfo;
				flag = "getagentcode";
				apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf);
			//});

		});
	}
	else if(flag=="getagentcode"){
//		alert(flag);
		getUserInfo(function (data) {
			applyInfo_A.applyDetail.baseInfo.agentCode = data["AGENT_CODE"];
			proposalPdf.agentMap.AGENTCODE = data["AGENT_CODE"];
			if(data["AGENTGRADE"]==null || data["AGENTGRADE"] ==undefined){
				data["AGENTGRADE"] = "";
			}
			proposalPdf.agentMap.AGENTGRADE = data["AGENTGRADE"];
			//alert('AgentCODE:'+applyInfo_A.applyDetail.baseInfo.agentCode);
			flag = "bank";
			apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf);
		},function (data) {
			//alert('失败');
		});
	}
	//银行
	else if(flag=="bank"){
		var isreleated = opts.isreleated
//		alert(flag);
//		var queryApply_SQL = {
//			"databaseName": 'promodel/10005/www/db/t_bank.sqlite',
//			"tableName": "T_BANK",
//			"conditions": {"BANK_CODE": applyInfo_A.applyDetail.baseInfo.bankCode }
//		};
//		queryTableDataByConditions(queryApply_SQL, function (data) {
//			var tempData = data[0];
//		alert('bank:'+JSON.stringify(tempData));
		
			//查询apply表中关于投保事项的相关数据
			var queryApplyInfo_SQL = {
				"databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
				"tableName": "T_APPLY",
				"conditions": {"ID": applyId}//保单ID
			};
			queryTableDataByConditions(queryApplyInfo_SQL, function (data2) {
//			alert("bank_apply"+data2);
				var applyInfoJson = data2[0];
				var renewRemindFlag = applyInfoJson.IS_NOTICE; //续期缴费提示标记
				var autoPayFlag = applyInfoJson.IS_PAY_FOR;    //保险费是否自动垫交    
				var electronicContFlag = applyInfoJson.IS_INSURE; //电子保单标记
				var electronicContPhone = applyInfoJson.VALID_PHONE; //电子保单电话
				var elecprintflag = applyInfoJson.IS_INSURE_PAPER;  //电子+纸质标记
				renewRemindFlag = (renewRemindFlag=="true" || renewRemindFlag==true) ? "1" : "0";
				autoPayFlag = (autoPayFlag=="true" || autoPayFlag==true) ? "1" : "0";
				electronicContFlag = (electronicContFlag=="true" || electronicContFlag==true) ? "Y": "Y"; //电子保单标记默认Y
				electronicContPhone = electronicContPhone=="0" ? "" : electronicContPhone;
				elecprintflag =  (elecprintflag=="true" || elecprintflag==true) ? "Y": "N";
				var applyInfoJsonObj = eval("("+applyInfoJson.PROSAL_JSON+")");
				var packageCode = applyInfoJsonObj.packageCode;
				if(isNull(packageCode)){
					packageCode = "";
				}
				// alert('autoPayFlag::'+autoPayFlag)
				applyInfo_A.applyDetail.baseInfo.renewRemindFlag = renewRemindFlag;			//续期缴费提示标记
				applyInfo_A.applyDetail.baseInfo.autoPayFlag = autoPayFlag;				//保险费是否自动垫交标记
				applyInfo_A.applyDetail.baseInfo.electronicContFlag = electronicContFlag;	//电子保单标记
				applyInfo_A.applyDetail.baseInfo.electronicContPhone = electronicContPhone;	//电子保单电话
				applyInfo_A.applyDetail.baseInfo.elecprintflag = elecprintflag;            //电子+纸质标记
				applyInfo_A.applyDetail.baseInfo.rel_applyNo = applyInfoJson.REL_APPLYNO;  //开门红关联保单号
				applyInfo_A.applyDetail.baseInfo.packageCode = packageCode;  			   //产品节标识
				// alert('applyInfo_A.applyDetail.baseInfo.elecprintflag::'+applyInfo_A.applyDetail.baseInfo.elecprintflag)
				var insureProductsMap = proposalPdf["insureProductsMap"];
				if(insureProductsMap){
					var tableDataList = insureProductsMap["tableDataList"];
					if(isreleated == "03" || isreleated == "Y"){
						for(var cc = 0; cc < tableDataList.length; cc++){
							if(tableDataList[cc][0]== '114403'){
								tableDataList.splice(cc,1);
							}
						}
					}else if(isreleated == '05'){
						for(var xx = 0; xx < tableDataList.length; xx++){
							if(tableDataList[xx][0]== '114403'){
								tableDataList.splice(0,xx);
								tableDataList.splice(1,tableDataList.length-1);
							}
						}
					}
					var payIntvValue = "0";
					if(tableDataList && tableDataList.length > 0){
						var mainProductInfo = tableDataList[0];
						payIntvValue = (mainProductInfo[6]=="一次交清") ? "0" : "12";
						if(mainProductInfo[0] == "111808" && mainProductInfo[6]=="趸交"){
							payIntvValue = "0";
						}
					}
					applyInfo_A.applyDetail.baseInfo.payIntv = payIntvValue;//主险缴费方式，年交，一次交清	
					applyInfo_A.applyDetail.baseInfo.payMode = "0";//首期缴费方式,默认银行转账
				}
			//alert("baseInfo:"+JSON.stringify(applyInfo_A.applyDetail.baseInfo));
				flag = "getbenefit";
				apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf);
			});
//		});
	}
	else if(flag=="getbenefit"){
//		alert(flag);
		var queryBenefit_SQL = {
			"databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
			"tableName": "T_CUSTOMER",
			"conditions": {"APPLY_ID": applyId }
		};
		queryTableDataByConditions(queryBenefit_SQL, function (data) {
			if(data.length>0){
				c_i=0;
				flag = "getbenefit_two";
				c_length = data.length;
				
				//查询被保人系投保人关系
				var appntRelationCode = subAction_prosalJson["relation"];
				var insurantSex = subAction_prosalJson["recognizeeSex"];
				var codeType = "relation";
				
				var relationToAppnt = "";
				var key = {
						"databaseName" : "promodel/10005/www/db/t_code.sqlite",
						"sql" : "SELECT RESERVE FROM T_CODE WHERE CODE_TYPE='"+codeType+"' AND CODE='"+appntRelationCode+"'",
				};
				queryTableDataUseSql(key, function (data2) {
					if(data2){
						var relationReserveCode = data2[0].RESERVE;
						if(relationReserveCode.indexOf(":") == -1){
							relationToAppnt = relationReserveCode;
						}else{
							relationToAppnt = relationReserveCode.split(":")[insurantSex];
						}
						
						for(var i = 0 ; i < data.length ; i++){
							var tempData = data[i];
							//alert('客户JSON：'+ JSON.stringify(tempData));
							//投保人
							if(tempData.IS_BENEFIT == 0){
							//alert('set投保人');
							//投保人信息
							var applicant = {//投保人信息
									"postalAddress": '',			//已在10002获取
									"postalCity": '',				//已在10002获取
									"postalCounty": '',				//已在10002获取
									"postalProvince": '',			//已在10002获取
									"postalZipCode": '',			//已在10002获取
									"weiboType": '',				//已在10002获取
									"birthday": '',					//已在10002获取
									"customerId": tempData.CUSTOMER_ID,	//投保人ID
									"email": '',
									"grpName":(tempData.WORK_UNIT=='' || tempData.WORK_UNIT==null)?'无':tempData.WORK_UNIT,	//地址
									"homeAddress": '',				//已在10002获取
									"homeCity": '',					//已在10002获取
									"homeCounty": '',				//已在10002获取
									"homeProvince": '',				//已在10002获取
									"homeZipCode": '',				//已在10002获取
									"id": '',						//已在10002获取
									"idEndDate": '',				//已在10002获取
									"idNo": '',						//已在10002获取
									"idType": '',					//已在10002获取
									"income": '',					//已在10002获取
									"incomeWay": '',				//已在10002获取
									"marriage": '',					//已在10002获取
									"mobile": '',					//已在10002获取投保人移动手机号码
									"msn": '',						//已在10002获取
									"nativePlace": '',				//已在10002获取
									"occupationCode": tempData.OCCUPATION_CODE,//投保人 职业代码
									"otherIncomeWay": '',			//已在10002获取
									"phone": '',					//已在10002获取投保人家庭电话
									"pluralityOccupationCode": '',	//已在10002获取
									"qq": '',						//已在10002获取
									"realName": tempData.NAME,		//投保人 名称
									"relationToMainInsured": tempData.RELATION,	//投保人关系
									"rgtCity": '',					//已在10002获取
									"rgtProvince": '',				//已在10002获取
									"sex":  tempData.SEX,//被保人性别
									"weiboNo": '',					//已在10002获取
									"age": 0 ,						//已在10002获取
									"benefitId":tempData.CUSTOMER_ID	//因需要从1002获取,所以追加该字段
								};

							//alert("applicant_1:"+JSON.stringify(applicant));
								if(tempData.SEX == 0){
									proposalPdf.customerMap.DELIVERYSEXCALL = '先生';
									
								}else{
									proposalPdf.customerMap.DELIVERYSEXCALL = '女士';									
								}
								proposalPdf.customerMap.DELIVERYNAME = tempData.NAME;
								applyInfo_A.applyDetail.applicant = applicant;
							}
							//alert("00000-->>"+JSON.stringify(applyInfo_A.applyDetail.applicant));
							//被保人
							if(tempData.IS_BENEFIT == 1){
								//alert('set被保人');
								var insurant = {
									"relationToAppnt" : relationToAppnt,		//被保人关系
									"weiboType" : '',			//已在10002获取
									"birthday" : '' ,			//被保人生日
									"customerId" : tempData.CUSTOMER_ID,//被保人ID
									"email" : '',				//被保人email
									"grpName" :  (tempData.WORK_UNIT=='' || tempData.WORK_UNIT==null)?'无':tempData.WORK_UNIT, //被保人 公司名称
									"homeAddress" : '',			//被保人地址
									"homeCity" : '',			//被保人市
									"homeCounty" : '',			//被保人国籍
									"homeProvince" : '',		//被保人省			
									"homeZipCode" : '',			//被保人邮编
									"id" : '',					//被保人id
									"idEndDate" : '',			//被保人证件有效止期
									"idNo" : '',				//被保人证件号码
									"idType" : '',				//被保人证件类型
									"income" : '',				//被保人年收入
									"incomeWay" : '',			//被保人收入来源
									"marriage" : '',			//被保人婚姻状态
									"mobile" : '',				//被保人移动电话
									"msn" : '',					//被保人msn
									"nativePlace" : '',			//被保人国籍
									"occupationCode" : tempData.OCCUPATION_CODE,//被保人 职业代码
									"otherIncomeWay" : '',//被保人其他收入来源
									"phone" : '',				//被保人家庭电话
									"pluralityOccupationCode" : '',//被保人
									"qq" : '',//被保人qq
									"realName" : tempData.NAME,//被保人姓名
									"rgtCity" : '',//被保人市
									"rgtProvince" : '',//被保人省
									"sex" : tempData.SEX,//被保人性别
									"weiboNo" : '',//被保人weibo
									"age" : 0,//被保人年龄
									"benefitId":tempData.CUSTOMER_ID//因需要从1002获取,所以追加该字段
								};
//							alert("insurant:"+JSON.stringify(insurant));
								if(tempData.SEX == 0){
									proposalPdf.customerMap.SEXCALL = '先生';
									proposalPdf.customerMap.SEX = '男';
								}else{
									proposalPdf.customerMap.SEXCALL = '女士';
									proposalPdf.customerMap.SEX = '女';
								}
								proposalPdf.customerMap.NAME = tempData.NAME;
						
								applyInfo_A.applyDetail.insuredList[0].insurant = insurant;
							}
							//受益人
							if(tempData.IS_BENEFIT == 2){
								var newBenefitType = (tempData.BENEFIT_TYPE == "0") ? "1" : "2";
								//alert('set受益人');
								var beneficiary = {
									//"address" : '',//通讯地址-需从1002中取值
									"birthday" : tempData.BIRTHDAY,//生日
									"bnfGrade" : tempData.BENEFIT_ORDER,//受益顺序,
									"bnfLot" : tempData.BENEFIT_RATE,//受益份额,
									"bnfType" : newBenefitType ,//受益人类别,
									//"idEndDate" : ''//证件有效止期至-需从1002中取值
									//"idNo" : '',//证件号码-需从1002中取值
									//"idType" : '',//证件类型-需从1002中取值
									"sex" : tempData.SEX,//性别
									"realName" : tempData.NAME,//姓名
									"relationToInsured" : tempData.RELATION,//与被保人关系,
									"benefitId":tempData.CUSTOMER_ID,	//因需要从1002获取,所以追加该字段
									"isAppnt": "false"
								};
								applyInfo_A.applyDetail.insuredList[0].beneficiaryList.push(beneficiary);
							}
						}
						/////////////////////////////////getbenefit-end//////////////////////////////
						apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf,c_i,c_length,data);
					}
				});
				
			}
		});
	}
	else if(flag=="getbenefit_two"){
//alert(flag);
//		alert("c_i:"+c_i+"___"+"c_i:"+c_length);
		if(c_i < c_length){
			//alert(flag);
			var query1002_sql = {
				"databaseName": 'promodel/10002/www/db/esales.sqlite',
				"tableName": "T_CUSTOMER",
				"conditions": {"ID": c_data[c_i].CUSTOMER_ID }
			};
			queryTableDataByConditions(query1002_sql, function (data) {
				var tempData = data[0];
				//证件有效期如果是长期有效的，需设置成生日加100年的形式
				var newIdEndDate = tempData.ID_END_DATE;
				if(newIdEndDate == "长期有效" && tempData.BIRTHDAY){
					//var tempBirthday = new Date(tempData.BIRTHDAY);
					//tempBirthday.setFullYear(tempBirthday.getFullYear() + 100);
					//newIdEndDate = formatDate(tempBirthday,"yyyy-MM-dd");
                    newIdEndDate = "9999-12-31";
				}
                if((typeof newIdEndDate == 'string')&& newIdEndDate!="" && newIdEndDate!=null && newIdEndDate != '长期有效'){
                    var R=new Date();
                    var nowY=R.getFullYear();
                    var oldY=Number(newIdEndDate.substr(0,4));
                    if((oldY-nowY)>=90 || oldY==9999){
                        newIdEndDate = "9999-12-31";
                    }
                }
				
				//根据下标benefit_i拿出list中的beneficiary，然后set值
				var beneficiaryItem = applyInfo_A.applyDetail.insuredList[0].beneficiaryList;			
				for(var i = 0 ; i < beneficiaryItem.length ; i ++ ){
					var beneficiary = beneficiaryItem[i];
					if(beneficiary.benefitId == tempData.ID){
						//beneficiary.idType = tempData.IDNAME;
						beneficiary.idType = tempData.IDTYPE;
						beneficiary.idNo = tempData.IDNO;
						//beneficiary.address = tempData.HOME_ADDRESS;
						beneficiary.address = tempData.HOME_PROVINCE+tempData.HOME_CITY+tempData.HOME_COUNTY+tempData.HOME_ADDRESS;
						beneficiary.idEndDate = newIdEndDate;
						//任晓敏新增4个字段国籍，手机号，职业名称，职业代码,另后台需职业类型
						beneficiary.nativePlace = tempData.NATIVE_PLACE; //国籍
						beneficiary.mobile = tempData.MOBILE; //手机号
						beneficiary.occupationCodeName = tempData.OCCUPATION_CODE_NAME; //职业名称
						beneficiary.occupationCode = tempData.OCCUPATION_CODE; //职业代码
						beneficiary.occupationCodeType = tempData.OCCUPATION_CODE_TYPE; //职业类型

					}
				}
				//投保人
				var applicant = applyInfo_A.applyDetail.applicant;
				
				if(applicant.benefitId == tempData.ID){
					applicant.postalAddress = tempData.COMPANY_ADDRESS;
					applicant.postalCity = tempData.COMPANY_CITY;		
					applicant.postalCounty = tempData.COMPANY_COUNTY;	
					applicant.postalProvince = tempData.COMPANY_PROVINCE;
					applicant.postalZipCode = tempData.COMPANY_ZIP_CODE;
					applicant.weiboType = '';
					applicant.birthday = tempData.BIRTHDAY;	//投保人生日
//					applicant.birthday = "1982-01-01";	//投保人生日
					//applicant.customerId					//已在10005获取
					applicant.email = tempData.EMAIL;		//投保人email
					applicant.grpName = (tempData.WORK_UNIT=='' || tempData.WORK_UNIT==null)?'无':tempData.WORK_UNIT;		//
					applicant.homeAddress = tempData.HOME_ADDRESS;	//投保人地址
					applicant.homeCity = tempData.HOME_CITY;		//投保人城市
					applicant.homeCounty = tempData.HOME_COUNTY;	//投保人区县
					applicant.homeProvince = tempData.HOME_PROVINCE;//投保人省			
					applicant.homeZipCode = tempData.HOME_ZIP_CODE;	//投保人邮编
					applicant.id = tempData.ID;					//投保人id
					applicant.idEndDate = newIdEndDate;	//投保人证件有效止期
					applicant.idNo = tempData.IDNO;				//投保人证件号码
//					applicant.idNo = "130206198201011833";				//投保人证件号码
					applicant.idType = tempData.IDTYPE;				//投保人证件类型
					applicant.income = tempData.INCOME;				//投保人年收入
					applicant.incomeWay = tempData.INCOME_WAY;		//投保人收入来源
					applicant.marriage = tempData.MARRI_STATUS;		//投保人婚姻状态
					applicant.phone = tempData.HOME_PHONE;			//投保人家庭电话
					applicant.msn = tempData.MSN;					//投保人msn
					applicant.nativePlace = tempData.NATIVE_PLACE;	//投保人国籍
					//applicant.occupationCode		//已在10005获取
					applicant.occupationCodeName = tempData.OCCUPATION_CODE_NAME;//投保人职业名称
					applicant.otherIncomeWay = tempData.OTHER_INCOME_WAY;//投保人其他收入来源
					applicant.mobile = tempData.MOBILE;//投保人移动电话
					applicant.pluralityOccupationCode = tempData.PLURALITY_OCCUPATION_CODE;	//兼职职业编码
					applicant.pluralityOccupationName = tempData. PLURALITY_OCCUPATION_CODE_NAME;//兼职职业名称	
					applicant.qq = tempData.QQ;	//投保人qq
					//applicant.realName = ,	//已在10005获取
					//applicant.relationToMainInsured": ''; //未知
					applicant.rgtCity = tempData.RGT_CITY;	//未知
					applicant.rgtProvince = tempData.RGT_PROVINCE;//投保人省
					applicant.rgtProvince = tempData.RGT_PROVINCE;//投保人省
					//applicant.sex = ,			//已在10005获取
					applicant.weiboNo = '';		//微博
					applicant.age = getAgeByBirthday(tempData.BIRTHDAY)+""; 			//年龄
				}
				//被保人
				var insurant = applyInfo_A.applyDetail.insuredList[0].insurant;
//				alert("insurant.benefitId == tempData.ID_"+insurant.benefitId == tempData.ID);
				if(insurant.benefitId == tempData.ID){
//					alert("tempData.ID:"+tempData.ID);
//					alert("tempData.IDNO:"+tempData.IDNO);
//					insurant.relationToAppnt = '';					//系被保人关系
					insurant.weiboType =  '';						//微博类型
					insurant.birthday = tempData.BIRTHDAY;			//被保人生日
					insurant.customerId = tempData.ID;				//被保人ID
					insurant.email = tempData.EMAIL;				//被保人email
					insurant.grpName = (tempData.WORK_UNIT=='' || tempData.WORK_UNIT==null)?'无':tempData.WORK_UNIT;			//单位名称
					insurant.homeAddress = tempData.HOME_ADDRESS;	//被保人地址
					insurant.homeCity = tempData.HOME_CITY;			//被保人市
					insurant.homeCounty = tempData.HOME_COUNTY;		//被保人区县
					insurant.homeProvince = tempData.HOME_PROVINCE;	//被保人省			
					insurant.homeZipCode = tempData.HOME_ZIP_CODE;	//被保人邮编
					insurant.id = tempData.ID;						//被保人id
					insurant.idEndDate = newIdEndDate;		//被保人证件有效止期
					insurant.idNo = tempData.IDNO;					//被保人证件号码
					insurant.idType = tempData.IDTYPE;				//被保人证件类型
					insurant.income = tempData.INCOME;				//被保人年收入
					insurant.incomeWay = tempData.INCOME_WAY;		//被保人收入来源
					insurant.marriage = tempData.MARRI_STATUS;		//被保人婚姻状态
					insurant.phone = tempData.HOME_PHONE;				//被保人家庭电话
					insurant.msn = tempData.MSN;					//被保人msn
					insurant.nativePlace = tempData.NATIVE_PLACE;		//被保人国籍
					//insurant.occupationCode		//已在10005获取
					insurant.occupationCodeName = tempData.OCCUPATION_CODE_NAME;//被保人职业名称
					insurant.otherIncomeWay = tempData.OTHER_INCOME_WAY;//被保人其他收入来源
					insurant.mobile = tempData.MOBILE;//被保人移动电话
					insurant.pluralityOccupationCode = tempData.PLURALITY_OCCUPATION_CODE;	//兼职职业编码
					insurant.pluralityOccupationName = tempData. PLURALITY_OCCUPATION_CODE_NAME;//兼职职业名称					
					insurant.qq = tempData.QQ;//被保人qq
					//insurant.realName	//已在10005获取
					insurant.rgtCity = tempData.RGT_CITY;//未知
					insurant.rgtProvince = tempData.RGT_PROVINCE;//被保人省
					//insurant.sex		//已在10005获取
					//insurant.weiboNo	//已在10005获取
					//alert(' tempData.AGE==='+ tempData.AGE);
					if( tempData.AGE==''){
						tempData.AGE = 0;
					}
					insurant.age = getAgeByBirthday(tempData.BIRTHDAY)+"";		//已在10005获取
					//10002赋值
					proposalPdf.customerMap.AGE = getAgeByBirthday(tempData.BIRTHDAY)+"";

				}
				
				//查询地址表数据
				// var tAddress10005_sql = {
				// 		"databaseName":"promodel/10005/www/db/t_address.sqlite",
				// 		"sql" : "select * from t_address where place_code != ''"
				// 	}; 
				//根据省市名称获取对应code码
				// queryTableDataUseSql(tAddress10005_sql, function (data2) {
				// 	if(data2){
				// 		var addressArray = data2;
				// 		var newAddressJson = {};
				// 		for(var k = 0 ; k < addressArray.length ; k++){
				// 			var tempAddress = addressArray[k];
				// 			var placeCode = tempAddress["PLACE_CODE"];
				// 			var placeName = tempAddress["PLACE_NAME"];
				// 			newAddressJson[placeName] = placeCode;
				// 		}

				// 		//设置地址编码
				// 		if(applicant.benefitId == tempData.ID){
				// 			applicant.postalCity = newAddressJson[tempData.COMPANY_CITY];		
				// 			applicant.postalProvince = newAddressJson[tempData.COMPANY_PROVINCE];
				// 			applicant.homeCity = newAddressJson[tempData.HOME_CITY];		//投保人城市
				// 			applicant.homeProvince = newAddressJson[tempData.HOME_PROVINCE];//投保人省		
				// 			applicant.rgtCity = newAddressJson[tempData.RGT_CITY];			//未知
				// 			applicant.rgtProvince = newAddressJson[tempData.RGT_PROVINCE];	//投保人省
				// 		}
				// 		if(insurant.benefitId == tempData.ID){
				// 			insurant.homeCity = newAddressJson[tempData.HOME_CITY];			//被保人市
				// 			insurant.homeProvince = newAddressJson[tempData.HOME_PROVINCE];	//被保人省		
				// 			insurant.rgtCity = newAddressJson[tempData.RGT_CITY];		//被保人市
				// 			insurant.rgtProvince = newAddressJson[tempData.RGT_PROVINCE];//被保人省
				// 		}
						
				// 		//alert("applicant_2"+JSON.stringify(applicant));
				// 		//alert("insurant_2"+JSON.stringify(insurant));
						
				// 		c_i = c_i+1;
				// 		if(c_i < c_length){
				// 			apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf,c_i,c_length,c_data);
				// 		}else{
				// 			flag = "commitInsurance";
				// 			apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf);
				// 		}
				// 	}
				// });
				c_i = c_i+1;
				if(c_i < c_length){
					apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf,c_i,c_length,c_data);
				}else{
					flag = "commitInsurance";
					apply_submit(applyId,opts,flag,http_aply_id,http_proposal_id,applyInfo_A,proposalPdf);
				}
				//alert("applicant_2"+JSON.stringify(applicant));
				//alert("insurant_2"+JSON.stringify(insurant));
			});
		}
	}else if(flag == "commitInsurance"){
		
//		alert("提交保单前！");
		
//		alert("applyInfo:"+JSON.stringify(applyInfo_A));
//		alert("baseinfo:"+JSON.stringify(applyInfo_A.applyDetail.baseInfo));
//		alert("applicant:"+JSON.stringify(applyInfo_A.applyDetail.applicant));
//		alert("insuredList:"+JSON.stringify(applyInfo_A.applyDetail.insuredList));
//      alert("insurant:"+JSON.stringify(applyInfo_A.applyDetail.insuredList[0].insurant));
		//需要提交的保单
		applyInfo_A.applyDetail = JSON.stringify(applyInfo_A.applyDetail);

		parameterJson["applyInfo"] = applyInfo_A;
		var queryApply_SQL = {
			"databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
			"tableName": "T_APPLY",
			"conditions": {"ID": applyId}//保单ID
		};
		//开门红已对pdf里面的产品列表数据进行分离，提交时查询pdf原始数据重新进行赋值
		queryTableDataByConditions(queryApply_SQL, function (data6) {
			var obj = data6[0];
			var pjson2 = eval('('+obj.PROSAL_JSON+')');
			var recommendProduct = pjson2["CONTENT"].insureProductsMap;
			var productObj =  recommendProduct["tableDataList"];
			for(var i = 0 ; i < productObj.length ; i ++){
				var item_list = productObj[i];
				var item5 = item_list[5];
				var item6 = item_list[6];
				var tempItem = (item5 == "12") ? "年交" : "一次交清";
				if(item_list[0] == "121716" || item_list[0] == "121717" || item_list[0] == "121718" || item_list[0] == "121719" || item_list[0] == "111808"){
					tempItem = "趸交";
				}
				item_list[5] = item6;
				item_list[6] = tempItem;
			}
			proposalPdf.insureProductsMap.tableDataList =  productObj;
			parameterJson["proposalPdf"] = proposalPdf;
		})
		
		
		//获取投保人、被保人、受益人证件url数据
		var byid = {
				"databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
				"tableName": "T_CUSTOMER",
				"conditions": {"APPLY_ID": applyId}//保单ID
			};
		queryTableDataByConditions(byid, function (data) {
//			alert("证件照片data:"+data);
			if(data && data.length > 0){
				//受益人证件url数组 
				var benefImage1Array = new Array();
				var benefImage2Array = new Array();
				for(var i = 0 ; i < data.length ; i++)
				{
					var tempData = data[i];
					//如果证件正反面URL均为空的情况则不做处理
					if(isNull(tempData.CARD_FRONT) && isNull(tempData.CARD_REVERSE) && isNull(tempData.BANK_FRONT) && isNull(tempData.COPY_FRONT) && isNull(tempData.COPY_REVERSE)  && isNull(tempData.CUSTOM_FRONT) && isNull(tempData.CUSTOM_REVERSE)){
						continue;
					}
					// if(isNull(tempData.CARD_FRONT) && isNull(tempData.CARD_REVERSE)){
					// 	continue;
					// }
					if(tempData.IS_BENEFIT == 0){	//投保人
						parameterJson["appnImage1"] = tempData.CARD_FRONT;
						parameterJson["appnImage2"] = tempData.CARD_REVERSE;
						parameterJson["appnImage3"] = tempData.BANK_FRONT;//银行卡影像件
						parameterJson["appnImage4"] = tempData.COPY_FRONT;//抄录投保人影像件
						parameterJson["appnImage5"] = tempData.COPY_REVERSE;//抄录确认书影像件
						parameterJson["appnImage6"] = tempData.CUSTOM_FRONT;//客户合照影像件（苏州代理人）
						parameterJson["appnImage7"] = tempData.CUSTOM_REVERSE;//客户合照影像件（苏州代理人）
					}else if(tempData.IS_BENEFIT == 1){	//被保人
						parameterJson["insurantImage1"] = tempData.CARD_FRONT;
						parameterJson["insurantImage2"] = tempData.CARD_REVERSE;
					}else if(tempData.IS_BENEFIT == 2){	//受益人
						benefImage1Array.push(tempData.CARD_FRONT);
						benefImage2Array.push(tempData.CARD_REVERSE);
					}
				}
				if(benefImage1Array.length > 0 && benefImage2Array.length > 0){
					parameterJson["benefImage1"] = benefImage1Array.join(",");
					parameterJson["benefImage2"] = benefImage2Array.join(",");
				}
			}
//			alert("appnImage1:"+parameterJson["appnImage1"]+"___appnImage2:"+parameterJson["appnImage2"]);
//			alert("insurantImage1:"+parameterJson["insurantImage1"]+"___insurantImage2:"+parameterJson["insurantImage2"]);
//			alert("benefImage1:"+parameterJson["benefImage1"]+"___benefImage2:"+parameterJson["benefImage2"]);
			
			//判断是否选择电子签名
			var elecSignNameFlag = opts.elecSignNameFlag;
			if(elecSignNameFlag == "Y"){
				//电子签名中所有图片
				var signInsurnoticeList = opts.signInsurnoticeList;
				var signApplyList = opts.signApplyList;
                var signConfirmationList =  opts.signConfirmationList;  //天津确认书签名
                var tjConfirmationData = opts.tjConfirmationData;   //天津确认书信息
                if(tjConfirmationData!=null && tjConfirmationData!=undefined && signConfirmationList!=null && signConfirmationList.length>0){
                    parameterJson["tjConfirmationData"] = tjConfirmationData;
                    //天津销售确认书加密
                    getEncFile_confirmation(function(data){
                        //alert("getEncFile.data:"+JSON.stringify(data));
                        if(data){
                            var returnEncFileJson=eval("("+data+")");
                            //电子签名中图片URL和加密包的字符串参数
                            var signConfirmationParameter = signConfirmationList.join(",");
                            signConfirmationParameter = signConfirmationParameter + "," + returnEncFileJson["confirmationEncodePath"];

                            //将电子签名中的图片URL存入提交保单的参数中
                            parameterJson["signConfirmationList"] = signConfirmationParameter;
                            //alert("signConfirmationList:"+JSON.stringify(parameterJson["signConfirmationList"]));
                        }
                    },function(error){
                        if(error===null){
                            myAlert("电子签名未填写完整！");
                            closeLoadingWait();
                        }else{
                            myAlert("插件调用失败，请重新尝试。若多次尝试后仍然如此，请联系相关人员处理！");
                            closeLoadingWait();
                        }
                    });
                }
				getEncFile(function(data){
//					alert("getEncFile.data:"+data);
					if(data){
						var returnEncFileJson=eval("("+data+")");
//						signInsurnoticeList.push(returnEncFileJson["insurnoticeEncodePath"]);
//						signApplyList.push(returnEncFileJson["applyEncodePath"]);
						
						//电子签名中图片URL和加密包的字符串参数
						var signInsurnoticeParameter = signInsurnoticeList.join(",");
						var signApplyParameter = signApplyList.join(",");
						signInsurnoticeParameter = signInsurnoticeParameter + "," + returnEncFileJson["insurnoticeEncodePath"];
						signApplyParameter = signApplyParameter + "," + returnEncFileJson["applyEncodePath"];
						
						//将电子签名中的图片URL存入提交保单的参数中
						parameterJson["signInsurnoticeList"] = signInsurnoticeParameter;
						parameterJson["signApplyList"] = signApplyParameter;
						
//						alert("signInsurnoticeList:"+JSON.stringify(parameterJson["signInsurnoticeList"]));
//						alert("signApplyList:"+JSON.stringify(parameterJson["signApplyList"]));

						flag = "proposalInfo";
						apply_submit(applyId,opts,flag);
					}
				},function(error){
					if(error===null){
						myAlert("电子签名未填写完整！");
						closeLoadingWait();
					}else{
						// myAlert("getEncFile插件错误信息："+error);
						myAlert("插件调用失败，请重新尝试。若多次尝试后仍然如此，请联系相关人员处理！");
						closeLoadingWait();
					}
				});
			}else{
				flag = "proposalInfo";
				apply_submit(applyId,opts,flag);
			}
		});
	}else if(flag == "proposalInfo"){
//		alert("flag:"+flag);
		//建议书详情
		var proposalInfoList = new Array();
		var proposalJson = new Object();
		//查询建议书数据
		var proposalKey = {
			"databaseName": "promodel/10003/www/db/esales.sqlite",
			"tableName": "T_PROPOSAL",
			"conditions": {"ID": opts.propsalID}
		};
		queryTableDataByConditions(proposalKey, function (data) {
			if(data && data.length > 0){
				var tempData = data[0];
				proposalJson["PRINT_INTERVAL"] = tempData["PRINT_INTERVAL"];
				proposalJson["CREATE_TIME"] = convertDatetimeToTimestamp(tempData["CREATE_TIME"]);
				proposalJson["REAL_NAME"] = tempData["REAL_NAME"];
				proposalJson["UPDATE_TIME"] = convertDatetimeToTimestamp(tempData["UPDATE_TIME"]);
				proposalJson["FYP"] = tempData["FYP"];
				proposalJson["COVER_ID"] = tempData["COVER_ID"];
				proposalJson["ID"] = tempData["ID"];
				proposalJson["IS_PRINT"] = tempData["IS_PRINT"];
				proposalJson["AGENT_CODE"] = tempData["AGENT_CODE"];
				proposalJson["FLAG"] = tempData["FLAG"];
				proposalJson["PRINT_OPTIONS"] = tempData["PRINT_OPTIONS"];
				proposalJson["CODE"] = tempData["CODE"];
				proposalJson["TITLE"] = tempData["TITLE"];

				proposalInfoList.push(proposalJson);
				parameterJson["proposalInfo"] = proposalInfoList;
				flag = "insurantList";
				apply_submit(applyId,opts,flag);
			}
		});
	}else if(flag == "insurantList"){
//		alert("flag:"+flag);
		//建议书被保人信息列表
		var insurantList = new Array();
		//查询建议书险种列表
		var proposalInsurantKey = {
				"databaseName": "promodel/10003/www/db/esales.sqlite",
				"tableName": "T_PROPOSAL_INSURANT",
				"conditions": {"PROPOSAL_ID": opts.propsalID}
			};
		queryTableDataByConditions(proposalInsurantKey, function (data) {
//			alert("insurantList.data:"+JSON.stringify(data));
			if(data && data.length > 0){
				for(var j = 0 ; j < data.length ; j++){
					var tempInsurant = data[j];
					var currentInsurant = new Object();
					currentInsurant["RELATION_TO_APPNT"] = tempInsurant["RELATION_TO_APPNT"];
					currentInsurant["BIRTHDAY"] = tempInsurant["BIRTHDAY"];
					currentInsurant["REAL_NAME"] = tempInsurant["REAL_NAME"];
					currentInsurant["CREATE_TIME"] = convertDatetimeToTimestamp(tempInsurant["CREATE_TIME"]);
					currentInsurant["RELATION_TO_FIRST_INSURANT"] = tempInsurant["RELATION_TO_FIRST_INSURANT"];
					currentInsurant["SEQ"] = tempInsurant["SEQ"];
					currentInsurant["CUSTOMER_ID"] = tempInsurant["CUSTOMER_ID"];
					currentInsurant["INSURANT_DETAIL"] = tempInsurant["INSURANT_DETAIL"];
					currentInsurant["UPDATE_TIME"] = convertDatetimeToTimestamp(tempInsurant["UPDATE_TIME"]);
					currentInsurant["OCCUPATION_CODE"] = tempInsurant["OCCUPATION_CODE"];
					currentInsurant["SEX"] = tempInsurant["SEX"];
					currentInsurant["ID"] = tempInsurant["ID"];
					currentInsurant["PLURALITY_OCCUPATION_CODE"] = tempInsurant["PLURALITY_OCCUPATION_CODE"];
					currentInsurant["PROPOSAL_ID"] = tempInsurant["PROPOSAL_ID"];
					currentInsurant["FLAG"] = tempInsurant["FLAG"];
					
					insurantList.push(currentInsurant);
				}
				parameterJson["sinsurantList"] = insurantList;
				flag = "insuranceList";
				apply_submit(applyId,opts,flag);
			}
		});
		
	}else if(flag == "insuranceList"){
//		alert("flag:"+flag);
		//险种列表
		var insuranceList = new Array();
		//查询建议书险种列表
		var proposalProductKey = {
				"databaseName": "promodel/10003/www/db/esales.sqlite",
				"tableName": "T_PROPOSAL_PRODUCT",
				"conditions": {"PROPOSAL_ID": opts.propsalID}
			};
		queryTableDataByConditions(proposalProductKey, function (data) {
			var isreleated = opts.isreleated;
			if(isreleated == "03" || isreleated == "Y"){
				for(var c = 0; c < data.length; c++){
					//如果关联万能，年金的红利领取方式默认为2（现金领取）
					if(data[c].MAIN_PRODUCT_CODE == '112406' || data[c].MAIN_PRODUCT_CODE == '112407'){
						data[c].BONUS_GET_MODE = '2';
					}
					if(data[c]['PRODUCT_CODE']== '124405'){
						data.splice(c,1);
					}					
				}
			}else if(isreleated == '05'){
				for(var x = 0; x < data.length; x++){
					if(data[x]['PRODUCT_CODE']== '124405'){
						data[x]['PRODUCT_CODE'] = '';
						data[x]['MAIN_PRODUCT_CODE']= '114403';
						data.splice(0,x);
						data.splice(1,data.length-1);
					}
				}
			}
			if(data && data.length > 0){
				for(var j = 0 ; j < data.length ; j++){
					var tempProduct = data[j];
					var currentProduct = new Object();
					currentProduct["ADD_PREM"] = tempProduct["ADD_PREM"];
					currentProduct["PAY_INTV"] = tempProduct["PAY_INTV"];
					currentProduct["CREATE_TIME"] = convertDatetimeToTimestamp(tempProduct["CREATE_TIME"]);
					currentProduct["PREM"] = tempProduct["PREM"].toString();
					currentProduct["MAIN_PRODUCT_CODE"] = tempProduct["MAIN_PRODUCT_CODE"];
					currentProduct["PAY_END_YEAR_FLAG"] = tempProduct["PAY_END_YEAR_FLAG"];
					currentProduct["PRODUCT_CODE"] = tempProduct["PRODUCT_CODE"];
					currentProduct["SEQ"] = tempProduct["SEQ"].toString();
					currentProduct["INSU_YEARS_FLAG"] = tempProduct["INSU_YEARS_FLAG"];
					currentProduct["UPDATE_TIME"] = convertDatetimeToTimestamp(tempProduct["UPDATE_TIME"]);
					currentProduct["PAY_END_YEAR"] = tempProduct["PAY_END_YEAR"];
					currentProduct["AMOUNT"] = tempProduct["AMOUNT"].toString();
					currentProduct["INSU_YEARS"] = tempProduct["INSU_YEARS"];
					currentProduct["INSURANT_SEQ"] = tempProduct["INSURANT_SEQ"].toString();
					currentProduct["JOB_ADD_FEE"] = tempProduct["JOB_ADD_FEE"].toString();
					currentProduct["BONUS_GET_MODE"] = tempProduct["BONUS_GET_MODE"];
					currentProduct["MULTI"] = tempProduct["MULTI"].toString();
					currentProduct["ID"] = tempProduct["ID"].toString();
					currentProduct["PRODUCT_DETAIL"] = tempProduct["PRODUCT_DETAIL"];
					currentProduct["PROPOSAL_ID"] = tempProduct["PROPOSAL_ID"];
					currentProduct["FLAG"] = tempProduct["FLAG"];
					// alert('BONUS_GET_MODE2222==='+JSON.stringify(currentProduct["BONUS_GET_MODE"]))
					insuranceList.push(currentProduct);
				}
				parameterJson["sinsuranceList"] = insuranceList;
				flag = "applicantInfo";
				apply_submit(applyId,opts,flag);
			}
		});
	}else if(flag == "applicantInfo"){
//		alert("flag:"+flag);
		//建议书投保人列表
		var applicantList = new Array();
		//查询建议书投保人列表
		var proposalApplicantKey = {
				"databaseName": "promodel/10003/www/db/esales.sqlite",
				"tableName": "T_PROPOSAL_APPNT",
				"conditions": {"PROPOSAL_ID": opts.propsalID}
			};
		queryTableDataByConditions(proposalApplicantKey, function (data) {
//			alert("applicantInfo.data:"+JSON.stringify(data));
			if(data && data.length > 0){
				for(var j = 0 ; j < data.length ; j++){
					var tempApplicant = data[j];
					var currentApplicant = new Object();
					currentApplicant["ID"] = tempApplicant["ID"];
					currentApplicant["PROPOSAL_ID"] = tempApplicant["PROPOSAL_ID"];
					currentApplicant["CUSTOMER_ID"] = tempApplicant["CUSTOMER_ID"];
					currentApplicant["REAL_NAME"] = tempApplicant["REAL_NAME"];
					currentApplicant["SEX"] = tempApplicant["SEX"];
					currentApplicant["BIRTHDAY"] = convertDatetimeToTimestamp(tempApplicant["BIRTHDAY"]);
					currentApplicant["OCCUPATION_CODE"] = tempApplicant["OCCUPATION_CODE"];
					currentApplicant["APPNT_DETAIL"] = tempApplicant["APPNT_DETAIL"];
					currentApplicant["RELATION_TO_FIRST_INSURANT"] = tempApplicant["RELATION_TO_FIRST_INSURANT"];
					currentApplicant["CREATE_TIME"] = convertDatetimeToTimestamp(tempApplicant["CREATE_TIME"]);
					currentApplicant["UPDATE_TIME"] = convertDatetimeToTimestamp(tempApplicant["UPDATE_TIME"]);
					currentApplicant["PLURALITY_OCCUPATION_CODE"] = tempApplicant["PLURALITY_OCCUPATION_CODE"];
					currentApplicant["FLAG"] = tempApplicant["FLAG"];
					
					applicantList.push(currentApplicant);
				}
				parameterJson["sapplicant"] = applicantList;
				flag = "customerFamilyList";
				apply_submit(applyId,opts,flag);
			}
		});
	}else if(flag == "customerFamilyList"){
//		alert("flag:"+flag);
		//客户关系列表
		var customerFamilyList = new Array();
		//查询客户关系列表
		var customerRelationKey = {
				"databaseName": "promodel/10002/www/db/esales.sqlite",
				"tableName": "T_CUSTOMER_FAMILY",
				"conditions": {"FIRST_CUSTOMER_ID": opts.applicantID}
			};
		queryTableDataByConditions(customerRelationKey, function (data) {
//			alert("customerFamilyList.data:"+JSON.stringify(data));
			if(data && data.length > 0){
				for(var j = 0 ; j < data.length ; j++){
					var tempFamily = data[j];
					var customerFamily = new Object();
					customerFamily["id"] = tempFamily["ID"];
					customerFamily["firstCustomerId"] = tempFamily["FIRST_CUSTOMER_ID"];
					customerFamily["secondCustomerId"] = tempFamily["SECOND_CUSTOMER_ID"];
					customerFamily["relation"] = tempFamily["RELATION"];
					customerFamily["createTime"] = convertDatetimeToTimestamp(tempFamily["CREATE_TIME"]);
					customerFamily["updateTime"] = convertDatetimeToTimestamp(tempFamily["UPDATE_TIME"]);
					
					customerFamilyList.push(customerFamily);
				}
			}
			parameterJson["customerFamilyList"] = customerFamilyList;
			//最后一步提交保单相关数据
			commitInsuranceByJson(opts,parameterJson);
		});
	}
}
//提交保单相关数据
function commitInsuranceByJson(opts,parameterJson){
	//alert("parameterJson:"+JSON.stringify(parameterJson));
	var json = {"url": API_URL + "/app/apply/newbiz", "parameters": parameterJson };
	//alert("yjl:json:"+JSON.stringify(json));
	httpRequestByPost(json,function (obj){
		 //alert("返回结果："+obj);
			 var returnJson=eval("("+obj+")");
		     opts.callBackFun && opts.callBackFun(returnJson);
		 },function (errorInfo){
//		     CommonFn.alertPopupFun($ionicPopup,'loser','保单提交出错！',3000);
			 var returnJson = {"status" : {"code":"1","msg":errorInfo}};
		     opts.callBackFun && opts.callBackFun(returnJson);
	     }
 	);
}

/*
	根据data获取其中的值并且返回计算结果
*/
function getAmount(k,data,applyInfo,product){
	
	if(product == 'main'){
		//主险
		if(k == 0){
		//险种代码
		applyInfo.mainProductCode = data[k];
		}else if(k == 1){
		//险种名称
		applyInfo.mainProductName = data[k];
		}else if(k == 2){
		//保额/份数
		applyInfo.mainProductAmount = Amountreplace_price(data[k]);
		applyInfo.sumAmount = Amountreplace(applyInfo.sumAmount,data[k]);
		}else if(k == 3){
		//保费
		applyInfo.mainProductPrem = Amountreplace_price(data[k]);
		applyInfo.sumPrem = Amountreplace(applyInfo.sumPrem,data[k]);
		}else if(k == 4){
		//职业加费
		applyInfo.sumPrem = Amountreplace(applyInfo.sumPrem,data[k]);
		}else if(k == 5){
		//交费期间

		}else if(k == 6){
		//交费方式

		}else if(k == 7){
		//保险期间

		}
	}else{
		//附加险
		if(k == 0){
		//险种代码			
		}else if(k == 1){
		//险种名称
		//applyInfo.mainProductName = data[k];
		}else if(k == 2){
		//保额/份数
		applyInfo.sumAmount = Amountreplace(applyInfo.sumAmount,data[k]);
		}else if(k == 3){
		//保费
		applyInfo.sumPrem = Amountreplace(applyInfo.sumPrem,data[k]);
		}else if(k == 4){
		//职业加费
		applyInfo.sumPrem = Amountreplace(applyInfo.sumPrem,data[k]);
		}else if(k == 5){
		//交费期间

		}else if(k == 6){
		//交费方式

		}else if(k == 7){
		//保险期间

		}
	}
}
/*
	去除 元 并累加
*/
function Amountreplace(arg1,arg2){
	if(arg2.indexOf("元") != -1){
		arg2 = arg2.substring(0,arg2.length-1);
		return SumAmount(arg1,arg2);
	}
	//add by yangjialin
	if(arg2.indexOf("份") != -1){
		return parseInt(arg1);
	}
}
/*
	去除 元
*/
function Amountreplace_price(arg1){
	if(arg1.indexOf("元") != -1){
		return arg1 = arg1.substring(0,arg1.length-1);
	}
	//add by yangjialin
	if(arg1.indexOf("份") != -1){
		return "0";
	}
}

/*
	累加计算
*/
function SumAmount(arg1,arg2){
	//var num1 = parseInt(arg1);
	//var num2 = parseInt(arg2);
	//modify by yangjialin
	var num1 = parseFloat(arg1);
	var num2 = parseFloat(arg2);
	if(isNaN(num1) || isNaN(num2)){
		//alert('转换出错-非数字');
	}else{
		return num1 + num2;
	}
}