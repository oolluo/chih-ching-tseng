const content = document.getElementById('content');

loadContent('atm.html', 'atm-btn')

function loadContent(page, pageID) {
    fetch(page)
    .then(response => response.text())
    .then(html => {
        document.getElementById('content').innerHTML = html;
        window.scrollTo(0, 0);
        highlightNav(pageID);
        initializeModal();
        if (page === 'home.html') {
            initializeScreensaver();
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

    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
        modalVideo.removeAttribute('src');
        modalVideo.muted = true;
    })

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

    moveText();
}

function getRandomInt(Max) {
    return Math.floor(Math.random() * Max + 1);
}