/* eslint-disable */
import { showAlert } from './alert.mjs';

const shareForm = document.querySelector('.form-share');
const calendarID = document.querySelector('.ting').id;

const shareCalendar = async email => {
  try {
    showAlert('success', 'Sending email...');
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:5000/api/v1/users/me/calendars/${calendarID}/share/${email}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Calendar share invitation has been sent');
      window.location.assign(`/calendars/${calendarID}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

shareForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  shareCalendar(email);
});
