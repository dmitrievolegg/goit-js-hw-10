const form = document.querySelector('.feedback-form');
const localStorageKey = 'feedback-form-state';

form.addEventListener('input', onFormData);
form.addEventListener('submit', onSubmitForm);

const formData = {
  email: '',
  message: '',
};

const savedData = JSON.parse(localStorage.getItem(localStorageKey)) ?? {};

if (savedData) {
  const { email, message } = form.elements;
  email.value = savedData.email || '';
  message.value = savedData.message || '';
  formData.email = savedData.email || '';
  formData.message = savedData.message || '';
}

function onFormData(e) {
  const { name, value } = e.target;
  formData[name] = value.trim();
  localStorage.setItem(localStorageKey, JSON.stringify(formData));
}

function onSubmitForm(e) {
  e.preventDefault();

  if (!formData.email || !formData.message) {
    return alert('Fill please all fields');
  }

  console.log(formData);

  localStorage.removeItem(localStorageKey);
  formData.email = '';
  formData.message = '';
  form.reset();
}
