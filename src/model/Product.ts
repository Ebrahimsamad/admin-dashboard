export interface Dimensions {
    width: number;
    height: number;
    depth: number;
}

export interface Meta {
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    barcode: string;
}

export interface Product {
    _id: string; // GUID as string
    title: string;
    description: string;
    categoryID: number;
    price: number;
    discountPercentage: number;
    stock: number;
    brand: string;
    dimensions: Dimensions;
    warrantyInformation: string;
    availabilityStatus: string;
    returnPolicy: string;
    meta: Meta;
    images: string[]; // Array of image URLs
    thumbnail: string; // URL of the thumbnail image
}
