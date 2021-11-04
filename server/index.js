const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');
const config = require('./config/key');

// 비밀로 설정한 정보를 가져오는 것(비밀번호 담김)
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected~!!'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});


app.post('/api/users/login', (req, res) => {
  //요청된 이메일이 데이터베이스에 있는지 확인하고 있다면 비밀번호가 맞는 비번인지 확인하고 맞다면 토큰을 생성해주기.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "해당 이메일로 가입한 유저가 없습니다."
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, messagae: "비밀번호가 틀렸습니다." });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 쿠키에 저장한다. (나중에 로그인한 클라이언트가 쿠키에 가진 토큰값과 DB에 담긴 토큰값이 같은지 비교하게 된다.)
        res.cookie("chococookie", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });

    });
  });
});

// ▼ login : auth 미들웨어로 콜백함수 전에 인증을 도와줌.
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 true라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.roe === 0 ? false : true,
    isAUth: true,
    email: req.user.email,
    name: req.user.name,
    lasname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// ▼ logout
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      });
    }
  );
});

app.listen(port, () => {
  console.log(`http://localhost:${port}에서 만납시다.`);
});