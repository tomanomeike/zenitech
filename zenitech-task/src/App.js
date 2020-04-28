import React from 'react';
import FlickrLigthBox from './components/FlickrLightbox'
import './App.css';

function App() {
  return (
    <div className="App">
     <FlickrLigthBox api_key='1b4e5b0203fab0d5731afe68f0a543e1' user_id='12037949754@N01' limit={500}/>
    </div>
  );
}

export default App;
