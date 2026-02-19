import imageCompression from 'browser-image-compression';

export const uploadImageToCloudinary = async (file) => {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", "uefnmap"); 

    const res = await fetch("https://api.cloudinary.com/v1_1/domw8nflv/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    
    // URL এবং Public ID দুটোই রিটার্ন করছি
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};