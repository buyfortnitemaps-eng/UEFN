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

export const uploadMultipleImagesToCloudinary = async (files) => {
  if (!files || files.length === 0) return [];

  try {
    // ১. প্রতিটি ফাইলের জন্য আপলোড প্রমিস তৈরি করা
    const uploadPromises = files.map(async (file) => {
      // আপনার তৈরি করা uploadImageToCloudinary ফাংশনটিকেই কল করা হচ্ছে
      const result = await uploadImageToCloudinary(file);
      
      if (!result) {
        throw new Error("Failed to upload one of the images");
      }
      
      return result; // এটি { url, publicId } রিটার্ন করবে
    });

    // ২. সবগুলো আপলোড একসাথে সম্পন্ন করা (Parallel Upload)
    const uploadedImages = await Promise.all(uploadPromises);
    
    // রিটার্ন করবে: [{url: '...', publicId: '...'}, {url: '...', publicId: '...'}]
    return uploadedImages;
    
  } catch (error) {
    console.error("Multiple image upload failed:", error);
    return [];
  }
};