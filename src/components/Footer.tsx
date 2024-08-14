import '../styles/footer.css';
// import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faTwitter, faFacebook, faInstagram, faYoutube} from '@fortawesome/free-brands-svg-icons';
import { faCcVisa as faCcVisaBrand, faCcAmex as faCcAmexBrand, faCcMastercard as faCcMastercardBrand, faCcPaypal as faCcPaypalBrand, faBitcoin as faBitcoinBrand, faEthereum as faEthereumBrand } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown as faChevronDownSolid } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function Footer (){

    return(
        <footer className="partial-footer">
            <div className="footer-container">
                <div className="footer-container_logo">  
                    <img src={"https://res.cloudinary.com/dm4xprvtz/image/upload/v1721423159/logo8_y2jnbp.png"} alt="Logo Footer" className="footer-logo"/>
                </div>
                <div className="footer-container_item">
                    <p>SEGUINOS</p>
                    <div className="socials-container">
                        <FontAwesomeIcon icon={faInstagram as IconProp} className="fa-brands fa-2xl fa-instagram social_icon"/>
                        <FontAwesomeIcon icon={faTwitter as IconProp} className="fa-brands fa-2xl fa-twitter social_icon"/>
                        <FontAwesomeIcon icon={faFacebook as IconProp} className="fa-brands fa-2xl fa-facebook social_icon"/>
                        <FontAwesomeIcon icon={faYoutube as IconProp} className="fa-brands fa-2xl fa-youtube social_icon"/>
                    </div>
                </div>
                <div className="footer-container_item">
                    <div className="footer-container_item-title">
                        <p>SOBRE NOSOTROS</p>
                        <FontAwesomeIcon icon={faChevronDownSolid} className="fa-solid fa-chevron-down chevron-margin-right"/>
                    </div>
                    <div className="footer-container_item-content">
                        <Link href="/">About</Link>
                    </div>
                </div>
                <div className="footer-container_item">
                    <div className="footer-container_item-title">
                        <p>MARCAS</p>
                        <FontAwesomeIcon icon={faChevronDownSolid} className="fa-solid fa-chevron-down chevron-margin-right"/>
                    </div>
                    <div className="footer-container_item-content">
                        <p className="half-margin"><Link href="/">Nike</Link></p>
                        <p className="half-margin"><Link href="/">Adidas</Link></p>
                        <p className="half-margin"><Link href="/">FILA</Link></p>
                        <p className="half-margin"><Link href="/">Puma</Link></p>
                        <p className="half-margin"><Link href="/">Air Jordan</Link></p>
                    </div>
                </div>
                <div className="footer-container_item">
                    <div className="footer-container_item-title">
                        <p>SERVICIO AL CLIENTE</p>
                        <FontAwesomeIcon icon={faChevronDownSolid} className="fa-solid fa-chevron-down chevron-margin-right"/>
                    </div>
                    <div className="footer-container_item-content">
                        <p className="half-margin"><Link href="/">FAQs</Link></p>
                        <p className="half-margin"><Link href="/">Contactenos</Link></p>
                        <p className="half-margin"><Link href="/">Tiendas</Link></p>
                        <p className="half-margin"><Link href="/">Politica de privacidad</Link></p>
                        <p className="half-margin"><Link href="/">Politica de devoluciones</Link></p>
                    </div>
                </div>
                <div className="footer-container_item">
                    <p>MEDIOS DE PAGO</p>
                    <div className="socials-container">
                        <FontAwesomeIcon icon={faCcVisaBrand as IconProp} className="fa-brands fa-2xl fa-cc-visa social_icon"/>
                        <FontAwesomeIcon icon={faCcAmexBrand as IconProp} className="fa-brands fa-2xl fa-cc-amex social_icon"/>
                        <FontAwesomeIcon icon={faCcMastercardBrand as IconProp} className="fa-brands fa-2xl fa-cc-mastercard social_icon"/>
                        <FontAwesomeIcon icon={faCcPaypalBrand as IconProp} className="fa-brands fa-2xl fa-cc-paypal social_icon"/>
                        <FontAwesomeIcon icon={faBitcoinBrand as IconProp} className="fa-brands fa-2xl fa-bitcoin social_icon"/>
                        <FontAwesomeIcon icon={faEthereumBrand as IconProp} className="fa-brands fa-2xl fa-ethereum social_icon"/>
                    </div>
                </div>
                <p>Copyright © 2022 SneaKicks.</p>
            </div>
        </footer>
    )
}

export default Footer;