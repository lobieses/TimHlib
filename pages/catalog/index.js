// ------------ Constants -------------------------------------

const FILTERS_URL_FIELD = 'filters'
const SEARCH_URL_FIELD = 'search';

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

    if(!Object.keys(parsedSearchVariables).length || !parsedSearchVariables[fieldName]) return;

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
            const searchRegex = new RegExp(search.toLowerCase() , 'g');
            return searchRegex.test(product.name.toLowerCase());
        });
    }

    return products
}

const insertProducts = (products) => {
    const catalogField = document.getElementById('products');
    catalogField.innerHTML = '';

    products.forEach(product => {
        const wrapper = document.createElement('div');
        wrapper.className = 'product-wrapper';

        const image = document.createElement('div');
        image.className = 'product-image';
        image.style.backgroundImage = `url('${product.imageFilePath}')`;

        const name = document.createElement('h3');
        name.textContent = product.name;

        const description = document.createElement('p');
        description.textContent = product.description;

        const aboutButton = document.createElement('button');
        aboutButton.className = 'product-about-button';
        aboutButton.textContent = 'Дізнатися більше';

        wrapper.appendChild(image);
        wrapper.appendChild(name);
        wrapper.appendChild(description);
        wrapper.appendChild(aboutButton);

        catalogField.appendChild(wrapper);
    })
}

const synchronizeProducts = () => {
    const filterCriteria = getFilterCriteria();

    const products = getProductsBySettings(...filterCriteria);

    insertProducts(products);
}

// ------------ Search Workers -------------------------------------

const focusOnSearchFieldClick = () => {
    const searchField = document.getElementById('search');
    const input = document.getElementById('search-input');

    searchField.addEventListener('click', () => input.focus());

    input.addEventListener('focus',  () => addClassname(searchField, 'active-focus'));
    input.addEventListener('blur',  () => removeClassname(searchField, 'active-focus'))
}

const synchronizeSearchFieldWithUrl = () => {
    const searchDataFromUrl = getQueryDataFromUrl(SEARCH_URL_FIELD);

    if(!searchDataFromUrl) return;

    const input = document.getElementById('search-input');
    input.value = searchDataFromUrl;
}

const startListeningSearchField = () => {
    const input = document.getElementById('search-input');

    input.addEventListener('keyup', (e) => {
        if(e.target.value.length) {
            changeQueryDataInUrl(SEARCH_URL_FIELD, e.target.value);
        } else {
            removeQueryFieldFromUrl(SEARCH_URL_FIELD);
        }

        synchronizeProducts();
    })
}

// Catalog Starter

window.addEventListener('load', () => {
    // start listening filter button changing
    startListenFilterButtons();

    // add focus input on search area click
    focusOnSearchFieldClick();

    // synchronize input text with url
    synchronizeSearchFieldWithUrl();

    // start listening search field
    startListeningSearchField();

    // after synchronizing all settings - update catalog
    synchronizeProducts();
})































