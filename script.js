const content = document.getElementById('content');
const htmlEl = document.documentElement;

loadContent('home.html', 'home-btn')

function loadContent(page, pageID) {
    fetch(page)
    .then(response => response.text())
    .then(html => {
        document.getElementById('content').innerHTML = html;
        window.scrollTo(0, 0);
        highlightNav(pageID);
        lazyLoadVideos();
        if (!isMobile()) {
            initializeModal();
        } else {
            initializeGalleryMuteButtons();
        }
        if (page === 'home.html') {
            initializeScreensaver();
            htmlEl.style.overflow = 'hidden';
        } else {
            htmlEl.style.overflow = 'auto';
        }
    })
}

function highlightNav(pageID) {
    const buttons = document.querySelectorAll('.nav-links a');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(pageID).classList.add('active');
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const contacts = document.querySelector('.contact');
    navLinks.classList.toggle('active');
    contacts .classList.toggle('active');
}

function initializeModal() {
    const modal = document.getElementById('modal');
    const modalVideo = document.getElementById('modal-video');
  
    const thumbnails = document.querySelectorAll('.gallery-item');
    for (let i = 0; i < thumbnails.length; i++) {
      thumbnails[i].addEventListener('click', function (e) {
        const videoSrc = e.target.getAttribute('src');
        modalVideo.setAttribute('src', videoSrc);
        modal.style.display = 'flex';
        modalVideo.muted = false;
      });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalVideo) {
            modal.style.display = 'none';
            modalVideo.removeAttribute('src');
            modalVideo.muted = true;
        }
    })
}

function initializeScreensaver() {
    const text = document.querySelector('.screensaver-text');

    // initialize dimensions //
    const container = document.querySelector('.screensaver-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const textWidth = text.offsetWidth;
    const textHeight = text.offsetHeight;

    // initialize position and velocity //
    let x = getRandomInt(containerWidth - textWidth);
    let y = getRandomInt(containerHeight - textHeight);
    let speedX = 1;
    let speedY = 1;

    // move the text
    function moveText() {
        x += speedX;
        y += speedY;

        text.style.transform = `translate(${x}px, ${y}px)`;
        
        if (x + textWidth > containerWidth || x < 0) {
            speedX = -speedX;
        }
        if (y + textHeight > containerHeight || y < 0) {
            speedY = -speedY;
        }

        requestAnimationFrame(moveText);
    }
    function clickToRevealScreensaverText() {
        const screensaverText = document.querySelector('.screensaver-text');
        screensaverText.addEventListener('click', () => {
            speedX = -speedX;
            speedY = -speedY;
        })
    }
    moveText();
    clickToRevealScreensaverText();
}

function initializeGalleryMuteButtons() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    // if click on mute icon, it unmute
    galleryItems.forEach((item) => {
        const video = item.querySelector('.video'); // Finds the <video> in the current item.
        const muteBtn = item.querySelector('.mute-btn'); // Finds the <button> in the current item.
        
        muteBtn.addEventListener('click', () => {
            galleryItems.forEach((otherItem) => {
                const otherVideo = otherItem.querySelector('.video');
                const otherMuteBtn = otherItem.querySelector('.mute-btn');
                if (otherVideo !== video) {
                  otherVideo.muted = true;
                  otherMuteBtn.textContent = 'volume_off';
                }
              });

            // Toggle mute for the current video
            video.muted = !video.muted;

            // Update button text/icon
            if (video.muted) {
                muteBtn.textContent = 'volume_off';
            } else {
                muteBtn.textContent = 'volume_up';
            }
        })
    });
}

function lazyLoadVideos() {
    const videos = document.querySelectorAll('.video');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Start loading when 10% of the video is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, observerOptions);

    videos.forEach((video) => observer.observe(video));
}

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

function getRandomInt(Max) {
    return Math.floor(Math.random() * Max + 1);
}