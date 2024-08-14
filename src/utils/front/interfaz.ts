export interface Brand {
    id: number;
    name: string;
};

export interface Size {
    id: number;
    size: number;
    centimeters: number;
};

export interface Product {
    id: number;
    category: string;
    id_brand: number;
    name: string;
    colorwave: string;
    whole_name: string;
    discount: number;
    price_original: number;
    price_final: number;
    release_year: number;
    shoe_condition: string;
    story: string;
    main_picture: string;
    picture1?: (string | null);
    picture2?: (string | null);
    picture3?: (string | null);
    brand?: Brand;
    carts?: Products_cart[];
    product_sizes?: Products_size[];
    reviews?: Review[];
    hasStock?: boolean;
};

export interface Products_cart {
    id: number;
    user_id: (number | null);
    product_id: (number | null);
    units: number;
    size: number;
    bought: number;
    order_id: (number | null);
    user?: (User | null);
    product?: (Product | null);
    order?: (Order | null);
};

export interface Products_size {
    id: number;
    stock: number;
    product_id: (number);
    size_id: (number);
    product?: (Product);
    size?: (Size);
};

export interface Order {
    id: number;
    charges: (number | null);
    total_amount: number;
    id_user: (number | null);
    user_fullname: (string);
    id_shipping: (number | null);
    user?: (User | null);
    shipping?: (Shipping | null);
    products_cart?: (Products_cart[]);
};

export interface Review {
    id: number;
    stars: number;
    text: string;
    id_product: number;
    product?: Product;
};

export interface Shipping {
    id: number;
    name: string;
    description: string;
    cost: number;
    orders?: Order[];
};

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    image: string;
    carts?: Products_cart[];
    orders?: Order[];
};
