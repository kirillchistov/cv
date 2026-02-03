import { getText } from './i18n';
import type { Lang } from './types';

function setError(fieldName: string, message: string): void {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message || '';
}

function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

export function initForm(): void {
  const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
  const formStatus = document.getElementById('formStatus');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (contactForm.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (contactForm.elements.namedItem('email') as HTMLInputElement).value.trim();
    const message = (
      contactForm.elements.namedItem('message') as HTMLTextAreaElement
    ).value.trim();

    const lang = (document.documentElement.getAttribute('data-lang') || 'ru') as Lang;

    let hasError = false;

    if (!name) {
      setError('name', getText('errName', lang));
      hasError = true;
    } else setError('name', '');

    if (!email) {
      setError('email', getText('errEmailEmpty', lang));
      hasError = true;
    } else if (!validateEmail(email)) {
      setError('email', getText('errEmailBad', lang));
      hasError = true;
    } else setError('email', '');

    if (!message) {
      setError('message', getText('errMsg', lang));
      hasError = true;
    } else setError('message', '');

    if (hasError) {
      if (formStatus) formStatus.textContent = '';
      return;
    }

    const subject = encodeURIComponent(getText('mailSubject', lang));
    const body = encodeURIComponent(
      `${getText('formNameLabel', lang)}: ${name}\nEmail: ${email}\n\n${getText(
        'formMsgLabel',
        lang
      )}:\n${message}`
    );

    const mailtoLink = `mailto:kchistov@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    if (formStatus) formStatus.textContent = getText('formStatus', lang);
  });
}
