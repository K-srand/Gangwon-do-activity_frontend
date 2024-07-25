const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://223.130.138.174:4040', // 서버 URL or localhost:설정한포트번호
      changeOrigin: true, // 이 옵션을 true로 설정하여 요청의 origin을 대상 URL로 변경
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', 'http://223.130.138.174:3030'); // 클라이언트의 origin을 명시
        proxyReq.setHeader('Access-Control-Allow-Credentials', 'true'); // 자격 증명 허용
      }
    })
  );
};
