import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ setProjectDetails }) => {
  const [crop, setCrop] = useState({
    unit: 'px', // Can be 'px' or '%'
    width: 250,
    height: 250,
    aspect: 1 / 1,
  });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const handleImageLoaded = (image) => {
    setImageRef(image);
  };

  const handleCropComplete = (crop) => {
    if (imageRef && crop.width && crop.height) {
      getCroppedImg(imageRef, crop, zoom);
    }
  };

  const getCroppedImg = (image, crop, zoom = 1) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.drawImage(
      image,
      (crop.x * scaleX) / zoom,
      (crop.y * scaleY) / zoom,
      (crop.width * scaleX) / zoom,
      (crop.height * scaleY) / zoom,
      0,
      0,
      crop.width,
      crop.height
    );
    ctx.restore();

    canvas.toBlob((blob) => {
      setCroppedImage(blob);
      setProjectDetails((prevDetails) => ({ ...prevDetails, icon: blob }));
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInput(URL.createObjectURL(file));
    }
  };

  return (
    <div className="image-cropper-container">
      {fileInput ? (
        <ReactCrop
          src={fileInput}
          crop={crop}
          zoom={zoom}
          onImageLoaded={handleImageLoaded}
          onComplete={handleCropComplete}
          onChange={(newCrop) => setCrop(newCrop)}
          ruleOfThirds
        />
      ) : (
        <div className="image-upload-placeholder">
          <label className="upload-label">
            Click to upload an image
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}

      {fileInput && (
        <>
          <div className="flex justify-center mt-4">
            <label>
              Zoom:
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
              />
            </label>
          </div>
          {croppedImage && (
            <div className="mt-4 flex justify-center">
              <h3 className="text-center">Preview:</h3>
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Cropped Icon Preview"
                className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageCropper;
