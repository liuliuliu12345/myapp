// 首页的js
var express = require('express');
var router = express.Router();

/* GET home page. */
// 用到这个express的时候，处理中间件的一个函数，next这个是引用下一个函数，写这个才会到下一个文件访问
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

// 用户管理,如果url地址响应的数据，就会调用这个函数返回给前端
// router.get('/users.html', function (req, res) {
//   res.render('users'); //页面
// });

// 手机管理
router.get('/phone.html', function (req, res) {
  res.render('phone');
});

// 品牌管理
router.get('/brand.html', function (req, res) {
  res.render('brand');
});

// 首页
router.get('/shouYe.html', function (req, res) {
  res.render('shouYe');
});

//注册页面
router.get('/zhuCe.html', function (req, res) {
  res.render('zhuCe');
});

// url地址栏输入的 get请求登录页面
router.get('/dengLu.html', function (req, res) {
  res.render('dengLu');
});




module.exports = router;