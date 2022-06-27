$(function () {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;
    // 定义事件过滤器
    template.defaults.imports.dataFormat = function (data) {
        const time = new Date(data);

        const y = time.getFullYear();
        const m = time.getMonth() + 1;
        const r = time.getDate();

        let hh = time.getHours();
        hh = hh < 9 ? '0' + hh : hh;
        let mm = time.getMinutes();
        mm = mm < 9 ? '0' + mm : mm;
        let ss = time.getSeconds();
        ss = ss < 9 ? '0' + ss : ss;

        return `${y}-${m}-${r} ${hh}:${mm}:${ss}`
    }

    // 定义请求数据
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initCate();
    initTable();

    // 获取文章列表
    function initTable() {
        // 发起请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                const { status, data, message, total } = res;
                if (status !== 0) return layer.msg(message);;
                // 使用模板引擎渲染页面
                let htmlStr = template('artListTemplate', data);
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }


    // 动态渲染分类筛选函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return layer.msg(res.message);
                let htmlStr = template('artCateTemplate', res.data)
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    // 筛选表单绑定 submit 事件
    $('#form-sec').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',    //分页容器的 Id
            count: total,       // 总数据条数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum,     // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候,触发 jump 回调
            // 触发 jump 回调的方式有两种
            // 1. 点击页码的时候, 会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法,就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值,来判断是通过哪种方式,触发的 jump 回调    
                // 如果 first 的值为 true, 证明是方式二触发的.否则就是方式一
                // 把最新的页码值,复制到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数, 赋值
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表, 并渲染表格
                if (!first) {
                    initTable();
                }
            }
        })
    }
    
    // 使用事件委托 给删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        const id = $(this).attr('data-index')
        // console.log($(this).attr('data-index'));
        layer.confirm('确定要删除吗？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    layer.msg(res.message);
                    if (res.status !== 0) return;
                    initTable();
                }
            })
            layer.close(index);
          });
    })
})