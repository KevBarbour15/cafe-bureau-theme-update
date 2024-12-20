class LoadingAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    return;
    let loadingScreen = this.querySelector('#loading-screen');
    let path1 = this.querySelector('#path-1');
    let path2 = this.querySelector('#path-2');
    let desktopVideo = this.querySelector('.desktop-video video');
    let mobileVideo = this.querySelector('.mobile-video video');
    let video = window.innerWidth >= 768 ? desktopVideo : mobileVideo;
    let videoReady = false;

    if (video && video.readyState >= 3) {
      videoReady = true;
    }

    [desktopVideo, mobileVideo].forEach(vid => {
      if (vid) {
        vid.addEventListener('canplay', () => {
          if (vid === video) videoReady = true;
        });
      }
    });

    const tl = gsap.timeline({});

    tl.fromTo(path1,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 45%, 0% 45%)",
        duration: .5,
        ease: "power2.inOut"
      })
      .to(path1, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 0% 85%)",
        duration: 0.42,
        ease: "power2.inOut"
      }, 0.55)
      .call(() => {
        if (!videoReady) {
          tl.pause();
          [desktopVideo, mobileVideo].forEach(vid => {
            if (vid) {
              vid.addEventListener('canplay', () => {
                tl.resume();
              }, { once: true });
            }
          });
        }
      })
      .to(path1, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: .35,
        ease: "power2.inOut"
      }, 1)
      .fromTo(path2, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: .35,
          ease: "power2.inOut"
        }, "<")
      .to(loadingScreen, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onStart: () => {
          if (video) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.log("Video playback failed:", error);
              });
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