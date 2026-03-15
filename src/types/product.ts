export interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    supplier: string;
    countryCode: string;
}

export interface CountryInfo {
    name: string;
    region: string;
    flag: string;
}

export interface ProductDetail extends Product {
    country: CountryInfo;
}