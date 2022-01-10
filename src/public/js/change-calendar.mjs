/* eslint-disable */

const calendars = document.getElementsByClassName('my-calendar');

for (let i = 0; i < calendars.length; ++i) {
  calendars[i].addEventListener('click', function () {
    window.location.assign(`/calendars/${this.id}`);
  });
}
