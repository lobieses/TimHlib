const haveClass = (elem, classn) => elem.className.split(' ').some(existsClassn => existsClassn === classn);

const deleteClassname = (elem, classname) => {
    elem.className = elem.className.split(' ').filter(classn => classn !== classname).join(' ')
}

const addClassname = (elem, classname) => {
    if (!haveClass(elem, classname)) {
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
            deleteClassname(e.target, 'inDrag')
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

const navbarScroll = (elem) => {
    elem.addEventListener('click', (e) => {
        const path = e.target.dataset.href;
        const section = document.getElementById(path);
        let navbarHeight


        switch (defineWindowsPositionAsNumber()) {
            case 1: {
                navbarHeight = 114
                break
            }
            default: {
                navbarHeight = 100
            }
        }

        if (section && path) window.scrollTo({
            top: +section.offsetTop - navbarHeight,
            behavior: "smooth",
        });
    })
}

const defineWindowsPositionAsNumber = () => {
    const width = window.innerWidth;
    switch (true) {
        case (width > 1440): {
            return 0
        }
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

const manageNavbarStatus = (activate, elems) => {
    elems.forEach(elem => {
        if (activate) {
            addClassname(elem, 'active');
        } else {
            deleteClassname(elem, 'active');
        }
    })
}

const mobileNavbarToggling = () => {
    const burger = document.getElementById('mobile-burger');
    const navbar = document.getElementById('mobile-navbar');
    const blackout = document.getElementById('mobile-blackout');

    const navbarElems = [burger, navbar, blackout]

    burger.addEventListener('click', () => {
        manageNavbarStatus(!haveClass(burger, 'active'), navbarElems);
    });

    blackout.addEventListener('click', () => {
        if (haveClass(burger, 'active')) {
            manageNavbarStatus(false, navbarElems);
        }
    })

    navbar.addEventListener('click', (e) => {
        if (haveClass(e.target, 'mobile-navbar-link')) {
            manageNavbarStatus(false, navbarElems);
        }
    })
}

const loopHeaderCarousel = () => {
    const nextButton = document.getElementById('header-next-button');
    const carousel = document.getElementById('carouselExampleIndicators');
    const switchClasses = ['carousel-control-next-icon', 'carousel-control-prev-icon', 'carousel-indicator'];

    const callback = (e) => {
        if (switchClasses.some(classn => haveClass(e.target, classn))) {
            clearInterval(loopInterval);
            carousel.removeEventListener('click', callback);
        }
    }

    const loopInterval = setInterval(() => {
        carousel.removeEventListener('click', callback);
        nextButton.click();
        carousel.addEventListener('click', callback);
    }, 5000)

    carousel.addEventListener('click', callback)


}

window.addEventListener('load', () => {
    const windowsPositionAsNumber = defineWindowsPositionAsNumber()
    startSwiper('.about-swiper', 9000, swiperOffsetsList.about[windowsPositionAsNumber]);
    startSwiper('.benefits-swiper', 9000, swiperOffsetsList.benefits[windowsPositionAsNumber]);
    startSwiper('.clients-swiper', 9000, swiperOffsetsList.clients[windowsPositionAsNumber]);

    implementDraggablePointer();

    observerNavbarOpacity();

    loopHeaderCarousel();

    elemScrolledTrigger('about-us-separator', () => separatorAnimation('about-us-separator'));
    elemScrolledTrigger('benefits-separator', () => separatorAnimation('benefits-separator'));

    navbarScroll(document.getElementById('navbar'));
    navbarScroll(document.getElementById('mobile-navbar'));
    navbarScroll(document.getElementById('logo'));

    Array.from(document.getElementsByClassName('start_button')).forEach((elem) => navbarScroll(elem))

    mobileNavbarToggling();

    const separator = document.getElementById('head_separator');
    separator.style.width = '100%';
})



























