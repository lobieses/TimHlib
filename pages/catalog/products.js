// Products can contain and can be filtered by next types of products: bakery, confectionery, meat
const PRODUCT_TYPES = {
    BAKERY: 'bakery',
    CONFECTIONERY: 'confectionery',
    MEAT: 'meat'
}

const PRODUCTS = [
    {
        id: 1,
        name: 'Chockolate',
        type: PRODUCT_TYPES.CONFECTIONERY,
        imageFilePath: './img/chocolate.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        id: 2,
        name: 'Sausage',
        type: PRODUCT_TYPES.MEAT,
        imageFilePath: './img/sausage.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        id: 1,
        name: 'Bread',
        type: PRODUCT_TYPES.BAKERY,
        imageFilePath: './img/bread.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },

]
