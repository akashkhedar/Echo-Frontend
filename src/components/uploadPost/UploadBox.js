import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import socket from "../../utils/socket";
import BoxHead from "./BoxHead";
import Controls from "./Controls";
import ImageCropper from "./ImageCropper";
import PostCreator from "./PostCreator";

const UploadBox = ({ handleClose }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null); // This will store the File object
  const [croppedFile, setCroppedFile] = useState(null); // This will store the cropped File

  const [about, setAbout] = useState({
    caption: "",
    tags: "",
    mentions: "",
  });

  const forward = () => {
    setStep((prev) => prev + 1);
  };

  const backward = () => {
    setStep((prev) => prev - 1);
  };

  const handlePost = async () => {
    if (!croppedFile) {
      console.error("No cropped image to upload");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", croppedFile);
    formData.append("upload_preset", "preset_echo");

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

      const ratio = res.data.width / res.data.height;

      const response = await axiosInstance.post("/post/upload", {
        media: res.data.secure_url,
        caption: about.caption,
        ratio: ratio,
      });

      socket.emit("newPost", response.data.post);

      handleClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: {
          xs: "80%",
          sm: "65%",
          md: "65%",
          lg: "80%",
          xl: "75%",
        },
        height: {
          xs: "95%",
          md: "90%",
        },
        overflowY: "auto",
        backgroundColor: "rgb(32, 32, 40)",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        py: 1,
        my: 1,
        px: { xs: 1, sm: 3 },
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Box sx={{ mb: 2, width: "100%" }}>
        <BoxHead handleClose={handleClose} />
      </Box>
      <Box
        sx={{
          width: "100%",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {step === 0 ? (
          <ImageCropper file={file} setCroppedFile={setCroppedFile} />
        ) : (
          <PostCreator about={about} setAbout={setAbout} />
        )}
      </Box>

      <Box sx={{ mt: 3, width: "100%" }}>
        <Controls
          setFile={setFile}
          forward={forward}
          backward={backward}
          step={step}
          handlePost={handlePost}
          loading={loading}
          hasFile={!!file}
          hasCroppedFile={!!croppedFile}
        />
      </Box>
    </Box>
  );
};

export default UploadBox;
