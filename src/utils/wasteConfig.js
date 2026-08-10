export const WASTE_CATEGORIES = {
    plastic: {
        label: 'พลาสติก',
        color: 'bg-[#db2777]', // ชมพู
        items: ['พลาสติกรวม', 'ขวดน้ำขุ่น', 'ขวดน้ำใส', 'ขวดน้ำ PET สี'],
        carbonMultiplier: 1.0310
    },
    paper: {
        label: 'กระดาษ',
        color: 'bg-[#f59e0b]', // ส้ม
        items: ['กระดาษขาวดำ', 'กระดาษสีรวม', 'กระดาษลัง'],
        carbonMultiplier: 5.6735
    },
    glass: {
        label: 'แก้ว',
        color: 'bg-[#10b981]', // เขียว
        items: ['แก้ว'],
        carbonMultiplier: 0.2760
    },
    aluminum: {
        label: 'อลูมิเนียม',
        color: 'bg-[#7c3aed]', // ม่วง
        items: ['กระป๋องกาแฟ/นม'],
        carbonMultiplier: 9.1270
    },
    alloy: {
        label: 'โลหะผสม',
        color: 'bg-[#0ea5e9]', // ฟ้า
        items: ['โลหะผสม'],
        carbonMultiplier: 4.3910
    },
    iron: {
        label: 'เหล็ก',
        color: 'bg-[#94a3b8]', // เทา
        items: ['เหล็กหนา', 'เหล็กบาง', 'สังกะสี'],
        carbonMultiplier: 1.8320
    }
};

// ข้อมูลเริ่มต้นสำหรับราคารับซื้อ (Default Prices - ต่อกิโลกรัม)
// ในอนาคตเราจะดึงค่าพวกนี้มาจาก Firebase แทน แต่เอาไว้โชว์ UI เบื้องต้นก่อน
export const DEFAULT_PRICES = {
    'พลาสติกรวม': 5.00, 'ขวดน้ำขุ่น': 10.00, 'ขวดน้ำใส': 8.50, 'ขวดน้ำ PET สี': 4.00,
    'กระดาษขาวดำ': 5.00, 'กระดาษสีรวม': 1.00, 'กระดาษลัง': 5.50,
    'แก้ว': 1.00,
    'กระป๋องกาแฟ/นม': 35.00,
    'โลหะผสม': 5.00,
    'เหล็กหนา': 8.00, 'เหล็กบาง': 5.00, 'สังกะสี': 4.00
};