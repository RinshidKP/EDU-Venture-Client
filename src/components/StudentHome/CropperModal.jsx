import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropperModal = ({cropType,image,handleCroppedImage}) => {
  // const [selectedImage, setSelectedImage] = useState(true);
  const cropperRef = useRef(null);

  const blobToBuffer = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use Uint8Array instead of Buffer
        const buffer = new Uint8Array(reader.result);
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  };
  

  const onCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
  
      // Convert cropped image Canvas to Blob
      croppedCanvas.toBlob(
        async (blob) => {
          if (blob) {
            // Convert Blob to Buffer
            const buffer = await blobToBuffer(blob);
  
            // Get the Data URL of the cropped image
            const imageUrl = croppedCanvas.toDataURL('image/jpeg', 0.8);
  
            // Pass both the Buffer and Image URL to the parent component
            handleCroppedImage({ image:buffer, imageUrl });
          }
        },
        // Specify the MIME type and quality (adjust as needed)
        'image/jpeg',
        0.9
      );
    }
  };
  
  const calculateAspectRatio = () => {
    switch (cropType) {
      case 'flag':
        return 3 / 3; 
      case 'course':
        return 16 / 9; 
      case 'profile':
        return 1 / 1; 
      default:
        return 16 / 9; 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-container bg-white w-96 mx-auto rounded-lg p-6">
        <Cropper
          src={`${URL.createObjectURL(image)}`}
          style={{ height: 400, width: "100%" }}
          initialAspectRatio={calculateAspectRatio()}
          aspectRatio={calculateAspectRatio()}
          viewMode={1}
          guides={true}
          ref={cropperRef}
        />
        <div className="flex justify-center m-5">
          <button
            onClick={onCrop}
            className="bg-cyan-500 text-white px-5 py-3 rounded-md"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
