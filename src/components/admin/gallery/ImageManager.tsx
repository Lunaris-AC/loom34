import React, { useState, useEffect } from 'react';
import './ImageManager.css';

const ImageManager = ({ album }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images for the selected album
    fetch(`/api/albums/${album.id}/images`)
      .then((response) => response.json())
      .then((data) => setImages(data));
  }, [album]);

  const handleImageMove = (imageId, targetAlbumId) => {
    // Move image to another album
    fetch(`/api/images/${imageId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetAlbumId }),
    }).then(() => {
      // Refresh images
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    });
  };

  return (
    <div className="image-manager">
      <h2>Images in {album.name}</h2>
      <ul>
        {images.map((image) => (
          <li key={image.id}>
            <img src={image.url} alt={image.name} />
            <button onClick={() => handleImageMove(image.id, prompt('Enter target album ID'))}>
              Move
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageManager;
