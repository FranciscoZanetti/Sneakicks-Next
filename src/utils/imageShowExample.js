import { useEffect, useState } from 'react';

export default function DisplayImages({ entityType, entityId }) {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const res = await fetch(`/api/getImageUrls?entityType=${entityType}&entityId=${entityId}`);
      const data = await res.json();
      setImageUrls(Object.values(data.imageUrls).filter(url => url)); // Filtrar URLs vacías
    };

    fetchImageUrls();
  }, [entityType, entityId]);

  return (
    <div>
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`${entityType} image ${index + 1}`} />
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
}
