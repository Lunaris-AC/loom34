import React, { useState } from 'react';
import AlbumManager from './AlbumManager';
import ImageManager from './ImageManager';
import './AdminGallery.css';

const AdminGallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  return (
    <div className="admin-gallery">
      <AlbumManager onSelectAlbum={setSelectedAlbum} />
      {selectedAlbum && <ImageManager album={selectedAlbum} />}
    </div>
  );
};

export default AdminGallery;
