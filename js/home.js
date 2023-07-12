const toggleClassname = (elem, classname) => {
    if (elem.className.split(' ').some(classn => classn === classname)) {
        elem.className = elem.className.split(' ').filter(classn => classn !== classname).join(' ')
    } else {
        elem.className = `${elem.className} ${classname}`
    }
}

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

const defineWindowsPositionAsNumber = () => {
    const width = window.innerWidth;
    switch (true) {
        case (width <= 1440 && width >= 1024): {
            return 1
        }
        case (width <= 1024 && width >= 768): {
            return 2
        }
        case (width <= 768 && width >= 550): {
            return 3
        }
        case (width <= 550 && width >= 425): {
            return 4
        }
        case (width <= 425 && width >= 375): {
            return 5
        }
        default: {
            return 6
        }
    }
}

const swiperOffsetsList = {
    about: {
        0: 4,
        1: 3,
        2: 3,
        3: 3,
        4: 2,
        5: 3,
        6: 2
    },
    benefits: {
        0: 3,
        1: 3,
        2: 2,
        3: 2,
        4: 2,
        5: 2,
        6: 2
    },
    clients: {
        0: 7,
        1: 4,
        2: 3,
        3: 3,
        4: 2,
        5: 3,
        6: 2
    }
}

const mobileBurgerToggling = () => {
    const burger = document.getElementById('mobile-burger');
    const navbar = document.getElementById('mobile-navbar');
    const blackout = document.getElementById('mobile-blackout');

    burger.addEventListener('click', () => {
        toggleClassname(burger, 'active');
        toggleClassname(navbar, 'active');
        toggleClassname(blackout, 'active')
    });
}

window.addEventListener('load', () => {
    const windowsPositionAsNumber = defineWindowsPositionAsNumber()
    startSwiper('.about-swiper', 9000, swiperOffsetsList.about[windowsPositionAsNumber]);
    startSwiper('.benefits-swiper', 9000, swiperOffsetsList.benefits[windowsPositionAsNumber]);
    startSwiper('.clients-swiper', 9000, swiperOffsetsList.clients[windowsPositionAsNumber]);

    implementDraggablePointer();

    observerNavbarOpacity();

    elemScrolledTrigger('about-us-separator', () => separatorAnimation('about-us-separator'));
    elemScrolledTrigger('benefits-separator', () => separatorAnimation('benefits-separator'));

    navbarScroll();

    mobileBurgerToggling();

    const separator = document.getElementById('head_separator');
    separator.style.width = '100%';
})



























