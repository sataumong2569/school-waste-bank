export const uploadImageToCloudinary = async (file) => {
    // เช็กก่อนว่ามีไฟล์ส่งมาไหม
    if (!file) return null;

    // เตรียมข้อมูลส่งไปให้ Cloudinary
    const formData = new FormData();
    formData.append("file", file);

    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
        // ยิง API ไปที่ Cloudinary
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!res.ok) {
            throw new Error("อัปโหลดรูปภาพไม่สำเร็จ");
        }

        const data = await res.json();

        // คืนค่ากลับไปเป็น URL ของรูปภาพที่อัปโหลดเสร็จแล้ว
        return data.secure_url;

    } catch (error) {
        console.error("Cloudinary Error:", error);
        return null;
    }
};

// ฟังก์ชันแปลง URL ของ Cloudinary (รองรับทั้งแบบตัดสี่เหลี่ยม และแบบปรับความกว้างคงสัดส่วน)
export const getOptimizedImageUrl = (url, width = 150, height = null) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    const parts = url.split('/upload/');
    if (parts.length === 2) {
        const transform = height
            ? `c_fill,w_${width},h_${height},q_auto,f_auto`
            : `c_scale,w_${width},q_auto,f_auto`;

        return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }
    return url;
};