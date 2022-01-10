/* eslint-disable */
import { showAlert } from './alert.mjs';
// const events = document.getElementsByClassName('event');
const deleteEvents = document.getElementsByClassName('delete-event');

if (deleteEvents) {
  for (let i = 0; i < deleteEvents.length; ++i) {
    deleteEvents[i].onclick = async function () {
      try {
        if (confirm('Bạn thật sự muốn xóa sự kiện này?')) {
          const res = await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:5000/api/v1/users/me/calendars/${this.id}`,
          });
          if ((res.data.status = 'success')) location.reload(true);
        }
      } catch (err) {
        console.log(err.response);
        showAlert('error', 'Something went wrong, try again!');
      }
    };
  }
}
