"use client"
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
import { useState, useEffect } from 'react';
import '@/styles/productDetail.css';
require('dotenv').config();

interface SelectProps {
  product_sizes: Products_size[];
  changeStockStatus: (units: number) => void;
}

const Select: React.FC<SelectProps> = (props) => {
  const [productSizes, setProductSizes] = useState<Products_size[]>([]);
  const [selected, setSelected] = useState<string>("initial");

  useEffect(() => {
    setProductSizes(props.product_sizes);
    setSelected("initial");
  }, [props.product_sizes]);

  useEffect(() => {
    console.log("Select updated");
  }, [productSizes, selected]);

  useEffect(() => {
    return () => console.log("Select unmounted");
  }, []);

  const changeSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
    const selected = productSizes.find(productSize => productSize.size_id == parseFloat(event.target.value));
    if (selected) {
        const stock = selected.stock;
        props.changeStockStatus(stock);
    }
  };

  return (
    <select onChange={changeSelected} value={selected} name="size" id="size">
      <option value="initial" disabled hidden> </option>
      {productSizes &&
        productSizes.map((productSize, i) => (
          <option value={productSize.size_id} key={productSize.id + i}>
            {productSize.size_id}
          </option>
        ))
      }
    </select>
  );
}

export default Select;
