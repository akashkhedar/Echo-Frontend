import { toast } from "react-toastify";

const notify = (
  sender,

  type = "message",
  handleAcceptCall,
  handleDeclineCall,
  callType,
  username
) => {
  if (type === "message") {
    toast(`Message from ${sender}`);
  }

  if (type === "call") {
    toast.info(
      ({ closeToast }) => (
        <div>
          <strong>
            📞 Incoming {callType} call from {username}
          </strong>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                handleAcceptCall?.();
                closeToast();
              }}
              style={{
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Accept
            </button>
            <button
              onClick={() => {
                handleDeclineCall?.();
                closeToast();
              }}
              style={{
                padding: "5px 10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Ignore
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false, // override to keep it open
        closeOnClick: false,
        draggable: false,
        pauseOnHover: true,
      }
    );
  }
};

export default notify;
