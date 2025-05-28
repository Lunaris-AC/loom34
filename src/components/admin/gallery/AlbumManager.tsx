import React, { useState, useEffect } from 'react';
import './AlbumManager.css';

const AlbumManager = ({ onSelectAlbum }) => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // Fetch albums from the server
    fetch('/api/albums')
      .then((response) => response.json())
      .then((data) => setAlbums(data));
  }, []);

  const handleAlbumClick = (album) => {
    onSelectAlbum(album);
  };

  return (
    <div className="album-manager">
      <h2>Albums</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.id} onClick={() => handleAlbumClick(album)}>
            {album.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumManager;
