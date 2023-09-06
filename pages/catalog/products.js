// Products can contain and can be filtered by next types of products: bakery, confectionery, meat
const PRODUCT_TYPES = {
    BAKERY: 'bakery',
    CONFECTIONERY: 'confectionery',
    MEAT: 'meat'
}

const BASE_IMAGE_PATH = './img'

const PRODUCTS = [
    {
        id: 1,
        name: 'Chockolate',
        type: PRODUCT_TYPES.CONFECTIONERY,
        imageFilePath: `${BASE_IMAGE_PATH}/chocolate.jpg`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        benefits: ['tasty', 'tasty', 'tasty', 'tasty'],
        available: true,
        fieldOfApplication: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    },
    {
        id: 2,
        name: 'Sausage',
        type: PRODUCT_TYPES.MEAT,
        imageFilePath: `${BASE_IMAGE_PATH}/sausage.jpg`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        benefits: ['tasty', 'tasty', 'tasty', 'tasty'],
        available: false,
        fieldOfApplication: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    },
    {
        id: 3,
        name: 'Bread',
        type: PRODUCT_TYPES.BAKERY,
        imageFilePath: `${BASE_IMAGE_PATH}/bread.jpg`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        benefits: ['tasty', 'tasty', 'tasty', 'tasty'],
        available: true,
        fieldOfApplication: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    },

]
