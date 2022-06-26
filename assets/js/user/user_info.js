// 添加昵称 nickname 判断规则
$(function() {
    const form = layui.form;
    const layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if(value.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！"
        }
    }) 

    // 调用用户信息初始化函数
    initUserInfo();

    // 初始化用户信息函数
    function initUserInfo() {
        $.ajax({
            // 已经使用 baseAPI 改变请求头等内容
            method: 'GET',
            url: '/my/userinfo',
            success: res => {
                const {status, message, data} = res;
                if(status !== 0) return layer.msg(message);
                // 使用 layui 里的 from.val() 表单赋值来进行赋值
                form.val('formUserInfo', data)
            },
        })
    }
    
    // 给按钮绑定重置事件
    $('#btnReset').on('click', e => {
        // 阻止表单默认重置事件
        e.preventDefault();
        // 重新调用初始化用户信息函数
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: res => {
                if(res.status !== 0) return layer.msg('修改数据失败！');
                layer.msg('修改数据成功！')
                // 调用父页面中的方法，重新渲染用户信息和头像
                window.parent.getUserInfo();
            }
        })
    })
})