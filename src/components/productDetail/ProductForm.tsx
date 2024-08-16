"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '@/styles/productDetail.css';
import Select from '@/components/productDetail/Select';
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
require('dotenv').config();

interface ProductFormProps {
  product: Product;
  colorwaves: any;
  DRGchecker: string;
  onChangeDRG: (clicked: string) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, colorwaves, DRGchecker, onChangeDRG }) => {
  const [colorwaveSelected, setColorwaveSelected] = useState<any | undefined>(undefined);
  const [stock, setStock] = useState<number | boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setColorwaveSelected(product.colorwave);
  }, [product]);

  useEffect(() => {
    console.log("Product updated");
  }, [product, colorwaves, DRGchecker, colorwaveSelected, stock]);

  const getSelected = () => {
    if (product.product_sizes === undefined) {
      return (
        <select name="size" id="size">
          <option selected disabled hidden> </option>
        </select>
      );
    } else {
      return (<Select changeStockStatus={changeStockStatus} product_sizes={product.product_sizes} />);
    }
  }

  const workWithChangeDRG = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.localName === "span") {
      onChangeDRG((target.parentNode as HTMLElement).id);
    } else {
      onChangeDRG(target.id);
    }
  }

  const changeColorwaveSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setColorwaveSelected(event.target.value);
    console.log(event.target.value);
  }

  const handleColorwaveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeColorwaveSelected(event);
    let colorwaveMatch = product.id;
    colorwaves.forEach((colorwaveProduct: any) => {
      if (event.target.value === colorwaveProduct.colorwave) {
        colorwaveMatch = colorwaveProduct.id;
      }
    });
    if (colorwaveMatch !== undefined && colorwaveMatch !== product.id) {
      onChangeDRG("nav-descripcion");
      router.push("/products/" + colorwaveMatch);
    }
  }

  const changeStockStatus = (units: number) => {
    setStock(units);
  };

  const getStockStatus = () => {
    if (product?.hasStock) {
      if (typeof stock == "number" && stock > 0) {
        return <p className="form-stock-avaiable">{stock} DISPONIBLES</p>;
      } else if (typeof stock == "number" && stock == 0) {
        return <p className="form-stock-unavaiable">SIN STOCK</p>;
      } else if (!stock) {
        return <p className="form-stock-avaiable">DISPONIBLE</p>;
      }
    } else if (!product.hasStock) {
      return <p className="form-stock-unavaiable">SIN STOCK</p>;
    }
  }

  return (
    <section className="product">
      {product &&
        <section className="product-pc">
          <section className="images">
            <div id="image-pc">
              <img src={product.main_picture} alt={product.name} />
            </div>
            <div className="images-mini">
              <article className="images-mini-img-container">
                <img src={product.main_picture != null ? product.main_picture : ""} alt={product.name} />
              </article>
              <article className="images-mini-img-container">
                <img src={product.picture1 != null ? product.picture1 : ""} alt={product.name} />
              </article>
              <article className="images-mini-img-container">
                <img src={product.picture2 != null ? product.picture2 : ""} alt={product.name} />
              </article>
              <article className="images-mini-img-container">
                <img src={product.picture3 != null ? product.picture3 : ""} alt={product.name} />
              </article>
            </div>
          </section>

          <nav>
            <div onClick={workWithChangeDRG} id={DRGchecker === "nav-descripcion" ? "nav-descripcion-selected" : "nav-descripcion"}><span>Descripcion</span></div>
            <div onClick={workWithChangeDRG} id={DRGchecker === "nav-reseñas" ? "nav-reseñas-selected" : "nav-reseñas"}><span>Reseñas</span></div>
            <div onClick={workWithChangeDRG} id={DRGchecker === "nav-talles" ? "nav-talles-selected" : "nav-talles"}><span>Guía de talles</span></div>
          </nav>
        </section>
      }

      {product && colorwaves &&
        <section className="product-info">
          <div className="product-info-header">
            <h2>{product.whole_name}</h2>
            <div className="fav"><FontAwesomeIcon className="fa-regular fa-heart" icon={faHeartRegular} /></div>
          </div>

          <div className="star-rating">
            <FontAwesomeIcon className="fa-solid fa-star" icon={faStarSolid} /><FontAwesomeIcon className="fa-solid fa-star" icon={faStarSolid} /><FontAwesomeIcon className="fa-solid fa-star" icon={faStarSolid} /><FontAwesomeIcon className="fa-solid fa-star" icon={faStarSolid} /><FontAwesomeIcon className="fa-regular fa-star" icon={faStarRegular} />
          </div>

          <div className="product-info-brand">
            {product.brand &&
              <p id="product-info-brand">{product.brand.name}</p>
            }
          </div>

          <div className="images-big"><img src={product.main_picture} alt={product.name} /></div>

          <div className="product-info-condition">
            {product.shoe_condition === "used" && <p id="product-info-condition">Usado</p>}
            {product.shoe_condition === "new_no_def" && <p id="product-info-condition">Nuevo</p>}
          </div>

          <section className="product-info-price">
            {product.discount != 0 &&
              <div className="price-old">
                <span className="price"> {product.price_original}</span>
              </div>
            }
            <div className="price-off">
              <div className="price-off-price">
                <span>$ {product.price_final}</span>
              </div>
              {product.discount != 0 &&
                <span className="price-off-off">{product.discount}% OFF</span>
              }
            </div>
          </section>

          <section className="product-info-extra">
            <article className="extra">
              <span className="extra-icon"><FontAwesomeIcon className="fa-solid fa-truck-fast" icon={faTruckFast} /></span>
              <span className="extra-text">Detalles de envío</span>
            </article>
            <article className="extra">
              <span className="extra-icon"><FontAwesomeIcon className="fa-solid fa-arrow-right-arrow-left" icon={faArrowRightArrowLeft} /></span>
              <span className="extra-text">Detalles de devolución</span>
            </article>
          </section>

          <form className="product-info-form" action={"api/products/" + product.id} method="post">

            <section className="form-size">
              <div className="size-select-container-parent">
                <div className="size-select-container-child">
                  <label htmlFor="size">Talle:</label>
                  {getSelected()}
                  <span className="custom-arrow-size"></span>
                </div>
              </div>
            </section>

            {colorwaveSelected &&
              <section className="form-colorwaves">
                <div className="colorwaves-container">
                  <label htmlFor="colorwave">Modelo:</label>
                  <select name="colorwave" id="colorwave" value={colorwaveSelected} onChange={handleColorwaveChange}>
                    <option value={product.colorwave}>{product.colorwave}</option>
                    {colorwaves.length >= 1 &&
                      colorwaves.map((colorwaveProduct: any, i: number) => {
                        return (
                          <option value={colorwaveProduct.colorwave} key={colorwaveProduct.colorwave + i}>{colorwaveProduct.colorwave}</option>
                        );
                      })
                    }
                  </select>
                  <span className="custom-arrow-colorwave"></span>
                </div>
              </section>
            }

            <div className="cart-button">
              <button type="submit">AGREGAR AL CARRITO</button>
            </div>

          </form>

          {getStockStatus()}

        </section>
      }

    </section>
  );
}

export default ProductForm;
