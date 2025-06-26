class LoadingAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Check play-animation attribute
    const playAnimationAttr = this.getAttribute('play-animation');
    const shouldPlayAnimation = playAnimationAttr === null || playAnimationAttr === 'true';
    if (!shouldPlayAnimation) {
      // Instantly hide loading screen and allow scroll if animation is disabled
      const loadingScreen = this.querySelector('#loading-screen');
      if (loadingScreen) document.documentElement.style.overflowY = 'auto';
      return;
    } else {
      const loadingScreen = this.querySelector('#loading-screen');
      if (loadingScreen) loadingScreen.style.display = 'flex';
    }

    // Force scroll to top when component connects
    this.html = document.querySelector('html');
    this.window = window;

    if (this.window.scrollY !== 0) {
      this.window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

    // Prevent scroll until animation is complete
    this.html.style.overflowY = 'hidden';

    let loadingScreen = this.querySelector('#loading-screen');
    let path1 = this.querySelector('#path-1');
    let path2 = this.querySelector('#path-2');
    let desktopVideo = this.querySelector('.desktop-video video');
    let mobileVideo = this.querySelector('.mobile-video video');
    let desktopImg = this.querySelector('.tw-hidden.md\\:tw-block img');
    let mobileImg = this.querySelector('.md\\:tw-hidden img');
    let video = window.innerWidth >= 768 ? desktopVideo : mobileVideo;
    let image = window.innerWidth >= 768 ? desktopImg : mobileImg;
    let videoReady = false;
    let imageReady = false;

    // Video readiness
    [desktopVideo, mobileVideo].forEach(vid => {
      if (vid) {
        vid.muted = true;
        vid.playsInline = true;
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        vid.load();

        vid.addEventListener('canplaythrough', () => {
          if (vid === video) videoReady = true;
        }, { once: true });
      }
    });

    // Image readiness
    [desktopImg, mobileImg].forEach(img => {
      if (img) {
        if (img.complete && img.naturalWidth !== 0) {
          if (img === image) imageReady = true;
        } else {
          img.addEventListener('load', () => {
            if (img === image) imageReady = true;
          }, { once: true });
        }
      }
    });

    const tl = gsap.timeline({});

    tl.fromTo(path1,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 0% 85%)",
        duration: 1.7,
        ease: "linear"
      })
      .call(() => {
        // Wait for video or image to be ready
        if ((video && !videoReady) || (image && !imageReady)) {
          tl.pause();
          if (video && !videoReady) {
            [desktopVideo, mobileVideo].forEach(vid => {
              if (vid) {
                vid.addEventListener('canplay', () => {
                  tl.resume();
                }, { once: true });
              }
            });
          }
          if (image && !imageReady) {
            [desktopImg, mobileImg].forEach(img => {
              if (img) {
                img.addEventListener('load', () => {
                  tl.resume();
                }, { once: true });
              }
            });
          }
        } else {
          tl.resume();
        }
      })
      .to(path1, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.3,
        ease: "linear"
      })
      .fromTo(path2, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.3,
          ease: "power2.inOut"
        }, "<")
      .to(loadingScreen, {
        delay: 0.2,
        opacity: 0,
        duration: 0.3,
        ease: "power4.out",
        onStart: () => {
          if (video) {
            try {
              video.muted = true;
              video.playsInline = true;

              const attemptPlay = async () => {
                try {
                  await video.play();
                } catch (error) {
                  document.addEventListener('touchstart', () => {
                    video.play().catch(e => console.warn('Video playback failed:', e));
                  }, { once: true });
                }
              };

              attemptPlay();
            } catch (error) {
              console.warn("Video playback error:", error);
            }
          }
        }
      })
      .set(loadingScreen, {
        display: 'none',
        onComplete: () => {
          this.html.style.overflowY = 'auto';
        }
      }
      );

  }
}

customElements.define('loading-animation', LoadingAnimation);