export default {
  init() {
    // Add padding to top block based on header height
    const addTopBlockPadding = () => {
      $('body main > div:first-of-type').css({ paddingTop: $('#site-header').height() });
    };
    addTopBlockPadding();

    let lastScrollY = $(window).scrollTop();

    $(window).on('scroll', function () {
      let currentScrollY = $(this).scrollTop();

      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        $('body').addClass('hideHeader');
      } else if (currentScrollY < lastScrollY) {
        $('body').removeClass('hideHeader');
      }

      lastScrollY = currentScrollY;
    });

    window.addEventListener('resize', () => {
      addTopBlockPadding();
    });

    // Offcanvas toggle functionality
    $('.offcanvas-toggle').on('click', () => {
      $('body').toggleClass('offcanvas-open');
    });

    $('.toggle-search').on('click', () => {
      $('#search-form').toggleClass('active');
    });

    // Region selector logic
    const initRegionSelector = () => {
      const regionSelector = document.getElementById('region-selector');
      if (!regionSelector) return;

      const currentPath = window.location.pathname;
      if (currentPath.includes('/americas')) {
        regionSelector.value = 'americas';
      } else if (currentPath.includes('/emea')) {
        regionSelector.value = 'emea';
      } else if (currentPath.includes('/apac')) {
        regionSelector.value = 'apac';
      }

      regionSelector.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const redirectUrl = selectedOption.getAttribute('data-url');
        window.location.href = redirectUrl;
      });
    };

    initRegionSelector();

    const contactToggle = document.getElementById('contact-toggle');
    const contactContainer = document.getElementById('contact-container');

    if (contactToggle && contactContainer) {
      contactToggle.addEventListener('click', () => {
        contactContainer.classList.toggle('translate-y-full');
      });
    }

    const termsCheckbox = document.getElementById('contact-terms');
    const submitButton = document.getElementById('submit-button');

    const toggleSubmitButton = () => {
      if (submitButton) {
        submitButton.disabled = !termsCheckbox.checked;
      }
    };

    if (termsCheckbox) {
      termsCheckbox.addEventListener('click', toggleSubmitButton);
    }

    const form = document.querySelector('form.contact-form');
    const recaptchaSiteKey = document.querySelector('meta[name="recaptcha-site-key"]').getAttribute('content');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!window.grecaptcha) {
          alert('reCAPTCHA failed to load. Please try again.');
          return;
        }

        grecaptcha.ready(async () => {
          try {
            const token = await grecaptcha.execute(recaptchaSiteKey, { action: 'submit' });
            const recaptchaInput = document.getElementById('g-recaptcha-response');

            if (!recaptchaInput) {
              console.error('reCAPTCHA input field is missing from the form.');
              return;
            }

            recaptchaInput.value = token;

            form.submit();
          } catch (error) {
            alert('Failed to verify reCAPTCHA. Please try again.');
            console.error('reCAPTCHA error:', error);
          }
        });
      });
    }
  },
};
