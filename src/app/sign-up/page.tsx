"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/productDetail.css';
import fetchData from "@/utils/front/fetch";
import { useRouter } from 'next/navigation';
import { SingleImageDropzone } from '@/components/edgestore/single-image-dropzone';
import { useEdgeStore } from '@/libs/edgestore';
import { useFormik } from 'formik';
import { registerSchema } from '@/utils/validations/user';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import "@/styles/register.css";


interface FormValues {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_repeat: string;
    image?: string | undefined | null;
}


const RegisterPage: React.FC = () => {
    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState<string>();
    const [errorsBack, setErrorsBack] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { edgestore } = useEdgeStore();
    const router = useRouter();

    const initialValues: FormValues = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_repeat: '',
    }

    const resetForm = (old?: any) => {
        const inputFirstName = document.querySelector('form input[name="first_name"]') as HTMLInputElement;
        const inputLastName = document.querySelector('form input[name="last_name"]') as HTMLInputElement;
        const inputEmail = document.querySelector('form input[name="email"]') as HTMLInputElement;
        const inputPassword = document.querySelector('form input[name="password"]') as HTMLInputElement;
        const inputPasswordRepeat = document.querySelector('form input[name="password_repeat"]') as HTMLInputElement;

        inputFirstName.value = old?.first_name ?? '';
        inputLastName.value = old?.last_name ?? '';
        inputEmail.value = old?.email ?? '';
        inputPassword.value = old?.password?? '';
        inputPasswordRepeat.value = old?.password_repeat ?? '';

        if (!old) {
            setUrl(undefined);
            setFile(undefined);
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

            try {
                let data = values;
                data.first_name.trim();
                data.last_name.trim();
                data.email.trim();
                data.password.trim();
                data.password_repeat.trim();

                if (file && !url) {
                    const res = await edgestore.users.upload({
                        file,
                        onProgressChange: (progress) => {
                          // you can use this to show a progress bar
                          console.log(progress);
                        },
                    });
                    setUrl(res.url);
                    data.image = res.url;
                } else if (!file && url) {
                    data.image = url;
                }

                const results = await fetchData('/users/register', {
                    method: 'POST',
                    body: data,
                });
                console.log(results);
                console.log(JSON.stringify(results));

                if (results.status == 201) {
                    setErrorsBack(undefined);
                    resetForm();
                    setIsSubmitting(false);
                    router.push("/login");
                } else if (results.status == 400) {
                    setErrorsBack("Revisa los campos con valores inválidos.");
                    resetForm(results.old);
                } else if (results.status == 404) {
                    setErrorsBack("El mail pertenece a un usuario ya registrado.");
                    resetForm(results.old);
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
        validate: (values) => {
            const result = registerSchema.safeParse(values);
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
        },
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
        <main id='register'>
            <div className="register-container">
                { isProcessing && <LoadingOverlay text='' /> }
                <form
                    className="form"
                    id="register-form"
                    onSubmit={formik.handleSubmit}
                >
                    <h1>CREA TU CUENTA</h1>
                    <section className="form-container">
                        {errorsBack && (
                            <div className="error-div">
                                <p style={{ color: 'red' }}>
                                    { errorsBack }
                                </p>
                            </div>
                        )}

                        <div className="input-form-container">
                            <p id="errors-first-name" className="errors-messages">
                                { formik.touched.first_name && formik.errors.first_name }
                            </p>
                            <input
                                id="input-first-name"
                                className={formik.touched.first_name && formik.errors.first_name ? "input-form-errors" : "input-form"}
                                type="text"
                                name="first_name"
                                placeholder="Nombres"
                                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[' -][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
                                required
                                maxLength={30}
                                value={formik.values.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="input-form-container">
                            <p id="errors-last-name" className="errors-messages">
                                { formik.touched.last_name && formik.errors.last_name }
                            </p>
                            <input
                                id="input-last-name"
                                className={formik.touched.last_name && formik.errors.last_name ? "input-form-errors" : "input-form"}
                                type="text"
                                name="last_name"
                                placeholder="Apellidos"
                                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[' -][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
                                required
                                maxLength={30}
                                value={formik.values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="input-form-container">
                            <p id="errors-email" className="errors-messages">
                                { formik.touched.email && formik.errors.email }
                            </p>
                            <input
                                id="input-email"
                                className={formik.touched.email && formik.errors.email ? "input-form-errors" : "input-form"}
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                maxLength={30}
                                value={formik.values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="input-form-container">
                            <p id="errors-password" className="errors-messages">
                                { formik.touched.password && formik.errors.password }
                            </p>
                            <input
                                id="input-password"
                                className={formik.touched.password && formik.errors.password ? "input-form-errors" : "input-form"}
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                pattern="[A-Za-z0-9!@#$%^&*()_+=-]{8,60}"
                                required
                                maxLength={30}
                                value={formik.values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="input-form-container">
                            <p id="errors-password-repeat" className="errors-messages">
                                { formik.touched.password_repeat && formik.errors.password_repeat }
                            </p>
                            <input
                                id="input-password-repeat"
                                className={formik.touched.password_repeat && formik.errors.password_repeat ? "input-form-errors" : "input-form"}
                                type="password"
                                name="password_repeat"
                                placeholder="Repetir contraseña"
                                pattern="[A-Za-z0-9!@#$%^&*()_+=-]{8,60}"
                                required
                                maxLength={30}
                                value={formik.values.password_repeat}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <article className="image-container">
                            <p className="item-header">Foto de perfil</p>
                            <SingleImageDropzone
                                width={200}
                                height={200}
                                value={file}
                                onChange={(file) => {
                                    setFile(file);
                                }}
                            />
                        </article>
                    </section>

                    <div className="register_button-container">
                        <input
                            className="register-button"
                            type="submit"
                            value="Registrarse"
                            name="register-button"
                            disabled={isSubmitting}
                        />
                        <div className="register-child">
                            <Link href="/login">¿Ya tienes Cuenta? Iniciar Sesión</Link>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default RegisterPage;
