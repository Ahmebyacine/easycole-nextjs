import QRCode from "qrcode";

export async function generateQRCode(data) {
  return await QRCode.toDataURL(data, {
    width: 120,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}