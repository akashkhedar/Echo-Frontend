import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageCropMenu from "./ImageCropMenu";

const MIN_DIMENSION = 300;

const ImageCropper = ({ file, setFile }) => {
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (file.file) {
      setCrop(null);
      setError(false);
    }
  }, [file.file]);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      setError(true);
      setFile((prev) => ({ ...prev, file: "" }));
      return;
    }

    const ratio = naturalWidth / naturalHeight;
    let selectedRatio = 1;

    if (ratio <= 0.8) {
      selectedRatio = 4 / 5;
    } else if (ratio >= 1.06) {
      selectedRatio = 1.91 / 1;
    } else if (ratio <= 0.4 || ratio >= 2.5) {
      setCrop(null);
    }

    setFile((prev) => ({ ...prev, ratio: selectedRatio }));

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        selectedRatio,
        naturalWidth,
        naturalHeight
      ),
      naturalWidth,
      naturalHeight
    );
    setCrop(initialCrop);
  };

  const handleAspectRatioChange = (newRatio) => {
    setFile((prev) => ({ ...prev, ratio: newRatio }));

    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;

      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 100,
          },
          newRatio,
          naturalWidth,
          naturalHeight
        ),
        naturalWidth,
        naturalHeight
      );
      setCrop(newCrop);
    }
  };

  const handleFitToFrame = () => {
    setCrop(null);
    setFile((prev) => ({ ...prev, ratio: null }));
  };

  const getCroppedImage = async (imageRef, crop) => {
    if (!imageRef.current || !crop) {
      throw new Error("Image or crop data not available");
    }
    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2D context");
    }

    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    ctx.drawImage(
      image,
      Math.floor(crop.x * scaleX),
      Math.floor(crop.y * scaleY),
      Math.floor(crop.width * scaleX),
      Math.floor(crop.height * scaleY),
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to Blob
    const croppedBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg");
    });
    setFile((prev) => ({ ...prev, croppedImage: croppedBlob }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(25, 24, 24)",
        border: "1px solid rgb(62, 46, 62)",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {file.file.length > 0 ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => {
                setFile((prev) => ({
                  ...prev,
                  coordinates: c,
                  ratio: file.ratio,
                }));
                getCroppedImage(imgRef, crop);
              }}
              aspect={file.ratio}
              minWidth={MIN_DIMENSION}
              keepSelection
            >
              <img
                ref={imgRef}
                src={file.file}
                alt="Crop Preview"
                onLoad={handleImageLoad}
                style={{
                  maxHeight: "60vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </ReactCrop>
          </Box>

          {/* Aspect Ratio Selection */}
          <ImageCropMenu
            handleAspectRatioChange={handleAspectRatioChange}
            handleFitToFrame={handleFitToFrame}
            aspectRatio={file.ratio}
          />
        </Box>
      ) : error ? (
        <Typography variant="body1" fontWeight={700} color="rgb(100, 100, 107)">
          Image is too small
        </Typography>
      ) : (
        <Typography variant="body1" fontWeight={700} color="rgb(100, 100, 107)">
          Nothing to show here
        </Typography>
      )}
    </Box>
  );
};

export default ImageCropper;
