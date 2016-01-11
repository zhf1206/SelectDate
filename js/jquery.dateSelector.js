/*******下拉框式的日期选择器*******
 * dateSelector v1.0 -- 下拉框式的日期选择器
 * 作者:zeke QQ:251195120
 * $Date:2015-12-28
 ********下拉框式的日期选择器******/
(function ($) {
    $.fn.extend({
        dateSelector: function (opt, callback) {
            /*参数定义*/
            var defaults = {
                yearBegin: "", 	        //开始年(默认为:1960年)
                yearEnd: "",            //结束年(默认为:当前年)
                yearEnabled: true, 		//年选择框是否启用(默认为:启用)
                monthEnabled: true, 	//月选择框是否启用(默认为:启用)
                dayEnabled: true, 		//日选择框是否启用(默认为:启用)
                className:"data",
                selectClass:"backbg",
                minDate:null,           //最小日期ID或者值
                maxDate:null            //最大日期ID或者值
            };
            $.extend(true,defaults, opt);

            /*函数区域*/
            var getNowYear = function () {
                //得到现在的年
                var date = new Date();
                return date.getFullYear();
            }
            var getNowMonth = function () {
                //得到现在的月
                var date = new Date();
                return date.getMonth() + 1;
            }
            var getNowDay = function () {
                //得到现在的日
                var date = new Date();
                return date.getDate();
            }
            /*判断是否闰年*/
            var isLeapYear = function (year) {
                return (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0)));
            }
            //明年
            var nextYear = getNowYear()+1;
            /*END*/

            if(defaults.yearBegin==null||defaults.yearBegin==""){
                defaults.yearBegin = getNowYear();
            }
            if(defaults.yearEnd==null||defaults.yearEnd==""){
                defaults.yearEnd = nextYear;
            }

            //可遍历添加多个
            $(this).each(function () {
                var _this = this;
                var el = $(this);
                el.hide();//隐藏原有的输入框
                var elval = el.val();
                var elDate = new Date(elval.split("-").join("/"));
                var oldYear = elDate.getFullYear();//取得输入框里的年值
                var oldMonth = elDate.getMonth() + 1;//取得输入框里的月值(月初始是从0开始)
                var oldDay = elDate.getDate();//取得输入框里的日值
                var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);//每一个月份相应的天数
                if (isNaN(oldYear))oldYear = getNowYear();
                if (isNaN(oldMonth))oldMonth = getNowMonth();
                if (isNaN(oldDay))oldDay = getNowDay();

                var dafultDate=function(){
                    var currDate=oldYear + "-" + oldMonth + "-" + oldDay;
                    el.val(currDate);
                };

                /*
                 * 初始化当天
                 * */
                var loadCurrent = function(){
                    $(selectYear).val(oldYear);
                    $(selectMonth).val(oldMonth);
                    $(selectDay).val(oldDay);
                    var currDate=$(selectYear).val() + "-" + $(selectMonth).val() + "-" + $(selectDay).val();
                    el.val(currDate);
                };

                var selectRoot = $("<div></div>");
                //加入控件到文本框的位置
                el.after(selectRoot);

                /*创建年下拉框*/
                var selectYear = $("<div></div>");
                var defSelUl=$("<ul></ul>");
                selectYear.attr("id",_this.id + "_selectYear");
                selectYear.attr("class",defaults.className);
                //selectYear.disabled = defaults.yearEnabled ? false : true;
                for (var i = defaults.yearEnd; i >= defaults.yearBegin; i--) {
                    var defSelLi = $("<li></li>");
                    defSelLi.text(i);
                    //如果等于当前年就选中
                    if (!isNaN(oldYear)) {
                        if (i == oldYear) {
                            selectYear.append("<span class='select down'>"+i+"</span>");
                            defSelLi.addClass(defaults.selectClass);
                        }
                    }
                    defSelUl.append(defSelLi);
                }
                selectYear.append(defSelUl);
                selectRoot.append(selectYear);
                el.next("div").append(selectRoot);
                /*END*/

                /*创建月下拉框*/
                var selectMonth = $("<div></div>");
                var defSelUl=$("<ul></ul>");
                selectMonth.attr("id",_this.id + "_selectMonth");
                selectMonth.attr("class",defaults.className);
                // selectMonth.disabled = defaults.monthEnabled ? false : true;
                for (var i = 1; i <= 12; i++) {
                    var defSelLi = $("<li></li>");
                    defSelLi.text(i);
                    //如果等于当前年就选中
                    if (!isNaN(oldMonth)) {
                        if (i == oldMonth) {
                            selectMonth.append("<span class='select down'>"+i+"</span>");
                            defSelLi.addClass(defaults.selectClass);
                        }
                    }
                    defSelUl.append(defSelLi);
                }
                //加入控件到文本框的位置
                selectMonth.append(defSelUl);
                selectRoot.append(selectMonth);
                el.next("div").append(selectRoot);
                /*END*/

                /*创建日下拉框*/
                var selectDay = $("<div></div>");
                selectDay.attr("id",_this.id + "_selectDay");
                selectDay.attr("class",defaults.className);
                // selectDay.disabled = defaults.dayEnabled ? false : true;
                var dayCount = daysInMonth[$(selectMonth.find("span")).text() - 1];//天数
                if (oldMonth == 2 && isLeapYear($(selectYear.find("span")).text()))dayCount++;
                $(selectDay).CreateDay(dayCount, oldDay);
                //加入控件到文本框的位置
                selectRoot.append(selectDay);
                el.next("div").append(selectRoot);
                //$(selectDay).before(" ");
                $(selectDay).find("ul li").each(function(i,obj){
                    var curval=parseInt($(obj).text());
                    if(oldDay==curval){
                        $(obj).addClass(defaults.selectClass);
                    }
                });

                var _selHeight=$(selectYear).height();
                //初始化
                dafultDate();
                /*END*/

                /*=========================绑定下拉框事件============================*/
                /*
                *年点击和选择事件
                */
                $(selectYear).click(function(){
                    $(this).siblings().find("span").removeClass('up').addClass('down');
                    $(this).siblings().find("ul").hide();
                    $(this).find("ul").toggle();
                    if($(this).children('span').hasClass('down')){
                        $(this).children('span').removeClass('down').addClass('up');
                    }else{
                        $(this).children('span').removeClass('up').addClass('down');
                    }
                });

                $(selectYear).find("ul>li").mouseover(function(event) {
                    $(this).addClass(defaults.selectClass);
                }).mouseout(function(event) {
                    $(this).removeClass(defaults.selectClass);
                }).click(function () {
                    var thisYear = $(this).text();
                    $(this).parent().prev('span').text(thisYear);
                    var dayCount = daysInMonth[$(selectMonth).children('span').text() - 1];//天数
                    if (oldMonth == 2 && isLeapYear($(selectYear).children('span').text()))dayCount++;
                    $(selectDay).CreateDay(dayCount, oldDay);
                    return updateValue();
                });

                /*
                *月点击和选择事件
                */
                $(selectMonth).click(function(){
                    $(this).siblings().find("span").removeClass('up').addClass('down');
                    $(this).siblings().find("ul").hide();
                    $(this).find("ul").toggle();
                    if($(this).children('span').hasClass('down')){
                        $(this).children('span').removeClass('down').addClass('up');
                    }else{
                        $(this).children('span').removeClass('up').addClass('down');
                    }
                    //滚动条滚动
                    // $(this).find("ul li").each(function(i,obj){
                    //     if($(obj).hasClass(defaults.selectClass))
                    //     var curval=parseInt($(obj).text());
                    //     if(oldDay==curval){
                    //         $(obj).parent().animate({scrollTop:$(obj).offset().top-_selHeight-40},200);
                    //     }
                    // });
                });
                $(selectMonth).find("ul>li").mouseover(function(event) {
                    $(this).addClass(defaults.selectClass);
                }).mouseout(function(event) {
                    $(this).removeClass(defaults.selectClass);
                }).click(function () {
                    var thisMonth = $(this).text();
                    $(this).parent().prev('span').text(thisMonth);
                    var dayCount = daysInMonth[$(selectMonth).children('span').text() - 1];//天数
                    if (oldMonth == 2 && isLeapYear($(selectYear).children('span').text()))dayCount++;
                    $(selectDay).CreateDay(dayCount, oldDay);
                    return updateValue();
                });

                /*
                *日点击和选择事件
                */
                $(selectDay).click(function(){
                    $(this).siblings().find("span").removeClass('up').addClass('down');
                    $(this).siblings().find("ul").hide();
                    $(this).find("ul").toggle();
                    if($(this).children('span').hasClass('down')){
                        $(this).children('span').removeClass('down').addClass('up');
                    }else{
                        $(this).children('span').removeClass('up').addClass('down');
                    }

                    //滚动条滚动
                    // $(this).find("ul li").each(function(i,obj){
                    //     if($(obj).hasClass(defaults.selectClass))
                    //     var curval=parseInt($(obj).text());
                    //     if(oldDay==curval){
                    //         $(obj).parent().animate({scrollTop:$(obj).offset().top-_selHeight-40},200);
                    //     }
                    // });
                });
                $(selectDay).find("ul>li").mouseover(function(event) {
                    $(this).addClass(defaults.selectClass);
                }).mouseout(function(event) {
                    $(this).removeClass(defaults.selectClass);
                }).click(function () {
                    var thisDay = $(this).text();
                    $(this).parent().prev('span').text(thisDay);
                    return updateValue();
                });

                /*实时更新输入框的值*/
                var updateValue = function () {
                    var currDate=$(selectYear).children('span').text() + "-" + $(selectMonth).children('span').text() + "-" + $(selectDay).children('span').text();
                    el.val(currDate);
                };
                /*===========================END=======================================*/

                $(document).bind("click",function(e){ 
                    var target = $(e.target); 
                    if(target.closest($(selectYear)).length == 0){ 
                        $(selectYear).find("ul").hide();
                    }
                    if(target.closest($(selectMonth)).length == 0){ 
                        $(selectMonth).find("ul").hide();
                    } 
                    if(target.closest($(selectDay)).length == 0){ 
                        $(selectDay).find("ul").hide();
                    } 
                });

                $(_this).bind("onchange",function(){
                    console.log("ok");
                    var nowDate = new Date($(this).split("-").join("/"));
                    var nYear = nowDate.getFullYear();
                    var nMonth = nowDate.getMonth() + 1;
                    var nDay = nowDate.getDate();
                    $(selectYear).find("span").text(nYear);
                    $(selectMonth).find("span").text(nMonth);
                    $(selectDay).find("span").text(nDay);
                });

                // el.onpropertychange=function(){
                //     var nowDate = new Date($(this).split("-").join("/"));
                //     var nYear = nowDate.getFullYear();
                //     var nMonth = nowDate.getMonth() + 1;
                //     var nDay = nowDate.getDate();
                //     $(selectYear).find("span").text(nYear);
                //     $(selectMonth).find("span").text(nMonth);
                //     $(selectDay).find("span").text(nDay);
                // };

                //判断日期大小
                var compareDate = function(){
                    if(defaults.minDate!=null){
                        var curr = new Date(currDate.replace(/-/g,"/"));
                        var min= null;
                        if(opt.minDate.indexOf("#")==0){
                            min=new Date($(opt.minDate).val().replace(/-/g,"/"));
                        }else{
                            min= new Date(opt.minDate.replace(/-/g,"/"));
                        }
                        if(curr<min){
                            loadCurrent();
                            alert("请选择正确日期");
                        }
                    }
                    if(defaults.maxDate!=null){
                        var curr = new Date(currDate.replace(/-/g,"/"));
                        var max = null;
                        if(opt.minDate.indexOf("#")==0){
                            max=new Date($(opt.maxDate).val().replace(/-/g,"/"));
                        }else{
                            max= new Date(opt.maxDate.replace(/-/g,"/"));
                        }
                        if(curr>max){
                            loadCurrent();
                            alert("请选择正确日期");
                        }
                    }
                };
                /*END*/



                var hasClass = function (obj, cls) {
                    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
                };

                var addClass = function (obj, cls) {
                    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
                };

                var removeClass = function (obj, cls) {
                    if (hasClass(obj, cls)) {
                        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                        obj.className = obj.className.replace(reg, ' ');
                    }
                };

                var toggleClass = function (obj,cls){
                    if(hasClass(obj,cls)){
                        removeClass(obj, cls);
                    }else{
                        addClass(obj, cls);
                    }
                };
            });

            
            return this;
        },
        CreateDay: function (dayCount, oldDay) {
            //生成日期下拉框
            var defSelUl=$("<ul></ul>");
            var me = this.get(0);
            $(this).empty();
            for (var i = 1; i <= dayCount; i++) {
                var defSelLi = $("<li></li>");
                defSelLi.text(i);
                //如果等于当前年就选中
                if (!isNaN(oldDay)) {
                    if (i == oldDay) {
                        $(me).append("<span class='select down'>"+i+"</span>");
                    }
                }
                defSelUl.append(defSelLi);
            }
            $(me).append(defSelUl);
        },
        SetSelDate:function(dataStr){
            //设置日期
            var nowDate = new Date(dataStr.split("-").join("/"));
            var nYear = nowDate.getFullYear();
            var nMonth = nowDate.getMonth() + 1;
            var nDay = nowDate.getDate();
            var selYear = $(this).next("div").find("#"+$(this).attr("id")+"_selectYear");
            var selMonth = $(this).next("div").find("#"+$(this).attr("id")+"_selectMonth");
            var selDay = $(this).next("div").find("#"+$(this).attr("id")+"_selectDay");

            selYear.children('span').text(nYear);
            selMonth.children('span').text(nMonth);
            selDay.children('span').text(nDay);

            selYear.find("ul li").each(function(i,obj){
                var oldDay = parseInt($(obj).parent().prev().text());
                var curval=parseInt($(obj).text());
                if(oldDay==curval){
                    $(obj).addClass("backbg");
                }else{
                    $(obj).removeClass('backbg');
                }
            });

            selMonth.find("ul li").each(function(i,obj){
                var oldDay = parseInt($(obj).parent().prev().text());
                var curval=parseInt($(obj).text());
                if(oldDay==curval){
                    $(obj).addClass("backbg");
                }else{
                    $(obj).removeClass('backbg');
                }
            });

            selDay.find("ul li").each(function(i,obj){
                var oldDay = parseInt($(obj).parent().prev().text());
                var curval=parseInt($(obj).text());
                if(oldDay==curval){
                    $(obj).addClass("backbg");
                }else{
                    $(obj).removeClass('backbg');
                }
            });
        }
    });
})(jQuery);
