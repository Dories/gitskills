angular.module('starter.services', [])
/**
 *回执列表后台数据交互工厂 
 *add by wangzj
 *2016-6-23
 */
.factory('Receipts',function($http){
	var Receipts = function(){
		this.items = [];
		this.busy = false;
		this.after = '';
		this.page = 0;
	};
	Receipts.prototype.nextPage = function(){
		if (this.busy) return;
		this.busy = true;
		
		var url = API_URL+"/app/apply/queryReceiptList?currentPage="+this.page+"&callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(data){
			var items = data;
			for(var i = 0;i < items.length;i++){
				this.items.push(items[i]);
			}
			this.after = "t3_" + this.items[this.item.length - 1].id;
			this.busy = false;
			this.page +=1;
		}.bind(this));
	};
	return Receipts;
})
/**
 *问题件后台数据交互工厂 
 *add by wangzj
 *2016-6-23
 */
.factory('readyLoad',function($http){
    var readyLoad = function(isFirst,noticeDetail,piecesDetail){
        if (typeof(noticeDetail) == 'string' && noticeDetail) {
            //序列化json   通知书json
            var show_hide = eval("(" +noticeDetail + ")");
        }else{
            var show_hide = {lcquestionnaire: []};
        }
        //序列化   客户录入json用
        var c = "";
        //isFirst 1 代表第一次加载   
        if(isFirst!='1'){
            var list = show_hide.lcquestionnaire;
            //遍历核心需要默认勾选框
            for(var i = 0; i < list.length; i++){
                $('[value="'+list[i].lcquestionnaire+'"]').attr("checked",true);
                $('[value="'+list[i].lcquestionnaire+'"]').attr("disabled",true);
                $('[value="'+list[i].lcquestionnaire+'"]').addClass("checkboxStyleOfImpart-disabled");
            }
            // 打开相应的xml
            var list_m = $('[id^=div_problempieces_]');  
            for(var j = 0; j < list_m.length; j++){//遍历所有匹配到的元素，进行json重新组装
                if(list_m[j].checked){
                    var xmlId = list_m[j].id.substring(18);
                    var impartXmlpath = "xml/problempieces_"+xmlId+".xml";
                    var impartDivId = "question1_test";
                    var allInnerHTML = '';
                    var applicant_know = asyncQuestionRuleByXml(impartXmlpath);
                    var impartDiv = document.getElementById(impartDivId);
                    angular.element(impartDiv).append(applicant_know);
                }
            }

            // 解释自定数据
            if (!piecesDetail) {
                return;
            }
            c = eval("("+piecesDetail+")");
            // 自选的菜单
            for(var key in c){
                var key_l = key.toLowerCase();
                if (key_l.indexOf('problempieces_') != '-1') {
                    if (c[key] == true || c[key] == "true") {
                        if ($('#div_'+key+':checked').length){
                            continue;
                        }
                        $('#div_'+key+'').attr("checked",true);
                        // 打开相应的xml
                        var list_m = $('[id^=div_'+key+']'); 
                        for(var j = 0; j < list_m.length; j++){//遍历所有匹配到的元素，进行json重新组装
                            if(list_m[j].checked){
                                var xmlId = list_m[j].id.substring(18);
                                var impartXmlpath = "xml/problempieces_"+xmlId+".xml";
                                var impartDivId = "question1_test";
                                var allInnerHTML = '';
                                var applicant_know = asyncQuestionRuleByXml(impartXmlpath);
                                var impartDiv = document.getElementById(impartDivId);
                                angular.element(impartDiv).append(applicant_know);
                            }
                        }
                    }
                    continue;
                }
            }
            // 解释数据2
            for(var key in c){
                var key_l = key.toLowerCase();
                if (key_l.indexOf('problempieces_') != '-1') {
                    continue;
                }
                var input_type=$('#'+key).attr("type");
                if(input_type=="text" || input_type=="textarea" || input_type=="number"){
                    document.getElementById(key).value=c[key];
                }else if(input_type=="select-one"){
                    var select = document.getElementById(key);
                     for (var k = 0, count = select.options.length; k < count; k++) {
                         if (select.options[k].value == c[key]) {
                             select.selectedIndex = k;
                             break;
                         }
                     }
                }else{
                    document.getElementById(key).checked = c[key];
                }
                if(c[key]==true){
                    var cssname=$('#'+key).attr("class");                    
                    if(key.indexOf('_yes')!=-1){
                        if('A_1_6_yes'!=key)
                        {
                            var div_key = key.substring(0, key.length-4);
                            $('#div_'+div_key+'_').show();
                        }

                        if('A_4_8_yes' == key || 'A_6_7_yes' == key || 'A_9_6_yes' == key || 'C_9_6_yes' == key){
                            $('#'+cssname+'_hide').hide();
                        }else{
                            $('#'+cssname+'_hide').show();
                        }                       
                    }
                    if(key.indexOf('_no')!=-1){

                        if('A_1_6_no'==key)
                        {
                            var div_key = key.substring(0, key.length-3);
                            $('#div_'+div_key+'_').show();
                        }

                        if('A_4_8_no' == key || 'A_6_7_no' == key || 'A_9_6_no' == key || 'C_9_6_no' == key){
                            $('#'+cssname+'_hide').show();
                        }else{
                            $('#'+cssname+'_hide').hide();
                        }

                        if('A_4_11_no'==key||'A_6_3_no'==key||'A_3_6_no'==key)
                        {

                            setTimeout(function()
                            {
                                $('#div_A_4_11_').hide();
                                $("#div_A_6_3_").hide();
                                $("#div_A_3_6_").hide();
                            },500);

                        }

                    }
                }
            }
        }else{
            var list = show_hide.lcquestionnaire;
            for(var i = 0; i < list.length; i++){
                $('[value="'+list[i].lcquestionnaire+'"]').attr("checked",true);
                $('[value="'+list[i].lcquestionnaire+'"]').attr("disabled",true);
                $('[value="'+list[i].lcquestionnaire+'"]').addClass("checkboxStyleOfImpart-disabled");
            }
            var list_m = $('[id^=div_problempieces_]');  
             for(var j = 0; j < list_m.length; j++){//遍历所有匹配到的元素，进行json重新组装
                if(list_m[j].checked){
                    var xmlId = list_m[j].id.substring(18);
                    var impartXmlpath = "xml/problempieces_"+xmlId+".xml";
                    var impartDivId = "question1_test";
                    var allInnerHTML = '';
                    var applicant_know = asyncQuestionRuleByXml(impartXmlpath);
                    var impartDiv = document.getElementById(impartDivId);
                    angular.element(impartDiv).append(applicant_know);
                }
             }
        }

        if($("#A_24_1_2_yes").attr("checked"))
        {
            setTimeout(function()
            {
                $("*[for='A_24_1_2_01']").show();
                $("*[for='A_24_1_2_02']").show();
                $("*[for='A_24_1_2_03']").show();
                $("*[key='A_24_1_2_01']").show();
                $("*[key='A_24_1_2_02']").show();
                $("*[key='A_24_1_2_03']").show();

                $("*[for='A_24_1_3_a']").show();
                $("*[for='A_24_1_3_b']").show();
                $("*[for='A_24_1_3_c']").show();
                $("*[for='A_24_1_3_d']").show();
                $("*[for='A_24_1_3_e']").show();
                $("*[for='A_24_1_3_f']").show();
                $("*[key='A_24_1_3_a']").show();
                $("*[key='A_24_1_3_b']").show();
                $("*[key='A_24_1_3_c']").show();
                $("*[key='A_24_1_3_d']").show();
                $("*[key='A_24_1_3_e']").show();
                $("*[key='A_24_1_3_f']").show();
            },500);

        }

    };
    return readyLoad;
})
.factory('QuestionPapers',function($http){
	var QuestionPapers = function(){
		this.items = [];
		this.busy = false;
		this.after = '';
		this.page = 0;
	};
	QuestionPapers.prototype.nextPage = function(){
		if (this.busy) return;
		this.busy = true;		
		var url = API_URL+"/app/apply/problemPiecesQuery?currentPage="+this.page+"&callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(data){
			var items = data;
			for(var i = 0;i < items.length;i++){
				this.items.push(items[i]);
			}
			this.after = "t3_" + this.items[this.item.length - 1].id;
			this.busy = false;
			this.page +=1;
		}.bind(this));
	};
	return QuestionPapers;
})
/**
*公共变量 
* add by genglan
* 2015-1-24
*/ 
.factory("Variables",function (){
    return {
        appId: '10005',//当前应用ID
        recommendAppId:'10003',//建议书id
        customerAppId:'10002',//客户管理
        dataBaseName: "promodel/10005/www/db/insurance_online.sqlite",//当前应用数据库
        codeBaseName:"promodel/10005/www/db/t_code.sqlite",//码表对应数据库
        bankBaseName:"promodel/10005/www/db/t_bank.sqlite",//银行信息对应数据库
        currentCode: '',//当前登录人ID 8611018517
        alertPopup :null,//提示框
        //serverUrl :"http://10.0.22.112:7003/app/apply",//服务器url
        //serverUrl :"http://10.0.17.122:8080/esales_center/app/apply",//王思维的url
		serverUrl :API_URL+"/app/apply",
        codeJson:null,//代码集合
        productJson:null,//险种集合
        bankJson :null,//银行信息集合
        bankJsons:null
    }
})
/**
*变量赋值 
* add by genglan
* 2015-1-24
*/ 
.factory('setVariables',function (Variables,CommonFn) {
    var setVariablesDataFn = function(){
        Variables.dataBaseName = "promodel/"+Variables.appId+"/www/db/insurance_online.sqlite";
        Variables.codeBaseName = "promodel/"+Variables.appId+"/www/db/t_code.sqlite";
        Variables.bankBaseName = "promodel/"+Variables.appId+"/www/db/t_bank.sqlite";
        Variables.currentCode = CommonFn.getQueryStringByName("agentCode"); 
    }
    return {
        setVariablesData: function () {
            setVariablesDataFn();
        }
    }
})
/**
*初始化数据用 
* add by genglan
* 2015-1-24
*/
.factory('QuestionInit',function($http, $timeout){
    var QuestionInit = function(isuranc_sex,isuranc_age,appnt_sex,appnt_age){
        // 初始显示隐藏
        $timeout(function() {
            // 肝脏疾病问卷 第6、7题
            $('#div_A_3_6_').show();
            $('#div_A_3_7_').show();
            //高血压问卷    第11题
            $('#div_A_4_11_').show();
            //甲状腺问卷    第3题
            $('#div_A_6_3_').show();
            //劲椎疾病问卷  第7、10题
            $('#div_A_7_7_').show();
            $('#div_A_7_10_').show();
            // 机动车驾驶执照持有者问卷 // 点击右
            $('#div_C_6_4_').show();
            // 婴幼儿健康状况问卷(2)
            $('#problempieces_24 label[for^=A_24_1_2_0]').hide();
            $('#problempieces_24 span[key^=A_24_1_2_0]').hide();
            // 婴幼儿健康状况问卷(3)
            $('#problempieces_24 label[for^=A_24_1_3_]').hide();
            $('#problempieces_24 span[key^=A_24_1_3_]').hide();
            // 补充告知问卷（被保人）
            if (isuranc_sex) {
                if (isuranc_age >= 14 && isuranc_sex == '女' ) {
                    $('input[id=E_26_11_a_yes1]').attr('permission_empty',"no");
                    $('input[id=E_26_11_a_no1]').attr('permission_empty',"no");
                    $('input[id=E_26_11_b_yes1]').attr('permission_empty',"no");
                    $('input[id=E_26_11_b_no1]').attr('permission_empty',"no");
                    // 12题
                    $('input[id=E_26_12_01]').attr('allowSave',"false");
                    $('input[id=E_26_12_02]').attr('allowSave',"false");
                    $('input[id=E_26_12_b_yes1]').attr('permission_empty',"yes");
                    $('input[id=E_26_12_b_no1]').attr('permission_empty',"yes");
                }else if(isuranc_age <= 2){
                    $('input[id=E_26_11_a_yes1]').attr('permission_empty',"yes");
                    $('input[id=E_26_11_a_no1]').attr('permission_empty',"yes");
                    $('input[id=E_26_11_b_yes1]').attr('permission_empty',"yes");
                    $('input[id=E_26_11_b_no1]').attr('permission_empty',"yes");
                    // 12题
                    $('input[id=E_26_12_01]').attr('permission_empty',"no");
                    $('input[id=E_26_12_02]').attr('permission_empty',"no");
                    $('input[id=E_26_12_b_yes1]').attr('permission_empty',"no");
                    $('input[id=E_26_12_b_no1]').attr('permission_empty',"no");
                }else{
                    // 11题
                    $('input[id=E_26_11_a_yes1]').attr('permission_empty',"yes");
                    $('input[id=E_26_11_a_no1]').attr('permission_empty',"yes");
                    $('input[id=E_26_11_b_yes1]').attr('permission_empty',"yes");
                    $('input[id=E_26_11_b_no1]').attr('permission_empty',"yes");
                    // 12题
                    $('input[id=E_26_12_01]').attr('allowSave',"false");
                    $('input[id=E_26_12_02]').attr('allowSave',"false");
                    $('input[id=E_26_12_b_yes1]').attr('permission_empty',"yes");
                    $('input[id=E_26_12_b_no1]').attr('permission_empty',"yes");
                }
            }
            // 补充告知问卷（投保人）
            if (appnt_sex) {
                if (appnt_sex == '女' ) {
                    $('input[id=F_26_11_a_yes2]').attr('permission_empty',"no");
                    $('input[id=F_26_11_a_no2]').attr('permission_empty',"no");
                    $('input[id=F_26_11_b_yes2]').attr('permission_empty',"no");
                    $('input[id=F_26_11_b_no2]').attr('permission_empty',"no");
                }else{
                    $('input[id=F_26_11_a_yes2]').attr('permission_empty',"yes");
                    $('input[id=F_26_11_a_no2]').attr('permission_empty',"yes");
                    $('input[id=F_26_11_b_yes2]').attr('permission_empty',"yes");
                    $('input[id=F_26_11_b_no2]').attr('permission_empty',"yes");
                }
            }
        });
    };
    return QuestionInit;
})
.factory('initData',function (Variables,CommonFn){ 
    //根据类型查询有所代码
    var loadAllCode = function (){
        var sql = "select * from T_CODE ";
        var json = {
            "databaseName":Variables.codeBaseName,
            "sql": sql
        }; 
        queryTableDataUseSql(json,function(data){ 
            Variables.codeJson = data;
        },function (){
            console.log('查询code出错！');
        });
    }
    //初始化产品集合
    var loadProductJson = function (){
        var array = [];
        CommonFn.analysisXml({
            xmlString:'xml/product.xml',
            callBackFun:function (dom){
                var elements = dom.getElementsByTagName("insur");
                for (var i = 0; i < elements.length; i++) {
                    var json = {};
                    if(elements[i].attributes.length>1){
                      json["id"] = elements[i].getAttribute("id");
                      json["name"] = elements[i].getAttribute("name");
                      json["kind"] = elements[i].getAttribute("kind");
                      json["hasProductSpec"] = elements[i].getAttribute("hasProductSpec");
                      json["beginDate"] = elements[i].getAttribute("beginDate");
                      json["hasAppntImpart"] = elements[i].getAttribute("hasAppntImpart");
                      array.push(json)
                    }
                }
                Variables.productJson = array; 
            }
        });
    }
    //查询银行信息
    var loadBanks = function (fn){ 
    	var agent ='';
    	if(organCode){
    		agent = organCode.substr(0,4);
    	}else{
    		agent = "8611018517".substr(0,4);
    	}
        var sql = "select * from T_BANK where COM_CODE = " + agent;
        var json = {
            "databaseName":Variables.bankBaseName,
            "sql": sql
        }; 
        queryTableDataUseSql(json,function(data){         
            Variables.bankJson = data;
			fn();
        },function (){
            console.log('查询code出错！');
        });
    }

    //  add   2016.8.11  wuwei  108行 模糊查询银行信息
    var loadBanks1 = function (fn){
        var pctype = document.getElementById("pctype").value;
        if(pctype=='phone'){
            var bankvalue =document.getElementById("bank_select_pc").value
        }else{
            var bankvalue =document.getElementById("bank_select").value;
        }
        // var bankvalue = pctype = 'phone'?document.getElementById("bank_select_pc").value:document.getElementById("bank_select").value;
        var agent ='';
        if(organCode){
            agent = organCode.substr(0,4);
        }else{
            agent = "8611018517".substr(0,4);
        } 

        var sql = "select T_BANK.BANK_NAME,T_BANK.BANK_CODE from T_BANK where COM_CODE = " + agent + " and BANK_NAME like '%"+ bankvalue +"%'";

        var json = {
            "databaseName":Variables.bankBaseName,
            "sql": sql
        }; 
        queryTableDataUseSql(json,function(data){
            Variables.bankJsons = data; 
            fn();
        },function(){
            console.log('模糊查询银行信息出错！');
        });
    }

    return {
        loadAllCode:loadAllCode,
        loadProductJson:loadProductJson,
        loadBanks1:loadBanks1,
        loadBanks:loadBanks
        
    }
})
/**
*公共方法 
* add by genglan
* 2015-1-24
*/
.factory("CommonFn",function (Variables,$ionicLoading){
    //根据QueryString参数名称获取值
    var getQueryStringByName = function(name){
        var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
        if(result == null || result.length < 1){
            return "";
        }
        return result[1];
    }
    //提示框
    var alertPopupFun = function ($ionicPopup,icon,word,time){
        if(null != Variables.alertPopup){
            Variables.alertPopup.close(); 
        }
        Variables.alertPopup = $ionicPopup.alert({
            template: '<div class="pop_up_box"><span class="'+icon+'"></span>'+word+'</div>'
        });
        if(0 != time){ //time == 0 标识的是正在加载中......  加载完毕后会自动关闭
            setTimeout(function (){
                if(null != Variables.alertPopup){
                    Variables.alertPopup.close(); 
                } 
            },time);
        }   
    }
    //提示框2
    var alertPopupFun2 = function ($ionicPopup,icon,word,time){
        if(null != Variables.alertPopup){
            Variables.alertPopup.close();
        }
        Variables.alertPopup = $ionicPopup.alert({
            template: '<div class="pop_up_box1"><span class="'+icon+'"></span>'+word+'</div>'
        });
        if(0 != time){ //time == 0 标识的是正在加载中......  加载完毕后会自动关闭
            setTimeout(function (){
                if(null != Variables.alertPopup){
                    Variables.alertPopup.close();
                }
            },time);
        }
    }

    //功能：格式化时间,string转date
    function strToDate(str){
        if(str == null || str == "") return "";
        var dt = str.split(" ");
        if(dt[1] == null || dt[1] == "" ||dt[1] == undefined){//2007-11-15
            var d = dt[0].split("-");
            var d_date = new Date(d[0],d[1]-1,d[2],0,0,0);
            return d_date;
        }else{//2007-11-15 14:28:46
            var d = dt[0].split("-");
            var t = dt[1].split(":");
            var d_date = new Date(d[0],d[1]-1,d[2],t[0],t[1],t[2]);
            return d_date;
        }
    };
    //收费按钮控制
    var checkCharge = function(){
        var agentCode =  window.localStorage.getItem('agentCode');
        var curTime = new Date().getTime();
        var startTime = strToDate("2018-05-02 21:30:00").getTime();
        var endTime = strToDate("2018-05-02 22:30:00").getTime();
        if(curTime>=startTime && curTime<=endTime && agentCode!="8691001049" && agentCode!="8637059324"){
            return false;
        }else{
            return true;
        }
    }

    //OCR银行卡识别
    function invoateOCR (opts){
        var idCodeNum = opts.idtype;
        var method = opts.method;
        var json = {'idtype':idCodeNum,'method':method};
        //alert(JSON.stringify(json));
        invoateOCRPlugin(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function(err){
            opts.callBackFun && opts.callBackFun(err);
        })
    }
    function showLoading (str) {
        $ionicLoading.show({
            template: '<div class="pop_up_box2"><span class="loading_box"></span>'+str+'</div>'
        });
    };

    function hideLoading () {
        $ionicLoading.hide();
    };
    function invoateOCRPlugin(key,success_callback,failed_callback){
        //iOS
        if(brows().iphone){
            cordova.exec(success_callback, failed_callback, "MSOCRPlugin", "invocateOCRPlugin", [key]);
        }
        //Android
        else if(brows().android){
            return cordova.exec(success_callback, failed_callback, "MSOCRPlugin", "invocateOCRPlugin", key);
        }
    }

    //根据路径解析xml
    var analysisXml = function(opts){ 
        var xmlDoc; 
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
            xmlDoc.async = false;
            xmlDoc.load(opts.xmlString);
        }
        else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器 
            xmlDoc = document.implementation.createDocument('', '', null);
            xmlDoc.load(opts.xmlString);
        }else{ //谷歌浏览器
            var xmlhttp = new window.XMLHttpRequest();  
            xmlhttp.open("GET",opts.xmlString,false);  
            xmlhttp.send(null);  
            xmlDoc = xmlhttp.responseXML;  
        } 
        opts.callBackFun && opts.callBackFun(xmlDoc);  
    }
    //根据代码取name
    var loadCodeNameByCode = function (data,type,code){
        for(var i=0 ;i<data.length;i++){
            if(data[i].CODE_TYPE == type && data[i].CODE == code){
                return data[i].CODE_NAME;
            }
        }
        return '';
    }
    //根据险种ID获取险种name
    var loadProductNameByCode = function (data,code){
        for (var i = 0; i < data.length; i++) {
            if(data[i].id == code){
                return data[i].name;
            }   
        }
        return '';
    }
    //删除数组某一元素
    var deleteArray = function(opts){
        for(var i=0 ;i<opts.array.length ;i++){
            if(opts.deleteID == opts.array[i].ID){
               opts.array.splice(i, 1);
               opts.callBackFun && opts.callBackFun(opts.array);  
            }
        }
    }
    //根据银行编码找银行名称
    var loadBankNameByCode = function (data,code){
        for (var i = 0; i < data.length; i++) {
            if(data[i].BANK_CODE == code){
                return data[i].BANK_NAME;
            }   
        }
        return '';  
    }
    var findIndex =function(arr, n) {
        if(!angular.isArray(arr)){
            return null;
        };
        for(var i=0; i<arr.length; i++){
            if(arr[i] === n){
                return i;
            };
        };

        return null;
    };
    var adressSelect = function (module, allProvince, scope, dsy, provinceKey, cityKey, adressType) {
        var groupCity = null,
            groupCounty = null,
            groupCityKey;

        scope.$watch(module + '.data.' + provinceKey, function () {
          var provinceNow = scope[module].data[provinceKey];
          if(provinceNow){
            var provinceIndex = findIndex(allProvince, provinceNow);
            if(provinceIndex != null){
                groupCityKey = '0_' + provinceIndex;
                groupCity = dsy.Items[groupCityKey];
                scope[module].adress[adressType].city = groupCity;
                scope[module].adress[adressType].county = [];
            };
          };
        });

        scope.$watch(module + '.data.' + cityKey, function () {
          var cityNow = scope[module].data[cityKey];

          if(cityNow){
            var cityIndex = findIndex(groupCity, cityNow);

            if(cityIndex != null){
                var CountyKey = groupCityKey + '_' + cityIndex;
                groupCounty = dsy.Items[CountyKey];
                scope[module].adress[adressType].county = groupCounty;
            };
          };
        });
    }
    var isExist = function(value){
        if(typeof value == 'undefined' || value == null || value === ''){
            return false;
        }else{
            return true;
        };
    }
	this.code = {'idtype_0':'居民身份证','idtype_1':'中国护照','idtype_2':'军官证','idtype_4':'居民户口簿','idtype_7':'出生证','idtype_9':'出生日期','idtype_A':'士兵证','idtype_B':'港澳居民来往内地通行证','idtype_D':'警官证','idtype_E':'台湾居民来往大陆通行证','idtype_G':'港澳通行证','idtype_H':'外国护照','idtype_I':'外国人永久居留证','idtype_L':'港澳台居民居住证','incomeway_1':'工薪','incomeway_3':'私营','incomeway_4':'房屋出租','incomeway_7':'其他','marriage_0':'未婚','marriage_1':'已婚','marriage_2':'离异','marriage_3':'丧偶','nativeplace_AFG':'阿富汗','nativeplace_AHO':'荷属安的列斯','nativeplace_ALB':'阿尔巴尼亚','nativeplace_ALG':'阿尔及利亚','nativeplace_AND':'安道尔','nativeplace_DPR':'朝鲜','nativeplace_ANG':'安果拉','nativeplace_ARG':'阿根廷','nativeplace_ARM':'亚美尼亚','nativeplace_ARU':'阿鲁巴岛','nativeplace_AUS':'澳大利亚','nativeplace_AUT':'奥地利','nativeplace_AZE':'阿塞拜疆','nativeplace_BAN':'孟加拉国','nativeplace_BAR':'巴巴多斯','nativeplace_BAS':'巴西','nativeplace_BEL':'比利时','nativeplace_BER':'百慕大','nativeplace_BIH':'波斯尼亚-黑塞哥维那','nativeplace_BLR':'白俄罗斯','nativeplace_BOL':'玻利维亚','nativeplace_BOT':'博茨瓦纳','nativeplace_BRN':'巴林','nativeplace_BRU':'文莱','nativeplace_BUL':'保加利亚','nativeplace_CAN':'加拿大','nativeplace_CHI':'智利','nativeplace_CHN':'中国','nativeplace_TW':'台湾','nativeplace_MO':'澳门','nativeplace_HK':'香港','nativeplace_CIV':'象牙海岸','nativeplace_COL':'哥伦比亚','nativeplace_CRC':'哥斯达黎加','nativeplace_CRO':'克罗地亚','nativeplace_CUB':'古巴','nativeplace_CYP':'塞浦路斯','nativeplace_CZE':'捷克共和国','nativeplace_DEN':'丹麦','nativeplace_DEU':'德国','nativeplace_DG':'加纳','nativeplace_DOM':'多米尼加','nativeplace_ECU':'厄瓜多尔','nativeplace_EGY':'埃及','nativeplace_ENG':'英国','nativeplace_ESP':'西班牙','nativeplace_EST':'爱沙尼亚','nativeplace_ETH':'埃塞俄比亚','nativeplace_FAI':'法罗群岛','nativeplace_FIN':'芬兰','nativeplace_FRA':'法国','nativeplace_GCI':'根西','nativeplace_GEO':'格鲁吉亚','nativeplace_GRE':'希腊','nativeplace_HON':'洪都拉斯','nativeplace_HUN':'匈牙利','nativeplace_INA':'印度尼西亚','nativeplace_IND':'印度','nativeplace_IRI':'伊朗','nativeplace_IRL':'爱尔兰','nativeplace_IRQ':'伊拉克','nativeplace_ISL':'冰岛','nativeplace_ISR':'以色列','nativeplace_ISV':'美属维京群岛','nativeplace_ITA':'意大利','nativeplace_IVB':'英属维尔京群岛','nativeplace_JAM':'牙买加','nativeplace_JAN':'日本','nativeplace_JCI':'泽西岛','nativeplace_KAZ':'哈萨克斯坦','nativeplace_KEN':'肯尼亚','nativeplace_KGZ':'塔吉克斯坦','nativeplace_KOR':'韩国','nativeplace_LAT':'拉脱维亚','nativeplace_LBA':'利比亚','nativeplace_LIB':'黎巴嫩','nativeplace_LIE':'列支敦士登','nativeplace_LTU':'立陶宛','nativeplace_LUX':'卢森堡','nativeplace_MAR':'摩洛哥','nativeplace_MAW':'马拉维','nativeplace_MEX':'墨西哥','nativeplace_MGL':'蒙古','nativeplace_MKD':'马其顿','nativeplace_MLT':'马尔他','nativeplace_MNC':'摩纳哥','nativeplace_MRI':'毛利求斯','nativeplace_MY':'马来西亚','nativeplace_NAM':'纳米比亚','nativeplace_NCA':'尼加拉瓜','nativeplace_NGR':'尼日利亚','nativeplace_NL':'荷兰','nativeplace_NO':'挪威','nativeplace_NZL':'新西兰','nativeplace_OTH':'其他','nativeplace_PAN':'巴拿马','nativeplace_PAR':'巴拉圭','nativeplace_PER':'秘鲁','nativeplace_PHL':'菲律宾','nativeplace_PL':'波兰','nativeplace_PLE':'巴勒斯坦','nativeplace_PNG':'巴布亚新几内亚','nativeplace_POR':'葡萄牙','nativeplace_QAT':'卡塔尔','nativeplace_ROM':'罗马尼亚','nativeplace_RUS':'俄罗斯','nativeplace_RWA':'卢旺达','nativeplace_SCO':'苏格兰','nativeplace_SEY':'塞舌尔','nativeplace_SFA':'南非','nativeplace_SG':'新加坡','nativeplace_SLK':'斯里兰卡','nativeplace_SLO':'斯洛文尼亚','nativeplace_SMR':'圣马力诺','nativeplace_SOM':'索马里','nativeplace_SUD':'苏丹','nativeplace_SUI':'瑞士','nativeplace_SUR':'苏里南','nativeplace_SVK':'斯洛伐克','nativeplace_SWE':'瑞典','nativeplace_SYR':'叙利亚','nativeplace_THA':'泰国','nativeplace_TJK':'塔吉克斯坦','nativeplace_TKM':'土库曼斯坦','nativeplace_TO':'汤加','nativeplace_TRI':'特立尼达和多巴哥','nativeplace_TUN':'突尼斯','nativeplace_TUR':'土尔其','nativeplace_UAE':'阿拉伯联合酋长国','nativeplace_UGA':'乌干达','nativeplace_UKR':'乌克兰','nativeplace_URU':'乌拉圭','nativeplace_USA':'美国','nativeplace_UZB':'乌兹别克斯坦','nativeplace_VEN':'委内瑞拉','nativeplace_VIE':'越南','nativeplace_WLS':'威尔士','nativeplace_YEM':'也门','nativeplace_YUG':'南斯拉夫','nativeplace_ZAM':'赞比亚','nativeplace_ZIM':'津巴布韦','relation_00':'本人','relation_01':'丈夫','relation_02':'妻子','relation_03':'父亲','relation_04':'母亲','relation_05':'儿子','relation_06':'女儿','relation_07':'祖父','relation_08':'祖母','relation_09':'孙子','relation_10':'孙女','relation_11':'外祖父','relation_12':'外祖母','relation_13':'外孙','relation_14':'外孙女','relation_15':'哥哥','relation_16':'姐姐','relation_17':'弟弟','relation_18':'妹妹','relation_19':'公公','relation_20':'婆婆','relation_21':'岳父','relation_22':'岳母','relation_23':'儿媳','relation_24':'女婿','relation_25':'其他亲属','relation_26':'同事','relation_27':'朋友','relation_28':'雇主','relation_29':'雇员','relation_30':'其他','sex_0':'男','sex_1':'女'};
 
    return {
        getQueryStringByName: getQueryStringByName,//获取参数
        alertPopupFun: alertPopupFun,//alert提示框
        loadCodeNameByCode:loadCodeNameByCode,//根据code查name
        loadProductNameByCode:loadProductNameByCode,//根据产品ID查产品name
        loadBankNameByCode:loadBankNameByCode,
        adressSelect:adressSelect,
        analysisXml:function(opts){
            return analysisXml(opts);
        },
        deleteArray:function (opts){
            return deleteArray(opts);
        },
		code : this.code,
        findIndex:findIndex,
        isExist:isExist,
        alertPopupFun2: alertPopupFun2,//alert提示框2
        checkCharge:checkCharge,
        invoateOCR:invoateOCR,
        showLoading:showLoading,
        hideLoading:hideLoading
    }    
})
/**
*未提交保单相关 
* add by genglan
* 2015-1-24
*/
.factory("unFinshedInsurance",function (Variables,CommonFn){
    //未提交列表
    var loadUnFinshedInsurance = function (opts){
        var sql = "select * from T_APPLY WHERE SUBMIT_TIME IS NULL ";
        if("" != opts.searchVal && !!opts.searchVal){
            sql += " and (PRINT_NO like '%"+opts.searchVal+"%' or APPLICANT_NAME like '%"+opts.searchVal+"%' or INSURANT_NAME like '%"+opts.searchVal+"%' )";
        }
        if("" != opts.ID && !!opts.ID){
           sql += " and ID = '"+opts.ID+"'"; 
        }
        if("" != Variables.currentCode){
        	sql += " and AGENT_CODE = '" + Variables.currentCode + "'";
        }
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +" ORDER BY UPDATE_TIME DESC"
        };
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    };
    //已提交保单的预览功能数据
    var loadUnFinshedInsurances = function (opts){        
        var sql = "select * from T_APPLY  ";
       
        if("" != opts.ID && !!opts.ID){
           sql += " WHERE  PRINT_NO = '"+opts.ID+"'"; 
        }
        if("" != Variables.currentCode){
            sql += " and AGENT_CODE = '" + Variables.currentCode + "'";
        }
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +" ORDER BY UPDATE_TIME DESC"
        };

        queryTableDataUseSql(json,function(data){
         
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    };
    //根据保单ID查询投保人、被保人、收益人等信息
    var loadCustomer = function (opts){
        var sql = "select * from T_APPLY WHERE ID = '"+opts.applyID+"'";
        if("" != opts.applicantID && !!opts.applicantID){//查询的是投保人
            sql += " and APPLICANT_ID = '"+opts.applicantID+"'";
        }else if ("" != opts.recognizeeID && !!opts.recognizeeID){//查询的是被保人
            sql += " and INSURANT_ID = '"+opts.recognizeeID+"'";
        }else if("" != opts.benefit && !!opts.benefit){//查询的是受益人 benefit == 1 的时候
            sql += " and IS_BENEFIT = "+opts.benefit;
        }
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +" ORDER BY UPDATE_TIME DESC"
        }; 
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    }
    //根据保单ID查询投保人、被保人、收益人等信息
    var queryCustomer = function (opts){
        var sql = "select * from T_CUSTOMER WHERE APPLY_ID = '"+opts.applyID+"'";
        if("" != opts.applicantID && !!opts.applicantID){//查询的是投保人
            sql += " and CUSTOMER_ID = '"+opts.applicantID+"'";
        }else if ("" != opts.recognizeeID && !!opts.recognizeeID){//查询的是被保人
            sql += " and CUSTOMER_ID = '"+opts.recognizeeID+"'";
        }else if("" != opts.benefit && !!opts.benefit){//查询的是受益人 benefit == 1 的时候
            sql += " and IS_BENEFIT = "+opts.benefit;
        }
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +" ORDER BY UPDATE_TIME DESC"
        }; 
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    }
    //根据客户ID查询投保人、被保人详细信息,分别从10002和10005中查询
    var queryCustomerById = function(opts){
    	var applyID = opts.applyID;
    	var customerId = "";
    	var isBenefit = "";
    	if(opts.applicantID){
    		customerId = opts.applicantID;
    		isBenefit = "0";
    	}else if(opts.recognizeeID){
    		customerId = opts.recognizeeID;
    		isBenefit = "1";
    	}
    	var key = {
			"databaseName": Variables.dataBaseName,
			"tableName": "T_CUSTOMER",
			"conditions": {"CUSTOMER_ID": customerId,"IS_BENEFIT":isBenefit,"APPLY_ID":applyID}
		};
		queryTableDataByConditions(key, function (data1) {
			var tempData = [];
			tempData[0] = data1[0];
			var key_1002 = {
				"databaseName": 'promodel/10002/www/db/esales.sqlite',
				"tableName": "T_CUSTOMER",
				"conditions": {"ID":customerId}
			};
			queryTableDataByConditions(key_1002, function (data2) {
				tempData[1] = data2[0];
	            opts.callBackFun && opts.callBackFun(tempData);
			});
		});
	}
    //查询投保事项（续）中的部分数据
    var loadPayInfo = function(opts){
    	var applyId = opts.applyID;
        var applicantID = opts.applicantID
    	var key = {
				"databaseName": Variables.dataBaseName,
				"tableName": "T_APPLY",
				"conditions": {"ID": applyId}
		};
    	var key_bank = {
    			"databaseName":"promodel/10005/www/db/t_bank.sqlite",
    			"tableName": "T_APP_BANK",
    			"conditions": {"appliantId": applicantID,"isChecked":"true"}
    	};
		queryTableDataByConditions(key, function (data) {
			var tempData = [];
			tempData[0] = data[0];
			queryTableDataByConditions(key_bank, function (data2) {
				tempData[1] = data2[0];
				opts.callBackFun && opts.callBackFun(tempData);
			});
		});
    }
    //根据建议书ID查询险种设计信息
    var loadProductByID = function (opts){
//    alert("查询险种信息参数:"+opts);
//    alert("险种参数——proposalID:"+opts.proposalID);
        var sql = "select * from T_PROPOSAL_PRODUCT WHERE  PROPOSAL_ID = '"+opts.proposalID+"'";
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +" ORDER BY UPDATE_TIME DESC"
        }; 
//      alert("loadProductByID:"+JSON.stringify(json));
        queryTableDataUseSql(json,function(data){
//       alert("loadProductByID_data"+data);
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    }
    //删除
    var iterIndex = 0;
    var deleteData = function (array,opts){
        deleteTableData(array[iterIndex],function(arr){
            iterIndex ++;
            if(iterIndex > array.length - 1){
                opts.callBackFun && opts.callBackFun(arr[0]);
                iterIndex = 0;    
            }else{
                deleteData(array,opts);
            }
            
        },function(){
            console.log('删除出错！');
        });
    }
    //根据保单ID删除当前保单相关信息
    var  deleteInsurance = function(opts){
        if(opts.jsonDataArr.length >0){
            deleteData(opts.jsonDataArr,opts)
        }
    }
    //提交保单到中间平台
    var commitInsurance = function (opts){
        if("" != opts.formID && !!opts.formID){//根据保单ID查询保单详细信息
//        	testCommitInsurance(opts);
        	apply_submit(opts.formID,opts,'getaplyId');
			/**
            loadUnFinshedInsurance({
                ID:opts.formID,
                callBackFun:function (data){
                    if(data && data[0]){

                        var applyInfo = {
                            "agentCode":Variables.currentCode,
                            "applicantName":"张三丰",
                            "applyDetail":"{\"agentImpartList\":[{\"customerType\":\"2\",\"impartCode\":\"A0151\",\"impartContent\":\"朋友\",\"impartFlag\":\"1\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0152\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0153\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0154\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0155\",\"impartContent\":\"业务员推销\",\"impartFlag\":\"2\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0156\",\"impartContent\":\"家庭经济保障\",\"impartFlag\":\"2\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0157\",\"impartContent\":\"10\",\"impartFlag\":\"2\",\"impartVersion\":\"A03\"},{\"customerType\":\"2\",\"impartCode\":\"A0158\",\"impartContent\":\"18310011111\",\"impartFlag\":\"2\",\"impartVersion\":\"A03\"}],\"applicant\":{\"postalAddress\":\"大街10号\",\"postalCity\":\"010\",\"postalCounty\":\"东城区\",\"postalProvince\":\"1\",\"postalZipCode\":\"100000\",\"weiboType\":\"\",\"birthday\":\"1990-11-20\",\"customerId\":\"018611018517141120100653612621\",\"email\":\"\",\"grpName\":\"民生\",\"homeAddress\":\"大街10号\",\"homeCity\":\"010\",\"homeCounty\":\"东城区\",\"homeProvince\":\"1\",\"homeZipCode\":\"100000\",\"idEndDate\":\"2090-11-20\",\"idNo\":\"123456789999\",\"idType\":\"2\",\"income\":\"10.0\",\"incomeWay\":\"1\",\"marriage\":\"0\",\"mobile\":\"18310011111\",\"msn\":\"\",\"nativePlace\":\"CHN\",\"occupationCode\":\"2111901\",\"otherIncomeWay\":\"\",\"phone\":\"010-1111111\",\"pluralityOccupationCode\":\"2111702\",\"qq\":\"\",\"realName\":\"张三丰\",\"relationToMainInsured\":\"00\",\"rgtCity\":\"010\",\"rgtProvince\":\"1\",\"sex\":\"0\",\"weiboNo\":\"\",\"age\":24},\"baseInfo\":{\"accName\":\"张三丰\",\"agentCode\":\"8611018517\",\"autoPayFlag\":\"0\",\"bankAccNo\":\"1111111\",\"bankCode\":\"0101\",\"blessing\":\"\",\"electronicContFlag\":\"N\",\"electronicContPhone\":\"\",\"payIntv\":\"0\",\"payMode\":\"0\",\"printNo\":'"+opts.printNo+"',\"renewAccName\":\"张三丰\",\"renewBankAccNo\":\"1111111\",\"renewBankCode\":\"0101\",\"renewPayMode\":\"0\",\"renewRemindFlag\":\"0\",\"state\":\"-1\"},\"id\":\"018611018517141128153849632781\",\"insurantImpartList\":[{\"customerType\":\"0\",\"impartCode\":\"A0501\",\"impartContent\":\"170/60\",\"impartFlag\":\"2\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0502\",\"impartContent\":\"1/1\",\"impartFlag\":\"1\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0503\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0504\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0505\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0506\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0507\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0508\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0509\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0510\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0511\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0512\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0513\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0514\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0515\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0516\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0517\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0518\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0519\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0520\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0525\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0526\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A05\"},{\"customerType\":\"0\",\"impartCode\":\"A0527\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0528\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0529\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0530\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0531\",\"impartContent\":\"//C照///\",\"impartFlag\":\"1\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0532\",\"impartContent\":\"2次闯红灯\",\"impartFlag\":\"1\",\"impartVersion\":\"A06\"},{\"customerType\":\"0\",\"impartCode\":\"A0533\",\"impartContent\":\"\",\"impartFlag\":\"0\",\"impartVersion\":\"A06\"}],\"insuredList\":[{\"beneficiaryList\":[],\"insuranceList\":[{\"amount\":\"1000000\",\"insuYears\":\"70\",\"insuYearsFlag\":\"A\",\"insurantSeq\":\"1\",\"jobAddFee\":\"\",\"payEndYear\":\"1000\",\"payEndYearFlag\":\"Y\",\"payIntv\":\"0\",\"prem\":\"141540.00\",\"productCode\":\"111301\",\"productDetail\":\"\",\"proposalId\":\"018611018517141128153510380901\",\"seq\":\"1\",\"createTime\":\"2014-11-2815:36:34\",\"id\":128,\"updateTime\":\"2014-11-2815:37:04\"}],\"insurant\":{\"relationToAppnt\":\"00\",\"weiboType\":\"\",\"birthday\":\"1990-11-20\",\"customerId\":\"018611018517141120100653612621\",\"email\":\"\",\"grpName\":\"民生\",\"homeAddress\":\"大街10号\",\"homeCity\":\"010\",\"homeCounty\":\"东城区\",\"homeProvince\":\"1\",\"homeZipCode\":\"100000\",\"id\":115,\"idEndDate\":\"2090-11-20\",\"idNo\":\"123456789999\",\"idType\":\"2\",\"income\":\"10.0\",\"incomeWay\":\"1\",\"marriage\":\"0\",\"mobile\":\"18310011111\",\"msn\":\"\",\"nativePlace\":\"CHN\",\"occupationCode\":\"2111901\",\"otherIncomeWay\":\"\",\"phone\":\"010-1111111\",\"pluralityOccupationCode\":\"2111702\",\"qq\":\"\",\"realName\":\"张三丰\",\"rgtCity\":\"010\",\"rgtProvince\":\"1\",\"sex\":\"0\",\"weiboNo\":\"\",\"age\":24}}],\"proposalId\":\"018611018517141128153510380901\"}",            
                            "insurantName":"张三丰",
                            "sumPrem":"141540.0",
                            "mainProductAmount":"1000000",
                            "mainProductCode":"111301",
                            "mainProductName":"民生安康定期寿险",
                            "mainProductPrem":"141540.00",
                            "printNo":opts.printNo,
                            "proposalId":"018611018517141128153510380901",
                            "state":"-1",
                            "submitTime":"2015-2-12 15:43:00",
                            "sumAmount":"1000000.0",
                            "isNew":"0",
                            "id":"018611018517141128153849632781"
                        }
						//alert("data[0].PROSAL_JSON:" + data[0].PROSAL_JSON)
                        var pjson = eval("("+data[0].PROSAL_JSON+")"); 
                        var proposalPdf = {
                            "insureInterestHtmlCode" : "保险利益的HTML源码",
                            "importantNoteHtmlCode" : "重要提示的HTML源码",
                            "backgroundImage" : "201305212121040726.jpg",
                            "isThanksNote" : "1",
                            "isOpeningWords" : "1",
                            "openingWords":"幸福的家庭和事业,就像插在花瓶里美丽的鲜花.而支撑这一切的花瓶就是您和家人的健康.只有留住花瓶,才能让鲜花四季常开.",
                            "isEndingWords" : "1",
                            "endingWords" : "只有青山在,才会有柴烧.任何财富的制造者都是人,我们需要的是让人得到关照.如果鸡都没有了,哪里会有蛋呢?",
                            "customerMap" : {
                                "NAME" : "张三",
                                "SEX" : "男",
                                "AGE" : "34",
                                "JOB" : "2类职业",
                                "SEXCALL" : "先生"
                            },
                            "agentMap" : {
                                "AGENTCODE" : "1000101010",
                                "NAME" : "mrzhou",
                                "PHONE" : "13088888888",
                                "ORGANIZATION" : "北京分公司"
                            },
                            "insureProductsMap" : pjson["CONTENT"].insureProductsMap,//产品信息
                            "interestDemonstrationTableMap" : pjson["CONTENT"].interestDemonstrationTableMap,//利益演示
                            "isCompanyIntroduction" : "1"
                        } 
						
                        var json = {
                            "url": Variables.serverUrl + "/newbiz", 
                            "parameters": {'applyInfo':applyInfo,'proposalPdf':proposalPdf}
                        };
                        httpRequestByPost(json,
                            function (obj){
                                var returnJson=eval("("+obj+")");
                                opts.callBackFun && opts.callBackFun(returnJson.status);  
                            },function (){
                                CommonFn.alertPopupFun($ionicPopup,'loser','保单提交出错！',3000);
                            }
                        );  
                    }
                }
            });    
			**/
        }    
    }
    var updateInsuranceState = function(opts){
    	var applyId = opts.applyID;
    	var submitTime = opts.submitTime;
    	var sql = "update T_APPLY set SUBMIT_TIME = '"+submitTime+"' WHERE ID = '"+applyId+"'";
        
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql
        }; 
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('更新保单数据出错！');
        });
    }
    //年金关联万能后修改数据
    var updateReleatedInfo = function(opts) {
        var insuraId = opts.insuraId;
        var propsalID = opts.propsalID;
        var recommendId = opts.recommendId;
        var formID = opts.formID;
        var applyNo = opts.applyNo;
        var json = {
            "databaseName":"promodel/10005/www/db/insurance_online.sqlite",
            "sql": "update T_APPLY set IS_RELEATED = '05',REL_APPLYNO = '"+applyNo+"',PRINT_NO = null,ID = '"+insuraId+"',PROPOSAL_ID = '"+recommendId+"' WHERE ID = '"+formID+"'"
        }; 
        var json2 = {
            "databaseName":"promodel/10003/www/db/esales.sqlite",
            "sql": "update T_PROPOSAL set ID = '"+recommendId+"',ISCOMPLETE = 'Y' WHERE ID = '"+propsalID+"'"
        }; 
        var json3 = {
            "databaseName":"promodel/10005/www/db/insurance_online.sqlite",
            "sql": "update T_CUSTOMER set APPLY_ID = '"+insuraId+"',COPY_FRONT = null,COPY_REVERSE = null WHERE APPLY_ID = '"+formID+"'"
        };
        var json4 = {
            "databaseName":"promodel/10003/www/db/esales.sqlite",
            "sql": "update T_PROPOSAL_PRODUCT set PROPOSAL_ID = '"+recommendId+"'WHERE PROPOSAL_ID = '"+propsalID+"'"
        }; 
        var json5 = {
            "databaseName":"promodel/10003/www/db/esales.sqlite",
            "sql": "update T_PROPOSAL_APPNT set PROPOSAL_ID = '"+recommendId+"'WHERE PROPOSAL_ID = '"+propsalID+"'"
        }; 
        var json6 = {
            "databaseName":"promodel/10003/www/db/esales.sqlite",
            "sql": "update T_PROPOSAL_INSURANT set PROPOSAL_ID = '"+recommendId+"'WHERE PROPOSAL_ID = '"+propsalID+"'"
        }; 
        //修改原未提交保单数据及建议书转投保json里的建议书ID
        // if(''!=insuraId && ''!=recommendId && ''!=formID){
        //     queryTableDataUseSql(json,function(data){
        //         var queryApply_SQL = {
        //             "databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
        //             "tableName": "T_APPLY",
        //             "conditions": {"ID": insuraId}//保单ID
        //         };
        //         queryTableDataByConditions(queryApply_SQL, function (data2) {
        //             var obj = data2[0];
        //             var jsonInfo = eval("("+obj.PROSAL_JSON+")");
        //             jsonInfo['PROPOSAL_ID'] = recommendId;
        //             jsonInfo = JSON.stringify(jsonInfo)
        //             var key_sql = {
        //                 "databaseName":"promodel/10005/www/db/insurance_online.sqlite",
        //                 "sql":"update T_APPLY set PROSAL_JSON = '"+jsonInfo+"' WHERE ID = '"+insuraId+"'"
        //             };
        //             queryTableDataUseSql(key_sql,function(data3){
        //             })
        //         })
        //     },function (){
        //         console.log('更新保单数据出错！');
        //     }); 
        // }
        //修改建议书模块4张表中的建议书ID
        if(''!=recommendId && ''!=propsalID){
            queryTableDataUseSql(json2,function(data){
                // alert('03更新成功')
            },function (){
                console.log('更新保单数据出错！');
            });
            queryTableDataUseSql(json4,function(data){
                // alert('4更新成功')
            },function (){
                console.log('更新保单数据出错！');
            });
            queryTableDataUseSql(json5,function(data){
                // alert('5更新成功')
            },function (){
                console.log('更新保单数据出错！');
            });
            queryTableDataUseSql(json6,function(data){
                // alert('6更新成功')
            },function (){
                console.log('更新保单数据出错！');
            }); 
        }
        //修改05模块customer中的保单ID
        if(''!=insuraId  && ''!=formID){
            queryTableDataUseSql(json3,function(data){
                // alert('customer更新成功')
            },function (){
                console.log('更新保单数据出错！');
            });
        }
    }
    //更新保单中部分数据
    var updateInsuranceData = function(opts){
    	var updateApply = {
			"databaseName" : Variables.dataBaseName,
			"tableName" : "T_APPLY",
			"conditions" : [{"ID":opts.applyID}],
			"data": [opts.applyData]
		};
		updateORInsertTableDataByConditions(updateApply, function (data) {
//			alert("data:"+data);
            console.log('更新保单数据成功！');
            opts.callBackFun && opts.callBackFun(data);
		}, function () {
			console.log("保单数据更新失败！");
		});
    }
    //修改原未提交保单数据及建议书转投保json里的建议书ID
    var updateApplyInfo = function (opts) {
        var insuraId = opts.insuraId;
        // var propsalID = opts.propsalID;
        var recommendId = opts.recommendId;
        var formID = opts.formID;
        var applyNo = opts.applyNo;
        var json = {
            "databaseName":"promodel/10005/www/db/insurance_online.sqlite",
            "sql": "update T_APPLY set IS_RELEATED = '05',REL_APPLYNO = '"+applyNo+"',PRINT_NO = null,ID = '"+insuraId+"',PROPOSAL_ID = '"+recommendId+"' WHERE ID = '"+formID+"'"
        }; 
        queryTableDataUseSql(json,function(data){
            // alert('更新成功')
            var queryApply_SQL = {
                "databaseName": 'promodel/10005/www/db/insurance_online.sqlite',
                "tableName": "T_APPLY",
                "conditions": {"ID": insuraId}//保单ID
            };
            queryTableDataByConditions(queryApply_SQL, function (data2) {
                var obj = data2[0];
                var jsonInfo = eval("("+obj.PROSAL_JSON+")");
                jsonInfo['PROPOSAL_ID'] = recommendId;
                jsonInfo = JSON.stringify(jsonInfo)
                var key_sql = {
                    "databaseName":"promodel/10005/www/db/insurance_online.sqlite",
                    "sql":"update T_APPLY set PROSAL_JSON = '"+jsonInfo+"' WHERE ID = '"+insuraId+"'"
                };
                queryTableDataUseSql(key_sql,function(data3){
                    // alert('字段修改成功')
                    opts.callBackFun && opts.callBackFun(data);
                })
            })
            
        },function (){
            console.log('更新保单数据出错！');
        }); 
    }
    return {
        loadUnFinshedInsurance: function (opts) {//根据保单ID查询投保人信息
            return loadUnFinshedInsurance(opts);
        },
        loadUnFinshedInsurances: function (opts) {//根据保单ID查询投保人信息(承保预览)
            return loadUnFinshedInsurances(opts);
        },
        loadCustomer: function (opts) {//根据保单ID查询投保人、被保人、收益人等信息
            return loadCustomer(opts);
        },
        queryCustomer: function (opts) {//根据保单ID查询投保人、被保人、收益人等信息
            return queryCustomer(opts);
        },
        queryCustomerById: function (opts) {//根据客户ID查询投保人、被保人详细信息
            return queryCustomerById(opts);
        },
        loadPayInfo: function (opts) {//查询投保事项（续）中信息
            return loadPayInfo(opts);
        },
        loadProductByID: function (opts) {//根据保单ID查询险种设计信息
            return loadProductByID(opts);
        },
        deleteInsurance: function (opts) {//根据保单ID删除当前保单相关信息
            return deleteInsurance(opts);
        },
        commitInsurance:function (opts){//提交保单到中间平台
            return commitInsurance(opts);
        },
        updateInsuranceState:function (opts){//修改未提交保单提交状态
            return updateInsuranceState(opts);
        },
        updateInsuranceData:function (opts){//修改未提交保单数据
            return updateInsuranceData(opts);
        },
        updateReleatedInfo:updateReleatedInfo,
        updateApplyInfo:function(opts){
            return updateApplyInfo(opts);
        }
    }
})
/**
*已提交保单 
* add by genglan
* 2015-1-24
*/
.factory("submitInsurance",function (Variables,CommonFn,$ionicPopup){
    //查询已经提交的保单列表
    var loadFinishedInsurance = function (opts){
        var json = {
            "url": Variables.serverUrl + "/queryApplyList", 
            "parameters": {"printNo": opts.searchVal,"applyDate":opts.applyDate,"state":opts.state,'pageNo':opts.pageNo}
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                if('0' == returnJson.status.code){
                    var mydata = returnJson.jsonMap.list;
                    //opts.callBackFun && opts.callBackFun(mydata);
                     opts.callBackFun && opts.callBackFun(returnJson); 
                }else{
                    CommonFn.alertPopupFun($ionicPopup,'loser',returnJson.status.msg,3000);
                }  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','查询出错！',3000);
            }
        );
    }
    //查询单个保单
    var loadInsuranceByID = function (opts){
        var json = {
            "url": Variables.serverUrl + "/queryApplyDetail/"+opts.printNo
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                if(0 == returnJson.status.code){
                    var mydata = returnJson.jsonMap.detail;
                    opts.callBackFun && opts.callBackFun(mydata);  
                }else{
                   CommonFn.alertPopupFun($ionicPopup,'loser',returnJson.status.msg,3000);
                }  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','查询出错！',3000);
            }
        );
    }
    //查询保单状态
    var loadInsuranceState = function (opts){
        var json = {
            "url": Variables.serverUrl + "/getApplyState", 
            "parameters": {"printNo": opts.printNo}
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                if(0 == returnJson.status.code){
                    var mydata = returnJson.jsonMap;
                    opts.callBackFun && opts.callBackFun(mydata);  
                }else{
					closeLoadingWait();
                	myAlert(returnJson.status.msg);
                    //CommonFn.alertPopupFun($ionicPopup,'loser',returnJson.status.msg,3000);
                }  
            },function (){
            	//alert("查询出错！");
                closeLoadingWait();
                CommonFn.alertPopupFun($ionicPopup,'loser','查询出错！',3000);
            }
        );  
    }
    //保存其他收费方式
    var saveOtherChargeWay = function (opts){
        var json = {
            "url": Variables.serverUrl + "/updateBankInfo", 
            "parameters": {'printNo': opts.printNo,"bankCode":opts.bankCode,'bankAccNo':opts.bankAccNo,'bankProvince':opts.bankProvince,'bankCity':opts.bankCity,'bankSubType':opts.bankSubType,'rel_applyNo':opts.rel_applyNo}
        };
        httpRequestByPost(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                opts.callBackFun && opts.callBackFun(returnJson.status);  
            },function (){
                closeLoadingWait();
                CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
            }
        );  
    }
    //收费
    var chargeFun = function(opts){
        var json = {
            "url": Variables.serverUrl + "/payMent", 
            "parameters": {'printNo': opts.printNo,"bankCode":opts.bankCode,'bankAccNo':opts.bankAccNo,'bankProvince':opts.bankProvince,'bankCity':opts.bankCity,"bankSubType":opts.bankSubType,"bankPhone":opts.bankPhone,"rel_applyNo":opts.rel_applyNo}
        };
        httpRequestByPost(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                opts.callBackFun && opts.callBackFun(returnJson.status);  
            },function (){
                closeLoadingWait();
                CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
            }
        );
    }
    //撤单
    var showRevokeFun = function(opts){
        var json = {
            "url": Variables.serverUrl + "/drawBack", 
            "parameters": {'printNo': opts.printNo,"drawbackReason":opts.drawbackReason}
        };
        httpRequestByPost(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                opts.callBackFun && opts.callBackFun(returnJson.status);  
            },function (errorInfo){   
                closeLoadingWait();             
                CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试！',3000);
                // var returnJson = {"code":"5","msg":"网络异常，请稍候重试"};
                // opts.callBackFun && opts.callBackFun(returnJson);
            }
        );
    }
    //查询收费状态
    var queryChargeState = function(opts){
        var json = {
            "url": Variables.serverUrl + "/getFeeInfo", 
            "parameters": {'printNo': opts.printNo}
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                opts.callBackFun && opts.callBackFun(returnJson.status);  
            },function (){
                closeLoadingWait();
                CommonFn.alertPopupFun($ionicPopup,'loser','网络异常，请稍候重试',3000);
            }
        );
    }
    //查询保单基本信息
    var getInsuranceInfo = function(opts){

        opts.callBackFun && opts.callBackFun(opts.insuranceInfo);  
    }
    //修改其他App 的数据(客户和建议书)
    var updateOtherAppDb = function (opts){
        if("" != opts.propsalID){//去修改建议书的状态
            var key = {
                "databaseName":"promodel/"+Variables.recommendAppId+"/www/db/esales.sqlite",
                "tableName":"T_PROPOSAL",
                "conditions":[{"ID":opts.propsalID}],
                "data":[{"ISCOMPLETE":"Y"}]
            }
            updateTableData(key,function (str){
//            	alert("修改建议书状态："+str);
                console.log("提交保单后修改建议书数据状态！"+str);
            },function (){
                console.log("建议书状态修改异常！");
            });   
        }
        if ("" != opts.formID) {//去修改客户数据状态
            var sql = "select CUSTOMER_ID from T_CUSTOMER WHERE  APPLY_ID = '"+opts.formID+"'";
            var json = {
                "databaseName":Variables.dataBaseName,
                "sql": sql
            }; 
            queryTableDataUseSql(json,function(data){
//            	alert("T_CUSTOMER:"+data);
                if(data){
                    var conArray = new Array();
                    var dataArray = new Array();
                    var dataMap = {};
                    for (var i = data.length - 1; i >= 0; i--) {
                        var conMap = {};
                        conMap["ID"] = data[i].CUSTOMER_ID; 
                        conArray.push(conMap); 
                        dataMap["TYPE"] = "01"; 
                        dataArray.push(dataMap);
                    };
                    var key2 = {
                        "databaseName":"promodel/"+Variables.customerAppId+"/www/db/esales.sqlite",
                        "tableName":"T_CUSTOMER",
                        "conditions":conArray,
                        "data":dataArray
                    }
                    updateTableData(key2,function (str){
//                    	alert("提交保单后修改客户数据状态:"+str);
                        console.log("提交保单后修改客户数据状态！"+str);
                    },function (){
                        console.log("客户状态修改异常！");
                    });
                }
            },function (){
                console.log('查询出错！');
            });
        }
    }
    return {
        loadFinishedInsurance: function (opts) {//根据保单ID查询投保人信息
            return loadFinishedInsurance(opts);
        },
        loadInsuranceByID:function (opts){//根据保单ID查找保单详细信息
            return loadInsuranceByID(opts);
        },
        saveOtherChargeWay:function (opts){//其他收费方式
            return saveOtherChargeWay(opts);
        },
        chargeFun:function (opts){//保单收费
            return chargeFun(opts);
        },
        loadInsuranceState:function (opts){//查询保单状态
            return loadInsuranceState(opts);
        },
        showRevokeFun:function (opts){//撤单
            return showRevokeFun(opts);
        },
        queryChargeState:function (opts){//查询收费状态
            return queryChargeState(opts);
        },
        getInsuranceInfo:function (opts){//查询保单详情
            return getInsuranceInfo(opts);
        },
        updateOtherAppDb:updateOtherAppDb
    }
});