export interface Product {
    _id: string;
    title: string;
    description: string;
    categoryID: {
      _id: string;
      name: string;
    };
    price: number;
    discountPercentage: number;
    stock: number;
    brand: string;
    dimensions: string;
    warrantyInformation: string;
    images: string[];
    image: string;
    rating: number;
    reviews: any[]; // Adjust type as needed based on actual review structure
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    meta: {
      barcode: string;
    };
    __v: number;
  }
  