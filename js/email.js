
document.addEventListener('DOMContentLoaded', function () {
  emailjs.init('EA2bvatMxBn7nPmPj');

  document
    .getElementById('contact-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = {
        company: document.getElementById('company').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
      };

      emailjs
        .send("service_loqy67w","template_0sozfxe" , formData)
        .then(function (response) {
          alert('성공적으로 전송되었습니다. 감사합니다.');
          location.href = './index.html';
        })
        .catch(function (error) {
          console.error('이메일 전송 실패:', error);
          alert(
            '죄송합니다, 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'
          );
        });
    });
});

