"use client"
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { frontProductFileValidator } from "@/utils/validations/file";
import { productSchema } from "@/utils/validations/product";
import fetchData from "@/utils/front/fetch";
import { useRouter } from 'next/navigation';
import { Brand, Size, Product, Review, Products_size, Products_cart, Order, Shipping, User } from "@/utils/front/interfaz";
import {
    MultiImageDropzone,
    type FileState,
} from '@/components/edgestore/multi-image-dropzone';
import { useEdgeStore } from '@/libs/edgestore';
import "@/styles/createEdit.css";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
require('dotenv').config();

interface FormValues {
    name: string;
    colorwave: string;
    brand_name: string;
    category: string;
    size_30: string;
    size_35: string;
    size_40: string;
    size_45: string;
    size_50: string;
    size_55: string;
    size_60: string;
    size_65: string;
    size_70: string;
    size_75: string;
    size_80: string;
    size_85: string;
    size_90: string;
    size_95: string;
    size_100: string;
    size_105: string;
    size_110: string;
    size_115: string;
    size_120: string;
    size_125: string;
    size_130: string;
    size_135: string;
    size_140: string;
    size_145: string;
    size_150: string;
    size_155: string;
    price_original: string;
    discount: string;
    release_year: string;
    story: string;
    shoe_condition: string;
    product_pictures: string[];
}



const CreateEdit = (props: { product?: Product }) => {
    const { product } = props;
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [errorsBack, setErrorsBack] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const { edgestore } = useEdgeStore();
    const router = useRouter();

    // useEffect(() => {

    // }, [submittedSuccessfully]);

    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
          const newFileStates = structuredClone(fileStates);
          const fileState = newFileStates.find(
            (fileState) => fileState.key === key,
          );
          if (fileState) {
            fileState.progress = progress;
          }
          return newFileStates;
        });
    }

    let sizeArray: number[] = [];
    if (product?.product_sizes){
        product.product_sizes.forEach((product_size) => {
            sizeArray.push(Math.trunc(product_size.size_id * 10));
        });
    }

    const initialValues: FormValues = {
        name: product?.name ?? "",
        colorwave: product?.colorwave ?? "",
        brand_name: product?.brand?.name ?? "",
        category: product?.category ?? "",
        size_30: sizeArray.length == 26 ? sizeArray[0].toString() : "0",
        size_35: sizeArray.length == 26 ? sizeArray[1].toString() : "0",
        size_40: sizeArray.length == 26 ? sizeArray[2].toString() : "0",
        size_45: sizeArray.length == 26 ? sizeArray[3].toString() : "0",
        size_50: sizeArray.length == 26 ? sizeArray[4].toString() : "0",
        size_55: sizeArray.length == 26 ? sizeArray[5].toString() : "0",
        size_60: sizeArray.length == 26 ? sizeArray[6].toString() : "0",
        size_65: sizeArray.length == 26 ? sizeArray[7].toString() : "0",
        size_70: sizeArray.length == 26 ? sizeArray[8].toString() : "0",
        size_75: sizeArray.length == 26 ? sizeArray[9].toString() : "0",
        size_80: sizeArray.length == 26 ? sizeArray[10].toString() : "0",
        size_85: sizeArray.length == 26 ? sizeArray[11].toString() : "0",
        size_90: sizeArray.length == 26 ? sizeArray[12].toString() : "0",
        size_95: sizeArray.length == 26 ? sizeArray[13].toString() : "0",
        size_100: sizeArray.length == 26 ? sizeArray[14].toString() : "0",
        size_105: sizeArray.length == 26 ? sizeArray[15].toString() : "0",
        size_110: sizeArray.length == 26 ? sizeArray[16].toString() : "0",
        size_115: sizeArray.length == 26 ? sizeArray[17].toString() : "0",
        size_120: sizeArray.length == 26 ? sizeArray[18].toString() : "0",
        size_125: sizeArray.length == 26 ? sizeArray[19].toString() : "0",
        size_130: sizeArray.length == 26 ? sizeArray[20].toString() : "0",
        size_135: sizeArray.length == 26 ? sizeArray[21].toString() : "0",
        size_140: sizeArray.length == 26 ? sizeArray[22].toString() : "0",
        size_145: sizeArray.length == 26 ? sizeArray[23].toString() : "0",
        size_150: sizeArray.length == 26 ? sizeArray[24].toString() : "0",
        size_155: sizeArray.length == 26 ? sizeArray[25].toString() : "0",
        price_original: product?.price_original ? product.price_original.toString() : "",
        discount: product?.discount ? product.discount.toString() : "",
        release_year: product?.release_year ? product.release_year.toString() : "",
        story: product?.story ? product.story.toString() : "",
        shoe_condition: product?.shoe_condition ?? "new_no_def",
        product_pictures: [],
    };


    const resetForm = (old?: any) => {
        const inputName = document.querySelector('form input[name="name"]') as HTMLInputElement;
        const inputColorwave = document.querySelector('form input[name="colorwave"]') as HTMLInputElement;
        const inputBrandName = document.querySelector('form input[name="brand_name"]') as HTMLInputElement;
        const inputCategory = document.querySelector('form input[name="category"]') as HTMLInputElement;
        const inputPriceOriginal = document.querySelector('form input[name="price_original"]') as HTMLInputElement;
        const inputDiscount = document.querySelector('form input[name="discount"]') as HTMLInputElement;
        const inputReleaseYear = document.querySelector('form input[name="release_year"]') as HTMLInputElement;
        const inputStory = document.querySelector('form textarea[name="story"]') as HTMLTextAreaElement;
        const selectCondition = document.querySelector('form select[name="shoe_condition"]') as HTMLSelectElement;
        const inputSize30 = document.querySelector('form input[name="size_30"]') as HTMLInputElement;
        const inputSize35 = document.querySelector('form input[name="size_35"]') as HTMLInputElement;
        const inputSize40 = document.querySelector('form input[name="size_40"]') as HTMLInputElement;
        const inputSize45 = document.querySelector('form input[name="size_45"]') as HTMLInputElement;
        const inputSize50 = document.querySelector('form input[name="size_50"]') as HTMLInputElement;
        const inputSize55 = document.querySelector('form input[name="size_55"]') as HTMLInputElement;
        const inputSize60 = document.querySelector('form input[name="size_60"]') as HTMLInputElement;
        const inputSize65 = document.querySelector('form input[name="size_65"]') as HTMLInputElement;
        const inputSize70 = document.querySelector('form input[name="size_70"]') as HTMLInputElement;
        const inputSize75 = document.querySelector('form input[name="size_75"]') as HTMLInputElement;
        const inputSize80 = document.querySelector('form input[name="size_80"]') as HTMLInputElement;
        const inputSize85 = document.querySelector('form input[name="size_85"]') as HTMLInputElement;
        const inputSize90 = document.querySelector('form input[name="size_90"]') as HTMLInputElement;
        const inputSize95 = document.querySelector('form input[name="size_95"]') as HTMLInputElement;
        const inputSize100 = document.querySelector('form input[name="size_100"]') as HTMLInputElement;
        const inputSize105 = document.querySelector('form input[name="size_105"]') as HTMLInputElement;
        const inputSize110 = document.querySelector('form input[name="size_110"]') as HTMLInputElement;
        const inputSize115 = document.querySelector('form input[name="size_115"]') as HTMLInputElement;
        const inputSize120 = document.querySelector('form input[name="size_120"]') as HTMLInputElement;
        const inputSize125 = document.querySelector('form input[name="size_125"]') as HTMLInputElement;
        const inputSize130 = document.querySelector('form input[name="size_130"]') as HTMLInputElement;
        const inputSize135 = document.querySelector('form input[name="size_135"]') as HTMLInputElement;
        const inputSize140 = document.querySelector('form input[name="size_140"]') as HTMLInputElement;
        const inputSize145 = document.querySelector('form input[name="size_145"]') as HTMLInputElement;
        const inputSize150 = document.querySelector('form input[name="size_150"]') as HTMLInputElement;
        const inputSize155 = document.querySelector('form input[name="size_155"]') as HTMLInputElement;
        
        
        inputName.value = old ? old.name : "";
        inputBrandName.value = old ? old.brand_name : "";
        inputColorwave.value = old ? old.colorwave : "";
        inputCategory.value = old ? old.category : "";
        inputPriceOriginal.value = old ? old.price_original : "";
        inputDiscount.value = old ? old.discount : "";
        inputReleaseYear.value = old ? old.release_year : "";
        inputStory.value = old ? old.story : "";
        inputSize30.value = old ? old.size_30 : "0";
        inputSize35.value = old ? old.size_35 : "0";
        inputSize40.value = old ? old.size_40 : "0";
        inputSize45.value = old ? old.size_45 : "0";
        inputSize50.value = old ? old.size_50 : "0";
        inputSize55.value = old ? old.size_55 : "0";
        inputSize60.value = old ? old.size_60 : "0";
        inputSize65.value = old ? old.size_65 : "0";
        inputSize70.value = old ? old.size_70 : "0";
        inputSize75.value = old ? old.size_75 : "0";
        inputSize80.value = old ? old.size_80 : "0";
        inputSize85.value = old ? old.size_85 : "0";
        inputSize90.value = old ? old.size_90 : "0";
        inputSize95.value = old ? old.size_95 : "0";
        inputSize100.value = old ? old.size_100 : "0";
        inputSize105.value = old ? old.size_105 : "0";
        inputSize110.value = old ? old.size_110 : "0";
        inputSize115.value = old ? old.size_115 : "0";
        inputSize120.value = old ? old.size_120 : "0";
        inputSize125.value = old ? old.size_125 : "0";
        inputSize130.value = old ? old.size_130 : "0";
        inputSize135.value = old ? old.size_135 : "0";
        inputSize140.value = old ? old.size_140 : "0";
        inputSize145.value = old ? old.size_145 : "0";
        inputSize150.value = old ? old.size_150 : "0";
        inputSize155.value = old ? old.size_155 : "0";
        selectCondition.value = old ? old.shoe_condition : "new_no_defects";
        if (!old) {
            setUrls([]);
            setFileStates([]);
        }
    }



    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange: false,
        validateOnBlur: false,


        onSubmit: async (values: FormValues) => {
            console.log("VALUES:   ", values);
            setIsSubmitting(true);

            setIsProcessing(true);
            
            values.product_pictures = urls;
    
            try {
                const results = await fetchData('/products', {
                    method: 'POST',
                    body: values,
                });
                console.log(results);
                console.log(JSON.stringify(results));
                
                
                if (results.status == 201) {
                    for (const url of urls) {
                        await edgestore.products.confirmUpload({
                          url,
                        });
                    }
                    setErrorsBack(undefined);
                    resetForm();
                    setIsSubmitting(false);
                    router.push(results.url);
                } else if (results.status == 400) {
                    setErrorsBack("Revisa los campos con valores inválidos.");
                    resetForm(results.old);
                } else if (results.status == 403) {
                    setErrorsBack("No eres administrador.");
                    resetForm();
                } else {
                    setErrorsBack("Ha ocurrido un error en el servidor.");
                    resetForm(results.old);
                }
            } catch (error) {
                setErrorsBack("Ha ocurrido un error desconocido.");
                resetForm();
            } finally {
                setIsSubmitting(false);
                setIsProcessing(false);
            }
        },


        validate:  (values) => {
            let formattedValues = {
                brand_name: values.brand_name,
                category: values.category,
                colorwave: values.colorwave,
                discount: parseInt(values.discount),
                release_year: parseInt(values.release_year),
                price_original: parseInt(values.price_original),
                name: values.name,
                shoe_condition: values.shoe_condition,
                story: values.story,
                size_30: parseInt(values.size_30),
                size_35: parseInt(values.size_35),
                size_40: parseInt(values.size_40),
                size_45: parseInt(values.size_45),
                size_50: parseInt(values.size_50),
                size_55: parseInt(values.size_55),
                size_60: parseInt(values.size_60),
                size_65: parseInt(values.size_65),
                size_70: parseInt(values.size_70),
                size_75: parseInt(values.size_75),
                size_80: parseInt(values.size_80),
                size_85: parseInt(values.size_85),
                size_90: parseInt(values.size_90),
                size_95: parseInt(values.size_95),
                size_100: parseInt(values.size_100),
                size_105: parseInt(values.size_105),
                size_110: parseInt(values.size_110),
                size_115: parseInt(values.size_115),
                size_120: parseInt(values.size_120),
                size_125: parseInt(values.size_125),
                size_130: parseInt(values.size_130),
                size_135: parseInt(values.size_135),
                size_140: parseInt(values.size_140),
                size_145: parseInt(values.size_145),
                size_150: parseInt(values.size_150),
                size_155: parseInt(values.size_155),
                product_pictures: urls,
            }
    
            const result = productSchema.safeParse(formattedValues);
            console.log(result);
            console.log(JSON.stringify(result));            
            
            if (result.success) {
                return;
            }
            const errors: Record<string, string> = {};
            result.error.issues.forEach(error => {
                errors[error.path[0]] = error.message;
            });
            return errors;
        }
    });


    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        formik.handleBlur(e);
        formik.setFieldTouched(e.target.name, true, true);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        formik.handleChange(e);
        formik.setFieldTouched(e.target.name, false, false);
    };



    return (
        <main id='CreateEdit-main'>
            { isProcessing && <LoadingOverlay text='Creando producto...'/> }
            <div className="container">
                { product && <h2 className="manage-title">Edita el producto</h2> }
                {!product && <h2 className="manage-title">Crea un producto</h2> }
                <form onSubmit={formik.handleSubmit}>
                    { errorsBack && <p className="error-message errors-back">{errorsBack}</p> }
                    <article className="product-item">
                        <label htmlFor="item-name" className="item-label">Nombre del modelo</label>
                        {/* { formik.errors.name && formik.touched.name &&
                            <div className="error-message-container">
                                <p className="error-message">{formik.errors.name}</p>
                            </div>
                        } */}
                        <p className="error-message">{formik.touched.name && formik.errors.name}</p>
                        <input onChange={handleChange} onBlur={handleBlur} type="text" className={formik.errors.name && formik.touched.name ? "item-input-errors" : "item-input"} id="item-name" name="name" value={formik.values.name} />
                    </article>
                    <article className="product-item">
                        <label htmlFor="item-colorwave" className="item-label">Colorwave</label>
                        {/* { formik.errors.colorwave && formik.touched.colorwave &&
                            <div className="error-message-container">
                                <p className="error-message">{formik.errors.colorwave}</p>
                            </div>
                        } */}
                        <p className="error-message">{formik.touched.colorwave && formik.errors.colorwave}</p>
                        <input onChange={handleChange} onBlur={handleBlur} type="text" className={formik.errors.colorwave && formik.touched.colorwave ? "item-input-errors" : "item-input"} id="item-colorwave" name="colorwave" value={formik.values.colorwave} />
                    </article>
                    <article className="product-item">
                        <label htmlFor="item-brand" className="item-label">Marca</label>
                        {/* { formik.errors.brand_name && formik.touched.brand_name &&
                            <div className="error-message-container">
                                <p className="error-message">{formik.errors.brand_name}</p>
                            </div>
                        } */}
                        <p className="error-message">{formik.touched.brand_name && formik.errors.brand_name}</p>
                        <input onChange={handleChange} onBlur={handleBlur} type="text" className={formik.errors.brand_name && formik.touched.brand_name ? "item-input-errors" : "item-input"} id="item-brand" name="brand_name" value={formik.values.brand_name} />
                    </article>
                    <article className="product-item">
                        <label htmlFor="item-category" className="item-label">Categoía</label>
                        {/* { formik.errors.category && formik.touched.category &&
                            <div className="error-message-container">
                                <p className="error-message">{formik.errors.category}</p>
                            </div>
                        } */}
                        <p className="error-message">{formik.touched.category && formik.errors.category}</p>
                        <input onChange={handleChange} onBlur={handleBlur} type="text" className={formik.errors.category && formik.touched.category ? "item-input-errors" : "item-input"} id="item-category" name="category" value={formik.values.category} />
                    </article>
                    <article className="product-item">
                        <p className="item-header">Talles</p>
                        {( 
                            (formik.touched.size_30 && formik.errors.size_30) || 
                            (formik.touched.size_35 && formik.errors.size_35) || 
                            (formik.touched.size_40 && formik.errors.size_40) || 
                            (formik.touched.size_45 && formik.errors.size_45) || 
                            (formik.touched.size_50 && formik.errors.size_50) || 
                            (formik.touched.size_55 && formik.errors.size_55) || 
                            (formik.touched.size_60 && formik.errors.size_60) || 
                            (formik.touched.size_65 && formik.errors.size_65) || 
                            (formik.touched.size_70 && formik.errors.size_70) || 
                            (formik.touched.size_75 && formik.errors.size_75) || 
                            (formik.touched.size_80 && formik.errors.size_80) || 
                            (formik.touched.size_85 && formik.errors.size_85) || 
                            (formik.touched.size_90 && formik.errors.size_90) || 
                            (formik.touched.size_95 && formik.errors.size_95) || 
                            (formik.touched.size_100 && formik.errors.size_100) || 
                            (formik.touched.size_105 && formik.errors.size_105) || 
                            (formik.touched.size_110 && formik.errors.size_110) || 
                            (formik.touched.size_115 && formik.errors.size_115) || 
                            (formik.touched.size_120 && formik.errors.size_120) || 
                            (formik.touched.size_125 && formik.errors.size_125) || 
                            (formik.touched.size_130 && formik.errors.size_130) || 
                            (formik.touched.size_135 && formik.errors.size_135) || 
                            (formik.touched.size_140 && formik.errors.size_140) || 
                            (formik.touched.size_145 && formik.errors.size_145) || 
                            (formik.touched.size_150 && formik.errors.size_150) || 
                            (formik.touched.size_155 && formik.errors.size_155) ) &&
                            // <div className="error-message-container">
                            //     <p className="error-message">Complete correctamente todos los talles</p>
                            // </div>
                            <p className="error-message">Complete correctamente todos los talles</p>
                        }
                        <div id="product-size">

                            <div className={formik.errors.size_30 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_30"}>3 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_30' value={formik.values.size_30} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_35 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_35"}>3.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_35' value={formik.values.size_35} />
                                    <span>u</span>
                                </div>
                            </div>
                            <div className={formik.errors.size_40 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_40"}>4 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_40' value={formik.values.size_40} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_45 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_45"}>4.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_45' value={formik.values.size_45} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_50 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_50"}>5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_50' value={formik.values.size_50} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_55 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_55"}>5.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_55' value={formik.values.size_55} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_60 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_60"}>6 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_60' value={formik.values.size_60} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_65 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_65"}>6.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_65' value={formik.values.size_65} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_70 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_70"}>7 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_70' value={formik.values.size_70} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_75 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_75"}>7.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_75' value={formik.values.size_75} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_80 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_80"}>8 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_80' value={formik.values.size_80} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_85 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_85"}>8.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_85' value={formik.values.size_85} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_90 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_90"}>9 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_90' value={formik.values.size_90} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_95 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_95"}>9.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_95' value={formik.values.size_95} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_100 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_100"}>10 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_100' value={formik.values.size_100} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_105 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_105"}>10.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_105' value={formik.values.size_105} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_110 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_110"}>11 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_110' value={formik.values.size_110} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_115 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_115"}>11.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_115' value={formik.values.size_115} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_120 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_120"}>12 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_120' value={formik.values.size_120} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_125 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_125"}>12.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_125' value={formik.values.size_125} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_130 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_130"}>13 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_130' value={formik.values.size_130} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_135 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_135"}>13.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_135' value={formik.values.size_135} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_140 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_140"}>14 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_140' value={formik.values.size_140} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_145 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_145"}>14.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_145' value={formik.values.size_145} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_150 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_150"}>15 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_150' value={formik.values.size_150} />
                                    <span>u</span>
                                </div>
                            </div>

                            <div className={formik.errors.size_155 ? "item-size-errors" : "item-size"}>
                                <label htmlFor={"size_155"}>15.5 :</label>
                                <div className="size-input-container" >
                                    <input onChange={handleChange} onBlur={handleBlur} type="number" className="size-input" name='size_155' value={formik.values.size_155} />
                                    <span>u</span>
                                </div>
                            </div>

                        </div>
                    </article>
                    <section className="price-discount-container">
                        <article className="product-item">
                            <label htmlFor="item-price" className="item-label">Precio</label>
                            {/* { formik.errors.price_original && formik.touched.price_original &&
                                <div className="error-message-container">
                                    <p className="error-message">{formik.errors.price_original}</p>
                                </div>
                            } */}
                            <p className="error-message">{formik.touched.price_original && formik.errors.price_original}</p>
                            <input onChange={handleChange} onBlur={handleBlur} type="number" min="1" className={formik.errors.price_original && formik.touched.price_original ? "item-input-errors" : "item-input"} id="item-price" name="price_original" value={formik.values.price_original} />
                        </article>
                        <article className="product-item">
                            <label htmlFor="item-discount" className="item-label">Descuento</label>
                            {/* { formik.errors.discount && formik.touched.discount &&
                                <div className="error-message-container">
                                    <p className="error-message">{formik.errors.discount}</p>
                                </div>
                            } */}
                            <p className="error-message">{formik.touched.discount && formik.errors.discount}</p>
                            <div className="discount-container">
                                <input onChange={handleChange} onBlur={handleBlur} type="number" min="0" max="90" className={formik.errors.discount && formik.touched.discount ? "item-input-errors" : "item-input"} id="item-discount" name="discount" value={formik.values.discount} />
                                <span>%</span>
                            </div>
                        </article>
                    </section>
                    <section className="price-discount-container">
                        <article className="product-item">
                            <label htmlFor="item-year" className="item-label">Año de salida</label>
                            {/* { formik.errors.release_year && formik.touched.release_year &&
                                <div className="error-message-container">
                                    <p className="error-message">{formik.errors.release_year}</p>
                                </div>
                            } */}
                            <p className="error-message">{formik.touched.release_year && formik.errors.release_year}</p>
                            <input onChange={handleChange} onBlur={handleBlur} type="number" min="1970" className={formik.errors.release_year && formik.touched.release_year ? "item-input-errors" : "item-input"} id="item-year" name="release_year" value={formik.values.release_year} />
                        </article>
                        <article className="product-item">
                            <label htmlFor="item-condition" className="item-label">Condición</label>
                            <div id="item-condition-container">
                                <select onChange={handleChange} onBlur={handleBlur} name="shoe_condition" id="item-condition" defaultValue="new_no_defects">
                                    <option value="new_no_defects">Nuevo, sin defectos</option>
                                    <option value="used">Usado</option>
                                </select>
                                <span className="custom-arrow-size"></span>
                            </div>
                        </article>
                    </section>
                    <article className="product-item">
                            <label htmlFor="item-description" className="item-label">Descripción del producto</label>
                            {/* { formik.errors.story && formik.touched.story &&
                                <div className="error-message-container">
                                    <p className="error-message">{formik.errors.story}</p>
                                </div>
                            } */}
                            <p className="error-message">{formik.touched.story && formik.errors.story}</p>
                            <div className="description-container-parent">
                            <div className={formik.errors.story && formik.touched.story ? "description-container-child-errors" : "description-container-child"}>
                                <textarea onChange={handleChange} onBlur={handleBlur} name="story" id="item-description" placeholder={formik.values.story == "" ? "Escriba una descripción" : formik.values.story} value={formik.values.story}></textarea>
                                <span className="description-aux"></span>
                            </div>
                            </div>
                    </article>
                    <article className="product-item">
                        <p className="item-header" id='files-header'>Selecciona entre 1 y 4 imágenes (la primera será la principal)</p>
                        {/* { formik.errors.product_pictures && formik.touched.product_pictures &&
                            <div className="error-message-container">
                                <p className="error-message">{formik.errors.product_pictures}</p>
                            </div>
                        } */}

                        {/* <div className={formik.errors.product_pictures && formik.touched.product_pictures ? "item-images-errors" : "item-images"}>
                            <input onChange={handleChange} onBlur={handleBlur}
                            // onChange={(event) => {
                            //     setFiles(event.target.files);
                            //     console.log(event.target.files);
                            // }} 
                            type="file" name="product_pictures" accept=".jpg,.jpeg,.png" id="item-images" multiple/>
                        </div> */}

                        <MultiImageDropzone
                            value={fileStates}
                            dropzoneOptions={{
                                maxFiles: 4,
                            }}
                            onChange={(files) => {
                                setFileStates(files);
                            }}
                            onFilesAdded={async (addedFiles) => {
                                setFileStates([...fileStates, ...addedFiles]);
                                await Promise.all(
                                    addedFiles.map(async (addedFileState) => {
                                    try {
                                        const res = await edgestore.products.upload({
                                        file: addedFileState.file as File,
                                        options: {
                                            temporary: true,
                                        },
                                        onProgressChange: async (progress) => {
                                            updateFileProgress(addedFileState.key, progress);
                                            if (progress === 100) {
                                            // wait 1 second to set it to complete
                                            // so that the user can see the progress bar at 100%
                                            await new Promise((resolve) => setTimeout(resolve, 1000));
                                            updateFileProgress(addedFileState.key, 'COMPLETE');
                                            }
                                        },
                                        });
                                        setUrls((prevUrls) => [...prevUrls, res.url]);
                                        console.log(res);
                                    } catch (err) {
                                        updateFileProgress(addedFileState.key, 'ERROR');
                                    }
                                    }),
                                );
                            }}
                            onRemove={(index) => {
                                setUrls((prevUrls) => prevUrls.filter((_, i) => i != index));
                            }}
                        />

                    </article>
                    <article className="product-item" id="product-buttons">
                        <div className="item-submit">
                            <button disabled={isSubmitting} type="submit" id="item-submit">Crear</button>
                        </div>
                        <div className="item-reset">
                            <button disabled={isSubmitting} onClick={() => resetForm()} type="reset" id="item-reset">Borrar</button>
                        </div>
                    </article>
                </form>
            </div>
        </main>
    );
};

export default CreateEdit;
