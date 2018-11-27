var express = require('express');
// 把mongodb 模块银引入
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

//构建一个mongodb url地址
var url = 'mongodb://127.0.0.1:27017';



//用户的信息保存在users文件里面
// 如果用户访问的是localhost：3000/users
// 用户管理页
router.get('/', function (req, res, next) {
  // 将用户的列表从数据库里捞出来，，操作数据库 mongodb
  // MongoClient 链接url地址，第二个参数是回调函数（client变量）
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    // 如果err存在，链接数据库失败
    if (err) {
      console.log('链接数据库失败', err);
      res.render('error', {
        message: '链接数据库失败',
        error: err
      });
      // return就不再执行下去了
      return;
    }


    // 数据库的名字 得到的是一个数据库的对象
    var db = client.db('station');
    // 选择你要操作的集合（数据表）,查出来.用find（）.以数组的方式暴露出来toArray();
    db.collection('user').find().toArray(function (err, data) {
      // 错误优先处理
      if (err) {
        console.log('查询用户信息错误', err);
        // 有错误就渲染error 这个文件
        res.render('error', {
          message: '查询失败',
          // 将err错误对象传过 error
          error: err
        });
      } else {
        console.log(data);
        // 查询成功之后就把data渲染到页面
        res.render('users', {
          list: data
        });
      }

      // 查询完毕后记得关闭数据库的链接
      client.close();
    });

  });

});



// 登录页面传过来的参数
router.post('/dengLu', function (req, res) {
  // 1. 获取前端传递过来的参数 console.log(req.body);登录获取到的用户名
  var username = req.body.useName;
  var password = req.body.pwdName;

  // 2. 验证参数的有效性，是否为空
  if (!username) {
    res.render('error', {
      message: '用户名不能为空',
      error: new error('用户名不能为空') //这里没有error 自己new一个出去
    });
    return; //return 回去就不往下走了
  }

  if (!password) {
    res.render('error', {
      message: '密码不能为空', //发送到message这个错误文件，在页面输出
      error: new error('密码不能为空')
    })
  }
  // 3. 链接数据库做验证
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      console.log('链接失败', err);
      res.render('error', {
        message: '链接失败',
        error: err
      });
      return;
    }
    //数据库
    var db = client.db('station');
    // 数据库的表查找名和密码
    db.collection('user').find({
      // 数据库里面：登录获取的
      username: username,
      password: password
      //以数组的方式输出 data查询到的值
    }).toArray(function (err, data) {
      if (err) {
        console.log('查询失败', err);
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else if (data.length <= 0) { //data查询到的值
        // 没找到，登录失败
        res.render('error', {
          message: '用户没注册？登录失败',
          error: new Error('用户没注册？登录失败')
        })
      } else {
        // 登录成功，保存到 昵称到cookie，后面的就可以调用
        res.cookie('nickname', data[0].nickname, { //data得到的是数组
          maxAge: 60 * 60 * 1000
        });
        //刷新页面
        res.redirect('/');
      }
      //最后结束请求
      client.close();
    })
  })
  // res.send(' ');注意这里，因为 mongodb 的操作时异步操作
});

// 注册操作 localhost:3000/users/register


// 将router这个方法暴露出去
module.exports = router;