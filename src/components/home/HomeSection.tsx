"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "@/styles/productDetail.css";
require('dotenv').config();

interface HomeSectionProps {
    category: string;
    products: any[];
}

const HomeSection: React.FC<HomeSectionProps> = ({ category, products }) => {

    const router = useRouter();
    
    return (
        <div>
            <h2 className="center_text">{category}</h2>
            <div className="preview-container">
                {products.map((product, i) => (
                    <div className="preview-container_item" key={product.id * i} onClick={() => {router.push(process.env.NEXT_PUBLIC_APP_BASE_URL+'/products/'+product.id)}}>
                        <Link href={process.env.NEXT_PUBLIC_APP_BASE_URL+`/products/${product.id}`}>
                            <div className="preview_image">
                                <img
                                    src={product.main_picture}
                                    alt={product.whole_name}
                                    className="preview"
                                />
                            </div>
                            <div className="preview_content">
                                <h3 className="half-margin">{product.brand.name}</h3>
                                <p className="half-margin">{product.whole_name}</p>
                                <p className="half-margin price">{product.price_final}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeSection;
