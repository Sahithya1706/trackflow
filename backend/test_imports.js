
try {
  require('dotenv').config();
  console.log('dotenv ok');
  require('express');
  console.log('express ok');
  require('socket.io');
  console.log('socket.io ok');
  require('cookie-parser');
  console.log('cookie-parser ok');
  require('cors');
  console.log('cors ok');
  require('helmet');
  console.log('helmet ok');
  require('express-mongo-sanitize');
  console.log('express-mongo-sanitize ok');
  require('xss-clean');
  console.log('xss-clean ok');
  require('express-rate-limit');
  console.log('express-rate-limit ok');
} catch (err) {
  console.error('Error found:', err.code, err.message);
}
