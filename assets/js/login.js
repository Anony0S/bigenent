$(function () {
    $("#link_reg").click(function () {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link_login").click(function () {
        $(".reg-box").hide();
        $(".login-box").show();
    });

    const form = layui.form;
    const layer = layui.layer
    // 定义校验规则
    form.verify ({
        // 自定义一个叫 pwd 的校验规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 校验两次密码是否一致的规则
        repwd: (val) => {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            const pwd = $(".reg-box [name=password").val();
            if (pwd !== val) return "两次密码不一致"
        },
    });

    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        console.log(1);
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val().trim(),
                password: $('.reg-box [name=password]').val(),
            },
            success: res => {
                const {status, message} = res;
                layer.msg(message)
                if(status !== 0) return
                // 注册成功后跳转到登录界面
                $('#link_login').click();
            }
        })
    })

    // 监听登录表单，发送登录请求。
    $('#form-login').on('submit', function(e) {
        e.preventDefault();
        const data = $('#form-login').serialize();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data,
            success: res => {
                const {status, message} = res;
                layer.msg(message);
                if(status !== 0) return
                // 登录成功之后将 token 保存到 localStorage
                localStorage.setItem("token", res.token)
                location.href = "./index.html" 
            },
        })
    })
});
