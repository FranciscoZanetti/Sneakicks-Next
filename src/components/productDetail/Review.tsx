import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { Review as ReviewType } from '@/utils/front/interfaz';
import '@/styles/productDetail.css';

interface ReviewProps {
  review: ReviewType;
}

const Review: React.FC<ReviewProps> = ({ review: initialReview }) => {
  const [review, setReview] = useState<ReviewType | undefined>(initialReview);

  useEffect(() => {
    setReview(initialReview);
  }, [initialReview]);

  const getStars = () => {
    const starIcons = Array(5).fill(faStarRegular);
    for (let i = 0; i < (review?.stars ?? 0); i++) {
      starIcons[i] = faStarSolid;
    }
    return (
      <div>
        {starIcons.map((icon, index) => (
          <FontAwesomeIcon key={index} icon={icon} />
        ))}
      </div>
    );
  };

  return (
    <article className="previous-reviews-review">
      {review && (
        <>
          <div className="review-stars">
            {getStars()}
          </div>
          <p className="paragrafs">{review.text}</p>
        </>
      )}
    </article>
  );
}

export default Review;
