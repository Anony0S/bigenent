$(function () {
  const layer = layui.layer;
  const form = layui.form;
  // 调用函数
  initArtCateList();

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: (res) => {
        const { status, data, message } = res;
        let htmlStr = template("tpl-table", res);
        $("#news").html(htmlStr);
      },
    });
  }

  // 绑定添加类别事件
  let indexAdd = null;
  $("#btnAddClass").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  // 因为表单元素为动态添加，所以使用事件委托的方式给 body 添加submit 事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止默认提交事件
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $('#form-add').serialize(),
      success: res => {
        layer.msg(res.message);
        if (res.status !== 0) return;
        layer.close(indexAdd);
        initArtCateList()
      }
    })
  })

  // 绑定添加类别事件
  let indexEdit = null;
  $('#news').on("click", '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "编辑文章分类",
      content: $("#dialog-edit").html(),
    });

    let id = $(this).attr('data-index')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: res => {
        form.val('form-edit', res.data)
      }
    })
  });


  // 用事件委托给编辑按钮绑定事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止默认提交事件
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $('#form-edit').serialize(),
      success: res => {
        layer.msg(res.message);
        if (res.status !== 0) return;
        layer.close(indexEdit);
        initArtCateList()
      }
    })
  })

  // 使用事件委托给 删除按钮绑定事件
  $('body').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-index');
    layer.confirm('请您三思啊！', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: res => {
          layer.msg(res.message);
          if (res.status !== 0) return
          initArtCateList()
        }
      })
      layer.close(index);
    });
  })

});
