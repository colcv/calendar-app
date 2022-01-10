/* eslint-disable */
import { showAlert } from './alert.mjs';
const addForm = document.getElementById('form-add');
const calendarID = document.querySelector('.ting').id;

const addTask = async (title, start, description) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:5000/api/v1/users/me/calendars/${calendarID}/tasks`,
      data: {
        title,
        start,
        description,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Task created');
      window.location.assign(`/calendars/${calendarID}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const start = document.getElementById('start').value;
  const description = document.getElementById('description').value;
  addTask(title, start, description);
});
