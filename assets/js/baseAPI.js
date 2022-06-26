$.ajaxPrefilter(option => {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    option.url = `http://www.liulongbin.top:3007` + option.url;
    // 统一为有权限的接口，设置 headers 请求头
    if (option.url.indexOf("/my/") !== -1) {
        option.headers = {
            Authorization: localStorage.getItem("token"),
        };
    }

    // 全局统一挂载 complete 函数
    option.complete = function (res) {
        // 拿到的 res 即请求得到的内容
        const { responseJSON, responseJSON: { status, message } } = res;
        if (status === 1 && message === '身份认证失败！') {
            // 强制清空 token
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = './login.html';
        }
    }
})