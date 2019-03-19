/**
 * Created by 867123882 on 2018-5-8.
 */

function problemValidate() {
    var impartDiv = $('[id^=problempieces_]');
    var returnValue = 1;
    if (impartDiv.length > 0) {


        for (var i = 0; i < impartDiv.length; i++) {
            var $questionObj = $(impartDiv[i]);
            var titleText = $questionObj.find(".question_title").text();

            var typeIndex = $questionObj.attr("id").split("_")[1];


            //问卷调查校验
            $questionObj.find(".impartTable tr").each(function (index) {
                var questionIndex = index + 1;

                if ($(this).find("td").length == 1 && typeIndex != '14' && typeIndex != '23' && typeIndex != '24' && typeIndex != "36" && typeIndex != "37" && typeIndex != "26" && typeIndex != "31" && typeIndex != "32" && typeIndex != "38" && typeIndex != "39") {

                    var $small_text_list = $(this).find(".small_text_input");

                    for (var j = 0; j < $small_text_list.length; j++) {
                        if ($(this).find(".small_text_input").eq(j).val() == "" && typeIndex != "17" && typeIndex != "28" && typeIndex != "10" && typeIndex != "13") {

                            myAlert(titleText + "调查题目" + questionIndex + "没有填写完整！");
                            returnValue = 0;
                            break;

                        }
                    }

                    if (returnValue == 0) {
                        return false;
                    }


                    var $checkbox_list_length = $(this).find(".checkboxStyleOfImpart").length;
                    var $checkbox_length = $(this).find(".checkboxStyleOfImpart:checked").length;

                    if (($checkbox_length == 0) && ($checkbox_list_length > 0) && (typeIndex != "3") && (questionIndex != 3)) {

                        myAlert(titleText + "调查题目" + questionIndex + "没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_1_2_b").attr("checked") && $("#A_1_2_01").val() == "") {
                        myAlert(titleText + "调查题目2如果勾选疾病,疾病名称，下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#A_1_2_g").attr("checked") && $("#A_1_2_02").val() == "") {
                        myAlert(titleText + "调查题目2如果勾选其他，下面输入框必填！");
                        returnValue = 0;
                        return false;

                    }


                    if ($("#A_1_3_h").attr("checked") && $("#A_1_3_text").val() == "") {
                        myAlert(titleText + "调查题目3如果勾选多重残疾，下面输入框必填！");
                        returnValue = 0;
                        return false;

                    }

                    //残疾问卷
                    if (($("#A_1_4_yes").attr("checked") || $("#A_1_5_yes").attr("checked") || $("#A_1_6_yes").attr("checked") ||
                        $("#A_1_7_yes").attr("checked") || $("#A_1_8_yes").attr("checked") || $("#A_1_9_yes").attr("checked") ||
                        $("#A_1_10_yes").attr("checked")) && $("#A_1_10_01").val().trim() == "") {

                        myAlert(titleText + "调查题目4到10有一个勾选的是，详细告知为必填！");
                        returnValue = 0;
                        return false;

                    }

                    //癫痫问卷
                    if (($("#A_2_3_yes").attr("checked") || $("#A_2_4_yes").attr("checked") || $("#A_2_5_yes").attr("checked") ||
                        $("#A_2_6_yes").attr("checked") || $("#A_2_7_yes").attr("checked") || $("#A_2_8_yes").attr("checked") || $("#A_2_9_yes").attr("checked")
                        || $("#A_2_10_yes").attr("checked") || $("#A_2_11_yes").attr("checked")) && $("#A_2_12_01").val().trim() == "") {

                        myAlert(titleText + "调查题目4到10有一个勾选的是，详细告知为必填！");
                        returnValue = 0;
                        return false;

                    }

                    //甲状腺疾病问卷
                    if ($("#A_6_1_text1").val() == "") {
                        myAlert("甲状腺疾病问卷调查题目1首次诊断为必填！");
                        returnValue = 0;
                        return false;
                    }


                    //颈腰椎疾病问卷
                    if ($("#A_7_4_a").attr("checked") == false && $("#A_7_4_b").attr("checked") == false) {
                        myAlert(titleText + "调查题目4疼痛部位没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_7_4_01").attr("checked") == false && $("#A_7_4_02").attr("checked") == false) {
                        myAlert(titleText + "调查题目4活动是否受限没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    //女性健康问卷
                    if (typeIndex == "10") {
                        if ($("#A_10_4_01").val().trim() == "" || $("#A_10_4_02").val().trim() == "" || $("#A_10_4_03").val().trim() == "") {
                            myAlert("女性健康问卷调查题目4没有填写完整！");
                            returnValue = 0;
                            return false;
                        }
                    }


                    //机动车驾驶执照持有者问卷
                    if (typeIndex == "28") {

                        if ($("#C_6_1_07").attr("checked") && ($("#C_6_1_08").val().trim() == "")) {
                            myAlert(titleText + "调查题目1勾选其他下面输入框必填！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#C_6_2_04").attr("checked") && ($("#C_6_2_05").val().trim() == "")) {
                            myAlert(titleText + "调查题目1勾选其他下面输入框必填！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#C_6_4_02").attr("checked") && ($("#C_6_4_03").val().trim() == "")) {
                            myAlert(titleText + "调查题目4勾选每月后面输入框必填！");
                            returnValue = 0;
                            return false;
                        }
                        if ($("#C_6_4_04").attr("checked") && ($("#C_6_4_05").val().trim() == "")) {
                            myAlert(titleText + "调查题目4勾选其每周后面输入框必填！");
                            returnValue = 0;
                            return false;
                        }
                        if ($("#C_6_4_06").attr("checked") && ($("#C_6_4_07").val().trim() == "")) {
                            myAlert(titleText + "调查题目4勾选不确定后面输入框必填！");
                            returnValue = 0;
                            return false;
                        }


                        if ($("#C_6_5_02").attr("checked") && ($("#C_6_5_03").attr("checked") == false) && ($("#C_6_5_04").attr("checked") == false)) {
                            myAlert(titleText + "调查题目5勾选自用下面也需要勾选！");
                            returnValue = 0;
                            return false;
                        }


                        if ($("#C_6_5_04").attr("checked") && ($("#C_6_5_05").val().trim() == "")) {
                            myAlert(titleText + "调查题目5勾选其他后面输入框必填！");
                            returnValue = 0;
                            return false;
                        }


                        if ($("#C_6_5_06").attr("checked") && ($("#C_6_5_07").val().trim() == "")) {
                            myAlert(titleText + "调查题目5勾选专职司机后面输入框必填！");
                            returnValue = 0;
                            return false;
                        }
                        if ($("#C_6_5_08").attr("checked") && ($("#C_6_5_09").val().trim() == "")) {
                            myAlert(titleText + "调查题目5勾选兼职司机后面输入框必填！");
                            returnValue = 0;
                            return false;
                        }


                    }

                    //肝脏疾病问卷
                    if (typeIndex == "03")
                    {

                        if ($("#A_3_2_g").attr("checked") && $("#A_3_2_01").val().trim() == "") {
                            myAlert(titleText + "调查题目2勾选其它下面输入框必填！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#A_3_2_b").attr("checked") && (($("#A_3_3_a").attr("checked") == false) && ($("#A_3_3_b").attr("checked") == false) && ($("#A_3_3_c").attr("checked") == false))) {
                            myAlert(titleText + "调查题目2勾选勾选乙肝，调查题目3必填！");
                            returnValue = 0;
                            return false;
                        }
                    }

                    //视力问卷
                    if(typeIndex=="13")
                    {
                        if ($("#A_13_1_a").attr("checked") == false && $("#A_13_1_b").attr("checked") == false && $("#A_13_1_c").attr("checked") == false && $("#A_13_1_d").attr("checked") == false) {
                            myAlert(titleText + "调查题目1左眼没有勾选！");
                            returnValue = 0;
                            return false;
                        }


                        if ($("#A_13_1_e").attr("checked") == false && $("#A_13_1_f").attr("checked") == false && $("#A_13_1_g").attr("checked") == false && $("#A_13_1_h").attr("checked") == false) {
                            myAlert(titleText + "调查题目1右眼没有勾选！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#A_13_1_01").val() == "" || $("#A_13_1_02").val() == "" || $("#A_13_1_03").val() == "" || $("#A_13_1_04").val() == "" || $("#A_13_1_05").val() == "" || $("#A_13_1_06").val() == "") {
                            myAlert(titleText + "调查题目1没有填写完整！");
                            returnValue = 0;
                            return false;
                        }
                        if (($("#A_13_2_a").attr("checked") == false) && ($("#A_13_2_b").attr("checked") == false)) {
                            myAlert(titleText + "调查题目2勾选先天性和后天性必须勾选一项！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#A_13_2_b").attr("checked") && (
                            ($("#A_13_2_04").attr("checked") == false) && ($("#A_13_2_05").attr("checked") == false) &&
                            ($("#A_13_2_06").attr("checked") == false) && ($("#A_13_2_07").attr("checked") == false))) {
                            myAlert(titleText + "调查题目2勾选后天性，下面也需要勾选！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#A_13_2_b").attr("checked") && (($("#A_13_2_01").val() == "") || ($("#A_13_2_year").val() == "") || ($("#A_13_2_month").val() == ""))) {
                            myAlert(titleText + "调查题目2勾选后天性，起始时间和诊断结果必填！");
                            returnValue = 0;
                            return false;
                        }


                        if ($("#A_13_3_01").val() == "") {
                            myAlert(titleText + "调查题目3没有填写！");
                            returnValue = 0;
                            return false;
                        }

                    }

                    //赛车问卷
                    if (typeIndex == "29") {
                        if ($("#C_4_1_a_type").val() == "" || $("#C_4_1_b_type").val() == "" || $("#C_4_1_c_type").val() == "") {
                            myAlert(titleText + "调查题目1没有填写完整！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#C_4_3_c").attr("checked") && $("#C_4_3_01").val() == "") {
                            myAlert(titleText + "调查题目3勾选其他，下面输入框必填！");
                            returnValue = 0;
                            return false;
                        }
                    }

                    //出国人员问卷
                    if (typeIndex == "27") {

                        if($("#C_9_1_content").val()=="")
                        {
                            myAlert(titleText + "调查题目1没有填写！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#C_9_2_j").attr("checked") && $("#C_9_2_01").val() == "") {
                            myAlert(titleText + "调查题目2勾选其他下面输入框必填！");
                            returnValue = 0;
                            return false;
                        }

                        if ($("#C_9_3_job_title").val() == "" || $("#C_9_3_content").val() == "") {
                            myAlert(titleText + "调查题目3输入框没有填写完整！");
                            returnValue = 0;
                            return false;
                        }
                    }

                }

                else if ($(this).find("td").length == 2 && typeIndex != '23' && typeIndex != '24' && typeIndex != "36" && typeIndex != "37" && typeIndex != "26" && typeIndex != "31" && typeIndex != "32" && typeIndex != "38" && typeIndex != "39") {
                    var tdFirstchild = $(this).find("td").eq(0);
                    var tdLastchild = $(this).find("td").eq(1);


                    var $checkbox_list_length = tdLastchild.find(".checkboxStyleOfImpart").length;
                    var $checkbox_length = tdLastchild.find(".checkboxStyleOfImpart:checked").length;


                    //console.log(titleText+"调查题目"+questionIndex+"没有勾选！"+$checkbox_length+"###########"+$checkbox_list_length);

                    var checkIndex = questionIndex;
                    if (typeIndex == '01' && questionIndex > 10) {
                        checkIndex = questionIndex - 1;
                    }
                    else if (typeIndex == '02' && questionIndex > 11) {
                        checkIndex = questionIndex - 1;
                    }
                    else if (typeIndex == '03' && questionIndex > 15) {
                        checkIndex = questionIndex - 1;
                    }
                    else if (typeIndex == '04' && questionIndex > 14) {
                        checkIndex = questionIndex - 1;
                    }
                    else if ((typeIndex == '05' && questionIndex > 12) || (typeIndex == '06' && questionIndex > 13) || (typeIndex == '07' && questionIndex > 13) || (typeIndex == '08' && questionIndex > 13) || (typeIndex == '09' && questionIndex > 10) || (typeIndex == '10' && questionIndex > 11)
                        || (typeIndex == '11' && questionIndex > 11) || (typeIndex == '12' && questionIndex > 11) || (typeIndex == '13' && questionIndex > 7) || (typeIndex == '15' && questionIndex > 16) || (typeIndex == '17' && questionIndex > 9) || (typeIndex == '18' && questionIndex > 15)
                        || (typeIndex == '20' && questionIndex > 12) || (typeIndex == '21' && questionIndex > 11) || (typeIndex == '22' && questionIndex > 6) || (typeIndex == '25' && questionIndex > 11)) {
                        checkIndex = questionIndex - 1;
                    }

                    if (($checkbox_length == 0) && ($checkbox_list_length > 0)) {
                        myAlert(titleText + "调查题目" + checkIndex + "没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    var rightCheckValue = tdLastchild.find(".checkboxStyleOfImpart:checked").val();


                    if ((rightCheckValue == "1" && questionIndex != 6 && typeIndex == '01') || (rightCheckValue == "0" && questionIndex == 6 && typeIndex == '01') || (rightCheckValue == "1" && typeIndex != '01')) {
                        var tdFirstchildCheckboxLength = tdFirstchild.find(".checkboxStyleOfImpart").length;
                        var tdFirstchildCheckedLength = tdFirstchild.find(".checkboxStyleOfImpart:checked").length;


                        if ((tdFirstchildCheckedLength == 0) && (tdFirstchildCheckboxLength > 0)) {
                            myAlert(titleText + "调查题目" + questionIndex + "左边选项至少勾选一项！");
                            returnValue = 0;
                            return false;
                        }


                        if (tdFirstchild.find("textarea").length > 0 && tdFirstchild.find("textarea").val().trim() == ""&&typeIndex!="27") {
                            myAlert(titleText + "调查题目" + checkIndex + "左边没有填写完整！");
                            returnValue = 0;
                            return false;
                        }

                        var inputTextList = tdFirstchild.find(".text-style");
                        for (var j = 0; j < inputTextList.length; j++) {

                            if ((tdFirstchild.find(".text-style").eq(j).val().trim() == "" && questionIndex != 8 && typeIndex == '01')) {

                                var checkIndex = questionIndex;
                                if (typeIndex == '01' && questionIndex > 10) {
                                    checkIndex = questionIndex - 1;
                                }
                                else if (typeIndex == '02' && questionIndex > 11) {
                                    checkIndex = questionIndex - 1;
                                }

                                myAlert(titleText + "调查题目" + checkIndex + "左边没有填写完整！");
                                returnValue = 0;
                                break;
                            }

                            if ((tdFirstchild.find(".text-style").eq(j).val() == "" && questionIndex != 7 && typeIndex == '02')) {
                                myAlert(titleText + "调查题目" + questionIndex + "左边没有填写完整！");
                                returnValue = 0;
                                break;
                            }


                            if (tdFirstchild.find(".text-style").eq(j).val().trim() == "" && typeIndex == '03' && questionIndex != 2 && questionIndex != 6 && questionIndex != 7) {
                                myAlert(titleText + "调查题目" + questionIndex + "左边没有填写完整！");
                                returnValue = 0;
                                break;
                            }


                            if ((tdFirstchild.find(".text-style").eq(j).val() == "" && questionIndex != 11 && typeIndex == '04')) {
                                myAlert(titleText + "调查题目" + questionIndex + "左边没有填写完整！");
                                returnValue = 0;
                                break;
                            }


                        }


                        if (returnValue == 0) {
                            return false;
                        }

                        //残疾问卷调查
                        if (typeIndex == '01') {
                            if ($("#A_1_8_04").attr("checked") && $("#A_1_8_05").val() == "") {
                                myAlert(titleText + "调查题目8如果勾选其他 ，下面输入框必填！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_1_11_yes").attr("checked") && $("#A_1_11_01").val().trim() == "") {
                                myAlert(titleText + "调查题目11左边没有填写！");
                                returnValue = 0;
                                return false;
                            }

                        }


                        //癫痫问卷调查
                        if (typeIndex == '02') {
                            if ($("#A_2_7_yes").attr("checked")) {


                                if ($("#A_2_7_001").attr("checked") == false && $("#A_2_7_002").attr("checked") == false) {
                                    myAlert(titleText + "调查题目7长期服药治疗和间歇服药治疗必须填写一项！");
                                    returnValue = 0;
                                    return false;
                                }


                                if ($("#A_2_7_001").attr("checked") && $("#A_2_7_01").val().trim() == "" && $("#A_2_7_02").val().trim() == "" && $("#A_2_9_03").val().trim() == "") {

                                    myAlert(titleText + "调查题目7左边没有填写完整！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_2_7_002").attr("checked") && $("#A_2_7_04").val().trim() == "" && $("#A_2_7_05").val().trim() == "" && $("#A_2_9_06").val().trim() == "") {

                                    myAlert(titleText + "调查题目7左边没有填写完整！");
                                    returnValue = 0;
                                    return false;
                                }

                            }

                            if ($("#A_2_13_01").val().trim() == "" && $("#A_2_13_yes").attr("checked")) {
                                myAlert(titleText + "调查题目12左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                        }


                        //肝脏疾病携带问卷
                        if (typeIndex == '03') {

                            if ($("#A_3_6_010").attr("checked") && $("#A_3_6_01").val().trim() == "") {
                                myAlert(titleText + "调查题目6勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_3_7_08").attr("checked") && $("#A_3_7_01").val().trim() == "") {
                                myAlert(titleText + "调查题目7勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_3_12_yes").attr("checked")) {

                                if (($("#A_3_12_01").val().trim() == "") || ($("#A_3_12_07").val().trim() == "")) {
                                    myAlert(titleText + "调查题目12左边输入框没有填写完整！");
                                    returnValue = 0;
                                    return false;
                                }

                            }


                            if (($("#A_3_6_yes").attr("checked") || $("#A_3_7_yes").attr("checked") || $("#A_3_8_yes").attr("checked") || $("#A_3_9_yes").attr("checked") ||
                                $("#A_3_10_yes").attr("checked") || $("#A_3_11_yes").attr("checked") || $("#A_3_12_yes").attr("checked") ||
                                $("#A_3_13_yes").attr("checked") || $("#A_3_14_yes").attr("checked")) && $("#A_3_14_01").val().trim() == "") {

                                myAlert(titleText + "调查题目6到14有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_3_15_01").val().trim() == "" && $("#A_3_15_yes").attr("checked")) {
                                myAlert(titleText + "调查题目15左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //高血压问卷
                        if (typeIndex == '04') {


                            if ($("#A_4_11_05").attr("checked") && $("#A_4_11_01").val().trim() == "") {
                                myAlert(titleText + "调查题目11勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_4_12_yes").attr("checked") && $("#A_4_12_01").val().trim() == "" && $("#A_4_12_02").val().trim() == "" && $("#A_4_12_03").val().trim() == "") {
                                myAlert(titleText + "调查题目12左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_4_13_yes").attr("checked") && $("#A_4_13_01").val().trim() == "" && $("#A_4_13_02").val().trim() == "") {
                                myAlert(titleText + "调查题目13左边饮酒量没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_4_6_yes").attr("checked") || $("#A_4_7_yes").attr("checked") || $("#A_4_8_yes").attr("checked") ||
                                $("#A_4_9_yes").attr("checked") || $("#A_4_10_yes").attr("checked") || $("#A_4_11_yes").attr("checked") ||
                                $("#A_4_12_yes").attr("checked") || $("#A_4_13_yes").attr("checked")) && $("#A_4_13_06").val().trim() == "") {

                                myAlert(titleText + "调查题目6到13有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_4_14_01").val().trim() == "" && $("#A_4_14_yes").attr("checked")) {
                                myAlert(titleText + "调查题目14左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                        }


                        //呼吸系统疾病问卷
                        if (typeIndex == '05') {

                            if ($("#A_5_2_text1").val() == "" || $("#A_5_2_text2").val() == "") {
                                myAlert(titleText + "调查题目2输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_5_3_s").attr("checked") && $("#A_5_3_01").val().trim() == "") {
                                myAlert(titleText + "调查题目3勾选其它症状下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_5_4_yes").attr("checked") && ($("#A_5_4_01").val().trim() == "" || $("#A_5_4_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目4左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_5_6_yes").attr("checked") && ($("#A_5_6_01").val().trim() == "" || $("#A_5_6_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目6左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_5_7_yes").attr("checked")) {
                                if ($("#A_5_7_05").attr("checked") && $("#A_5_7_01").val().trim() == "") {
                                    myAlert(titleText + "调查题目7左边勾选服药治疗下面的药物名称不能为空！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_5_7_07").attr("checked") && ($("#A_5_7_03").val().trim() == "" || $("#A_5_7_04").val().trim() == "")) {
                                    myAlert(titleText + "调查题目7左边勾选手术治疗下面的输入框不能为空！");
                                    returnValue = 0;
                                    return false;
                                }


                                if ($("#A_5_7_06").attr("checked") && $("#A_5_7_02").val().trim() == "") {
                                    myAlert(titleText + "调查题目7左边勾选其它治疗下面的输入框不能为空！");
                                    returnValue = 0;
                                    return false;
                                }


                            }


                            if ($("#A_5_10_yes").attr("checked") && ($("#A_5_10_01").val().trim() == "" || $("#A_5_10_02").val().trim() == "" || $("#A_5_10_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目10左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_5_4_yes").attr("checked") || $("#A_5_5_yes").attr("checked") || $("#A_5_6_yes").attr("checked") || $("#A_5_7_yes").attr("checked") ||
                                $("#A_5_8_yes").attr("checked") || $("#A_5_9_yes").attr("checked") || $("#A_5_10_yes").attr("checked") ||
                                $("#A_5_11_yes").attr("checked")) && $("#A_5_11_01").val().trim() == "") {

                                myAlert(titleText + "调查题目4到11有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_5_12_01").val().trim() == "" && $("#A_5_12_yes").attr("checked")) {
                                myAlert(titleText + "调查题目12左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                        }


                        //甲状腺疾病问卷
                        if (typeIndex == '06') {

                            if ($("#A_6_4_yes").attr("checked")) {
                                if ($("#A_6_4_001").attr("checked") == false && $("#A_6_4_002").attr("checked") == false && $("#A_6_4_003").attr("checked") == false) {
                                    myAlert(titleText + "调查题目4左边大小没有勾选！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_6_4_004").attr("checked") == false && $("#A_6_4_005").attr("checked") == false) {
                                    myAlert(titleText + "调查题目4左边数量没有勾选！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_6_4_006").attr("checked") == false && $("#A_6_4_007").attr("checked") == false) {
                                    myAlert(titleText + "调查题目4左边分布没有勾选！");
                                    returnValue = 0;
                                    return false;
                                }
                                if ($("#A_6_4_008").attr("checked") == false && $("#A_6_4_009").attr("checked") == false) {
                                    myAlert(titleText + "调查题目4左边触痛没有勾选！");
                                    returnValue = 0;
                                    return false;
                                }
                                if ($("#A_6_4_010").attr("checked") == false && $("#A_6_4_011").attr("checked") == false) {
                                    myAlert(titleText + "调查题目4左边活动度没有勾选！");
                                    returnValue = 0;
                                    return false;
                                }


                                if ($("#A_6_4_011").attr("checked") == false && $("#A_6_4_012").attr("checked") == false && $("#A_6_4_013").attr("checked") == false) {
                                    myAlert(titleText + "调查题目4左边质地没有勾选！");
                                    returnValue = 0;
                                    return false;
                                }


                            }


                            if ($("#A_6_5_yes").attr("checked") && ($("#A_6_5_01").val().trim() == "" || $("#A_6_5_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目5左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_6_6_yes").attr("checked") && ($("#A_6_6_01").val().trim().trim() == "" || $("#A_6_6_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目6左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ((!$("#A_6_7_yes").attr("checked")) && ($("#A_6_7_01").val().trim() == "")) {
                                myAlert(titleText + "调查题目7左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_6_9_yes").attr("checked") && ($("#A_6_9_01").val().trim() == "" || $("#A_6_9_02").val().trim() == "" || $("#A_6_9_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目9左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_6_3_yes").attr("checked") || $("#A_6_4_yes").attr("checked") || $("#A_6_5_yes").attr("checked") ||
                                $("#A_6_6_yes").attr("checked") || $("#A_6_7_yes").attr("checked") || $("#A_6_8_yes").attr("checked") ||
                                $("#A_6_9_yes").attr("checked") || $("#A_6_10_yes").attr("checked") || $("#A_6_11_yes").attr("checked") || $("#A_6_12_yes").attr("checked"))
                                && $("#A_6_12_01").val().trim() == "") {

                                myAlert(titleText + "调查题目3到12有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_6_13_01").val().trim() == "" && $("#A_6_13_yes").attr("checked")) {
                                myAlert(titleText + "调查题目13左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                        }

                        //颈腰疾病疾病问卷
                        if (typeIndex == '07') {

                            if ($("#A_7_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_7_7_yes").attr("checked") && ($("#A_7_7_06").attr("checked") && $("#A_7_7_07").val().trim() == "")) {
                                myAlert(titleText + "调查题目7勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_7_8_yes").attr("checked") && $("#A_7_8_01").val() == "") {
                                myAlert(titleText + "调查题目8左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_7_9_yes").attr("checked") && $("#A_7_9_04").val() == "") {
                                myAlert(titleText + "调查题目9左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_7_13_yes").attr("checked") && ($("#A_7_13_01").val() == "" || $("#A_7_13_02").val() == "" || $("#A_7_13_03").val() == "" || $("#A_7_13_04").val() == "")) {
                                myAlert(titleText + "调查题目13左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_7_5_yes").attr("checked") || $("#A_7_6_yes").attr("checked") || $("#A_7_6_yes").attr("checked") ||
                                $("#A_7_7_yes").attr("checked") || $("#A_7_8_yes").attr("checked") || $("#A_7_9_yes").attr("checked") ||
                                $("#A_7_10_yes").attr("checked") || $("#A_7_11_yes").attr("checked") || $("#A_7_12_yes").attr("checked") ||
                                $("#A_7_13_yes").attr("checked")) && $("#A_7_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目5到13有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_7_15_01").val().trim() == "" && $("#A_7_14_yes").attr("checked")) {
                                myAlert(titleText + "调查题目14左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //泌尿系统结石问卷
                        if (typeIndex == '08') {

                            if ($("#A_8_5_yes").attr("checked") && ($("#A_8_5_01").val().trim() == "" || $("#A_8_5_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目5左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_8_6_09").attr("checked") && $("#A_8_6_01").val().trim() == "") {
                                myAlert(titleText + "调查题目6左边药物名称没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_8_6_010").attr("checked") && ($("#A_8_6_02").val().trim() == "" || $("#A_8_6_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目6左边体外碎石下面输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_8_6_011").attr("checked") && ($("#A_8_6_04").val().trim() == "" || $("#A_8_6_05").val().trim() == "")) {
                                myAlert(titleText + "调查题目6左边手术切开取石下面输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_8_6_012").attr("checked") && $("#A_8_6_08").val().trim() == "") {
                                myAlert(titleText + "调查题目6左边其它治疗下面输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_8_4_yes").attr("checked") || $("#A_8_5_yes").attr("checked") || $("#A_8_6_yes").attr("checked") ||
                                $("#A_8_7_yes").attr("checked") || $("#A_8_8_yes").attr("checked") || $("#A_8_9_yes").attr("checked") ||
                                $("#A_8_9_yes").attr("checked") || $("#A_8_10_yes").attr("checked") || $("#A_8_10_yes").attr("checked")) && $("#A_8_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目4到10有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_8_11_yes").val().trim() == "" && $("#A_8_11_01").attr("checked")) {
                                myAlert(titleText + "调查题目11左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                        }

                        //尿检异常问卷
                        if (typeIndex == '09') {

                            if ($("#A_9_10_yes").attr("checked") && ($("#A_9_10_01").val().trim() == "" || $("#A_9_10_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目10左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if (($("#A_9_3_yes").attr("checked") || $("#A_9_4_yes").attr("checked") ||
                                $("#A_9_5_yes").attr("checked") || $("#A_9_6_yes").attr("checked") || $("#A_9_7_yes").attr("checked") ||
                                $("#A_9_8_yes").attr("checked") || $("#A_9_9_yes").attr("checked") || $("#A_9_10_yes").attr("checked") ||
                                $("#A_9_11_yes").attr("checked") || $("#A_9_12_yes").attr("checked") || $("#A_9_13_yes").attr("checked")) && $("#A_9_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目3到13有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_9_14_01").val().trim() == "" && $("#A_9_14_yes").attr("checked")) {
                                myAlert(titleText + "调查题目14左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                        }

                        //女性健康问卷
                        if (typeIndex == '10') {

                            if ($("#A_10_1_l").attr("checked") && $("#A_10_1_01").val().trim() == "") {
                                myAlert(titleText + "调查题目1勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_10_3_01").val().trim() == "" || $("#A_10_3_02").val().trim() == "") {
                                myAlert(titleText + "调查题目3下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_10_8_yes").attr("checked") && $("#A_10_8_05").attr("checked") && $("#A_10_8_01").val().trim() == "") {
                                myAlert(titleText + "调查题目8勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_10_9_yes").attr("checked") && ($("#A_10_9_01").val().trim() == "" || $("#A_10_9_02").val().trim() == "" || $("#A_10_9_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目9左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_10_5_yes").attr("checked") || $("#A_10_6_yes").attr("checked") || $("#A_10_7_yes").attr("checked") ||
                                $("#A_10_8_yes").attr("checked") || $("#A_10_9_yes").attr("checked") || $("#A_10_10_yes").attr("checked")) &&
                                $("#A_10_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目5到10有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_10_11_01").val().trim() == "" && $("#A_10_11_yes").attr("checked")) {
                                myAlert(titleText + "调查题目11左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                        }


                        //贫血问卷
                        if (typeIndex == '11') {

                            if ($("#A_11_9_yes").attr("checked") && ($("#A_11_9_01").val() == "" || $("#A_11_9_02").val() == "" || $("#A_11_9_03").val() == "")) {

                                myAlert(titleText + "调查题目9左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;

                            }


                            if (($("#A_11_4_yes").attr("checked") || $("#A_11_5_yes").attr("checked") || $("#A_11_6_yes").attr("checked") ||
                                $("#A_11_7_yes").attr("checked") || $("#A_11_8_yes").attr("checked") || $("#A_11_9_yes").attr("checked") ||
                                $("#A_11_10_yes").attr("checked") || $("#A_11_11_yes").attr("checked")) && $("#A_11_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目5到11有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_11_12_01").val().trim() == "" && $("#A_11_12_yes").attr("checked")) {
                                myAlert(titleText + "调查题目12左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //乳腺疾病问卷
                        if (typeIndex == '12') {
                            if ($("#A_12_1_01").val().trim() == "") {
                                myAlert(titleText + "调查题目1没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_12_4_yes").attr("checked") && ($("#A_12_4_01").val().trim() == "" || $("#A_12_4_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目4左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_12_6_yes").attr("checked") && $("#A_12_6_05").attr("checked") && $("#A_12_6_01").val().trim() == "") {
                                myAlert(titleText + "调查题目6勾选其他下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_12_8_yes").attr("checked")) {

                                if ($("#A_12_8_06").attr("checked") && ($("#A_12_8_01").val().trim() == "" || $("#A_12_8_02").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8勾选服药治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_12_8_07").attr("checked") && ($("#A_12_8_03").val().trim() == "" || $("#A_12_8_04").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8勾选手术治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_12_8_08").attr("checked") && ($("#A_12_8_05").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8勾选其他治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }


                            }


                            /*
                             if($("#A_12_10_yes").attr("checked")&&($("#A_12_10_01").val().trim()==""||$("#A_12_10_02").val().trim()==""))
                             {
                             myAlert(titleText+"调查题目10左边输入框没有填写完整！");
                             returnValue=0;
                             return false;
                             }*/


                            if (($("#A_12_3_yes").attr("checked") || $("#A_12_4_yes").attr("checked") || $("#A_12_5_yes").attr("checked") || $("#A_12_6_yes").attr("checked")
                                || $("#A_12_7_yes").attr("checked") || $("#A_12_8_yes").attr("checked") || $("#A_12_9_yes").attr("checked") || $("#A_12_10_yes").attr("checked")
                                || $("#A_12_11_yes").attr("checked")) && $("#A_12_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目3到11有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_12_12_yes").attr("checked") && $("#A_12_12_01").val().trim() == "") {
                                myAlert(titleText + "调查题目12左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //视力问卷
                        if (typeIndex == '13') {


                            if ($("#A_13_4_yes").attr("checked") && ($("#A_13_4_01").val().trim() == "" || $("#A_13_4_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目4左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_13_6_yes").attr("checked") && ($("#A_13_6_01").val().trim() == "" || $("#A_13_6_02").val().trim() == "" || $("#A_13_6_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目6左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_13_4_yes").attr("checked") || $("#A_13_5_yes").attr("checked") || $("#A_13_6_yes").attr("checked") || $("#A_13_7_yes").attr("checked"))
                                && $("#A_13_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目4到7有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_13_8_yes").attr("checked") && $("#A_13_8_01").val().trim() == "") {
                                myAlert(titleText + "调查题目12左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //受伤问卷
                        if (typeIndex == '14') {

                            if ($("#A_14_1_year").val().trim() == "" || $("#A_14_1_month").val().trim() == "") {
                                myAlert(titleText + "调查题目1没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_14_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2没有填写！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_14_3_yes").attr("checked") && $("#A_14_3_01").val().trim() == "") {
                                myAlert(titleText + "调查题目3左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_14_4_yes").attr("checked") && $("#A_14_4_01").val().trim() == "") {
                                myAlert(titleText + "调查题目4左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_14_5_a").attr("checked") == false && $("#A_14_5_b").attr("checked") == false && $("#A_14_5_c").attr("checked") == false && $("#A_14_5_d").attr("checked") == false) {
                                myAlert(titleText + "调查题目5必须勾选一项！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_14_5_a").attr("checked") && $("#A_14_5_01").val().trim() == "") {
                                myAlert(titleText + "调查题目5勾选住院，住院天数必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_14_5_d").attr("checked") && $("#A_14_5_02").val().trim() == "") {
                                myAlert(titleText + "调查题目5手术情况勾选是，手术名称必填！");
                                returnValue = 0;
                                return false;
                            }

                            /* if($("#A_14_5_year").val().trim()==""&&$("#A_14_5_month").val().trim()=="")
                             {
                             myAlert(titleText+"调查题目5手术日期必填！");
                             returnValue=0;
                             return false;
                             }*/


                            if ($("#A_14_6_01").val().trim() == "") {
                                myAlert(titleText + "调查题目6没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_14_7_01").val().trim() == "") {
                                myAlert(titleText + "调查题目7没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_14_8_01").val().trim() == "") {
                                myAlert(titleText + "调查题目8没有填写！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_14_9_yes").attr("checked") && $("#A_14_9_01").val().trim() == "") {
                                myAlert(titleText + "调查题目9左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_14_10_yes").attr("checked") && $("#A_14_10_01").val().trim() == "") {
                                myAlert(titleText + "调查题目10左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_14_11_yes").attr("checked") && $("#A_14_11_01").val().trim() == "") {
                                myAlert(titleText + "调查题目11左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //糖尿病问卷
                        if (typeIndex == '15') {


                            if ($("#A_15_5_yes").attr("checked") && ($("#A_15_5_01").val().trim() == "" || $("#A_15_5_02").val().trim() == "" || $("#A_15_5_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目5左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_15_6_yes").attr("checked")) {
                                if ($("#A_15_6_05").attr("checked") && ($("#A_15_6_01").val().trim() == "" || $("#A_15_6_02").val().trim() == "")) {
                                    myAlert(titleText + "调查题目6勾选持续服药，下面输入框不能为空！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_15_6_06").attr("checked") && ($("#A_15_6_03").val().trim() == "" || $("#A_15_6_04").val().trim() == "")) {
                                    myAlert(titleText + "调查题目6勾选间断服药，下面输入框不能为空！");
                                    returnValue = 0;
                                    return false;
                                }

                            }

                            if ($("#A_15_7_yes").attr("checked")) {
                                if ($("#A_15_7_07").attr("checked") && ($("#A_15_7_01").val().trim() == "" || $("#A_15_7_02").val().trim() == "")) {
                                    myAlert(titleText + "调查题目7勾选持续治疗，下面输入框不能为空！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_15_7_08").attr("checked") && ($("#A_15_7_03").val().trim() == "" || $("#A_15_7_04").val().trim() == "" || $("#A_15_7_05").val().trim() == "" || $("#A_15_7_06").val().trim() == "")) {
                                    myAlert(titleText + "调查题目7勾选间断治疗，下面输入框不能为空！");
                                    returnValue = 0;
                                    return false;
                                }

                            }


                            if ($("#A_15_11_yes").attr("checked") && ($("#A_15_11_01").val().trim() == "" || $("#A_15_11_02").val().trim() == "" || $("#A_15_11_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目11左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_15_12_yes").attr("checked") && ($("#A_15_12_01").val().trim() == "" || $("#A_15_12_02").val().trim() == "" || $("#A_15_12_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目12左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_15_4_yes").attr("checked") || $("#A_15_5_yes").attr("checked") || $("#A_15_6_yes").attr("checked") || $("#A_15_7_yes").attr("checked") || $("#A_15_8_yes").attr("checked")
                                || $("#A_15_9_yes").attr("checked") || $("#A_15_10_yes").attr("checked") || $("#A_15_11_yes").attr("checked") || $("#A_15_12_yes").attr("checked") || $("#A_15_13_yes").attr("checked")
                                || $("#A_15_14_yes").attr("checked") || $("#A_15_15_yes").attr("checked") || $("#A_15_16_yes").attr("checked")) && $("#A_15_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目4到16有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                            if ($("#A_15_17_yes").attr("checked") && $("#A_15_17_01").val().trim() == "") {
                                myAlert(titleText + "调查题目17左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //特别健康问卷
                        if (typeIndex == '16') {

                            if ($("#A_16_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_16_3_01").val().trim() == "") {
                                myAlert(titleText + "调查题目3没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_16_4_01").val().trim() == "" || $("#A_16_4_02").val().trim() == "" || $("#A_16_4_03").val().trim() == "" || $("#A_16_4_04").val().trim() == "") {
                                myAlert(titleText + "调查题目4没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_16_5_01").val().trim() == "" || $("#A_16_5_02").val().trim() == "" || $("#A_16_5_03").val().trim() == "") {
                                myAlert(titleText + "调查题目5没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_16_6_yes").attr("checked") && $("#A_16_6_01").val() == "") {
                                myAlert(titleText + "调查题目6左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_16_8_yes").attr("checked") && $("#A_16_8_01").val() == "") {
                                myAlert(titleText + "调查题目8左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }


                        //听力问卷
                        if (typeIndex == '17') {


                            if ($("#A_17_2_c").attr("checked") && $("#A_17_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2勾选其它下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_17_3_b").attr("checked") && ($("#A_17_3_06").val().trim() == "" || $("#A_17_3_07").val().trim() == "" || $("#A_17_3_05").val() == "" ||
                                ($("#A_17_3_01").attr("checked") == false && $("#A_17_3_02").attr("checked") == false && $("#A_17_3_03").attr("checked") == false && $("#A_17_3_04").attr("checked") == false))) {
                                myAlert(titleText + "调查题目3没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_17_4_01").val().trim() == "") {
                                myAlert(titleText + "调查题目4没有填写！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_17_5_yes").attr("checked") && ($("#A_17_5_01").val().trim() == "" || $("#A_17_5_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目5左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_17_7_yes").attr("checked") && ($("#A_17_7_01").val().trim() == "" || $("#A_17_7_02").val().trim() == "" || $("#A_17_7_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目7左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if (($("#A_17_5_yes").attr("checked") || $("#A_17_6_yes").attr("checked") || $("#A_17_7_yes").attr("checked") ||
                                $("#A_17_8_yes").attr("checked") || $("#A_17_9_yes").attr("checked"))
                                && $("#A_17_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目5到9有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_17_10_yes").attr("checked") && $("#A_17_10_01").val().trim() == "") {
                                myAlert(titleText + "调查题目10没有填写！");
                                returnValue = 0;
                                return false;
                            }


                        }

                        //痛风及血尿酸值异常问卷
                        if (typeIndex == '18') {

                            if ($("#A_18_6_yes").attr("checked") && ($("#A_18_6_01").val().trim() == "" || $("#A_18_6_02").val() == "" || $("#A_18_6_02").val() == "")) {
                                myAlert(titleText + "调查题目6左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_18_8_yes").attr("checked") && ($("#A_18_8_01").val().trim() == "" || $("#A_18_8_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目8左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_18_9_yes").attr("checked") && ($("#A_18_9_01").val().trim() == "")) {
                                myAlert(titleText + "调查题目9左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_18_10_yes").attr("checked")) {
                                if ($("#A_18_10_05").attr("checked") && ($("#A_18_10_01").val().trim() == "")) {
                                    myAlert(titleText + "调查题目10勾选口服治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_18_10_06").attr("checked") && ($("#A_18_10_02").val().trim() == "" || $("#A_18_10_02").val().trim() == "")) {
                                    myAlert(titleText + "调查题目10勾选手术治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_18_10_07").attr("checked") && ($("#A_18_10_04").val().trim() == "")) {
                                    myAlert(titleText + "调查题目10勾选其它治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }


                            }


                            if ($("#A_18_12_yes").attr("checked") && ($("#A_18_12_01").val().trim() == "" || $("#A_18_12_02").val().trim() == "" || $("#A_18_12_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目12左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#A_18_13_yes").attr("checked") && ($("#div_A_18_13_").find("input").eq(0).val().trim() == "" || $("#div_A_18_13_").find("input").eq(1).val().trim() == "" || $("#div_A_18_13_").find("input").eq(2).val().trim() == "")) {
                                myAlert(titleText + "调查题目13左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if (($("#A_18_5_yes").attr("checked") || $("#A_18_6_yes").attr("checked") || $("#A_18_7_yes").attr("checked") || $("#A_18_8_yes").attr("checked") ||
                                $("#A_18_9_yes").attr("checked")
                                || $("#A_18_10_yes").attr("checked") || $("#A_18_11_yes").attr("checked") || $("#A_18_12_yes").attr("checked") || $("#A_18_13_yes").attr("checked") ||
                                $("#A_18_14_yes").attr("checked")
                                || $("#A_18_15_yes").attr("checked")) && $("#A_18_17_content").val().trim() == "") {

                                myAlert(titleText + "调查题目5到9有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_18_16_yes").attr("checked") && $("#A_18_16_01").val().trim() == "") {
                                myAlert(titleText + "调查题目16没有填写！");
                                returnValue = 0;
                                return false;
                            }


                        }

                        //消化系统疾病问卷
                        if (typeIndex == '19') {

                            if ($("#A_19_2_l").attr("checked") && $("#A_19_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2勾选其他下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_19_3_yes").attr("checked") && ($("#A_19_3_01").val().trim() == "" || $("#A_19_3_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目3左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_19_4_yes").attr("checked") && ($("#A_19_4_01").val().trim() == "" || $("#A_19_4_02").val().trim() == "" || $("#A_19_4_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目4左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_19_7_yes").attr("checked") && ($("#A_19_7_01").val().trim() == "" || $("#A_19_7_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目7左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if ($("#A_19_8_yes").attr("checked")) {
                                if ($("#A_19_8_05").attr("checked") && ($("#A_19_8_01").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8勾选服药治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_19_8_06").attr("checked") && ($("#A_19_8_02").val().trim() == "" || $("#A_19_8_03").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8勾选手术治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                                if ($("#A_19_8_07").attr("checked") && ($("#A_19_8_04").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8勾选其它治疗下面输入框必填！");
                                    returnValue = 0;
                                    return false;
                                }

                            }

                            if (($("#A_19_3_yes").attr("checked") || $("#A_19_4_yes").attr("checked") || $("#A_19_5_yes").attr("checked") ||
                                $("#A_19_6_yes").attr("checked") || $("#A_19_7_yes").attr("checked")
                                || $("#A_19_8_yes").attr("checked") || $("#A_19_9_yes").attr("checked")) && $("#A_19_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目3到9有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                        }

                        //哮喘问卷
                        if (typeIndex == '20') {

                            if ($("#A_20_3_b").attr("checked") && $("#A_20_3_01").val().trim() == "") {
                                myAlert(titleText + "调查题目3下面输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#A_20_7_yes").attr("checked") && ($("#A_20_7_01").val().trim() == "" || $("#A_20_7_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目7左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#A_20_8_yes").attr("checked")) {

                                if (($("#A_20_8_03").attr("checked") && $("#A_20_8_01").val().trim() == "") || ($("#A_20_8_04").attr("checked") && $("#A_20_8_02").val().trim() == "")) {
                                    myAlert(titleText + "调查题目8左边输入框没有填写完整！");
                                    returnValue = 0;
                                    return false;
                                }


                            }

                            if ($("#A_20_11_yes").attr("checked") && ($("#A_20_11_01").val().trim() == "" || $("#A_20_11_02").val().trim() == "" || $("#A_20_11_03").val().trim() == "")) {
                                myAlert(titleText + "调查题目11左边输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_20_4_yes").attr("checked") || $("#A_20_5_yes").attr("checked") || $("#A_20_6_yes").attr("checked") ||
                                $("#A_20_7_yes").attr("checked") || $("#A_20_8_yes").attr("checked")
                                || $("#A_20_9_yes").attr("checked") || $("#A_20_10_yes").attr("checked") || $("#A_20_11_yes").attr("checked") ||
                                $("#A_20_12_yes").attr("checked")) && $("#A_20_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目4到12有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                        }

                        //心脏疾病问卷
                        if (typeIndex == '21') {


                            if ($("#A_21_2_f").attr("checked") && $("#A_21_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2勾选其他下面输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }

                             if(($("#A_21_3_a").attr("checked")==false&&$("#A_21_3_b").attr("checked")==false&&$("#A_21_3_c").attr("checked")==false&&$("#A_21_3_d").attr("checked")==false)
                             ||($("#A_21_3_e").attr("checked")==false&&$("#A_21_3_f").attr("checked")==false&&$("#A_21_3_g").attr("checked")==false&&$("#A_21_3_h").attr("checked")==false)
                             ||($("#A_21_3_i").attr("checked")==false&&$("#A_21_3_j").attr("checked")==false&&$("#A_21_3_k").attr("checked")==false)
                             ||($("#A_21_3_l").attr("checked")==false&&$("#A_21_3_m").attr("checked")==false&&$("#A_21_3_n").attr("checked")==false))
                             {
                             myAlert(titleText+"调查题目3没有勾选完整！");
                             returnValue=0;
                             return false;
                             }

                            if ($("#A_21_3_n").attr("checked") && $("#A_21_3_o").val() == "") {
                                myAlert(titleText + "调查题目3勾选其他输入框必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_21_5_yes").attr("checked") && ($("#A_21_5_01").val().trim() == "" || $("#A_21_5_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目5左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_21_8_yes").attr("checked") && ($("#A_21_8_01").val().trim() == "" || $("#A_21_8_02").val().trim() == "")) {
                                myAlert(titleText + "调查题目8左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_21_4_yes").attr("checked") || $("#A_21_5_yes").attr("checked") || $("#A_21_6_yes").attr("checked") ||
                                $("#A_21_7_yes").attr("checked") || $("#A_21_8_yes").attr("checked")
                                || $("#A_21_9_yes").attr("checked") || $("#A_21_10_yes").attr("checked") || $("#A_21_11_yes").attr("checked")) &&
                                $("#A_21_11_content").val().trim() == "") {

                                myAlert(titleText + "调查题目4到11有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                        }

                        //心脏结构疾病问卷
                        if (typeIndex == '22') {


                            if ($("#A_22_1_yes").attr("checked") && ($("#A_22_1_01").val().trim() == "" || $("#A_22_1_02").val().trim() == "" || $("#A_22_1_03").val().trim() == "")) {

                                myAlert(titleText + "调查题目1左边没有填写完整！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_22_3_yes").attr("checked") && $("#A_22_3_09").attr("checked") && $("#A_22_3_01").val().trim() == "") {

                                myAlert(titleText + "调查题目3左边勾选其他输入框必填！");
                                returnValue = 0;
                                return false;

                            }

                            if ($("#A_22_5_yes").attr("checked") && ($("#A_22_5_01").val().trim() == "" || $("#A_22_5_02").val().trim() == "")) {

                                myAlert(titleText + "调查题目5左边没有填写完整！");
                                returnValue = 0;
                                return false;

                            }


                            if (($("#A_22_1_yes").attr("checked") || $("#A_22_2_yes").attr("checked") || $("#A_22_3_yes").attr("checked") ||
                                $("#A_22_4_yes").attr("checked") || $("#A_22_5_yes").attr("checked")
                                || $("#A_22_6_yes").attr("checked")) && $("#A_22_check_result").val().trim() == "") {

                                myAlert(titleText + "调查题目1到6有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }
                        }

                        //肿瘤问卷
                        if (typeIndex == "25") {
                            if ($("#A_25_2_01").val().trim() == "") {
                                myAlert(titleText + "调查题目2输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#A_25_4_01").val().trim() == "") {
                                myAlert(titleText + "调查题目4输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_25_5_yes").attr("checked") && ($("#A_25_5_01").val() == "" || $("#A_25_5_02").val() == "")) {
                                myAlert(titleText + "调查题目5左边输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#A_25_6_yes").attr("checked") && ($("#A_25_6_01").val() == "" || $("#A_25_6_02").val() == "" || $("#A_25_6_03").val() == "" || $("#A_25_6_04").val() == "")) {
                                myAlert(titleText + "调查题目6左边输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }


                            if (($("#A_25_6_yes").attr("checked")|| $("#A_25_10_yes").attr("checked") || $("#A_25_11_yes").attr("checked")
                                || $("#A_25_12_yes").attr("checked")|| $("#A_25_13_yes").attr("checked")) && $("#A_25_13_content").val() == "") {

                                myAlert(titleText + "调查题目6到13有一个勾选的是，详细告知为必填！");
                                returnValue = 0;
                                return false;

                            }


                        }

                        //赛车问卷
                        if (typeIndex == "29") {

                            if ($("#C_4_4_yes").attr("checked") && ($("#C_4_4_01").val() == "" && $("#C_4_4_02").val() == "")) {
                                myAlert(titleText + "调查题目4左边没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                        }

                        //危险职业问卷
                        if (typeIndex == "30") {
                            if ($("#C_1_1_content").val() == "") {
                                myAlert(titleText + "调查题目1详细告知没有填写！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_1_4_content").val() == "") {
                                myAlert(titleText + "调查题目4详细告知没有填写！");
                                returnValue = 0;
                                return false;
                            }
                        }

                        //危险运动问卷
                        if (typeIndex == "33") {
                            if ($("#C_2_1_content").val() == "") {
                                myAlert(titleText + "调查题目1详细告知没有填写！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_2_4_content").val() == "") {
                                myAlert(titleText + "调查题目4详细告知没有填写！");
                                returnValue = 0;
                                return false;
                            }
                        }

                        //海运问卷
                        if (typeIndex == "34") {
                            if ($("#C_8_1_shipname").val() == "" || $("#C_8_1_shipmastername").val() == "" || $("#C_8_1_shipregisterlocation").val() == "") {
                                myAlert(titleText + "调查题目1没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#C_8_3_content").val() == "") {
                                myAlert(titleText + "调查题目3没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_8_4_content").val() == "") {
                                myAlert(titleText + "调查题目4没有填写完整！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_8_5_content").val() == "") {
                                myAlert(titleText + "调查题目5没有填写完整！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#C_8_6_j").attr("checked") && $("#C_8_6_01").val() == "") {
                                myAlert(titleText + "调查题目6勾选其他输入框必填！");
                                returnValue = 0;
                                return false;
                            }

                            if ($("#C_8_8_yourjob").val() == "" || $("#C_8_8_jobtitle").val() == "") {
                                myAlert(titleText + "调查题目8输入框没有填写完整！");
                                returnValue = 0;
                                return false;
                            }


                        }

                        //航空问卷
                        if (typeIndex == "35") {
                            if ($("#C_7_1_h").attr("checked") && $("#C_7_1_01").val() == "") {
                                myAlert(titleText + "调查题目1勾选其他下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_7_2_mainjob").val() == "0") {
                                myAlert(titleText + "调查题目2主要工作没有选择！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_7_3_content").val() == "") {
                                myAlert(titleText + "调查题目3没有填写！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_7_4_f").attr("checked") && $("#C_7_4_01").val() == "") {
                                myAlert(titleText + "调查题目4勾选其他下面输入框必填！");
                                returnValue = 0;
                                return false;
                            }
                            if ($("#C_7_6_content").val() == "") {
                                myAlert(titleText + "调查题目6输入框没有填写！");
                                returnValue = 0;
                                return false;
                            }

                        }


                    }

                    //出国人员问卷
                    if (typeIndex == "27") {


                        if ($("#C_9_5_yes").attr("checked") && $("#C_9_5_01").val() == "") {
                            myAlert(titleText + "调查题目5左边输入框没有填写完整！");
                            returnValue = 0;
                            return false;
                        }


                        if (($("#C_9_6_no").attr("checked")) && ($("#C_9_6_01").val() == "")) {
                            myAlert(titleText + "调查题目6左边输入框没有填写完整！");
                            returnValue = 0;
                            return false;
                        }
                        if ($("#C_9_7_yes").attr("checked") && $("#C_9_7_01").val() == "") {
                            myAlert(titleText + "调查题目7左边输入框没有填写完整！");
                            returnValue = 0;
                            return false;
                        }


                    }

                }

                //胸痛问卷
                else if (typeIndex == "23") {


                    if ($("#A_23_1_year").val() == "" || $("#A_23_1_month").val() == "" || $("#A_23_1_years").val() == "" || $("#A_23_1_months").val() == "" || $("#A_23_1_day").val() == "") {
                        myAlert(titleText + "调查题目1.1没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if (($("#table_problempieces_23 tr").eq(1).find(".checkboxStyleOfImpart:checked").length == 0) && ($("#table_problempieces_23 tr").eq(1).find(".checkboxStyleOfImpart").length > 0)) {
                        myAlert(titleText + "调查题目1.2没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_1_2_yes").attr("checked") == false && $("#A_23_1_2_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1.3请勾选是或者否！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_1_2_yes").attr("checked") && ($("#table_problempieces_23 tr").eq(2).find(".checkboxStyleOfImpart:checked").length == 0)) {
                        myAlert(titleText + "调查题目1.3左边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_1_2_yes").attr("checked") && $("#A_23_1_2_08").attr("checked") && $("#A_23_1_1_02").val() == "") {
                        myAlert(titleText + "调查题目1.3左边勾选其它下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }


                    if (($("#table_problempieces_23 tr").eq(3).find(".checkboxStyleOfImpart:checked").length == 0) && ($("#table_problempieces_23 tr").eq(3).find(".checkboxStyleOfImpart").length > 0)) {
                        myAlert(titleText + "调查题目1.4没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#A_23_1_3_f").attr("checked") && $("#A_23_1_3_03").val() == "") {
                        myAlert(titleText + "调查题目1.4勾选其它下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#table_problempieces_23 tr").eq(4).find(".checkboxStyleOfImpart:checked").length == 0) && ($("#table_problempieces_23 tr").eq(4).find(".checkboxStyleOfImpart").length > 0)) {
                        myAlert(titleText + "调查题目1.5没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#table_problempieces_23 tr").eq(5).find(".checkboxStyleOfImpart:checked").length == 0) && ($("#table_problempieces_23 tr").eq(5).find(".checkboxStyleOfImpart").length > 0)) {
                        myAlert(titleText + "调查题目1.6没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#table_problempieces_23 tr").eq(6).find(".checkboxStyleOfImpart:checked").length == 0) && ($("#table_problempieces_23 tr").eq(6).find(".checkboxStyleOfImpart").length > 0)) {
                        myAlert(titleText + "调查题目1.7没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#table_problempieces_23 tr").eq(7).find(".checkboxStyleOfImpart:checked").length == 0) && ($("#table_problempieces_23 tr").eq(7).find(".checkboxStyleOfImpart").length > 0)) {
                        myAlert(titleText + "调查题目1.8没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_1_7_f").attr("checked") && $("#A_23_1_7_03").val() == "") {
                        myAlert(titleText + "调查题目1.8勾选其它方法下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_2_yes").attr("checked") == false && $("#A_23_2_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#A_23_2_yes").attr("checked") && ($("#A_23_2_01").val() == "" || $("#A_23_2_02").val() == "")) {

                        myAlert(titleText + "调查题目2左边没有填写完整！");
                        returnValue = 0;
                        return false;

                    }


                    if ($("#A_23_3_yes").attr("checked") == false && $("#A_23_3_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#A_23_4_yes").attr("checked") == false && $("#A_23_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目4右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_4_yes").attr("checked") && ($("#A_23_4_01").val() == "" || $("#A_23_4_02").val() == "")) {

                        myAlert(titleText + "调查题目4左边没有填写完整！");
                        returnValue = 0;
                        return false;

                    }

                    if ($("#A_23_5_yes").attr("checked") == false && $("#A_23_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目5右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_23_6_yes").attr("checked") == false && $("#A_23_6_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目6右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if (($("#A_23_2_yes").attr("checked") || $("#A_23_3_yes").attr("checked") || $("#A_23_4_yes").attr("checked") ||
                        $("#A_23_5_yes").attr("checked") || $("#A_23_6_yes").attr("checked"))
                        && $("#A_23_check_result").val() == "") {

                        myAlert(titleText + "调查题目2到6有一个勾选的是，详细告知为必填！");
                        returnValue = 0;
                        return false;

                    }

                    if ($("#A_23_7_yes").attr("checked") == false && $("#A_23_7_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目7右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_23_7_yes").attr("checked") && $("#A_23_7_01").val() == '') {
                        myAlert(titleText + "调查题目7左边详细告知没有填写！");
                        returnValue = 0;
                        return false;
                    }


                }

                //婴幼儿健康状况问卷
                else if (typeIndex == '24') {

                    if ($("#A_24_1_2_no").attr("checked") == false && $("#A_24_1_2_yes").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（2）分娩方式没有选择！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_24_1_2_yes").attr("checked") && $("#A_24_1_2_01").attr("checked") == false && $("#A_24_1_2_02").attr("checked") == false && $("#A_24_1_2_03").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（2）非自然分娩下面勾选框没有勾选！");
                        returnValue = 0;
                        return false;

                    }

                    if ($("#A_24_1_2_yes").attr("checked") && $("#A_24_1_3_a").attr("checked") == false && $("#A_24_1_3_b").attr("checked") == false
                        && $("#A_24_1_3_c").attr("checked") == false && $("#A_24_1_3_d").attr("checked") == false && $("#A_24_1_3_e").attr("checked") == false && $("#A_24_1_3_f").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（3）非自然分娩下面勾选框没有勾选！");
                        returnValue = 0;
                        return false;

                    }

                    if ($("#A_24_1_4_yes").attr("checked") == false && $("#A_24_1_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（4）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_1_5_yes").attr("checked") == false && $("#A_24_1_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（5）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_1_6_yes").attr("checked") == false && $("#A_24_1_6_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（6）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_1_7_yes").attr("checked") == false && $("#A_24_1_7_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（7）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_1_8_yes").attr("checked") == false && $("#A_24_1_8_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1中的（8）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#A_24_1_4_yes").attr("checked") || $("#A_24_1_5_yes").attr("checked") || $("#A_24_1_6_yes").attr("checked") ||
                        $("#A_24_1_7_yes").attr("checked") || $("#A_24_1_8_yes").attr("checked"))
                        && $("#A_24_1_check_result").val() == "") {

                        myAlert(titleText + "调查题目1中的（4）到（8）有一个勾选的是，详细告知为必填！");
                        returnValue = 0;
                        return false;

                    }

                    if ($("#A_24_2_1_long").val() == "" || $("#A_24_2_1_weight").val() == "" || $("#A_24_2_1_week").val() == "" || $("#A_24_2_1_01").val() == "") {
                        myAlert(titleText + "调查题目2中的（1）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_2_2_yes").attr("checked") == false && $("#A_24_2_2_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2中的（2）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_2_3_yes").attr("checked") == false && $("#A_24_2_3_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2中的（3）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_2_4_yes").attr("checked") == false && $("#A_24_2_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2中的（4）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_2_5_yes").attr("checked") == false && $("#A_24_2_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2中的（5）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_2_6_yes").attr("checked") == false && $("#A_24_2_6_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2中的（6）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_2_7_yes").attr("checked") == false && $("#A_24_2_7_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2中的（7）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#A_24_2_2_yes").attr("checked") || $("#A_24_2_3_yes").attr("checked") || $("#A_24_2_4_yes").attr("checked") ||
                        $("#A_24_2_5_yes").attr("checked")) && $("#A_24_2_check_result").val() == "") {

                        myAlert(titleText + "调查题目2中的（2）到（5）有一个勾选的是，详细告知为必填！");
                        returnValue = 0;
                        return false;

                    }

                    if ($("#A_24_3_yes").attr("checked") == false && $("#A_24_3_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_24_3_yes").attr("checked") && $("#A_24_3_01").val() == "") {
                        myAlert(titleText + "调查题目3左边没有填写");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_24_4_yes").attr("checked") == false && $("#A_24_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目4没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#A_24_5_yes").attr("checked") == false && $("#A_24_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目5没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#A_24_5_yes").attr("checked") && $("#A_24_5_01").val() == "") {
                        myAlert(titleText + "调查题目5左边没有填写");
                        returnValue = 0;
                        return false;
                    }


                }

                //补充告知问卷（被保险人）
                else if (typeIndex == '36') {
                    if ($("#E_26_1_bheight").val() == "" || $("#E_26_1_bweight").val() == "") {
                        myAlert(titleText + "调查题目1没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_2_yes1").attr("checked") == false && $("#E_26_2_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目2右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_2_yes1").attr("checked") && ($("#E_26_2_01").val() == "" || $("#E_26_2_02").val() == "")) {
                        myAlert(titleText + "调查题目2左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#E_26_3_yes1").attr("checked") == false && $("#E_26_3_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目3右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_3_yes1").attr("checked") && ($("#E_26_3_01").val() == "" || $("#E_26_3_02").val() == "" || $("#E_26_3_03").val() == "" || $("#E_26_3_04").val() == "" || $("#E_26_3_05").val() == "")) {
                        myAlert(titleText + "调查题目3左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_4_yes1").attr("checked") == false && $("#E_26_4_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目4右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_5_yes1").attr("checked") == false && $("#E_26_5_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目5右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_6_yes1").attr("checked") == false && $("#E_26_6_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目6右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_7_yes1").attr("checked") == false && $("#E_26_7_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目7右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_8_yes1").attr("checked") == false && $("#E_26_8_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目8右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_9_a_yes1").attr("checked") == false && $("#E_26_9_a_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中A题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_b_yes1").attr("checked") == false && $("#E_26_9_b_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中B题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_c_yes1").attr("checked") == false && $("#E_26_9_c_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中C题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_d_yes1").attr("checked") == false && $("#E_26_9_d_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中D题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_e_yes1").attr("checked") == false && $("#E_26_9_e_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中E题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_f_yes1").attr("checked") == false && $("#E_26_9_f_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中F题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_g_yes1").attr("checked") == false && $("#E_26_9_g_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中G题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_h_yes1").attr("checked") == false && $("#E_26_9_h_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中H题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_i_yes1").attr("checked") == false && $("#E_26_9_i_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中I题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_j_yes1").attr("checked") == false && $("#E_26_9_j_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中J题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_9_k_yes1").attr("checked") == false && $("#E_26_9_k_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中K题目没有勾选");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#E_26_10_yes1").attr("checked") == false && $("#E_26_10_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目10右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_11_a_yes1").attr("checked") == false && $("#E_26_11_a_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目11中A题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_11_a_yes1").attr("checked") && $("#E_26_11_01").val() == "") {
                        myAlert(titleText + "调查题目11中A题目左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_11_b_yes1").attr("checked") == false && $("#E_26_11_b_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目11中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_12_01").val() == "" || $("#E_26_12_02").val() == "") {
                        myAlert(titleText + "调查题目12中A题目输入框没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_12_b_yes1").attr("checked") == false && $("#E_26_12_b_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目12中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#E_26_13_a_yes1").attr("checked") == false && $("#E_26_13_a_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目13中A题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_13_b_yes1").attr("checked") == false && $("#E_26_13_b_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目13中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_14_yes1").attr("checked") == false && $("#E_26_14_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目14右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_15_yes1").attr("checked") == false && $("#E_26_15_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目15右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_16_yes1").attr("checked") == false && $("#E_26_16_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目16右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_17_yes1").attr("checked") == false && $("#E_26_17_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目17右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#E_26_18_a_yes1").attr("checked") == false && $("#E_26_18_a_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目18中A题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#E_26_18_b_yes1").attr("checked") == false && $("#E_26_18_b_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目18中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#E_26_19_yes1").attr("checked") == false && $("#E_26_19_no1").attr("checked") == false) {
                        myAlert(titleText + "调查题目19右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    var judgeCheckbox = 0;
                    $("#problempieces_36 input[type='checkbox']:checked").each(function () {
                        if ($(this).val() == "0") {
                            judgeCheckbox = 1;
                            return false;
                        }
                    });

                    if (judgeCheckbox == 0 && $("#E_26_20_content").val() == "") {
                        myAlert(titleText + "详细告知为必填！");
                        returnValue = 0;
                        return false;
                    }


                }

                //补充告知问卷（投保人）
                else if (typeIndex == '37') {
                    if ($("#F_26_1_theight").val() == "" || $("#F_26_1_tweight").val() == "") {
                        myAlert(titleText + "调查题目1没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_2_yes2").attr("checked") == false && $("#F_26_2_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目2右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_2_yes2").attr("checked") && ($("#F_26_2_01").val() == "" || $("#F_26_2_02").val() == "")) {
                        myAlert(titleText + "调查题目2左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#F_26_3_yes2").attr("checked") == false && $("#F_26_3_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目3右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_3_yes2").attr("checked") && ($("#F_26_3_01").val() == "" || $("#F_26_3_02").val() == "" || $("#F_26_3_03").val() == "" || $("#F_26_3_04").val() == "" || $("#F_26_3_05").val() == "")) {
                        myAlert(titleText + "调查题目3左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_4_yes2").attr("checked") == false && $("#F_26_4_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目4右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_5_yes2").attr("checked") == false && $("#F_26_5_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目5右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_6_yes2").attr("checked") == false && $("#F_26_6_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目6右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_7_yes2").attr("checked") == false && $("#F_26_7_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目7右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_8_yes2").attr("checked") == false && $("#F_26_8_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目8右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_9_a_yes2").attr("checked") == false && $("#F_26_9_a_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中A题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_b_yes2").attr("checked") == false && $("#F_26_9_b_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中B题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_c_yes2").attr("checked") == false && $("#F_26_9_c_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中C题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_d_yes2").attr("checked") == false && $("#F_26_9_d_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中D题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_e_yes2").attr("checked") == false && $("#F_26_9_e_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中E题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_f_yes2").attr("checked") == false && $("#F_26_9_f_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中F题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_g_yes2").attr("checked") == false && $("#F_26_9_g_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中G题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_h_yes2").attr("checked") == false && $("#F_26_9_h_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中H题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_i_yes2").attr("checked") == false && $("#F_26_9_i_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中I题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_j_yes2").attr("checked") == false && $("#F_26_9_j_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中J题目没有勾选");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_9_k_yes2").attr("checked") == false && $("#F_26_9_k_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中K题目没有勾选");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#F_26_10_yes2").attr("checked") == false && $("#F_26_10_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目10右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_11_a_yes2").attr("checked") == false && $("#F_26_11_a_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目11中A题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_11_a_yes2").attr("checked") && $("#F_26_11_01").val() == "") {
                        myAlert(titleText + "调查题目11中A题目左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_11_b_yes2").attr("checked") == false && $("#F_26_11_b_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目11中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#F_26_13_a_yes2").attr("checked") == false && $("#F_26_13_a_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目13中A题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_13_b_yes2").attr("checked") == false && $("#F_26_13_b_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目13中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_14_yes2").attr("checked") == false && $("#F_26_14_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目14右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_15_yes2").attr("checked") == false && $("#F_26_15_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目15右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_16_yes2").attr("checked") == false && $("#F_26_16_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目16右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_17_yes2").attr("checked") == false && $("#F_26_17_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目17右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#F_26_18_a_yes2").attr("checked") == false && $("#F_26_18_a_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目18中A题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_26_18_b_yes2").attr("checked") == false && $("#F_26_18_b_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目18中B题目右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_26_19_yes2").attr("checked") == false && $("#F_26_19_no2").attr("checked") == false) {
                        myAlert(titleText + "调查题目19右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    var judgeCheckbox = 0;
                    $("#problempieces_37 input[type='checkbox']:checked").each(function () {
                        if ($(this).val() == "0") {
                            judgeCheckbox = 1;
                            return false;
                        }
                    });

                    if (judgeCheckbox == 0 && $("#F_26_20_content").val() == "") {
                        myAlert(titleText + "详细告知为必填！");
                        returnValue = 0;
                        return false;
                    }


                }

                //财务问卷
                else if (typeIndex == "26") {
                    if ($("#table_problempieces_26 tr").eq(1).find("input[type='checkbox']:checked").length == 0) {
                        myAlert(titleText + "调查题目1没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_1_f").attr("checked") && $("#B_2_1_01").val() == "") {
                        myAlert(titleText + "调查题目1勾选其他，说明必填！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#table_problempieces_26 tr").eq(2).find("input[type='checkbox']:checked").length == 0) {
                        myAlert(titleText + "调查题目2没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_2_d").attr("checked") && $("#B_2_2_01").val() == "") {
                        myAlert(titleText + "调查题目2勾选其他，说明必填！");
                        returnValue = 0;
                        return false;
                    }

                    var inputValue = 1;
                    for (var i = 4; i <= 9; i++) {

                        var trObj = $("#table_problempieces_26 tr").eq(i).find(".text-style");

                        if (trObj.eq(0).val() == "" && trObj.eq(1).val() == "" && trObj.eq(2).val() == ""
                            && trObj.eq(3).val() == "" && trObj.eq(4).val() == "" && trObj.eq(5).val() == ""
                            && trObj.eq(6).val() == "") {
                            inputValue = 1;
                        }
                        else if (trObj.eq(0).val() != "" && trObj.eq(1).val() != "" && trObj.eq(2).val() != ""
                            && trObj.eq(3).val() != "" && trObj.eq(4).val() != "" && trObj.eq(5).val() != ""
                            && trObj.eq(6).val() != "") {
                            inputValue = 1;
                        }
                        else {
                            inputValue = 0;
                            break;
                        }

                    }

                    if (inputValue == 0) {
                        myAlert(titleText + "调查题目3没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_3_1_yes").attr("checked") == false && $("#B_2_3_1_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3中的（1）没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#B_2_3_2_yes").attr("checked") == false && $("#B_2_3_2_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3中的（2）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_3_3_yes").attr("checked") == false && $("#B_2_3_3_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3中的（3）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_3_4_yes").attr("checked") == false && $("#B_2_3_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3中的（4）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_3_5_yes").attr("checked") == false && $("#B_2_3_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目3中的（5）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_3_1_yes").attr("checked") && $("#B_2_3_2_yes").attr("checked") && $("#B_2_3_3_yes").attr("checked") && $("#B_2_3_4_yes").attr("checked") && $("#B_2_3_5_yes").attr("checked") && $("#B_2_3_check_result").val() == "") {
                        myAlert(titleText + "调查题目3中的（1）到（5）勾选，详细告知必填！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_4_01").val() == "" || $("#B_2_4_02").val() == "") {
                        myAlert(titleText + "调查题目4中的（1）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_4_2_a").attr("checked") == false && $("#B_2_4_2_b").attr("checked") == false && $("#B_2_4_2_c").attr("checked") == false && $("#B_2_4_2_d").attr("checked") == false && $("#B_2_4_2_e").attr("checked") == false) {
                        myAlert(titleText + "调查题目4中的（2）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_4_2_e").attr("checked") && $("#B_2_4_03").val() == "") {
                        myAlert(titleText + "调查题目4中的（2）勾选其他下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_4_3_01").val() == "") {
                        myAlert(titleText + "调查题目4中的（3）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#B_2_4_4_year").val() == "" || $("#B_2_4_4_month").val() == "" || $("#B_2_4_4_years").val() == "") {
                        myAlert(titleText + "调查题目4中的（4）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_4_5_year").val() == "" || $("#B_2_4_5_money").val() == "") {
                        myAlert(titleText + "调查题目4中的（5）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#B_2_4_yes").attr("checked") == false && $("#B_2_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目4中的（6）右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_4_yes").attr("checked") && $("#B_2_4_6_01").val() == "") {
                        myAlert(titleText + "调查题目4中的（6）左边没有填写！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#B_2_4_7_yes").attr("checked") == false && $("#B_2_4_7_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目4中的（7）右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_7_yes").attr("checked") && $("#B_2_4_7_01").val() == "") {
                        myAlert(titleText + "调查题目4中的（7）左边没有填写！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#B_2_5_1_money1").val() == "" || $("#B_2_5_1_money2").val() == "" || $("#B_2_5_1_money3").val() == "") {
                        myAlert(titleText + "调查题目5中的（1）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#B_2_5_2_money1").val() == "" || $("#B_2_5_2_money2").val() == "" || $("#B_2_5_2_money3").val() == "") {
                        myAlert(titleText + "调查题目5中的（2）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_5_3_money1").val() == "") {
                        myAlert(titleText + "调查题目5中的（3）没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_5_3_a").attr("checked") == false && $("#B_2_5_3_b").attr("checked") == false && $("#B_2_5_3_c").attr("checked") == false && $("#B_2_5_3_d").attr("checked") == false) {
                        myAlert(titleText + "调查题目5中的（3）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_5_3_d").attr("checked") && $("#B_2_5_3_01").val() == "") {
                        myAlert(titleText + "调查题目5中的（3）勾选其他下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }


                    /*   if($("#B_2_6_1_money1").val()==""||$("#B_2_6_1_money2").val()==""||$("#B_2_6_1_money3").val()=="")
                     {
                     myAlert(titleText+"调查题目6中的（1）没有填写完整！");
                     returnValue=0;
                     return false;
                     }
                     if($("#B_2_6_2_money1").val()==""||$("#B_2_6_2_money2").val()==""||$("#B_2_6_2_money3").val()=="")
                     {
                     myAlert(titleText+"调查题目6中的（2）没有填写完整！");
                     returnValue=0;
                     return false;
                     }*/


                    /*  if($("#B_2_6_3_money1").val()=="")
                     {
                     myAlert(titleText+"调查题目6中的（3）没有填写完整！");
                     returnValue=0;
                     return false;
                     }

                     if($("#B_2_5_3_a").attr("checked")==false&&$("#B_2_5_3_b").attr("checked")==false&&$("#B_2_5_3_c").attr("checked")==false&&$("#B_2_5_3_d").attr("checked")==false)
                     {
                     myAlert(titleText+"调查题目6中的（3）没有勾选！");
                     returnValue=0;
                     return false;
                     }

                     if($("#B_2_5_3_d").attr("checked")&&$("#B_2_5_3_01").val()=="")
                     {
                     myAlert(titleText+"调查题目6中的（3）勾选其他下面输入框必填！");
                     returnValue=0;
                     return false;
                     }
                     */

                    if ($("#B_2_7_1_a").attr("checked") == false && $("#B_2_7_1_b").attr("checked") == false && $("#B_2_7_1_c").attr("checked") == false && $("#B_2_7_1_d").attr("checked") == false && $("#B_2_7_1_e").attr("checked") == false) {
                        myAlert(titleText + "调查题目7没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_7_1_e").attr("checked") && $("#B_2_7_1_01").val() == "") {
                        myAlert(titleText + "调查题目7勾选其他下面输入框必填！");
                        returnValue = 0;
                        return false;
                    }

                   /* if($("#B_2_7_1_num3").val()==""||$("#B_2_7_1_num4").val()==""||$("#B_2_7_1_num5").val()==""
                        ||$("#B_2_7_1_num6").val()==""||$("#B_2_7_1_num7").val()=="")
                    {
                        myAlert(titleText+"调查题目7本人房产请注明没有填写完整！");
                        returnValue=0;
                        return false;
                    }*/

                     if($("#B_2_7_1_num1").val()==""||$("#B_2_7_1_num2").val()==""||$("#B_2_7_1_num3").val()==""
                     ||$("#B_2_7_1_num4").val()==""||$("#B_2_7_1_num5").val()==""||$("#B_2_7_1_num6").val()==""
                     ||$("#B_2_7_1_num7").val()==""||$("#B_2_7_1_num8").val()==""||$("#B_2_7_1_num9").val()=="")
                     {
                     myAlert(titleText+"调查题目7输入框没有填写完整！");
                     returnValue=0;
                     return false;
                     }

                    if ($("#B_2_7_2_yes").attr("checked") == false && $("#B_2_7_2_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目7私车是否拥有没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_7_2_yes").attr("checked") && $("#B_2_7_2_01").val() == "") {
                        myAlert(titleText + "调查题目7私车是否拥有下面输入框没有填写完整");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#B_2_8_yes").attr("checked") == false && $("#B_2_8_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目8右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_8_yes").attr("checked") && $("#B_2_8_01").val() == "") {
                        myAlert(titleText + "调查题目8左边输入框没有填写");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_1_num").val() == "") {
                        myAlert(titleText + "调查题目9中（1）输入框没有填写");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_1_a").attr("checked") == false && $("#B_2_9_1_b").attr("checked") == false && $("#B_2_9_1_c").attr("checked") == false && $("#B_2_9_1_d").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中（1）没有勾选");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_1_d").attr("checked") && $("#B_2_9_1_01").val() == "") {
                        myAlert(titleText + "调查题目9中（1）勾选其他输入框必填");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_2_num").val() == "") {
                        myAlert(titleText + "调查题目9中（2）输入框没有填写");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_3_yes").attr("checked") == false && $("#B_2_9_3_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中（3）右边没有勾选");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_3_yes").attr("checked") && ($("#B_2_9_3_01").val() == "" || $("#B_2_9_3_02").val() == "" || $("#B_2_9_3_03").val() == "")) {
                        myAlert(titleText + "调查题目9中（3）左边没有填写完整");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_4_yes").attr("checked") == false && $("#B_2_9_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目9中（3）右边没有勾选");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_9_4_yes").attr("checked") && ($("#B_2_9_4_01").val() == "" || $("#B_2_9_4_02").val() == "")) {
                        myAlert(titleText + "调查题目9中（3）左边没有填写完整");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#B_2_10_yes").attr("checked") == false && $("#B_2_10_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目10右边没有勾选");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#B_2_10_yes").attr("checked")) {

                        var inputValueB_2_10 = 0;
                        $("#div_B_2_10_ input").each(function () {
                            if ($(this).val() == "") {
                                inputValueB_2_10 = 1;
                            }
                        });

                        if (inputValueB_2_10 == 1) {
                            myAlert(titleText + "调查题目10左边输入框没有填写完整");
                            returnValue = 0;
                            return false;
                        }

                    }


                }

                //跳伞问卷
                else if (typeIndex == "31") {
                    if ($("#C_3_1_yes").attr("checked") == false && $("#C_3_1_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目1没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_3_2_yes").attr("checked") == false && $("#C_3_2_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目2没有勾选！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#C_3_2_yes").attr("checked") && $("#C_3_2_01").val() == "") {
                        myAlert(titleText + "调查题目2左边输入框没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_3_3_year").val() == "" || $("#C_3_3_times").val() == "" || $("#C_3_3_year_times").val() == "" || $("#C_3_3_plan_times").val() == "") {
                        myAlert(titleText + "调查题目3输入框没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#C_3_3_yes").attr("checked") == false && $("#C_3_2_01").attr("checked") == false) {
                        myAlert(titleText + "调查题目3中的（5）没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_3_5_yes").attr("checked") && $("#C_3_3_01").val() == "") {
                        myAlert(titleText + "调查题目3中的（5）左边输入框没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_3_4_freejump_year").val() == "" || $("#C_3_4_freejump_times").val() == "" || $("#C_3_4_freejump_plan_times").val() == "") {
                        myAlert(titleText + "调查题目4输入框没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_3_5_yes").attr("checked") == false && $("#C_3_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目5没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_3_5_yes").attr("checked") && $("#C_3_5_01").val() == "") {
                        myAlert(titleText + "调查题目5左边输入框没有填写！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#C_3_6_yes").attr("checked") == false && $("#C_3_6_no").attr("checked") == false) {
                        myAlert(titleText + "调查题6没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_3_6_yes").attr("checked") && $("#C_3_6_01").val() == "") {
                        myAlert(titleText + "调查题目6左边输入框没有填写！");
                        returnValue = 0;
                        return false;
                    }


                }

                //登山问卷
                else if (typeIndex == "32") {

                    if ($("#C_5_1_china_place").val() == "" || $("#C_5_1_china_zone").val() == "" || $("#C_5_1_china_time").val() == "" || $("#C_5_1_china_times").val() == "") {
                        myAlert(titleText + "调查题目1中A没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_5_1_overseas_place").val() == "" || $("#C_5_1_overseas_zone").val() == "" || $("#C_5_1_overseas_time").val() == "" || $("#C_5_1_overseas_times").val() == "") {
                        myAlert(titleText + "调查题目1中B没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_5_2_lastyear_times").val() == "" || $("#C_5_2_lastyear_hight").val() == "") {
                        myAlert(titleText + "调查题目2没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_5_3_regular_year").val() == "" || $("#C_5_3_regular_month").val() == "") {
                        myAlert(titleText + "调查题目3没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#C_5_4_yes").attr("checked") == false && $("#C_5_4_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目4没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_5_4_yes").attr("checked") && ($("#C_5_4_01").val() == "" || $("#C_5_4_02").val() == "" || $("#C_5_4_03").val() == "")) {
                        myAlert(titleText + "调查题目4左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#C_5_5_yes").attr("checked") == false && $("#C_5_5_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目5没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#C_5_5_yes").attr("checked") && $("#C_5_5_01").val() == "") {
                        myAlert(titleText + "调查题目5左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#C_5_6_yes").attr("checked") == false && $("#C_5_6_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目6没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_5_6_yes").attr("checked") && $("#C_5_6_01").val() == "") {
                        myAlert(titleText + "调查题目6左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_5_7_yes").attr("checked") == false && $("#C_5_7_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目7没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_5_7_yes").attr("checked") && $("#C_5_7_01").val() == "") {
                        myAlert(titleText + "调查题目7左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_5_8_yes").attr("checked") == false && $("#C_5_8_no").attr("checked") == false) {
                        myAlert(titleText + "调查题目8没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#C_5_8_yes").attr("checked") && $("#C_5_8_01").val() == "") {
                        myAlert(titleText + "调查题目8左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }
                }


                //关节炎问卷
                else if (typeIndex == "38") {
                    if ($("#F_38_1_01").val() == "") {
                        myAlert(titleText + "调查题目1没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_2_01").val() == "") {
                        myAlert(titleText + "调查题目2没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_3_01").val() == "") {
                        myAlert(titleText + "调查题目3没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_38_4_01").attr("checked") == false) && ($("#F_38_4_03").attr("checked") == false)) {
                        myAlert(titleText + "调查题目4没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_38_4_01").attr("checked") && $("#F_38_4_02").val() == "") || ($("#F_38_4_03").attr("checked") && $("#F_38_4_04").val() == "")) {
                        myAlert(titleText + "调查题目4没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if (($("#F_38_5_a_yes").attr("checked") == false) && ($("#F_38_5_a_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目5中a右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_5_a_yes").attr("checked") && ($("#F_38_5_a_01").val() == "")) {
                        myAlert(titleText + "调查题目5中a左边没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#F_38_5_b_yes").attr("checked") == false) && ($("#F_38_5_b_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目5中b右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_5_b_yes").attr("checked") && ($("#F_38_5_b_01").val() == "")) {
                        myAlert(titleText + "调查题目5中b左边没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#F_38_5_c_yes").attr("checked") == false) && ($("#F_38_5_c_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目5中c右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_5_c_yes").attr("checked") && ($("#F_38_5_c_01").val() == "")) {
                        myAlert(titleText + "调查题目5中c左边没有填写！");
                        returnValue = 0;
                        return false;
                    }


                    if (($("#F_38_6_a_yes").attr("checked") == false) && ($("#F_38_6_a_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目6中a右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_6_a_yes").attr("checked") && ($("#F_38_6_a_01").val() == "")) {
                        myAlert(titleText + "调查题目6中a左边没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#F_38_6_b_yes").attr("checked") == false) && ($("#F_38_6_b_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目6中b右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_6_b_yes").attr("checked") && ($("#F_38_6_b_01").val() == "")) {
                        myAlert(titleText + "调查题目6中b左边没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_38_6_c_yes").attr("checked") == false) && ($("#F_38_6_c_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目6中c右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_6_c_yes").attr("checked") && ($("#F_38_6_c_01").val() == "")) {
                        myAlert(titleText + "调查题目6中c左边没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if (($("#F_38_6_d_yes").attr("checked") == false) && ($("#F_38_6_d_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目6中d右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_6_d_yes").attr("checked") && ($("#F_38_6_d_01").val() == "")) {
                        myAlert(titleText + "调查题目6中d左边没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_38_7_01").val() == "") {
                        myAlert(titleText + "调查题目7没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_8_01").val() == "") {
                        myAlert(titleText + "调查题目8没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_38_9_01").val() == "") {
                        myAlert(titleText + "调查题目9没有填写！");
                        returnValue = 0;
                        return false;
                    }


                }

                else if (typeIndex == "39") {

                    if ($("#F_39_1_01").val() == "" || $("#F_39_1_02").val() == "" || $("#F_39_1_03").val() == "") {
                        myAlert(titleText + "调查题目1没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_39_2_01").val() == "" || $("#F_39_2_02").val() == "") {
                        myAlert(titleText + "调查题目2中A没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_39_2_b_01").val() == "") {
                        myAlert(titleText + "调查题目2中B没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_39_2_c_01").attr("checked") == false) && ($("#F_39_2_c_03").attr("checked") == false)) {
                        myAlert(titleText + "调查题目2中C没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_39_2_c_01").attr("checked") && ($("#F_39_2_c_02").val() == "")) || ($("#F_39_2_c_03").attr("checked") && ($("#F_39_2_c_04").val() == ""))) {
                        myAlert(titleText + "调查题目2中C没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#F_39_3_a_01").val() == "") {
                        myAlert(titleText + "调查题目3中A没有填写！");
                        returnValue = 0;
                        return false;
                    }


                    if (($("#F_39_3_b_yes").attr("checked") == false) && ($("#F_39_3_b_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目3中没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_39_3_b_yes").attr("checked") && ($("#F_39_3_b_01").val() == "")) {
                        myAlert(titleText + "调查题目3左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_39_3_c_yes").attr("checked") == false) && ($("#F_39_3_c_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目3中C没有勾选！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_39_3_c_yes").attr("checked") && ($("#F_39_3_c_01").val() == "")) {
                        myAlert(titleText + "调查题目3中C左边没有填写完整！");
                        returnValue = 0;
                        return false;
                    }


                    if ($("#F_39_4_01").val() == "") {
                        myAlert(titleText + "调查题目4没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if (($("#F_39_5_yes").attr("checked") == false) && ($("#F_39_5_no").attr("checked") == false)) {
                        myAlert(titleText + "调查题目5右边没有勾选！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_39_5_yes").attr("checked") && ($("#F_39_5_01").val() == "")) {
                        myAlert(titleText + "调查题目5左边没有填写！");
                        returnValue = 0;
                        return false;
                    }

                    if ($("#F_39_6_01").val() == "") {
                        myAlert(titleText + "调查题目6没有填写！");
                        returnValue = 0;
                        return false;
                    }
                    if ($("#F_39_7_01").val() == "") {
                        myAlert(titleText + "调查题目7没有填写！");
                        returnValue = 0;
                        return false;
                    }
                }


            });


            if (returnValue == 0) {
                break;
            }


        }


    } else {
        myAlert("请向右滑动选择相关问题卷，并仔细填写！");

    }


    if (returnValue == 0) {
        return false;
    }
    else {
        return true;
    }

}