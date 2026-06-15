const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://audibox-e-commerce.onrender.com/api/admin/login', {
      email: 'admin@dec.com',
      password: 'AudiboxAdmin2026!'
    });
    console.log('STATUS:', res.status);
    console.log('DATA:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('ERROR STATUS:', err.response.status);
      console.log('ERROR DATA:', err.response.data);
    } else {
      console.log('ERROR MESSAGE:', err.message);
    }
  }
}

test();
