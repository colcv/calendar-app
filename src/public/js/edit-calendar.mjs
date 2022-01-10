/* eslint-disable */
import { showAlert } from './alert.mjs';
const addForm = document.getElementById('form-add');
const calendarID = document.querySelector('.ting').id;

const addCalendar = async (title, description) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:5000/api/v1/users/me/calendars/${calendarID}`,
      data: { title, description },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Calendar updated');
      window.location.assign(`/calendars/${calendarID}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  addCalendar(title, description);
});
