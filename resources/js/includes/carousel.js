export default {
  init() {
    const carousel = document.querySelector('.carousel');

    const slides = carousel?.querySelectorAll('.carousel-slide');

    const durations = slides?.length ? [...slides].map(slide => {
      const duration = slide?.dataset?.duration;
      return duration ? parseInt(duration, 10) * 1000 : 2000;
    }) : [2000];

    $('.carousel').slick({
      autoplay: true,
      autoplaySpeed: durations[0],
      arrows: true,
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      nextArrow: nextArrow,
      prevArrow: prevArrow,
      appendDots: carousel,
    });

    const slickInstance = $('.carousel').slick('getSlick');

    $('.carousel').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
      const newSpeed = durations[nextSlide] || 2000;
      slickInstance.slickSetOption('autoplaySpeed', newSpeed, false);

      const current = slick.$slides[currentSlide];
      const next = slick.$slides[nextSlide];

      const iframe = $(next).find('iframe');
      iframe.css('visibility', 'hidden');
      const src = iframe.attr('src');
      iframe.attr('src', '');
      setTimeout(() => {
        iframe.attr('src', src);
        iframe.css('visibility', 'visible');
      }, 10);

      const currentVideo = $(current).find('video');
      if (currentVideo.length) {
        currentVideo[0].pause();
        currentVideo[0].currentTime = 0;
        currentVideo[0].muted = true;
      }

      const nextVideo = $(next).find('video');
      if (nextVideo.length) {
        nextVideo[0].muted = true;
        nextVideo[0].play();
      }
    });

    /*
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        const arrows = document.querySelectorAll('.slick-arrow');
        arrows.forEach(arrow => {
          arrow.classList.remove('opacity-0');
          arrow.classList.add('opacity-100');
        });
      });

      carousel.addEventListener('mouseleave', () => {
        const arrows = document.querySelectorAll('.slick-arrow');
        arrows.forEach(arrow => {
          arrow.classList.add('opacity-0');
          arrow.classList.remove('opacity-100');
        });
      });
    }
    */

    document.querySelectorAll('.slick-arrow').forEach(arrow => {
      arrow.addEventListener('click', () => {
        const videos = document.querySelectorAll('.carousel video');
        videos.forEach(video => {
          video.muted = true;
        });
      });
    });
  },
};

export const prevArrow = `
  <button
    class="slick-arrow slick-arrow--prev absolute top-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style="transform: translateY(50%); left: 2rem;"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 192"
      class="size-12 rotate-180"
    >
      <polygon
        class="fill-minova-gold"
        points="17.74 14.43 11.06 28.16 159.02 94.54 12.54 163.88 19.23 177.6 180.9 101.21 180.9 88.6 17.74 14.43"
      />
    </svg>
  </button>`;

export const nextArrow = `
  <button
    class="slick-arrow slick-arrow--next absolute top-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style="transform: translateY(50%); right: 2rem;"
  >
     <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 192"
      class="size-12"
    >
      <polygon
        class="fill-minova-gold"
        points="17.74 14.43 11.06 28.16 159.02 94.54 12.54 163.88 19.23 177.6 180.9 101.21 180.9 88.6 17.74 14.43"
      />
    </svg>
  </button>`;
