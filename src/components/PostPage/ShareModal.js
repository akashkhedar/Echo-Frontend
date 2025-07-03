import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Box,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ShareModal = ({ openShare, closeShareModal, postId }) => {
  const shareUrl = `https://app.echo.linkpc.net/post/${postId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {}
  };

  return (
    <Dialog open={openShare} onClose={closeShareModal}>
      <Box sx={{ bgcolor: " #1e1e2f" }}>
        <DialogTitle sx={{ color: "whitesmoke" }}>Share this post</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Button
              variant="contained"
              color="success"
              href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              startIcon={<WhatsAppIcon />}
            >
              WhatsApp
            </Button>
            <Button
              variant="contained"
              color="primary"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              startIcon={<FacebookIcon />}
            >
              Facebook
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "black" }}
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              startIcon={<XIcon />}
            >
              X (Twitter)
            </Button>
            <Button
              variant="outlined"
              onClick={copyToClipboard}
              startIcon={<ContentCopyIcon />}
            >
              Copy Link
            </Button>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ShareModal;
