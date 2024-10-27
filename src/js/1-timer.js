import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  timer: document.querySelector('.timer'),
  input: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  button: document.querySelector('[data-start]'),
};

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < Date.now()) {
      iziToast.error({
        timeout: 2000,
        position: 'topRight',
        title: 'Error',
        message: 'Please choose a date in the future!',
      });

      refs.button.setAttribute('disabled', 'true');
    } else {
      refs.button.removeAttribute('disabled');

      iziToast.success({
        timeout: 2000,
        position: 'topRight',
        title: 'OK',
        message: 'You can press START',
      });
    }
  },
};

flatpickr(refs.input, options);

const timer = {
  timerId: null,
  disable: (refs.button.disabled = true),

  start() {
    this.timerId = setInterval(() => {
      const currentDate = Date.now();

      const delta = userSelectedDate - currentDate;

      if (delta <= 0) {
        clearInterval(this.timerId);
        updateClockFace(convertMs(0));
        refs.input.disabled = false;
        return;
      }

      const time = convertMs(delta);
      updateClockFace(time);
    }, 1000);

    iziToast.info({
      position: 'topRight',
      title: 'Caution',
      message: 'Please, wait until the time is out',
    });
  },
};

refs.button.addEventListener('click', () => {
  if (timer.timerId) {
    clearInterval(timer.timerId);
  }

  timer.start();
  refs.button.disabled = true;
  refs.input.disabled = true;
});

const addLeadingZero = value => {
  return String(value).padStart(2, '0');
};

function updateClockFace(time) {
  const { days, hours, minutes, seconds } = refs;

  days.textContent = addLeadingZero(time.days);
  hours.textContent = addLeadingZero(time.hours);
  minutes.textContent = addLeadingZero(time.minutes);
  seconds.textContent = addLeadingZero(time.seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
