/* eslint-disable */
import { showAlert } from './alert.mjs';
const editForm = document.querySelector('.form-edit');
const calendarID = document.querySelector('.ting').id;
const eventID = document.querySelector('.tong').id;

const editEvent = async (
  title,
  start,
  end,
  location,
  organizer,
  description
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:5000/api/v1/users/me/calendars/${calendarID}/events/${eventID}`,
      data: {
        title,
        start,
        end,
        location,
        organizer,
        description,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Event updated');
      window.location.assign(`/calendars/${calendarID}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

editForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const location = document.getElementById('location').value;
  const organizer = document.getElementById('organizer').value;
  const description = document.getElementById('description').value;
  editEvent(title, start, end, location, organizer, description);
});
