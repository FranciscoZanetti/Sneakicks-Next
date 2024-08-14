"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'next/navigation';
import '@/styles/productDetail.css';
import ProductForm from '@/components/productDetail/ProductForm';
import Description from '@/components/productDetail/Description';
import Reviews from '@/components/productDetail/Reviews';
import SizeChart from '@/components/productDetail/SizeChart';
import Recommended from '@/components/productDetail/Recommended';
import fetchData from "@/utils/front/fetch";
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { useRouter } from 'next/navigation';
import DeleteOverlay from "@/components/productDetail/DeleteOverlay";
require('dotenv').config();


interface ResultsType {
  product: Product;
  colorwaves: any;
  recommended: Product[];
}

const ProductDetail: React.FC = () => {
  const id = useParams().id;
  const [overlay, setOverlay] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const productId = typeof id === 'string' ? parseInt(id) : null;
  const [product, setProduct] = useState<Product | null>(null);
  const [colorwaves, setColorwaves] = useState<any>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const isNotDesktop = useMediaQuery({ query: '(max-width: 992px)' });
  const [DRGchecker, setDRGchecker] = useState('nav-descripcion');

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      if (id) {
        let results = await fetchData("/products/"+id);
        if (results.success) {
          setProduct(results.data.product);
          setColorwaves(results.data.colorwaves);
          results.data.product.reviews.reverse();
          setReviews(results.data.product.reviews);
          setRecommended(results.data.recommended);
          setIsLoading(false);
        }
      }
    };

    getData();
  }, [productId, id]);

  useEffect(() => {
    const updateData = async () => {
      if (product && product.id !== productId) {
        setDRGchecker('nav-descripcion');
        let results = await fetchData("/products/"+id);
        if (results.success) {
          setProduct(results.data.product);
          setColorwaves(results.data.colorwaves);
          results.data.product.reviews.reverse();
          setReviews(results.data.product.reviews);
          setRecommended(results.data.recommended);
          setIsLoading(false);
        }
      }
    };

    updateData();
  }, [productId, product, id]);

  useEffect(() => {
    return () => console.log('ProductDetail unmounted');
  }, []);

  const changeDRG = (clicked: string) => {
    setDRGchecker(clicked);
  };

  const handleDelete = async () => {
      try {
          const results = await fetchData("/products/" + productId, { method: "DELETE" });
          if (results.status == 200) {
              router.push("/");
          } else {
              return;
          }
      } catch (error) {
          console.log(error);
          return;
      }
  }

  const handleAbort = async () => {
    setOverlay(false);
    console.log(overlay);
    
  }

  const pagePath = "products > ";

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main id='ProductDetail'>

      {overlay && <DeleteOverlay id={productId} handleDelete={handleDelete} handleAbort={handleAbort} /> }

      <div className="container">
        <div className="directory">
          <Link href="/products">{pagePath}</Link>
          {product && (
            <Link href={`/products/${id}`}>
              {product.whole_name}
            </Link>
          )}
        </div>

        <section className="edit-delete-container">
          <div className="edit-delete">
            {/* <Link href="" className="edit-delete-a"> */}
              <div className="edit-delete-buttons" id="edit-button">
                <p>Editar</p>
              </div>
            {/* </Link> */}
            {/* <Link href="" className="edit-delete-a" onClick={() => {setOverlay(true)}}> */}
              <div className="edit-delete-buttons" id="delete-button" onClick={() => {setOverlay(true)}}>
                <p>Eliminar</p>
              </div>
            {/* </Link> */}
          </div>
        </section>

        {product && colorwaves && (
          <ProductForm product={product} colorwaves={colorwaves} DRGchecker={DRGchecker} onChangeDRG={changeDRG} />
        )}

        {product && reviews && isNotDesktop && (
          <section className="details">
            <Description story={product.story} />
            <Reviews reviews={reviews} productId={product.id} />
            <SizeChart />
          </section>
        )}

        {product && reviews && isDesktop && (
          <section className="details">
            {DRGchecker === 'nav-descripcion' && <Description story={product.story} />}
            {DRGchecker === 'nav-reseñas' && <Reviews reviews={reviews} productId={product.id} />}
            {DRGchecker === 'nav-talles' && <SizeChart />}
          </section>
        )}

        {product && recommended && recommended.length > 0 && (
          <section className="recomended">
            <h3>Te pueden interesar</h3>
            <Recommended recommended={recommended} />
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
