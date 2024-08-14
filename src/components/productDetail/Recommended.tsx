import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/productDetail.css';
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
require('dotenv').config();

interface RecommendedProps {
  recommended: Product[];
}

const Recommended: React.FC<RecommendedProps> = ({ recommended }) => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(recommended);

  useEffect(() => {
    setRecommendedProducts(recommended);
  }, [recommended]);

  useEffect(() => {
  }, [recommendedProducts]);

  return (
    <div className="preview-container">
      {recommendedProducts && recommendedProducts.length > 0 &&
        recommendedProducts.map((product, i) => (
          <div className="preview-container_item" key={product.id + i}>
            <Link href={process.env.NEXT_PUBLIC_APP_BASE_URL + "/products/" + product.id}>
              <div className="preview_image">
                <img src={product.main_picture} alt="" className="preview"/>
              </div>
              <div className="preview_content">
                <h3 className="half-margin">{product.brand?.name}</h3>
                <p className="half-margin">{product.name}</p>
                <p className="half-margin">{product.price_final}</p>
              </div>
            </Link>
          </div>
        ))
      }
    </div>
  );
}

export default Recommended;
