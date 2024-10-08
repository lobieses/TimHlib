// ------------ Constants -------------------------------------

const FILTERS_URL_FIELD = 'filters'
const SEARCH_URL_FIELD = 'search';

const TYPES_TRANSLATOR = {
    [PRODUCT_TYPES.BAKERY]: 'Хлібобулочні',
    [PRODUCT_TYPES.MEAT]: "М'ясні",
    [PRODUCT_TYPES.CONFECTIONERY]: 'Кондитерські'
}

let modalSupport;

const INSERT_TYPES = {
    IMG: 'IMG',
    TEXT: 'TEXT',
    BOOLEAN: 'BOOLEAN',
    LIST: 'LIST'
}

const MODAL_FULFILL_MAP = {
    'modal-image': {productField: 'imageFilePath', type: INSERT_TYPES.IMG},
    'modal-name': {productField: 'name', type: INSERT_TYPES.TEXT},
    'modal-description': {productField: 'description', type: INSERT_TYPES.TEXT},
    'benefits': {productField: 'benefits', type: INSERT_TYPES.LIST},
    'field-of-application': {productField: 'fieldOfApplication', type: INSERT_TYPES.TEXT},
    'is-available': {productField: 'available', type: INSERT_TYPES.BOOLEAN},
}

// ------------ Boiler FNs -------------------------------------

const haveClass = (elem, classn) => elem.className.split(' ').some(existsClassn => existsClassn === classn);

const removeClassname = (elem, classname) => {
    elem.className = elem.className.split(' ').filter(classn => classn !== classname).join(' ')
}

const addClassname = (elem, classname) => {
    if (!haveClass(elem, classname)) {
        elem.className = `${elem.className} ${classname}`
    }
}

// ------------ URL Workers -------------------------------------

const parseQueryString = () => {

    const str = window.location.search;
    const objURL = {};

    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        ($0, $1, $2, $3) => {
            objURL[$1] = $3;
        }
    );

    return objURL;
};

const getQueryDataFromUrl = (field) => {
    const parsedSearchVariables = parseQueryString();

    return parsedSearchVariables[field];
}

const changeQueryDataInUrl = (fieldName, data) => {
    const parsedSearchVariables = parseQueryString();

    parsedSearchVariables[fieldName] = data;

    const newSearchVariables = Object.keys(parsedSearchVariables).reduce((acc, variable, index) =>
            `${acc}${variable}=${parsedSearchVariables[variable]}${Object.keys(parsedSearchVariables).length - 1 === index ? '' : '&'}`,
        '');

    window.history.pushState({}, '', `${window.location.pathname}?${newSearchVariables}`);
}

const removeQueryFieldFromUrl = (fieldName) => {
    const parsedSearchVariables = parseQueryString();

    if (!Object.keys(parsedSearchVariables).length || !parsedSearchVariables[fieldName]) return;

    delete parsedSearchVariables[fieldName];

    const newSearchVariables = Object.keys(parsedSearchVariables).reduce((acc, variable, index) =>
            `${acc}${variable}=${parsedSearchVariables[variable]}${Object.keys(parsedSearchVariables).length - 1 === index ? '' : '&'}`,
        '');

    window.history.pushState({}, '', `${window.location.pathname}?${newSearchVariables}`);
}

// ------------ Filter Workers -------------------------------------

const addFilterToUrl = (fieldName, variableToAdd) => {
    const existingData = getQueryDataFromUrl(fieldName);
    let newData;

    if (existingData && existingData.length) {
        newData = [...new Set([...existingData.split(','), variableToAdd])].join(',');
    } else {
        newData = variableToAdd;
    }

    changeQueryDataInUrl(fieldName, newData);
}

const removeFilterFromUrl = (fieldName, elemToRemove) => {
    const parsedSearchVariables = parseQueryString();
    const existingData = parsedSearchVariables[fieldName];

    if (!existingData || !existingData.length) return

    const filteredData = existingData.split(',').filter(variable => variable !== elemToRemove);

    if (filteredData.length) {
        const newData = filteredData.join(',');
        changeQueryDataInUrl(fieldName, newData)
    } else {
        removeQueryFieldFromUrl(fieldName);
    }
}

const getFilterCriteria = () => {
    const filtersFromUrl = (getQueryDataFromUrl(FILTERS_URL_FIELD));
    const filters = (filtersFromUrl ? filtersFromUrl.split(',') : []).filter(filter => Object.values(PRODUCT_TYPES).includes(filter));

    const searchInput = document.getElementById('search-input');
    const search = searchInput.value.trim();

    return [filters, search];
}

const synchronizeFilterButtons = () => {
    const filterButtons = Array.from(document.getElementById('filters').children);

    if (!filterButtons.length) return;

    const enabledFilters = getFilterCriteria()[0];

    if (enabledFilters && enabledFilters.length) {
        filterButtons.forEach(button => {
            if (enabledFilters.includes(button.dataset.filter)) {
                addClassname(button, 'active-filter');
            } else {
                removeClassname(button, 'active-filter');
            }
        })
    } else {
        filterButtons.forEach(button => removeClassname(button, 'active-filter'));
    }
}

const addFilter = (filter) => {
    if (!Object.values(PRODUCT_TYPES).includes(filter)) return

    addFilterToUrl(FILTERS_URL_FIELD, filter);

}

const removeFilter = (filter) => {
    if (!Object.values(PRODUCT_TYPES).includes(filter)) return

    removeFilterFromUrl(FILTERS_URL_FIELD, filter);
}

const startListenFilterButtons = () => {
    const filterButtons = Array.from(document.getElementById('filters').children);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!haveClass(button, 'active-filter')) {
                addFilter(button.dataset.filter);
            } else {
                removeFilter(button.dataset.filter);
            }

            synchronizeFilterButtons();
            synchronizeProducts();
        })
    })

    synchronizeFilterButtons();
}

// ------------ Product Field Workers -------------------------------------

const getProductsBySettings = (types, search) => {
    let products = PRODUCTS;

    if (types && !types.length) return [];

    if (types && types.length) {
        products = products.filter(product => types.includes(product.type));
    }

    if (search && search.length) {
        products = products.filter(product => {
            const searchRegex = new RegExp(search.toLowerCase(), 'g');
            return searchRegex.test(product.name.toLowerCase());
        });
    }

    return products
}

const insertProductsInMain = (products) => {
    const catalogField = document.getElementById('products');
    catalogField.innerHTML = '';

    products.forEach(product => {
        const wrapper = document.createElement('div');
        wrapper.className = 'product-wrapper';

        const image = document.createElement('div');
        image.className = 'product-image';
        image.style.backgroundImage = `url('${product.imageFilePath}')`;
        // Mark as modal activator
        addClassname(image, modalActivatorClassCreatorBasedOnProductId(product.id));

        const name = document.createElement('h3');
        name.textContent = product.name;

        const description = document.createElement('p');
        description.textContent = product.description;

        const aboutButton = document.createElement('button');
        aboutButton.className = 'product-about-button';
        aboutButton.textContent = 'Дізнатися більше';
        // Mark as modal activator
        addClassname(aboutButton, modalActivatorClassCreatorBasedOnProductId(product.id));

        wrapper.appendChild(image);
        wrapper.appendChild(name);
        wrapper.appendChild(description);
        wrapper.appendChild(aboutButton);

        catalogField.appendChild(wrapper);
    })
}

const insertProductsInDropdown = (products) => {
    const dropdown = document.getElementById('dropdown-products');
    dropdown.innerHTML = '';

    products.forEach(product => {
        const productConcentrator = document.createElement('div');
        productConcentrator.className = 'dropdown-product-concentrator'

        const container = document.createElement('div');
        container.className = 'dropdown-product-container';
        container.style.backgroundImage = `url('${product.imageFilePath}')`;
        // Mark as modal activator
        addClassname(container, modalActivatorClassCreatorBasedOnProductId(product.id));

        const name = document.createElement('h2');
        name.textContent = product.name;

        const typeContainer = document.createElement('div');
        typeContainer.className = 'dropdown-product-typeContainer';

        const type = document.createElement('h4')
        type.textContent = TYPES_TRANSLATOR[product.type];

        typeContainer.appendChild(type);

        container.appendChild(name);
        container.appendChild(typeContainer);

        productConcentrator.appendChild(container)

        dropdown.appendChild(productConcentrator);
    })
}

const getActiveProducts = () => {
    const filterCriteria = getFilterCriteria();

    return getProductsBySettings(...filterCriteria);
}

const synchronizeProducts = () => {
    const products = getActiveProducts();

    insertProductsInMain(products);
    insertProductsInDropdown(products);

    // Update dropdown button state based on filtered products
    updateDropdownButtonState(products);

    modalSupport.synchronize();
}

// ------------ Search Workers -------------------------------------

const focusOnSearchFieldClick = () => {
    const searchField = document.getElementById('search');
    const input = document.getElementById('search-input');

    searchField.addEventListener('click', () => input.focus());

    input.addEventListener('focus', () => addClassname(searchField, 'active-focus'));
    input.addEventListener('blur', () => removeClassname(searchField, 'active-focus'))
}

const synchronizeSearchFieldWithUrl = () => {
    const searchDataFromUrl = getQueryDataFromUrl(SEARCH_URL_FIELD);

    if (!searchDataFromUrl) return;

    const input = document.getElementById('search-input');
    input.value = searchDataFromUrl;
}

const startListeningSearchField = () => {
    const input = document.getElementById('search-input');

    input.addEventListener('keyup', (e) => {
        if (e.target.value.length) {
            changeQueryDataInUrl(SEARCH_URL_FIELD, e.target.value);
        } else {
            removeQueryFieldFromUrl(SEARCH_URL_FIELD);
        }

        synchronizeProducts();
    })
}

// ------------ Modal Templates Creator -------------------------------------

const modalActivatorClassCreatorBasedOnProductId = (id) => `modal-product-activator-${id}`;

const generateLayoutByFulfillMap = (template, product) => {
    Object.keys(MODAL_FULFILL_MAP).forEach(classname => {
        const productField = MODAL_FULFILL_MAP[classname].productField;
        const type = MODAL_FULFILL_MAP[classname].type;
        const productValue = product[productField];

        if (typeof productValue !== 'boolean' && !productValue) return;

        const elem = template.getElementsByClassName(classname)[0];
        if (!elem) return;


        switch (type) {
            case INSERT_TYPES.IMG: {
                elem.src = productValue;
                break;
            }
            case INSERT_TYPES.LIST: {
                if (!Array.isArray(productValue)) break
                productValue.forEach(str => {
                    const li = document.createElement('li');
                    li.innerHTML = str;
                    elem.append(li);
                })
                break;
            }
            case INSERT_TYPES.BOOLEAN: {
                addClassname(elem, productValue ? 'positive' : 'negative');
                break;
            }
            case INSERT_TYPES.TEXT: {
                elem.innerHTML = productValue;
            }
        }
    })
}

const fulfillModals = () => {
    const modalTemplate = document.getElementById('modal-template');
    if (!modalTemplate) return;

    //remove id attribute to avoid errors
    modalTemplate.removeAttribute('id');

    //Add classname for 'modal' script detecting
    addClassname(modalTemplate, 'modal-entry');

    PRODUCTS.forEach(product => {
        //Make deep copy of template
        const template = modalTemplate.cloneNode(true);
        //Define class activator
        template.dataset.activatorsClass = modalActivatorClassCreatorBasedOnProductId(product.id);

        //Push values to modal
        generateLayoutByFulfillMap(template, product);

        document.body.prepend(template);
    })

    //Remove useless template from DOM
    modalTemplate.remove();
}

// ------------ Product Dropdown -------------------------------------

const initializeProductDropdownFunctionality = () => {
    const buttonActivator = document.getElementById('products-filtered-list');
    const dropdown = document.getElementById('products-filtered-list-dropdown');
    const dropdownCloser = document.getElementById('dropdown-close');

    const elemsForActivate = [dropdown];
    const elemsCanToggle = [buttonActivator, dropdownCloser];

    const dropdownSupport = new DropdownSupport(elemsForActivate, elemsCanToggle, [() => !!getActiveProducts().length])

    //Close dropdown on open product modal
    modalSupport.applyObservers(modalSupport.getEventsList().OPEN, () => {
        if (dropdownSupport.isActive()) dropdownSupport.forceClose();
    })
}

const updateDropdownButtonState = (products) => {
    const button = document.getElementById('products-filtered-list');

    if (!products.length) {
        addClassname(button, 'disable')
    } else {
        removeClassname(button, 'disable');
    }
}

// ------------ Contact Dropdown -------------------------------------
const initializeContactDropdownFunctionality = () => {
    const dropdown = document.getElementById('contacts-dropdown');
    const button = document.getElementById('contact-button');
    const closeButton = document.getElementById('dropdown-contact-close');

    const elemsForActivate = [dropdown];
    const elemsCanToggle = [button, closeButton];

    const dropdownSupport = new DropdownSupport(elemsForActivate, elemsCanToggle);
}

// Catalog Starter

window.addEventListener('load', () => {
    // fulfill page by product modals for 'modal' script
    fulfillModals();

    // start listening filter button changing
    startListenFilterButtons();

    // start listening search field
    startListeningSearchField();

    // add focus input on search area click
    focusOnSearchFieldClick();

    // synchronize input text with url
    synchronizeSearchFieldWithUrl();

    // Initialize modal script
    modalSupport = new ModalSupport();
    modalSupport.initializeModalFunctionality();

    // after synchronizing all settings - update catalog
    synchronizeProducts();

    // initialize filtered products dropdown listener
    initializeProductDropdownFunctionality();

    //initialize contact dropdown
    initializeContactDropdownFunctionality();
})































