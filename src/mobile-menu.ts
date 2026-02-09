export function initMobileMenu(): void {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const contactMobileLink = document.getElementById('contactMobileLink');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  if (contactMobileLink && mobileMenu) {
    contactMobileLink.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  }
}
