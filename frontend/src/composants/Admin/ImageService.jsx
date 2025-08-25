import React, { useRef, useState } from "react";
import { Box, Paper, CircularProgress, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageService = ({ service, setService }) => {
    const fileInputRef = useRef();
    const [isUploading, setIsUploading] = useState(false);

    const imageUrl = service?.image || "/images/default-service.png";

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "DomiService"); // preset Cloudinary

            const res = await fetch("https://api.cloudinary.com/v1_1/dkhjej8yx/image/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            // Enregistrer l'URL Cloudinary dans le service
            setService({ ...service, image: data.secure_url });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'upload de l'image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box textAlign="center" mb={3}>
            <Box
                sx={{ width: 240, height: 160, margin: "0 auto", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
            >
                <Paper
                    elevation={3}
                    sx={{ width: "100%", height: "100%", borderRadius: 2.5, overflow: "hidden" }}
                >
                    <img
                        src={imageUrl}
                        alt="Service"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {isUploading && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(255,255,255,0.6)"
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    {!service.image && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: "grey.500"
                            }}
                        >
                            <CloudUploadIcon fontSize="large" />
                            <Typography>Ajouter une image</Typography>
                        </Box>
                    )}
                </Paper>
            </Box>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </Box>
    );
};

export default ImageService;
