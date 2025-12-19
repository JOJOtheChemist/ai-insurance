const jwt = require('jsonwebtoken');

const JWT_SECRET = 'aB3dF9gH2jK5mN8pQ1rS4tU7vW0xY6zA9bC2dE5fG8hJ';

const payload = {
  sub: 2,
  username: 'yeya'
};

const token = jwt.sign(payload, JWT_SECRET);

console.log('\n生成的 JWT Token:');
console.log(token);
console.log('\n请复制到 HTML 页面的 Token 输入框中');
