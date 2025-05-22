// === 新增 utils/serialNumber.js ===
export function generateSerialNumber() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    let currentSerial = parseInt(localStorage.getItem('serialNumber') || '0', 10);
    currentSerial += 1;
    localStorage.setItem('serialNumber', currentSerial);

    const serial = String(currentSerial).padStart(4, '0');

    return `AWELLA${yyyy}${mm}${dd}${serial}`;
}
