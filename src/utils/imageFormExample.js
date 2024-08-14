import { useState } from 'react';

export default function UploadForm() {
  const [images, setImages] = useState([]);
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleEntityTypeChange = (e) => {
    setEntityType(e.target.value);
  };

  const handleEntityIdChange = (e) => {
    setEntityId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data.imageUrls); // URLs de las imágenes almacenadas en Cloudinary
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <input type="text" value={entityType} onChange={handleEntityTypeChange} placeholder="Entity Type (product, user, brand)" />
      <input type="text" value={entityId} onChange={handleEntityIdChange} placeholder="Entity ID" />
      <button type="submit">Upload</button>
    </form>
  );
}
