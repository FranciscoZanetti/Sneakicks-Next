"use client"
import Reviews from '@/components/productDetail/Reviews';
import SizeChart from '@/components/productDetail/SizeChart';
import Recommended from '@/components/productDetail/Recommended';
import fetchData from "@/utils/front/fetch";
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { useState, useEffect } from 'react';
import "@/styles/deleteOverlay.css";
require('dotenv').config();

interface DeleteOverlayProps {
    id: number | null;
    handleDelete: () => void;
    handleAbort: () => void;
}

export default function DeleteOverlay ({ id, handleDelete, handleAbort }: DeleteOverlayProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    return (
        <div id="overlay" className="overlay">
            <div className="overlay-content">
                <h2>¿Deseas eliminar el producto <span id="product-id">{id}</span>?</h2>
                <div className="overlay-buttons">
                    <button className="btn-cancel" onClick={handleAbort}>Cancelar</button>
                    <button disabled={isSubmitting} className="btn-delete" onClick={() => {setIsSubmitting(true); handleDelete()}}>Eliminar</button>
                </div>
            </div>
        </div>
    );
}
