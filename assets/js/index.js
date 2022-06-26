$(function () {
    // 调用 getUserInfo 函数获取用户基本信息
    getUserInfo();
    const layer = layui.layer;

    // 点击登录按钮，实现退出功能
    $('#btnLoginOut').on('click', () => {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            // 1. 清空本地存储中的 token 
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = './login.html'

            // 关闭 confirm 提示框
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: (res) => {
            if (res.status !== 0) return layui.layer.msg("数据请求失败！");
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },

        // 放在全局调用
        // // 不论成功还是失败，都会调用 complete 函数
        // complete: res => {
        //     // 拿到的 res 即请求得到的内容
        //     const {responseJSON,responseJSON:{status, message}} = res;
        //     if(status === 1 && message === '身份认证失败！') {
        //         // 强制清空 token
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页面
        //         location.href = './login.html';
        //     }
        // }
    });
};

// 渲染用户头像函数
function renderAvatar(user) {
    // 1. 获取用户信息
    const name = user.nickname || user.username;
    // 2. 渲染用户信息
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if (!user.user_pic) {
        $('.layui-nav-img').hide();
        // 设置为第一个大写字母或者是中文
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    } else {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    }
}