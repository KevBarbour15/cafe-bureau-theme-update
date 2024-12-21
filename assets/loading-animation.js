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
      //console.log('video ready 1');
      videoReady = true;
    }

    [desktopVideo, mobileVideo].forEach(vid => {
      if (vid) {
        //console.log('vid', vid);
        vid.muted = true;
        vid.setAttribute('playsinline', '');
        vid.addEventListener('canplay', () => {
          if (vid === video) videoReady = true;
          //console.log('video ready 2');
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
        ease: "power4.out",
        onStart: () => {
          if (video) {
            try {
              video.muted = true;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  //console.log("Video playback failed:", error);
                });
              }
            } catch (error) {
              //console.log("Video playback error:", error);
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