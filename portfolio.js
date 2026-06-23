const EMAILJS_PUBLIC_KEY = 'IowBoxZswcW2EgY-E';
const EMAILJS_SERVICE_ID = 'service_sqni29d';
const EMAILJS_TEMPLATE_ID = 'template_up9c47q';

if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
reveals.forEach((reveal) => observer.observe(reveal));

// Stagger cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.07}s`;
});

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

const mailModal = document.getElementById('mailModal');
const openMailBtn = document.getElementById('openMailBtn');
const closeMailBtn = document.getElementById('closeMailBtn');
const sendBtn = document.getElementById('sendBtn');
const mailStatus = document.getElementById('mailStatus');

function openMailModal() {
  mailModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeMailModal() {
  mailModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

function showStatus(message, type) {
  mailStatus.className = `mail-status is-visible is-${type}`;
  mailStatus.textContent = message;
}

function hideStatus() {
  mailStatus.className = 'mail-status';
  mailStatus.textContent = '';
}

async function sendMail() {
  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const subject = document.getElementById('mailSubject').value.trim();
  const message = document.getElementById('mailBody').value.trim();

  if (!name || !email || !subject || !message) {
    showStatus('Please fill in all fields', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('Please enter a valid email address', 'error');
    return;
  }

  if (!window.emailjs) {
    showStatus('Email service is not loaded. Please try again later.', 'error');
    return;
  }

  if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
    showStatus('EmailJS service/template IDs are missing in portfolio.js.', 'error');
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  hideStatus();

  const templateParams = {
    title: subject,
    name,
    time: new Date().toLocaleString(),
    message,
    email
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    showStatus('Message sent successfully!', 'success');
    sendBtn.textContent = 'Sent!';

    document.getElementById('senderName').value = '';
    document.getElementById('senderEmail').value = '';
    document.getElementById('mailSubject').value = '';
    document.getElementById('mailBody').value = '';

    setTimeout(() => {
      closeMailModal();
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    }, 2500);
  } catch (error) {
    console.error('EmailJS error:', error);
    const errorMessage = error?.text || error?.message || 'Please check your EmailJS settings.';
    showStatus(`Message could not be sent: ${errorMessage}`, 'error');
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Message';
  }
}

openMailBtn.addEventListener('click', openMailModal);
closeMailBtn.addEventListener('click', closeMailModal);
sendBtn.addEventListener('click', sendMail);

mailModal.addEventListener('click', (event) => {
  if (event.target === mailModal) {
    closeMailModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMailModal();
  }
});
