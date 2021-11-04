const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});
// pre: 저장하기 전에 할 일 정해주는 것
userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        else user.password = hash;
        next();
      });
    });
  } // 이 아래에 next를 넣지 않으면 pre에서 계속 머물게 될 것(Postman 뺑뺑이 오류) 
  else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebktoken으로 토큰 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};


userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // 토큰을 decode 한다
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 데이터베이스에 보관된 token이 일치하는지 확인
    user.findOne({ "_id": decoded, "token": token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};


const User = mongoose.model('User', userSchema);

module.exports = { User };