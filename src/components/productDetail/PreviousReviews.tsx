import { useState, useEffect } from 'react';
import { Review as ReviewType } from '@/utils/front/interfaz';
import Review from '@/components/productDetail/Review';
import '@/styles/productDetail.css';

interface PreviousReviewsProps {
  reviews: ReviewType[];
}

const PreviousReviews: React.FC<PreviousReviewsProps> = ({ reviews: initialReviews }) => {
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
  }, [reviews]);

  return (
    <section className="text-previous-reviews">
      { reviews.length > 0 && <p className="text-subtitle">Reseñas anteriores</p> }
      {reviews && reviews.length > 0 && (
        <div>
          {reviews.map((review, i) => (
            <div key={i + "div"}>
              {review && <Review review={review} key={review.id + i} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PreviousReviews;
