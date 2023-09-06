// ------------ Contact Dropdown -------------------------------------
const initializeContactDropdownFunctionality = () => {
    const dropdown = document.getElementById('contacts-dropdown');
    const button = document.getElementById('contact-button');
    const closeButton = document.getElementById('dropdown-contact-close');

    const elemsForActivate = [dropdown];
    const elemsCanToggle = [button, closeButton];

    new DropdownSupport(elemsForActivate, elemsCanToggle);
}

// News Starter

window.addEventListener('load', () => {

    //initialize contact dropdown
    initializeContactDropdownFunctionality();
})
