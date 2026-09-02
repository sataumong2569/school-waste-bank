import * as XLSX from 'xlsx';

/**
 * ฟังก์ชันสร้างและดาวน์โหลดไฟล์ Excel (.xlsx) สรุปรายชื่อสมาชิก
 * @param {Array} membersData ข้อมูลสมาชิกที่ผ่านการกรองแล้ว
 * @param {string} fileName ชื่อไฟล์ที่ต้องการบันทึก
 */
export const exportMembersToExcel = (membersData, fileName = 'รายงานสมาชิก_ธนาคารขยะ') => {
    if (!membersData || membersData.length === 0) {
        alert('ไม่พบข้อมูลสมาชิกที่จะส่งออก');
        return false;
    }

    const exportDateStr = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedRows = membersData.map((member) => {
        // คำนวณน้ำหนักรวมจากประวัติย้อนหลังที่มี
        const totalWeightFromHistory = member.history && Array.isArray(member.history)
            ? member.history.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0)
            : 0;

        return {
            'ชื่อ-นามสกุล': member.fullName || '-',
            'ชื่อเล่น': member.nickname || '-',
            'ชั้นเรียน': member.grade || '-',
            'สถานะนักเรียน': member.status || 'กำลังศึกษา',
            'ยอดเงินสะสม (บาท)': parseFloat(member.balance || 0),
            'ลดคาร์บอน (kgCO2e)': parseFloat(member.carbonPoints || 0),
            'แต้มสะสม (pts)': parseFloat(member.rewardPoints || 0),
            'จำนวนครั้งที่ฝาก': member.history ? member.history.length : 0,
            'น้ำหนักรวมจากประวัติ (กก.)': parseFloat(totalWeightFromHistory.toFixed(2))
        };
    });

    // 2. สร้าง Workbook และ Worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);

    // ปรับความกว้างของคอลัมน์อัตโนมัติให้อ่านง่าย (ให้เหลือเท่าจำนวนคอลัมน์ใหม่ที่เหลืออยู่)
    const columnWidths = [
        { wch: 25 }, // ชื่อ-นามสกุล
        { wch: 12 }, // ชื่อเล่น
        { wch: 12 }, // ชั้นเรียน
        { wch: 18 }, // สถานะนักเรียน
        { wch: 18 }, // ยอดเงินสะสม (บาท)
        { wch: 18 }, // ลดคาร์บอน (kgCO2e)
        { wch: 15 }, // แต้มสะสม (pts)
        { wch: 18 }, // จำนวนครั้งที่ฝาก
        { wch: 24 }  // น้ำหนักรวมจากประวัติ (กก.)
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'สรุปข้อมูลสมาชิก');

    // 3. บันทึกและดาวน์โหลดไฟล์
    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${fileName}_${dateStamp}.xlsx`);
    return true;
};