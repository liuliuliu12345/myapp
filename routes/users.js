// index跳转过来，代码都写在这里
var express = require('express'); //ejs模块的功能
var router = express.Router(); //ejs模块功能调用
var multer = require('multer'); //图片上传功能
var MongoClient = require('mongodb').MongoClient; //链接数据库
var async = require("async"); //异步
var ObjectId = require('mongodb').ObjectId; //获取mongodb 数据库的id
var url = 'mongodb://127.0.0.1:27017';
var upload = multer({ //存到本地的图片路径
  dest: 'F:/tmp'
});
var fs = require('fs'); //提供了一些使用函数，用于处理url与解析。
var path = require('path'); //处理文件与目录的路径



// =========================信息增加，用户管理==================
// 用户管理,信息分页
router.get('/', function (req, res, next) {
  var page = parseInt(req.query.page) || 1; //前端传过来的页面，默认为第一页
  var pageSize = parseInt(req.query.pageSize) || 5; //每页显示的条数
  var totalSize = 0; //总条数得查询数据库得来
  var data = [];

  // 将用户的数据从数据库里捞出来，，操作数据库 mongodb
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
        // console.log(isAdmin + "=================");
        res.render('users', {
          // 渲染到页面
          list: results[1],
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page,
        })
      }
    })
  });

});

// 用户模糊搜索
router.post('/search', function (req, res, next) {
  // res.send('===============')
  var page = parseInt(req.query.page) || 1; //前端传过来的页面，默认为第一页
  var pageSize = parseInt(req.query.pageSize) || 5; //每页显示的条数
  var totalSize = 0; //总条数得查询数据库得来
  var search = req.body.iptText; //获取 页面搜索值
  inputName = new RegExp(search); //nodejs转一下正则
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

    // 链接成功，数据库的名字 得到的是一个数据库的对象
    var db = client.db('station');
    async.series([
      function (cb) {
        db.collection('user').find({
          username: inputName
        }).count(function (err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },
      function (cb) {
        db.collection('user').find({
          username: inputName
        }).limit(pageSize).skip(page * pageSize - pageSize).toArray(function (err, data) {
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
          // 渲染到页面
          list: results[1],
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page
        })
      }
    })
  });

});

// 手机管理，信息分页
router.get('/phone', function (req, res) {
  // res.send('===================')
  var page = parseInt(req.query.page) || 1; //前端传过来的页面，默认为第一页
  var pageSize = parseInt(req.query.pageSize) || 3; //每页显示的条数
  var totalSize = 0; //总条数得查询数据库得来
  var data = [];

  // 将用户的列表从数据库里捞出来，，操作数据库 mongodb
  // MongoClient 链接url地址，第二个参数是回调函数（client变量）
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) { //链接url地址
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

    // console.log(1);
    // 数据库的名字 得到的是一个数据库的对象
    var db = client.db('station');
    async.series([
      function (cb) {
        db.collection('phone').find().count(function (err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },
      function (cb) {
        db.collection('phone').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function (err, data) {
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
        res.render('phone', {
          // 渲染到页面
          list: results[1],
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page,
          // isAdmin: data[0].isAdmin, //获取cookie里面的数据
          // nickname: data[0].nickname

        })

      }
    })
  });

});

// 品牌管理,品牌到数据库渲染数据
router.get('/brand', function (req, res) {
  var page = parseInt(req.query.page) || 1; //前端传过来的页面，默认为第一页
  var pageSize = parseInt(req.query.pageSize) || 4; //每页显示的条数
  var totalSize = 0; //总条数得查询数据库得来
  var data = [];

  // 将用户的列表从数据库里捞出来，，操作数据库 mongodb
  // MongoClient 链接url地址，第二个参数是回调函数（client变量）
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) { //链接url地址
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

    console.log(1);
    // 数据库的名字 得到的是一个数据库的对象
    var db = client.db('station');
    async.series([
      function (cb) {
        db.collection('drandname').find().count(function (err, num) {
          if (err) {
            cb(err);
          } else {
            totalSize = num;
            cb(null);
          }
        })
      },
      function (cb) {
        db.collection('drandname').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function (err, data) {
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

        res.render('brand', {
          // 渲染到页面
          list: results[1],
          totalPage: totalPage,
          pageSize: pageSize,
          currentPage: page

        })

      }
    })
  });

  // ==============
  // MongoClient.connect(url, {
  //   useNewUrlParser: true
  // }, function (err, client) {
  //   if (err) {
  //     res.render('error', {
  //       message: '链接失败',
  //       error: err
  //     })
  //     return;
  //   }
  //   var db = client.db('station');
  //   db.collection('drandname').find().toArray(function (err, data) {
  //     if (err) {
  //       res.render('error', {
  //         message: '失败',
  //         error: err
  //       })
  //       return;
  //     }
  //     // console.log(data + '=======================');
  //     res.render('brand', {
  //       //后台渲染到的参数传到前端的
  //       list: data
  //     });

  //     // 不管成功与否都要结束
  //     client.close();
  //   })
  // })


});

// 品牌增加
router.post('/addBrand', upload.single('drandLogo'), function (req, res) {
  // res.send(req.body)
  // 如果想要通过浏览器访问到这张图片的话，是不是需要将图片放到 public里面img去
  var filename = 'images/' + new Date().getTime() + '_' + req.file.originalname;
  var newFileName = path.resolve(__dirname, '../public/', filename); //public文件夹下面的 filename
  try {
    // fs.renameSync(req.file.path, newFileName);
    var data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFileName, data);

    // console.log(req.body);
    // res.send('上传成功');
    // 操作数据库写入
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {

      var db = client.db('station');
      db.collection('drandname').insertOne({
        //数据库商品名：接收要增加商品的名
        drandname: req.body.drandname,
        drandLogo: filename
      }, function (err) {
        res.redirect('/brand.html');
      })

    })

  } catch (error) {
    res.render('error', {
      message: '新增手机失败',
      error: error
    })
  }

})

// 手机增加
router.post('/addPhone', upload.single('fileImages'), function (req, res) {
  // res.send(req.body)
  // 如果想要通过浏览器访问到这张图片的话，是不是需要将图片放到 public里面img去
  var filename = 'images/' + new Date().getTime() + '_' + req.file.originalname;
  var newFileName = path.resolve(__dirname, '../public/', filename); //public文件夹下面的 filename
  try {
    // fs.renameSync(req.file.path, newFileName);
    var data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFileName, data);

    // console.log(req.body);
    // res.send('上传成功');
    // 操作数据库写入
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {

      var db = client.db('station');
      db.collection('phone').insertOne({
        //数据库商品名：接收要增加商品的名
        phonename: req.body.phoneName,
        Fendername: req.body.Fendername,
        Msrpname: req.body.Msrpname,
        ErshouMsrp: req.body.ErshouMsrp,
        images: filename
      }, function (err) {
        res.redirect('/phone.html');
      })

    })

  } catch (error) {
    res.render('error', {
      message: '新增手机失败',
      error: error
    })
  }

})



// =========================登录，注册============================

// 登录页面传到index的参数
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
        // 登录成功， 保存到 昵称到cookie， 后面的就可以调用
        res.cookie('nickname', data[0].nickname, { //data得到的是数组
          maxAge: 60 * 60 * 1000
        });
        res.cookie('isAdmin', data[0].isAdmin, { //管理员存到cookie
          maxAge: 60 * 60 * 1000
        });
        // res.render('index', {
        //   isAdmin: data[0].isAdmin, //获取cookie里面的数据
        //   nickname: data[0].nickname
        // })


        //刷新页面
        res.redirect('/')
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


//============================删除操作===========================
//用户操作删除 
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

// 手机信息删除
router.get('/deletePhone', function (req, res) {
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
    db.collection('phone').deleteOne({
      _id: ObjectId(id)
    }, function (err, data) {
      console.log(data);
      if (err) {
        res.render('error', {
          message: '删除失败',
          error: err
        })

      } else {
        // 删除成功，手机页面刷新
        res.redirect('/phone.html');
      }
    })
  })
});

// 手机品牌删除
router.get('/deletebrand', function (req, res) {
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
    db.collection('drandname').deleteOne({
      _id: ObjectId(id)
    }, function (err, data) {
      console.log(data);
      if (err) {
        res.render('error', {
          message: '删除失败',
          error: err
        })

      } else {
        // 删除成功，手机页面刷新
        res.redirect('/brand.html');
      }
    })
  })
});

// 退出删除cookie
router.get('/clearCookie', function (req, res, next) {
  // res.send('==================')
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');
  res.redirect('/dengLu.html'); //页面跳转
})


// =========================修改操作==============================
// 品牌信息修改
router.post("/xiuBrand", upload.single('drandLogo'), function (req, res) {
  // res.send('========================================')
  // upload.single('drandLogo')上传图片的
  // 如果想要通过浏览器访问到这张图片的话，是不是需要将图片放到 public里面img去
  var filename = 'images/' + new Date().getTime() + '_' + req.file.originalname;
  var newFileName = path.resolve(__dirname, '../public/', filename); //public文件夹下面的 filename
  try {
    // fs.renameSync(req.file.path, newFileName);
    var data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFileName, data);

    // console.log(req.body);
    // res.send('上传成功');
    // 操作数据库写入
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {

      var db = client.db('station');
      db.collection('drandname').update({
        _id: ObjectId(req.body.brandName1)
      }, {
        $set: {
          drandLogo: filename,
          drandname: req.body.brandName2
        }
      }, function (err) {
        // 修改成功跳转
        // res.send('=====================================')
        res.redirect('/brand.html');
      })

    })

  } catch (error) {
    res.render('error', {
      message: '品牌信息修改失败',
      error: error
    })
  }

});

// 用户信息修改
router.post("/userAlter", function (req, res) {
  // res.send('========================================')
  try {
    // // fs.renameSync(req.file.path, newFileName);
    // var data = fs.readFileSync(req.file.path);
    // fs.writeFileSync(newFileName, data);

    // console.log(req.body);
    // res.send('上传成功');
    // 操作数据库写入
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {

      var db = client.db('station');
      db.collection('user').update({ //集合，数据库表
        _id: ObjectId(req.body.phoneName) //id
      }, {
        $set: {
          username: req.body.userName1, //用户名
          nickname: req.body.userName2, //昵称
          phonename: req.body.Msrpname, //手机号码
          sex: req.body.ErshouMsrp, //性别
          age: req.body.ageName, //年龄
          isAdmin: req.body.isAdmin
        }
      }, function (err) {
        // 修改成功跳转
        // res.send('=====================================')
        res.redirect('/users');
      })

    })

  } catch (error) {
    res.render('error', {
      message: '修改信息失败',
      error: error
    })
  }

});

// 手机信息修改
router.post("/xiuPhone", upload.single('phoneImages'), function (req, res) {
  // res.send('========================================')
  // upload.single('drandLogo')上传图片的
  // 如果想要通过浏览器访问到这张图片的话，是不是需要将图片放到 public里面img去
  var filename = 'images/' + new Date().getTime() + '_' + req.file.originalname;
  var newFileName = path.resolve(__dirname, '../public/', filename); //public文件夹下面的 filename
  try {
    // fs.renameSync(req.file.path, newFileName);
    var data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFileName, data);

    // console.log(req.body);
    // res.send('上传成功');
    // 操作数据库写入
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {

      var db = client.db('station');
      db.collection('phone').update({ //phone数据表
        _id: ObjectId(req.body.phoneNameID)
      }, {
        $set: {
          phonename: req.body.phoneName, //名称
          Fendername: req.body.FenderName, //所属品牌
          Msrpname: req.body.Msrpname, //官方指导
          ErshouMsrp: req.body.ErshouMsrp, //二手回收价
          images: filename
        }
      }, function (err) {
        // 修改成功跳转
        // res.send('=====================================')
        res.redirect('phone');
      })

    })

  } catch (error) {
    res.render('error', {
      message: '修改手信息机失败',
      error: error
    })
  }

});





// 将router这个方法暴露出去
module.exports = router;