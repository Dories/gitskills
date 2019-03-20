// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','starter.filters'])
.run(function($ionicPlatform,setVariables,initData) {
  $ionicPlatform.ready(function() {
    setVariables.setVariablesData();//给变量赋值 应有独立打包的时候记得这行注释掉 add by genglan  
    initData.loadAllCode();//初始化代码 add by genglan
    initData.loadProductJson();//解析product add by genglan
    //初始化银行 add by genglan
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

	//判断设备类型
	function getQueryStringByName(name){
		var url = window.location.href;
		var lastStr = url.split('?')[1];
		if(!lastStr){
			return '';
		};
		var dataArr = lastStr.split('&');
		var resultJson = {};

		for(var i = 0; i<dataArr.length; i++){
			var newArr = dataArr[i].split('=');
			resultJson[newArr[0]] = newArr[1]
		};

		if(name in resultJson){
			return resultJson[name].split('#')[0];
		}else{
			return '';
		};
	}
	
	

	var url=document.URL;
	var omap = {};
	var para="";  
	if(url.lastIndexOf("?")>0){
	         para=url.substring(url.lastIndexOf("?")+1,url.length);	
	         var arr=para.split("&");
	         for(var i=0;i<arr.length;i++){
	         	omap[arr[i].split("=")[0]] = arr[i].split("=")[1]; 
	         }		 
	}   
	var pcType = omap["pctype"]; 

	if(omap["platform"]){
			pcType = omap["platform"];
	} 
	document.getElementById("pctype").value = pcType;
	DEVICE_TYPE = pcType;

    $stateProvider
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller:'MainCtrl'
    })
    .state('question_menu', {  //问题卷左侧菜单栏 add by wangzj
      url: "/question_menu/:prtSeq",//
      abstract: true,
      templateUrl: "templates/question_menu.html",
      controller:'QuestionMenuCtrl'
    })
    /************未提交保单  pad版 add by genglan ******/
	if(pcType == '' || pcType == 'pad'){
        $stateProvider
        .state('menu.question', {//问题件列表 add by wangzj
          url: "/question_list",
          views: {
            'menuContent' :{
              templateUrl: "templates/question_list.html",
              controller:'QuestionCtrl'
            },
            'submitContent@menu.question' :{
              templateUrl: "templates/none.html"
            }
          }
        })
        .state('menu.question.underwirting',{//核保通知书 
          url:"/underwirting_list/:prtSeq/:appntTel/:code/:prtNo/:manageCom",
          views:{
             'submitContent@menu.question' :{
                templateUrl: "templates/underwirting_list.html",
                controller:'UnderwirtingCtrl'
             }
          }          
        })
        .state('question_menu.question_main', {//问题卷 add by wangzj
        url: "/question_main/",
        views: {
          'menuContent' :{
            // 'submitContent@menu.question' :{
                templateUrl: "templates/question_main.html",
                controller:'QuestionMainCtrl'
            // }          
          }
        }
      })
        .state('menu.receipt', {//回执列表 add by wangzj
          url: "/receipt_list",
          views: {
            'menuContent' :{
              templateUrl: "templates/receipt_list.html",
              controller:'ReceiptCtrl'
            },
            'submitContent@menu.receipt' :{
              templateUrl: "templates/none.html"
            }
          }
        })
        .state('menu.receipt.duanxin', {//回执列表 add by wangzj
          url: "/duanxin/:applicantMobile/:agentCode/:issueTime/:contNo/:applyNo",
          views: {
            'submitContent@menu.receipt' :{
              templateUrl: "templates/duanxin.html",
              controller:'DuanPass'
            }
          }
        })
        .state('menu.receipt.huizhi', {//回执列表 add by wangzj
          url: "/huizhi/:applicantMobile/:agentCode/:issueTime/:contNo/:applyNo",
          views: {
            'submitContent@menu.receipt' :{
              templateUrl: "templates/huizhidan.html",
              controller:'HuiZhi'
            }
          }
        })
        .state('menu.list', {//未提交保单 add by genglan
        url: "/list",
        views: {
          'menuContent' :{
            templateUrl: "templates/menu_list.html",
            controller:'MenuCtrl'
          },
          'dataContent@menu.list' :{
            templateUrl: "templates/none.html"
          }
        }
      }) 
      .state('menu.list.data_view', {//未提交保单详情 add by genglan
        url: "/data_view/:insuranceID/:proposalID/:applicantID/:recognizeeID/:isreleated",//保单ID 建议书ID 投保人ID 、被保人ID
        views: {
          'dataContent@menu.list' :{
            templateUrl: "templates/data_view.html",
            controller:'DataCtrl'
          }
        }
      })
      .state('insure_needknow',{//跳转去在线投保须知
        url: "/insure_needknow/:applyid/:isreleated",
        templateUrl: "templates/insure_needknow.html",
        controller:'NeedKnowCtrl'
      })
			/*.state('test',{//跳转去在线投保须知
				url: "/test",
				templateUrl: "templates/test.html",
				controller:'TestCtrl'
			})*/
      /************已提交保单  pad版 ******/
      .state('menu.submit', {//已提交保单列表 add by genglan
        url: "/submit_list",
        views: {
          'menuContent' :{
            templateUrl: "templates/submit_list.html",
            controller:'InsuranceCtrl'
          },
          'submitContent@menu.submit' :{
            templateUrl: "templates/none.html"
          }
        }
      })
      .state('menu.submit.insurance_outline', {//已提交保单详情 add by genglan
        url: "/insurance_outline/:indexNo",
        views: {
          'submitContent@menu.submit' :{
            templateUrl: "templates/insurance_outline.html",
            controller:'InsuranceDataCtrl'
          }
        }
      })
      .state('menu.submit.insurance_preview', {//已提交保单预览 add by renxiaomin
          url: "/insurance_preview/:printNo/:indexNo",
          views: {
            'submitContent@menu.submit' :{
              templateUrl: "templates/insurance_preview.html",
              controller:'InsurancePreviewCtrl'
            }
          }
      })
    }else{
      $stateProvider
      .state('menu.question', {//问题件列表 add by wangzj
        url: "/question_list",
        views: {
          'menuContent' :{
            templateUrl: "templates/question_list.html",
            controller:'QuestionCtrl'
          }
        }
      })
      .state('underwirting',{//核保通知书 
          url:"/underwirting_list/:prtSeq/:appntTel/:code/:prtNo/:manageCom",
          templateUrl: "templates/underwirting_list.html",
          controller:'UnderwirtingCtrl'
      })
      .state('menu.receipt', {//回执列表 add by wangzj
        url: "/receipt_list",
        views: {
          'menuContent' :{
            templateUrl: "templates/receipt_list.html",
            controller:'ReceiptCtrl'
          }
        }
      })
      .state('duanxin', {//回执列表 add by wangzj
        url: "/duanxin/:applicantMobile/:agentCode/:issueTime/:contNo/:applyNo",
        templateUrl: "templates/duanxin.html",
        controller:'DuanPass'
      })
      .state('huizhi', {//回执列表 add by wangzj
        url: "/huizhi/:applicantMobile/:agentCode/:issueTime/:contNo/:applyNo",
        templateUrl: "templates/huizhidan.html",
        controller:'HuiZhi'
      })
      .state('menu.list', {//未提交保单列表 add by genglan
        url: "/list",
        views: {
          'menuContent' :{
            templateUrl: "templates/menu_list.html",
            controller:'MenuCtrl'
          }
        }
      }) 
      .state('data_view', {//未提交保单详情 add by genglan
        url: "/data_view/:insuranceID/:proposalID/:applicantID/:recognizeeID/:isreleated",
        templateUrl: "templates/data_view.html",
        controller:'DataCtrl'
      }) 
      .state('insure_needknow',{//跳转去在线投保须知
        url: "/insure_needknow/:applyid/:isreleated",
        templateUrl: "templates/insure_needknow.html",
        controller:'NeedKnowCtrl'
      })
      //已提交保单
      .state('menu.submit', {//已提交保单列表 add by genglan
        url: "/submit_list",
        views: {
          'menuContent' :{
            templateUrl: "templates/submit_list.html",
            controller:'InsuranceCtrl'
          }
        }
      }) 
      .state('question_menu.question_main', {//问题卷 add by wangzj
        url: "/question_main",
        views: {
          'menuContent' :{
            templateUrl: "templates/question_main.html",
            controller:'QuestionMainCtrl'
          }
        }
      })
     .state('insurance_outline', {//已提交保单详情 add by genglan
        url: "/insurance_outline/:indexNo",
        templateUrl: "templates/insurance_outline.html",
        controller:'InsuranceDataCtrl'
      })
     .state('insurance_preview', {//已提交保单预览 add by renxiaomin
          url: "/insurance_preview/:printNo/:indexNo",           
          templateUrl: "templates/insurance_preview.html",
          controller:'InsurancePreviewCtrl'          
      })
    }
    $urlRouterProvider.otherwise('/menu/list');//默认走的是已提交保单列表
});

