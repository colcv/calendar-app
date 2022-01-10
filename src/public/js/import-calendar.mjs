/* eslint-disable */
import { showAlert } from './alert.mjs';
const calendarImportBtn = document.getElementById('import-calendar');
const importPopup = document.getElementById('import-calendar-popup');
const importForm = document.getElementById('form-import');

const importCalendar = async calendarID => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:5000/api/v1/users/me/calendars/import-calendar`,
      data: { calendarID },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Calendar imported');
      window.location.assign(`/calendars/${calendarID}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

calendarImportBtn.addEventListener('click', () => {
  importPopup.style.display = 'block';
});

const closeBtn = document.getElementsByClassName('close')[0];
closeBtn.onclick = function () {
  importPopup.style.display = 'none';
};

const importBtn = document.getElementById('import-btn');
importForm.addEventListener('submit', e => {
  e.preventDefault();
  const calendarID = document.getElementById('calendar-id-import').value;
  importCalendar(calendarID);
});
