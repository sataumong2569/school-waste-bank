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

// ฟังก์ชันสำหรับแปลง URL ของ Cloudinary ให้บีบอัดและย่อขนาดอัตโนมัติ
export const getOptimizedImageUrl = (url, size = 150) => {
    // ถ้าไม่มี URL หรือไม่ใช่รูปจาก Cloudinary ให้คืนค่าเดิมกลับไป
    if (!url || !url.includes('cloudinary.com')) return url;

    // แทรกคำสั่ง: c_fill (ครอบตัด), w_ (กว้าง), h_ (สูง), q_auto (บีบอัดออโต้), f_auto (แปลงเป็น WebP/AVIF ออโต้)
    const parts = url.split('/upload/');
    if (parts.length === 2) {
        return `${parts[0]}/upload/c_fill,w_${size},h_${size},q_auto,f_auto/${parts[1]}`;
    }
    return url;
};