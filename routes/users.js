var express = require('express');
// 把mongodb 模块银引入
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require("async");
var router = express.Router();

//构建一个mongodb url地址
var url = 'mongodb://127.0.0.1:27017';



//用户的信息保存在users文件里面 如果用户访问的是localhost：3000/users
// 用户管理页,用户信息分页
router.get('/', function (req, res, next) {
  var page = parseInt(req.query.page) || 1; //页面
  var pageSize = parseInt(req.query.pageSize) || 5; //每页显示的条数
  var totalSize = 0; //总条数
  var data = [];

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
    async.series([
      function (cb) {
        db.collection('user').find().count(function (err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },
      function (cb) {
        db.collection('user').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function (err, data) {
          if (err) {
            cb(err)
          } else {
            cb(null, data)
          }
        })
      }
    ], function (err, results) {
      if (err) {
        res.render('error', {
          message: '错误',
          error: err
        })
      } else {
        var totalPage = Math.ceil(totalSize / pageSize); //总页数
        // console.log(totalPage);
        res.render('users', {
          list: results[1],
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page

        })
      }
    })



    // 选择你要操作的集合（数据表）,查出来.用find（）.以数组的方式暴露出来toArray();
    // db.collection('user').find().toArray(function (err, data) {
    //   // 错误优先处理
    //   if (err) {
    //     console.log('查询用户信息错误', err);
    //     // 有错误就渲染error 这个文件
    //     res.render('error', {
    //       message: '查询失败',
    //       // 将err错误对象传过 error
    //       error: err
    //     });
    //   } else {
    //     console.log(data);
    //     // 查询成功之后就把data渲染到页面
    //     res.render('users', {
    //       list: data
    //     });
    //   }

    //   // 查询完毕后记得关闭数据库的链接
    //   client.close();
    // });
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

// 注册操作后台验证 localhost:3000/users/register
router.post('/zhuCe', function (req, res) {
  // 注册传过来的参数
  var userNameVal = req.body.userNameVal;
  var pwdNameVal = req.body.pwdNameVal;
  var niChengVal = req.body.niChengVal;
  var phoneVal = req.body.phoneVal;
  var sex = req.body.sex;
  var age = parseInt(req.body.age);
  var isAdmin = req.body.isAdmin === '是' ? true : false;

  // 链接数据库做验证
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    // 如果有错误
    if (err) {
      console.log('链接数据库失败');
      res.render('error', {
        message: '链接数据库失败',
        error: err
      })
      return;
    };
    // 成功连接数据库
    var db = client.db('station');
    // 串行无关联
    async.series([
      function (cb) {
        db.collection('user').find({
          username: userNameVal
        }).count(function (err, num) {
          if (err) {
            cb(err); //错误
          } else if (num > 0) { //名字数大于0，有人了
            cb(new Error('此用户已经被注册了'));
          } else {
            // 可以注册
            cb(null);
          }
        });
      },
      // 注册添加到数据库
      function (cb) {
        db.collection('user').insertOne({
          username: userNameVal,
          password: pwdNameVal,
          nickname: niChengVal,
          age: age,
          sex: sex,
          isAdmin: isAdmin,
          phonename: phoneVal
        }, function (err) {
          if (err) {
            cb(err); //添加到数据库失败
          } else {
            cb(null);
          }
        })
      }
    ], function (err, result) { //成功
      if (err) { //如果有错误
        res.render('error', {
          message: '注册失败',
          error: err
        })
      } else {
        res.redirect('/dengLu.html');
      }
      // 不管成功or失败都结束操作，不执行下面的
      client.close();
    })
  });
});

//在页面删除用户操作 
router.get('/delete', function (req, res) {
  var id = req.query.id;

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      res.render('error', {
        message: '链接失败',
        error: err
      })
      return;
    }
    var db = client.db('station');
    db.collection('user').deleteOne({
      _id: ObjectId(id)
    }, function (err, data) {
      console.log(data);
      if (err) {
        res.render('error', {
          message: '删除失败',
          error: err
        })

      } else {
        // 删除成功，页面刷新
        res.redirect('/users');
      }
    })
  })
});




// 将router这个方法暴露出去
module.exports = router;