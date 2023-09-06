class ModalScript {
    _modalBlackout;
    _activeModal;
    _modalIsActive = false;
    _observers = [];
    _events = {
        OPEN: 'open',
        CLOSE: 'close'
    }

    _prepareBlackout() {
        const blackout = document.createElement('div');
        blackout.style.position = 'fixed';
        blackout.style.width = '100vw';
        blackout.style.height = '100vh';
        blackout.style.opacity = '0.7';
        blackout.style.zIndex = '-999';
        blackout.style.background = 'transparent';
        document.body.prepend(blackout);

        blackout.addEventListener('click', () => this._handleDeactivate());

        this._modalBlackout = blackout;
    }

    _handleActivate(modal) {
        if (this._modalIsActive) return;

        //Update State
        this._modalIsActive = true;
        this._activeModal = modal;

        //Enable Blackout
        this._modalBlackout.style.transition = 'background 0.3s';
        this._modalBlackout.style.background = '#000';
        this._modalBlackout.style.zIndex = '998';

        //Enable / Center Modal
        modal.style.position = 'fixed';
        modal.style.display = 'block';
        modal.style.zIndex = '999';
        modal.style.top = `calc(50% - ${modal.offsetHeight / 2}px)`;
        modal.style.left = `calc(50% - ${modal.offsetWidth / 2}px)`;

        //Emit event
        this._emitEvent(this._events.OPEN);
    }

    _handleDeactivate() {
        if (!this._modalIsActive) return;

        //Disable blackout
        this._modalBlackout.style.transition = 'z-index 0.3s  step-end ,background 0.3s';
        this._modalBlackout.style.background = 'transparent';
        this._modalBlackout.style.zIndex = '-999';

        //Disable Modal
        this._activeModal.style.zIndex = '-999';
        this._activeModal.style.left = '-1000px';

        //Update State
        this._modalIsActive = false;
        this._activeModal = null;

        //Emit event
        this._emitEvent(this._events.CLOSE);
    }

    // Emitter can emit 'open' or 'close' events
    _emitEvent(event) {
        this._observers.filter(observer => observer.event === event).forEach(observer => observer.callback());
    }

    getEventsList() {
        return this._events;
    }

    // Realization of 'Observer' pattern
    applyObservers(event, callback) {
        this._observers.push({event, callback});
    }

    initializeModalFunctionality() {
        this._prepareBlackout();
    }

    synchronize() {
        const modals = document.getElementsByClassName('modal-entry');

        Array.from(modals).filter(m => !!m?.dataset?.activatorsClass && !!m.dataset.activatorsClass.length).forEach(modal => {
            const activatorClass = modal.dataset.activatorsClass;

            const activators = Array.from(document.getElementsByClassName(activatorClass));

            activators.forEach(activator => activator.addEventListener('click', () => {
                    this._handleActivate(modal);
                })
            )
        });
    }

}

