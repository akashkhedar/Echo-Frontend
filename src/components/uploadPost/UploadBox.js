import { Box } from "@mui/system";
import React, { useState } from "react";
import BoxHead from "./BoxHead";
import Controls from "./Controls";
import ImageCropper from "./ImageCropper";
import PostCreator from "./PostCreator";
import axios from "axios";
import axiosInstance from "../../axiosInstance";

const UploadBox = ({ handleClose }) => {
  const [step, setStep] = useState(0);
  const forward = () => {
    setStep((prev) => prev + 1);
  };
  const backward = () => {
    setStep((prev) => prev - 1);
  };
  const [file, setFile] = useState({
    file: "",
    coordinates: {},
    ratio: 1,
    croppedImage: "",
  });

  const [about, setAbout] = useState({
    caption: "",
    tags: "",
    mentions: "",
  });

  const handlePost = async () => {
    const ratio = file.ratio;
    const croppedImage = file.croppedImage;
    if (!croppedImage) {
      throw new Error("No Blob to upload");
    }
    const image = new File([croppedImage], "cropped-image.jpg", {
      type: "image/jpeg",
    });
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "preset_echo");
    formData.append("context", `aspectRatio=${ratio}`);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dty9upcat/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axiosInstance.post("/post/upload", {
        media: res.data.secure_url,
        caption: about.caption,
        tags: about.tags,
        mentions: about.mentions,
      });
      handleClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  return (
    <Box
      sx={{
        height: "90%",
        width: { xs: "100%", md: "60%", lg: "50%", xl: "40%" },
        backgroundColor: "rgb(32, 32, 40)",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        pt: 0.8,
        px: 2,
        pb: 1.5,
      }}
    >
      <Box sx={{ mb: 3, width: "100%" }}>
        <BoxHead handleClose={handleClose} />
      </Box>
      <Box
        sx={{
          width: "min(80vw, 80vh)",
          height: "min(80vw, 80vh)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          borderRadius: 2,
        }}
      >
        {step === 0 ? (
          <ImageCropper file={file} setFile={setFile} />
        ) : (
          <PostCreator about={about} setAbout={setAbout} />
        )}
      </Box>

      <Box sx={{ mt: 3, width: "100%" }}>
        <Controls
          file={file}
          setFile={setFile}
          forward={forward}
          backward={backward}
          step={step}
          handlePost={handlePost}
        />
      </Box>
    </Box>
  );
};

export default UploadBox;
