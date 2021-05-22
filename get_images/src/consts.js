export const MAX_CONCURRENT = 5; // Concurrent requests
export const MAX_DELAY = 7000; // Max delay between subsequent requests

export const OPTION_USE_LOCAL = Symbol('use local');
export const OPTION_SELECTED_IDS = Symbol('selected ids');

export const COOKIE_PATH = 'src/input/cookie';
export const PRODUCTS_URL_PATH = 'src/input/productsUrls'; // AliExpress products URLs

export const SAMPLE_PAGE_PATH = 'src/samples/page.html';
export const SAMPLE_FREIGHT_PATH = 'src/samples/freight.json';

export const OUTPUT_PATH = 'src/output'; // Output folder
export const OUTPUT_INFO_PATH = `${OUTPUT_PATH}/info`; // Page output folder

export const PRODUCTS_JSON_PATH = `${OUTPUT_PATH}/productJSON`; // JSON
export const FULL_PAGE_INFO_PATH = `${OUTPUT_PATH}/products`;

export const NAME_INFO_PATH = `${OUTPUT_INFO_PATH}/nameInfo`;
export const SOLD_INFO_PATH = `${OUTPUT_INFO_PATH}/soldInfo`;
export const STORE_INFO_PATH = `${OUTPUT_INFO_PATH}/storeInfo`;
export const REVIEWS_INFO_PATH = `${OUTPUT_INFO_PATH}/reviewsInfo`;
export const PRICES_INFO_PATH = `${OUTPUT_INFO_PATH}/pricesInfo`;
export const IMAGES_INFO_PATH = `${OUTPUT_INFO_PATH}/imagesInfo`;

export const FREIGHT_PATH = `${OUTPUT_PATH}/freightsAll`; // Output all freights file
export const SELECTED_FREIGHT_PATH = `${OUTPUT_PATH}/frightsSmall`; // Output smallest price fright file
