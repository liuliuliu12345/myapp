var express = require('express');
var router = express.Router();
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var async = require("async");

var url = 'mongodb://127.0.0.1:27017';
var upload = multer({ //存到本地的图片路径
  dest: 'C:/tmp'
});
var fs = require('fs');
var path = require('path');



/* GET home page. */
// 用到这个express的时候，处理中间件的一个函数，next这个是引用下一个函数，写这个才会到下一个文件访问
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


// 首页的js,index只是起到一个页面跳转的作用,代码功能不再这里写

// 用户管理,如果url地址响应的数据，就会调用这个函数返回给前端，用户管理不写这里就url就登陆不了
// router.get('/users.html', function (req, res) {
//   res.render('users'); //页面
// });

// 手机管理，到数据库渲染数据
router.get('/phone.html', function (req, res) {
  res.redirect('/users/phone'); //页面
});


// 品牌管理,品牌到数据库渲染数据
router.get('/brand.html', function (req, res) {
  res.redirect('/users/brand'); //找到users页面的 brand
});


// 首页
router.get('/shouYe.html', function (req, res) {
  res.render('shouYe');
});

//注册页面
router.get('/zhuCe.html', function (req, res) {
  res.render('zhuCe');
});

// 登录页面url地址栏输入的 get请求登录页面
router.get('/dengLu.html', function (req, res) {
  res.render('dengLu');
});




module.exports = router;