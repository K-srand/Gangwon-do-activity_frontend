const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://3.36.27.202:4040', // 서버 URL or localhost:설정한포트번호
      changeOrigin: true // 이 옵션을 true로 설정하여 요청의 origin을 대상 URL로 변경
    })
  );
};
