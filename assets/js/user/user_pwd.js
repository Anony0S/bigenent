// 入口函数
$(function() {
    const form = layui.form;
    const layer = layui.layer;
    
    // 定义表单验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '新密码必须 6 ~ 12 位,且不能出现空格!'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) return '新旧密码不能相同!';
        },
        rePwd: function(value) {
            if(value !== $('[name=newPwd]').val()) return '两次密码不一致!'
        }
    })

    // 绑定提交事件
    $('.layui-form').on('submit', (e) => {
        e.preventDefault();
        // 发起请求
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            // !!!!! 注意注意注意::: 箭头函数没有this
            data: $('.layui-form').serialize(),
            success: res => {
                const {status, message} = res;
                if(status !== 0) return layer.msg('更新密码失败!');
                layer.msg(message);
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})