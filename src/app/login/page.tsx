"use client"
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/login.css';
import { loginSchema } from '@/utils/validations/user';
import { useFormik } from 'formik';
import fetchData from '@/utils/front/fetch';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
require('dotenv').config();

const Login = () => {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { session, setSession } = useSession();
  const router = useRouter();

  const resetForm = (old?: string) => {
    const inputEmail = document.querySelector('form input[type="email"]') as HTMLInputElement;
    const inputPassword = document.querySelector('form input[type="password"]') as HTMLInputElement;
    if (old) {
        inputEmail.value = old;
        inputPassword.value = "";
    } else {
        inputEmail.value = "";
        inputPassword.value = "";
    }
  }

  const formik = useFormik({
    initialValues: {
        email: '',
        password: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
        setIsSubmitting(true);
        try {
            const results = await fetchData(`/users/login`, {
                method: 'POST',
                body: { email: values.email, password: values.password }
            });

            if (results.status == 200) {
                setServerError(undefined);
                resetForm();
                setIsSubmitting(false);
                router.back();
                setSession({
                  first_name: results.data.first_name,
                  last_name: results.data.last_name,
                  image: results.data.image,
                  category: results.data.category
              });
            } else if (results.status == 404) {
                setServerError("Usuario no encontrado.");
                resetForm(results.old);
            } else if (results.status == 400) {
                setServerError("Contraseña incorrecta.");
                resetForm(results.old);
            } else {
                setServerError("Ha ocurrido un error en el servidor.");
                resetForm(results.old);
            }
        } catch (error) {
            setServerError("Ha ocurrido un error desconocido.");
        } finally {
            setIsSubmitting(false);
        }
    },
    validate: (values) => {
        const result = loginSchema.safeParse(values);
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(e);
    formik.setFieldTouched(e.target.name, true, true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    formik.setFieldTouched(e.target.name, false, false);
  };


  return (
    <>
    { session && <main id='login-main'><p>Acceso denegado.</p></main> }
    { !session &&
      <main id="login-main">
        <div className="login-form-container">
          <h1>INICIAR SESIÓN</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="input-container-padre">
              {serverError && (
                <div className="error-div">
                  <p style={{ color: 'red' }}>
                    {serverError}
                  </p>
                </div>
              )}
              <p className='error-alert' style={{ color: 'red' }}>
                {formik.touched.email && formik.errors.email}
              </p>
              <input
                className={`text-input ${formik.touched.email && formik.errors.email ? 'error-style' : ''}`}
                type="email"
                name="email"
                placeholder="Usuario"
                value={formik.values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <p className='error-alert' style={{ color: 'red' }}>
                {formik.touched.password && formik.errors.password}
              </p>
              <input
                className={`text-input ${formik.touched.password && formik.errors.password ? 'error-style' : ''}`}
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formik.values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <button disabled={isSubmitting} className="shop_button" name="button" type="submit">
              Ingresar
            </button>
            <div className="boton_hijo2">
              <p>
                <Link href="#">¿Olvidaste tu Contraseña?</Link>
              </p>
              <p>
                <Link href="/sign-up">¿No tienes Cuenta? Registrate</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    }
    </>
    
  );
};

export default Login;
