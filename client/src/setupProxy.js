const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
// ★ 프록시 서버 : 아이피를 임의로 바꿔줄 수 있어서 인터넷에 접근하는 사람의 ID를 모르게 된다. 또한 보내는 데이터도 임의로 바꿀 수 있다.
//    프록시 서버 사용 이유 : 회사에서 직원들이나 집에 있는 아이들 인터넷(지정한 특정 사이트) 사용 제어, 캐시를 이용해서 더 빠른
//                           인터넷 이용 제공, 더 나은 보안 제공, 이용 제한된 사이트 접근 가능
