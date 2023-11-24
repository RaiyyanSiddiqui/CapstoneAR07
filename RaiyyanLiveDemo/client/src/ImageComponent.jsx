import React, { useEffect, useState } from 'react';


var opts = {
  headers: {
    mode: 'no-cors'
  }
}

const ImageComponent = (props) => {
  const [imageSrc, setImageSrc] = useState('');
// mounts component on startup, here only once with [], and so it's the functional version of class componentDidMount kinda ting
  useEffect(() => { 
    const interval = setInterval(() => { // runs in a loop every x seconds 
      // Function to fetch the image
      const fetchImage = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/getImg', opts);
          console.log(response)
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };

      // Call the fetchImage function
      fetchImage();
  }, 200);

    // Cleanup function to revoke the object URL when the component is unmounted
    return () => {
      clearInterval(interval) // need to clear the interval within once this whole thing is unmounted
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Fetched Image" width = {props.width | 10}    height = {props.height | 10}/>}
    </div>
  );
};

export default ImageComponent;