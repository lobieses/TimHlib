class DropdownSupport {
    _isActive = false;
    _activeElems;
    _toggleElems;
    _specificCheckers = [];
    _blackout;

    _haveClass(elem, classn) {
        return elem.className.split(' ').some(existsClassn => existsClassn === classn)
    };


    _removeClassname(elem, classname) {
        elem.className = elem.className.split(' ').filter(classn => classn !== classname).join(' ')
    }

    _addClassname(elem, classname) {
        if (!this._haveClass(elem, classname)) {
            elem.className = `${elem.className} ${classname}`
        }
    }

    constructor(activeElems, toggleElems, specificCheckers) {
        this._activeElems = activeElems;
        this._toggleElems = toggleElems;
        this._specificCheckers = specificCheckers || [];

        this._prepareBlackout();

        this._toggleElems.forEach((elem) => {
            elem.addEventListener('click', () => {
                if (!this._isActive && !this._specificCheckers.every(checker => checker())) return;
                this._toggleDropdownStatus(!this._isActive, this._activeElems);
                this._isActive = !this._isActive;
            });
        })
    }

    forceClose() {
        this._toggleDropdownStatus(false);
    }

    isActive() {
        return this._isActive;
    }

    _prepareBlackout() {
        const blackout = document.createElement('div');
        blackout.style.position = 'fixed';
        blackout.style.width = '100vw';
        blackout.style.height = '100vh';
        blackout.style.opacity = '0.7';
        blackout.style.zIndex = '-999';
        blackout.style.background = 'transparent';
        blackout.style.transition = 'background 0.3s'
        document.body.prepend(blackout);

        blackout.addEventListener('click', () => {
            this._toggleDropdownStatus(false);
            this._isActive = false;
        });

        this._blackout = blackout;
    }

    _toggleDropdownStatus(activate) {
        const blackout = this._blackout;

        if (activate) {
            blackout.style.background = '#000';
            blackout.style.zIndex = '998';
            blackout.style.transition = 'background 0.3s';
        } else {
            blackout.style.zIndex = '-999';
            blackout.style.background = 'transparent';
            blackout.style.transition = 'z-index 0.3s  step-end ,background 0.3s';
        }

        this._activeElems.forEach(elem => activate ? this._addClassname(elem, 'active') : this._removeClassname(elem, 'active'));
    }
}