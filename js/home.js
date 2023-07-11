const startSwiper = (className, speed, sliderPerBlock) => {
    new Swiper(className, {
        loop: true,
        autoplay: {
            delay: 0,
        },
        speed: speed,
        slidesPerView: sliderPerBlock,
    })
}

const observerNavbarOpacity = () => {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled !== 0) {
            document.querySelector('.home-navbar').style.background = '#000';
        } else {
            document.querySelector('.home-navbar').style.background = 'none';
        }
    })
}

const implementDraggablePointer = () => {
    const draggableElems = Array.from(document.getElementsByClassName('sample-slider'));

    draggableElems.forEach((elem) => {
        elem.addEventListener('transitionend', (e) => {
            e.target.className = `${e.target.className} inDrag`;
        })

        elem.addEventListener('transitionstart', (e) => {
            e.target.className = e.target.className.replace(/^(.+) inDrag$/, '$1');
        })

    })
}

const elemScrolledTrigger = (id, callback) => {
    console.log('sd')
    const elem = document.getElementById(id);

    if (!elem) throw Error("elem haven't found");


    const checkerCallback = () => {
        const elemRect = elem.getBoundingClientRect();

        if (
            elemRect.top >= 0 &&
            elemRect.left >= 0 &&
            elemRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            elemRect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) {
            window.removeEventListener('scroll', checkerCallback);
            callback();
        }
    }

    window.addEventListener('scroll', checkerCallback);
}

// const counter = (elem, duration) => {
//
//     const start = parseInt(elem.textContent, 10);
//     const end = parseInt(elem.dataset.counter, 10);
//
//     if (start === end) return;
//
//     const range = end - start;
//     let curr = start;
//
//     const timeStart = Date.now();
//
//     const loop = () => {
//         let elaps = Date.now() - timeStart;
//         if (elaps > duration) elaps = duration;
//         const frac = elaps / duration;
//         const step = frac * range;
//         curr = start + step;
//         elem.textContent = Math.trunc(curr);
//         if (elaps < duration) requestAnimationFrame(loop);
//     };
//
//     requestAnimationFrame(loop);
// };

const separatorAnimation = (id) => {
    const elem = document.getElementById(id);
    const leftSide = elem.children[0];
    const rightSide = elem.children[2];

    leftSide.style.width = '100%';
    rightSide.style.width = '100%';
}

const navbarScroll = () => {
    const navbar = document.getElementById('navbar')

    navbar.addEventListener('click', (e) => {
        const path = e.target.dataset.href;
        const section = document.getElementById(path);

        if (section && path) window.scrollTo({
            top: +section.offsetTop - 114,
            behavior: "smooth",
        });
    })
}

window.addEventListener('load', () => {
    startSwiper('.about-swiper', 9000, 4);
    startSwiper('.benefits-swiper', 9000, 3);
    startSwiper('.clients-swiper', 9000, 7);

    implementDraggablePointer();

    observerNavbarOpacity();

    // elemScrolledTrigger('achievements', () => {
    //     const achievements = Array.from(document.getElementsByClassName('achievement_score'));
    //     achievements.forEach((elem) => counter(elem, 1000))
    //
    //     const underlines = Array.from(document.getElementsByClassName('achievement_underline'));
    //     underlines.forEach(underl => {
    //         underl.style.width = '100%';
    //     })
    // });

    elemScrolledTrigger('about-us-separator', () => separatorAnimation('about-us-separator'));
    elemScrolledTrigger('benefits-separator', () => separatorAnimation('benefits-separator'));

    navbarScroll();

    const separator = document.getElementById('head_separator');
    separator.style.width = '100%';
})



























