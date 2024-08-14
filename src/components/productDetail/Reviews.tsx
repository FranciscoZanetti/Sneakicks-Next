"use client"
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import PreviousReviews from '@/components/productDetail/PreviousReviews';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import '@/styles/productDetail.css';
import { Review, Product } from '@/utils/front/interfaz';
// import reviewSchema from '@/utils/validations/review';
import fetchData from '@/utils/front/fetch';
import LoadingOverlay from "@/components/loading/LoadingOverlay";
require('dotenv').config();


interface ReviewsProps {
  reviews: Review[];
  productId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews: initialReviews, productId }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorsBack, setErrorsBack] = useState<string | undefined>();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [starValue, setStarValue] = useState<number | undefined>();
  const [starStates, setStarStates] = useState([false, false, false, false, false]);
  const starsArray = [1, 2, 3, 4, 5];


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(event);
    
    event.preventDefault();
    console.log("ONSUBMIT");

    const textarea = document.querySelector('textarea');
    let errorArray: string[] = [];
    if (!starValue) {
      errorArray.push("Debe ingresar un puntaje de estrellas.");
    }
    if (textarea && (textarea.value == "" || !textarea.value)) {
      if (errorArray.length == 0) {
        errorArray.push("");
      }
      errorArray.push("Debe ingresar un comentario.");
    }

    if (errorArray.length > 0) {
      setErrors(errorArray);
      setErrorsBack(undefined);
      return;
    }

    setIsSubmitting(true);
    setIsProcessing(true);
    
    try{
        const results = await fetchData(`/products/${productId}/reviews`, {
            method: 'POST',
            body: { stars: starValue, text: textarea?.value }
        });
        console.log("STATUS: ", results.status);
        
        if (results.status == 201) {
          console.log("201: ", JSON.stringify(results));
          
            let latestReview = results.data;
            //let reviewsStorage = localStorage.getItem(`reviews${productId}`) ? JSON.parse(localStorage.getItem(`reviews${productId}`)) : reviews;
            //reviewsStorage.unshift({ latestReview });
            //localStorage.setItem(`reviews${productId}`, JSON.stringify(reviewsStorage));
            let updatedReviews = reviews;
            updatedReviews.unshift(latestReview);
            setReviews(updatedReviews);
            setStarValue(undefined);
            resetForm();
            setErrorsBack(undefined);
            setErrors([]);
            setStarStates([false, false, false, false, false]);
        }else {
            if (results.status == 403) {
              console.log("403: ", JSON.stringify(results));
              console.log(results.status);
              resetForm();
              setErrorsBack('Debes estar logeado para dejar una reseña.');
              setErrors([]);
            }
            if (results.status == 400) {
              console.log("400: ", JSON.stringify(results));
              setErrorsBack("Reseña incommpleta.");
              resetForm(results.old.text);
              setErrors([]);
            } else {
              console.log("500: ", JSON.stringify(results));
              setErrorsBack("Error de servidor.");
              resetForm(results.old.text);
              setErrors([]);
            }
        }
    } catch (error) {
        console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
      setIsProcessing(false);
    }
  };

  const resetForm = (old?: string) => {
    const textarea = document.querySelector('textarea');
    if (old) {
      textarea?.value ? textarea.value = old : undefined;
    } else {
      textarea?.value ? textarea.value = "" : undefined;
    }
  }

  const handleStars = (value: number) => {
    setStarValue(value);
    const newStarStates = starsArray.map(star => star <= value);
    setStarStates(newStarStates);
  };

  const renderStarIcon = (star: number) => (
    <FontAwesomeIcon icon={starStates[star - 1] ? faStarSolid : faStarRegular} />
  );

  useEffect(() => {
    setReviews(initialReviews);
    setStarStates([false, false, false, false, false]);
  }, [initialReviews]);

  return (
    <article className="details-text">
      <h3>Reseñas</h3>
      <form onSubmit={handleSubmit} className="text-review">
        { isProcessing && <LoadingOverlay text='Creando reseña...' /> }
        <p className="text-subtitle">Deja una reseña</p>
        {errorsBack && <p id="stars-text-error-message">{errorsBack}</p>}
        {errors.length == 1 && <p id="stars-text-error-message">{errors[0]}</p>}
        <div className="add-star-rating-container-parent">
          <div className="add-star-rating-container-child">
            {starsArray.map((star, i) => (
              <div className="star-input-container" key={i}>
                <div className="radio-container">
                  <input
                    onChange={() => handleStars(star)}
                    onClick={() => handleStars(star)}
                    type="radio"
                    name="stars"
                    value={star}
                  />
                </div>
                <div className="form-star-container">
                  {renderStarIcon(star)}
                </div>
              </div>
            ))}
          </div>
        </div>
        {errors.length == 2 && <p id="stars-text-error-message">{errors[1]}</p>}
        <div className="textarea-container-parent">
          <div className="textarea-container-child">
            <textarea
              // onChange={handleChange}
              // onBlur={handleBlur}
              // value={values.text}
              name="text"
              id="review"
              placeholder="Escribe tu reseña"
            />
            <span className="textarea-aux"></span>
          </div>
        </div>
        <div className="review-button">
          <button disabled={isSubmitting} type="submit">Publicar</button>
        </div>
      </form>
      {reviews && <PreviousReviews reviews={reviews} />}
    </article>
  );
}

export default Reviews;
