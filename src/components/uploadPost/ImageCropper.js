import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Box, Button, ButtonGroup, styled } from "@mui/material";

// Styled ratio buttons
const RatioButton = styled(Button)(({ theme, active }) => ({
  minWidth: "60px",
  fontWeight: active ? "bold" : "normal",
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.grey[400],
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "40px",
    padding: "6px 8px",
    fontSize: "0.75rem",
  },
}));

const ImageCropper = ({ file, setCroppedFile }) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspectRatio, setAspectRatio] = useState(1);
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Create object URL when file changes
  useEffect(() => {
    if (!file) {
      setSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    setImageLoaded(false);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Initialize crop when image loads
  function onImageLoad(e) {
    if (!e.currentTarget) return;

    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;

    let newCrop;
    if (aspectRatio === null) {
      newCrop = {
        unit: "px",
        x: 0,
        y: 0,
        width: width,
        height: height,
      };
    } else {
      newCrop = centerAspectCrop(width, height, aspectRatio);
    }

    setCrop(newCrop);
    setCompletedCrop(newCrop);
    setImageLoaded(true);
  }

  // Handle aspect ratio change
  const handleAspectChange = (ratio, ratioName) => {
    setAspectRatio(ratio);
    setSelectedRatio(ratioName);

    if (imgRef.current && imageLoaded) {
      const { width, height } = imgRef.current;
      if (ratio === null) {
        // For free ratio, set a crop that covers the entire image
        const fullCrop = {
          unit: "px",
          x: 0,
          y: 0,
          width: width,
          height: height,
        };
        setCrop(fullCrop);
        setCompletedCrop(fullCrop); // Also update completed crop
      } else {
        const newCrop = centerAspectCrop(width, height, ratio);
        setCrop(newCrop);
        setCompletedCrop(newCrop);
      }
    }
  };

  // Apply crop and generate new file with original quality
  const applyCrop = () => {
    if (
      !completedCrop ||
      !previewCanvasRef.current ||
      !imgRef.current ||
      !imageLoaded
    )
      return;

    const canvas = previewCanvasRef.current;
    // Use quality 1.0 for maximum quality
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        setCroppedFile(croppedFile);
      }
    }, "image/jpeg");
  };

  // Draw preview on canvas and apply crop
  useEffect(() => {
    if (
      !completedCrop ||
      !previewCanvasRef.current ||
      !imgRef.current ||
      !imageLoaded
    )
      return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio || 1;

    // Use the full resolution of the original image
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    // Apply crop after a small delay
    const timeoutId = setTimeout(() => {
      applyCrop();
    }, 100);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCrop, imageLoaded]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        overflowX: "hidden",
      }}
    >
      {src && (
        <>
          <div
            style={{
              marginBottom: "24px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio || undefined} // Only set aspect when not null
              minWidth={100}
              style={{ maxHeight: "70vh" }}
            >
              <img
                src={src}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </ReactCrop>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <ButtonGroup
              variant="contained"
              aria-label="image crop ratio"
              sx={{
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
                "& .MuiButtonGroup-grouped": {
                  minWidth: 0,
                },
              }}
            >
              <RatioButton
                onClick={() => handleAspectChange(null, "Free")}
                active={selectedRatio === "Free"}
              >
                Free
              </RatioButton>
              <RatioButton
                onClick={() => handleAspectChange(1, "1:1")}
                active={selectedRatio === "1:1"}
              >
                1:1
              </RatioButton>
              <RatioButton
                onClick={() => handleAspectChange(4 / 5, "4:5")}
                active={selectedRatio === "4:5"}
              >
                4:5
              </RatioButton>
              <RatioButton
                onClick={() => handleAspectChange(16 / 9, "16:9")}
                active={selectedRatio === "16:9"}
              >
                16:9
              </RatioButton>
            </ButtonGroup>
          </div>

          <canvas
            ref={previewCanvasRef}
            style={{
              display: "none",
            }}
          />
        </>
      )}
    </Box>
  );
};

// Center crop function
function centerAspectCrop(width, height, aspect) {
  if (aspect === null || isNaN(aspect)) {
    return {
      unit: "px",
      x: 0,
      y: 0,
      width: width,
      height: height,
    };
  }

  const cropWidth = Math.min(width, height * aspect);
  const cropHeight = Math.min(height, width / aspect);

  return centerCrop(
    makeAspectCrop(
      {
        unit: "px",
        width: cropWidth,
        height: cropHeight,
      },
      aspect,
      width,
      height
    ),
    width,
    height
  );
}
export default ImageCropper;
