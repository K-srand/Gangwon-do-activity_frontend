const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://223.130.138.174:4040',	// 서버 URL or localhost:설정한포트번호
      changeOrigin: true,
    })
  );
};