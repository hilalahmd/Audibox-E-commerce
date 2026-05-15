const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@dec.com',
      password: 'password'
    });
    
    console.log('Login Response:', res.data);
    console.log('Role is:', res.data.role);

    const token = res.data.token;
    let cookie = res.headers['set-cookie'];
    if (Array.isArray(cookie)) {
      cookie = cookie.join('; ');
    }

    const profile = await axios.get('http://localhost:5000/api/admin/profile', {
      headers: {
        Authorization: 'Bearer ' + token,
        Cookie: cookie
      }
    });

    console.log('Profile Response:', profile.data);
  } catch (err) {
    if (err.response) {
      console.error('Error Response:', err.response.status, err.response.data);
    } else {
      console.error('Error Message:', err.message);
    }
  }
}

testLogin();
