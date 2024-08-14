"use client"
import '../styles/header.css';
// import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars as faBarsSolid} from '@fortawesome/free-solid-svg-icons';
import {faCartShopping as faCartShoppingSolid} from '@fortawesome/free-solid-svg-icons';
import {faMagnifyingGlass as faMagnifyingGlassSolid} from '@fortawesome/free-solid-svg-icons';
import {faUser as faUserRegular} from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';

function Header (){

    const { session } = useSession();

    return(
        <header className="partial-header">
            <nav>
                <div className="top-navbar-container">
                    <div className="top-navbar">
                        <div className="top-left-navbar">
                            <ul>
                                <li><Link href="#"><FontAwesomeIcon className="fa-solid fa-bars dropdown" icon={faBarsSolid}/></Link></li>
                                <li><Link href="#"><FontAwesomeIcon className="fa-solid fa-magnifying-glass" icon={faMagnifyingGlassSolid}/></Link></li>
                            </ul>
                        </div>
                        <div className="logo">
                            <Link href="/">
                                <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423158/logo7_vqjhyc.png"} alt="Logo"/>
                            </Link>
                        </div>
                        <div className="top-right-navbar">
                                <ul>
                                    {/* { session?.category && session.category == 'admin' &&
                                        <li>
                                            <Link href="/create">
                                                <div className="user_button">
                                                    Crear producto
                                                </div>
                                            </Link>
                                        </li>
                                    } */}
                                    { session && session.first_name ? (
                                            <li>
                                                <Link href="">
                                                    <div className="user_button">
                                                        {session.first_name}
                                                    </div>
                                                </Link>
                                            </li>
                                        ) : (
                                            <li>
                                                <Link href="/login">
                                                    <FontAwesomeIcon className="fa-regular fa-user" icon={faUserRegular}/>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    <li><Link href="/cart"><FontAwesomeIcon className="fa-solid fa-cart-shopping" icon={faCartShoppingSolid}/></Link></li>
                                </ul>
                        </div>
                    </div>
                </div>
                <div className="bottom-navbar-container">
                    <div className="bottom-navbar">
                        <ul>
                            <li><Link href="/products?sizerange=men">MEN</Link></li>
                            <li><Link href="/products?sizerange=women">WOMEN</Link></li>
                            <li><Link href="/products?sizerange=kids">KIDS</Link></li>
                            <li><Link href="#">MARCAS</Link></li>
                            <li><Link href="#">OFERTAS</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;