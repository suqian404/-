$(function () {
    window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
        //;
        console.log("错误信息：" , errorMessage);
        console.log("出错文件：" , scriptURI);
        console.log("出错行号：" , lineNumber);
        console.log("出错列号：" , columnNumber);
        console.log("错误详情：" , errorObj);
        return true;
     }
    //  判断是否禁止登录
    if(localStorage.getItem("loginEnd")!=null){
        endTimes(localStorage.getItem("loginEnd"))
    }
// 登陆
    $("#loginIn").click(function () {
        
        var name = $('input[name="name"]').val();
        var pwd = $('input[name="pwd"]').val();
        if (name == '') {
            layui.layer.msg('请输入用户名');
            return;
        } else if (pwd == '') {
            layui.layer.msg('请输入密码');
            return;
        }
        if(localStorage.getItem("loginTime")==3){
            $("#loginIn").attr('disabled',true)
            let message = '登录验证失败超过三次，请30s稍后再试'
            failTims(message)
            endTimes(29)    
        }else if(localStorage.getItem("loginTime")>3){
            $("#loginIn").attr('disabled',true)
             
        }else{
            $("#loginIn").attr('disabled',false)
            if(pwd.length < 20){
                $.ajax({
                    type: "POST",
                    url: commonUrl.baseUrl + 'auth/login',
                    data: JSON.stringify({
                        username: name,
                        password: hex_md5(pwd)
                    }),
                    dataType: 'JSON',
                    contentType: 'application/json',
                    success: function (res, b, c) {
                        
                        if (res.code == 200) {
    
                            
                            setCookie("token",res.data,{
                                expires:1,
                                path:"/"
                            });
                            window.location.href = 'index.html'
                            localStorage.removeItem("loginTime")
                            layui.layer.msg(res.mass);
                        }else{
                            failTims(res.mass)
                        }
                    },
                    error: function (XMLHttpRequest,textStatus ,error) {
                        if(error.statusText = 'error'){
                            layui.layer.msg('网络异常');
                            window.location.reload();
                        }
                    }
                });
            }else{
                $.ajax({
                    type: "POST",
                    url: commonUrl.baseUrl + 'auth/login',
                    data: JSON.stringify({
                        username: name,
                        password: pwd
                    }),
                    dataType: 'JSON',
                    contentType: 'application/json',
                    success: function (res, b, c) {
                        
                        if (res.code == 200) {
                            setCookie("token",res.data,{
                                expires:1,
                                path:"/"
                            });
                            window.location.href = 'index.html'
                            localStorage.removeItem("loginTime")
                            layui.layer.msg(res.mass);
                        }else{
                            failTims(res.mass)
                        }
                    },
                    error: function (XMLHttpRequest,textStatus ,error) {
                        console.log(error.statusText)
                        if(error.statusText = 'error'){
                            layui.layer.msg('网络异常');
                            window.location.reload();
                        }
                    }
                });
            }
        }
        

        
    })
    $(document).keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            $("#loginIn").click();
        }
    });
})
// 登录倒计时
function endTimes(timese){
    var handler = setInterval(() => {
        if(timese<=0){
            clearInterval(handler)
            $('#loginIn').attr('disabled',false);
            $('#loginIn').text('登录')
            localStorage.removeItem("loginTime")
            localStorage.removeItem("loginEnd")
        }else{
            timese--
            localStorage.setItem("loginEnd",timese)
            var times = '距离下次登录还剩'+timese+'s'
            $('#loginIn').text(times)
        }
    }, 1000);
}
// 失败次数
function failTims(message){
    let nums = localStorage.getItem("loginTime")==null?0:Number(localStorage.getItem("loginTime"))
    nums++
    layui.layer.msg(message);
    localStorage.setItem("loginTime",nums)
    // if(sessionStorage.getItem("loginTime")>2){
        
    // }else{
    //     console.log(nums,'登录失败次数')
        
        
    // }
}
// 设置cookie
function setCookie(key,val,ops){
    ops = ops || {};
    let e = "";
    if(ops.expires){
        var d = new Date();
        d.setDate(d.getDate() + ops.expires);
        e = ";expires="+d;
    }
    let p = ops.path ? ";path="+ops.path : "";
    document.cookie = `${key}=${val}${p}${e}`;
}
// 获取cookie
function getCookie(key){
    // 1.获取所有cookie
    let strC = document.cookie;
    // 2.使用"; "分隔所有的cookie，单独拿到每一条
    let arrC = strC.split("; ");
    // 3.遍历每一条cookie
    for(var i = 0;i<arrC.length;i++){
        // 4.在此使用"="分隔，分隔成 名字和值的独立的状态
        // 5.判断数组的第一位的名字时否与传进来的获取的cookie的名字一致
        if(arrC[i].split("=")[0] === key){
            // 6.如果一致，返回数组的第二位，也就是对应的值
            return arrC[i].split("=")[1];
        }
    }
    // 7.循环结束后，如果程序还在执行，说明没有找到一致的值，那就返回空字符
    return "";
}



//URL:http://220.248.250.19:18080/
//测试账号:zhaohua    密码:zhaohua123 
//注释请于测试完毕后删除！！！
