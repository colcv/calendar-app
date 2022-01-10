/* eslint-disable */
import { showAlert } from './alert.mjs';

const register = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/auth/register',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Register successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 0);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const registerForm = document.getElementById('form-1');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    register(name, email, password, password);
  });
}
