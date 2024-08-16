import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft as faChevronLeftSolid, faChevronRight as faChevronRightSolid, faEllipsis as faEllipsisSolid } from '@fortawesome/free-solid-svg-icons';
import '@/styles/home.css';
import HomeSection from '@/components/home/HomeSection';
import fetchData from "@/utils/front/fetch";
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
import { prisma } from "@/libs/prisma";
import { redis } from "@/libs/redis";
require('dotenv').config();

interface HomeProps{
    unreleased: any[];
    bargains: any[];
    newones: any[];
    used: any[];
}

const getData = async () => {
    let products: any;
    products = await redis.get('products');
    
    console.log("\nREDIS PRODUCTS: " + JSON.stringify(products) + "\n");
    
    if (!products) {
        try {
            products = await prisma.product.findMany({
                include: {
                    brand: true,
                    product_sizes: true,
                },
            });
            await redis.set("products", JSON.stringify(products));
        } catch (error) {
            console.log(error);
            
        }
    }

    let newOnes: Product[] = [];
    let used: Product[] = [];
    let bargains: Product[] = [];
    let unreleased: Product[] = [];

    let counterNewOnes = 0;
    let counterUsed = 0;
    let counterBargains = 0;
    let counterUnreleased = 0;

    const year = new Date().getFullYear();

    products.forEach((product: Product) => {
        if (product.shoe_condition == "new_no_def"){
            newOnes.push(product);
            counterNewOnes++;
        } else {
            used.push(product);
            counterUsed++;
        }
        if (product.release_year > year){
            used.push(product);
            counterUnreleased++;
        }
        if (product.discount > 0){
            bargains.push(product);
            counterBargains++;
        }
    });

    let data = {
        counterNewones: counterNewOnes,
        counterUsed: counterUsed,
        counterBargains: counterBargains,
        counterUnreleased: counterUnreleased,
        newones: newOnes,
        used: used,
        bargains: bargains,
        unreleased: unreleased
    }

    return data;
}

export default async function Home() {
    // const unreleased: Product[] = [];
    // const bargains: Product[] = [];
    // const used: Product[] = [];
    // const newones: Product[] = [];
    console.log("Is this running on the server?", typeof window === "undefined");


    // console.log("WILL REFETCH");
    
    // const response = await fetchData("/products/landing", { seconds: 300 });
    // console.log(response);

    
    
    // const unreleased: Product[] = response.data?.unreleased ?? [];
    // console.log(unreleased);
    
    // const bargains: Product[] = response.data?.bargains ?? [];
    // const used: Product[] = response.data?.used ?? [];
    // const newones: Product[] = response.data?.newones ?? [];

    const data = await getData();

    const unreleased: Product[] = data?.unreleased ?? [];
    console.log(unreleased);
    
    const bargains: Product[] = data?.bargains ?? [];
    const used: Product[] = data?.used ?? [];
    const newones: Product[] = data?.newones ?? [];


    return (
        <main id='Home-main'>
            <div className="carrousel_container">
                <p className="carrousel_text">NUEVOS ARRIBOS</p>
                <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423153/banner2_qfybch.png"} alt="carrousel" className="carrousel"/>
                <Link href="/products" className="shop_button">COMPRAR</Link>
                <FontAwesomeIcon icon={faChevronLeftSolid} className="fa-solid fa-chevron-left fa-xl left_arrow"/>
                <FontAwesomeIcon icon={faChevronRightSolid} className="fa-solid fa-chevron-right fa-xl right_arrow"/>
            </div>
            <div className="pagination_container">
                <FontAwesomeIcon icon={faEllipsisSolid} className="fa-solid fa-2xl fa-ellipsis color-grey"/>
            </div>
            <div className="discount-container">
                <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423160/offer1_ye3s88.jpg"} alt="Oferta Nike" className="discount-container_item"/>
                <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423161/offer2_t1hqyy.png"} alt="Oferta Puma" className="discount-container_item"/>
            </div>

            {unreleased.length > 0 && <HomeSection category={"NOVEDADES"} products={unreleased} />}

            {bargains.length > 0 && <HomeSection category={"OFERTAS"} products={bargains} />}

            {newones.length > 0 && <HomeSection category={"NUEVOS"} products={newones} />}

            {used.length > 0 && <HomeSection category={"USADOS"} products={used} />}

            <div className="carrousel_container">
                <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423152/banneroffer_z60t55.jpg"} alt="Oferta Pony" className="lower_banner"/>
            </div>
            <h2 className="center_text">COMPRA POR MARCAS</h2>
            <div className="carrousel_small_container">
                <div className="carrousel_small">
                    <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423198/logonike_cceuaq.png"} alt="Logo Nike" className="brands_preview"/>
                    <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423196/logoadidas_fzqrev.png"} alt="Logo Adidas" className="brands_preview"/>
                    <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423197/logofila_vbf62q.png"} alt="Logo Fila" className="brands_preview"/>
                    <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423199/logopuma_eyqwaz.png"} alt="Logo Puma" className="brands_preview"/>
                    <FontAwesomeIcon icon={faChevronLeftSolid} className="fa-solid fa-chevron-left brands_left_arrow"/>
                    <FontAwesomeIcon icon={faChevronRightSolid} className="fa-solid fa-chevron-right brands_right_arrow"/>
                </div>
            </div>
        </main>
    );
}

// const getServerSideProps: GetServerSideProps<HomeProps> = async () =>{
//     const response = await fetch(`${process.env.APP_BASE_URL}/api/main`);
//     const data = await response.json();

//     return {
//         props: {
//             unreleased: data.data?.unreleased ?? [],
//             bargains: data.data?.bargains ?? [],
//             newones: data.data?.newones ?? [],
//             used: data.data?.used ?? [],
//         },
//     };
// }
