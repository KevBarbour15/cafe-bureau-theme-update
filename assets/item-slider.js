class ItemSlider extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.imageCount = this.getAttribute('data-image-count');
    if (this.imageCount <= 1) return;

    this.emblaNode = this.querySelector('.embla');
    this.prevBtnNode = this.querySelector('.embla__button--prev');
    this.nextBtnNode = this.querySelector('.embla__button--next');
    this.buttonsNode = this.querySelector('.embla__buttons');
    this.slideCount = this.querySelector('.embla__count');
    this.slideNodes = this.querySelectorAll('.embla__slide');
    this.dotsNode = this.querySelector('.embla__dots');
    this.autoPlay = this.getAttribute('autoPlay') === 'true';
    this.showCount = this.getAttribute('showCount') === 'true';
    this.useChips = this.getAttribute('useChips') === 'true';
    this.autoPlayInterval = parseFloat(this.getAttribute('autoPlayInterval'));
    this.fade = this.getAttribute('fade') === 'true';
    this.initializeCarousel();
  }

  initializeCarousel() {
    const observer = new MutationObserver(() => {
      // DATA ATTRIBUTES
      const showButtons = this.dataset.showButtons == '' && true;
      const showDots = this.dataset.showDots == '' && true;
      const showCount = this.dataset.showCount == '' && true;

      const disabledAtMd = this.dataset.disabledAtMd === '' && true;
      const disabledAtLg = this.dataset.disabledAtLg == '' && true;
      const disabledAtXlg = this.dataset.disabledAtXlg == '' && true;

      const alignCenter = this.dataset.alignCenter == '' && true;
      const alignCenterAtMd = this.dataset.alignCenterAtMd == '' && true;
      const alignCenterAtLg = this.dataset.alignCenterAtLg == '' && true;
      const alignCenterAtXlg = this.dataset.alignCenterAtXlg == '' && true;

      const disableLoopAtMd = this.dataset.disableLoopAtMd == '' && true;
      const disableLoopAtLg = this.dataset.disableLoopAtLg == '' && true;
      const disableLoopAtXlg = this.dataset.disableLoopAtXlg == '' && true;

      // OPTIONS

      const setBreakpointOptions = () => {
        const base = '(min-width: 0px)';
        const sm = '(min-width: 420px)';
        const md = '(min-width: 767px)';
        const lg = '(min-width: 992px)';
        const xl = '(min-width: 1440px)';

        let breakpoints = {
          [base]: { active: true, align: 'start', loop: true },
          [sm]: {},
          [md]: {},
          [lg]: {},
          [xl]: {},
        };

        // ALIGN
        if (alignCenter) {
          breakpoints[base].align = 'center';
        }
        if (alignCenterAtMd) {
          breakpoints[md].align = 'center';
        }
        if (alignCenterAtLg) {
          breakpoints[lg].align = 'center';
        }
        if (alignCenterAtXlg) {
          breakpoints[xl].align = 'center';
        }

        // ACTIVE
        if (disabledAtMd) {
          breakpoints[md].active = false;
        }
        if (disabledAtLg) {
          breakpoints[lg].active = false;
        }
        if (disabledAtXlg) {
          breakpoints[xl].active = false;
        }

        // LOOP
        if (disableLoopAtMd) {
          breakpoints[md].loop = false;
        }
        if (disableLoopAtLg) {
          breakpoints[lg].loop = false;
        }
        if (disableLoopAtXlg) {
          breakpoints[xl].loop = false;
        }

        return breakpoints;
      };

      let options = {
        slidesToScroll: 1,
        breakpoints: setBreakpointOptions(),
      };

      // CHECK FOR EMBLA
      if (this.emblaNode) {
        let plugins = [];
        if (this.autoPlay) {
          plugins.push(
            EmblaCarouselAutoplay({
              delay: this.autoPlayInterval,
              playOnInit: true,
              stopOnMouseEnter: true,
              stopOnInteraction: false,
            })
          );
        }

        if (this.fade) {
          plugins.push(EmblaCarouselFade());
        }
        const emblaApi = EmblaCarousel(this.emblaNode, options, plugins);

        if (showButtons) {
          this.addPrevNextBtnsClickHandlers(emblaApi, this.prevBtnNode, this.nextBtnNode);
          emblaApi.on('destroy', this.removePrevNextBtnsClickHandlers);
        }
        if (showDots) {
          this.addDotBtnsAndClickHandlers(emblaApi, this.dotsNode);
          this.removeDotBtnsAndClickHandlers = this.addDotBtnsAndClickHandlers(emblaApi, this.dotsNode);
          emblaApi.on('destroy', this.removeDotBtnsAndClickHandlers);
        }

        if (this.showCount) {
          this.addCount(emblaApi, this.slideCount);
        }
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  addCount = () => {
    let current = this.slideCount.querySelector('.embla__count-current');
    let total = this.slideCount.querySelector('.embla__count-total');
    current.textContent = 1;
    total.textContent = `of ${Array.from(this.slideNodes).length}`;
  };

  addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
    const scrollPrev = () => {
      emblaApi.scrollPrev();
      if (this.showCount) {
        let current = this.slideCount.querySelector('.embla__count-current');
        current.textContent = `${emblaApi.selectedScrollSnap() + 1} `;
      }
    };
    const scrollNext = () => {
      emblaApi.scrollNext();
      if (this.showCount) {
        let current = this.slideCount.querySelector('.embla__count-current');
        current.textContent = emblaApi.selectedScrollSnap() + 1;
      }
    };
    prevBtn.addEventListener('click', scrollPrev, false);
    nextBtn.addEventListener('click', scrollNext, false);

    return () => {
      prevBtn.removeEventListener('click', scrollPrev, false);
      nextBtn.removeEventListener('click', scrollNext, false);
    };
  };

  addDotBtnsAndClickHandlers(emblaApi, dotsNode) {
    let dotNodes = [];

    const addDotBtnsWithClickHandlers = () => {
      const scrollTo = (index) => {
        emblaApi.scrollTo(index);
      };
      if (!this.useChips) {
        dotsNode.innerHTML = emblaApi
          .scrollSnapList()
          .map(() => '<button class="embla__dot" type="button"></button>')
          .join('');
        dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'));
        dotNodes.forEach((dotNode, index) => {
          dotNode.addEventListener('click', () => scrollTo(index), false);
        });
      } else {
        dotNodes = Array.from(dotsNode.querySelectorAll('.embla__chip'));
        dotNodes.forEach((chipNode, index) => {
          chipNode.addEventListener('click', () => scrollTo(index), false);
        });
      }
    };

    const toggleDotBtnsActive = () => {
      if (!this.useChips) {
        const previous = emblaApi.previousScrollSnap();
        const selected = emblaApi.selectedScrollSnap();
        dotNodes[previous].classList.remove('embla__dot--selected');
        dotNodes[selected].classList.add('embla__dot--selected');
      } else {
        const previous = emblaApi.previousScrollSnap();
        const selected = emblaApi.selectedScrollSnap();
        dotNodes[previous].classList.add('tw-bg-primary-white');
        dotNodes[previous].classList.remove('tw-bg-primary-black');
        dotNodes[previous].querySelectorAll('p').forEach((p) => {
          p.classList.remove('!tw-text-white');
        });

        dotNodes[selected].classList.add('tw-bg-primary-black');
        dotNodes[selected].classList.remove('tw-bg-primary-white');
        dotNodes[selected].querySelectorAll('p').forEach((p) => {
          p.classList.add('!tw-text-white');
        });
      }
    };

    emblaApi
      .on('init', addDotBtnsWithClickHandlers)
      .on('reInit', addDotBtnsWithClickHandlers)
      .on('init', toggleDotBtnsActive)
      .on('reInit', toggleDotBtnsActive)
      .on('select', toggleDotBtnsActive);

    return () => {
      dotsNode.innerHTML = '';
    };
  }
}

customElements.define('item-slider', ItemSlider);
