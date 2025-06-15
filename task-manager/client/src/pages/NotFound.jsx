import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SentimentDissatisfied as SadIcon } from "@mui/icons-material";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
      }}
    >
      <SadIcon sx={{ fontSize: 100, color: "text.secondary", mb: 2 }} />
      <Typography variant="h1" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go to Dashboard
      </Button>
    </Box>
  );
}

export default NotFound;
