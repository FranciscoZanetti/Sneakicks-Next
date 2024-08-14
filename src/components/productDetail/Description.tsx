import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
import { useEffect } from 'react';
import '@/styles/productDetail.css';

interface DescriptionProps {
    story?: string;
}

const Description: React.FC<DescriptionProps> = ({ story }) => {

  useEffect(() => {
  }, [story]);

  return (
    <article className="details-text" id="description">
      {story ? (
        <div>
          <h3>Descripción</h3>
          <p className="paragrafs">{story}</p>
        </div>
      ) : (
        <p className="paragrafs">Cargando...</p>
      )}
    </article>
  );
}

export default Description;
