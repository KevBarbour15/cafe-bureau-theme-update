class LoadingAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Force scroll to top when component connects
    this.window = window;
    if (this.window.scrollY !== 0) {
      this.window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

    let loadingScreen = this.querySelector('#loading-screen');
    let path1 = this.querySelector('#path-1');
    let path2 = this.querySelector('#path-2');
    let desktopVideo = this.querySelector('.desktop-video video');
    let mobileVideo = this.querySelector('.mobile-video video');
    let video = window.innerWidth >= 768 ? desktopVideo : mobileVideo;
    let videoReady = false;

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
        if (!videoReady) {
          tl.pause();
          [desktopVideo, mobileVideo].forEach(vid => {
            if (vid) {
              vid.addEventListener('canplay', () => {
                //console.log('canplay');
                tl.resume();
              }, { once: true });
            }
          });
        } else {
          //console.log('video ready');
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
        display: 'none'
      }
      );

  }
}

customElements.define('loading-animation', LoadingAnimation);