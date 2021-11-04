const { User } = require('../models/User');

let auth = (req, res, next) => {
  // 인증 처리해주는 미들웨어
  // 1. 클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.chococookie;
  // 2. 토큰을 복호화한 후 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    //미들웨어가 빠져나갈 수 있게 next() 넣어주기
    next();
  });
  // 3. 유저가 있으면 인증 ok
  // 4. 유저가 없으면 인증 no
};

module.exports = { auth };