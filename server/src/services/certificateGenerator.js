import fs from "fs";
import path from "path";

import QRCode from "qrcode";
import sharp from "sharp";

import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";

// =====================================================
// HELPERS
// =====================================================

const escapeXml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const toNumber = (
  value,
  fallback
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

// =====================================================
// GENERATE CERTIFICATE
// =====================================================

export const generateCertificate = async ({
  templatePath,
  positions = {},
  studentName = "",
  courseName = "",
  credentialId,
  issueDate,
}) => {
  try {
    // ===================================================
    // CERTIFICATE ID
    // ===================================================

    const id =
      credentialId ||
      `SV-${uuidv4()
        .slice(0, 8)
        .toUpperCase()}`;

    // ===================================================
    // UPLOAD DIRECTORY
    // ===================================================

    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      "certificates"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    // ===================================================
    // PUBLIC VERIFICATION URL
    // ===================================================

    const frontendBaseUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    const verifyUrl =
      `${frontendBaseUrl.replace(
        /\/$/,
        ""
      )}/verify-certificate/${encodeURIComponent(id)}`;

    // ===================================================
    // QR CONFIGURATION
    // Template:
    //
    // positions: {
    //   qrCode: {
    //     x,
    //     y,
    //     width,
    //     height
    //   }
    // }
    // ===================================================

    const qrConfig = {
      ...(
        positions?.qrCode || {}
      ),
    };

    const qrX = toNumber(
      qrConfig.x,
      950
    );

    const qrY = toNumber(
      qrConfig.y,
      600
    );

    const qrWidth = Math.max(
      40,
      toNumber(
        qrConfig.width,
        120
      )
    );

    const qrHeight = Math.max(
      40,
      toNumber(
        qrConfig.height,
        120
      )
    );

    // ===================================================
    // QR GENERATION
    // ===================================================

    const qrPath = path.join(
      uploadDir,
      `${id}-qr.png`
    );

    await QRCode.toFile(
      qrPath,
      verifyUrl,
      {
        type: "png",
        width: Math.max(
          qrWidth,
          qrHeight
        ),
        margin: 2,
        errorCorrectionLevel: "H",
      }
    );

    // ===================================================
    // RESIZE QR ACCORDING TO TEMPLATE CONFIG
    // ===================================================

    const resizedQrPath =
      path.join(
        uploadDir,
        `${id}-qr-resized.png`
      );

    await sharp(qrPath)
      .resize({
        width: Math.round(
          qrWidth
        ),
        height: Math.round(
          qrHeight
        ),
        fit: "fill",
      })
      .png()
      .toFile(
        resizedQrPath
      );

    // ===================================================
    // TEMPLATE CHECK
    // ===================================================

    if (
      !templatePath ||
      !fs.existsSync(templatePath)
    ) {
      throw new Error(
        "Certificate template file not found."
      );
    }

    // ===================================================
    // CONVERT PDF TEMPLATE TO IMAGE
    // ===================================================

    let finalTemplate =
      templatePath;

    const extension =
      path
        .extname(templatePath)
        .toLowerCase();

    if (
      extension === ".pdf"
    ) {
      const pdfOutputDir =
        path.join(
          uploadDir,
          `${id}-template`
        );

      if (
        !fs.existsSync(
          pdfOutputDir
        )
      ) {
        fs.mkdirSync(
          pdfOutputDir,
          {
            recursive: true,
          }
        );
      }

      execSync(
        `pdftoppm -png -f 1 -singlefile "${templatePath}" "${pdfOutputDir}/certificate"`
      );

      finalTemplate =
        path.join(
          pdfOutputDir,
          "certificate.png"
        );
    }

    // ===================================================
    // FIELD POSITIONS
    // ===================================================

    const studentPosition =
      positions.studentName || {
        x: 600,
        y: 350,
      };

    const coursePosition =
      positions.courseName || {
        x: 600,
        y: 450,
      };

    const datePosition =
      positions.issueDate || {
        x: 600,
        y: 520,
      };

    // ===================================================
    // SAFE VALUES
    // ===================================================

    const safeStudentName =
      escapeXml(
        studentName || "Student"
      );

    const safeCourseName =
      escapeXml(
        courseName ||
          "SkilVira Program"
      );

    const safeIssueDate =
      escapeXml(
        issueDate ||
          new Date().toLocaleDateString(
            "en-IN"
          )
      );

    // ===================================================
    // SVG TEXT LAYER
    // ===================================================

    const svg = `
<svg
  width="1200"
  height="800"
  xmlns="http://www.w3.org/2000/svg"
>

  <text
    x="${toNumber(
      studentPosition.x,
      600
    )}"
    y="${toNumber(
      studentPosition.y,
      350
    )}"
    font-size="60"
    font-family="Arial, sans-serif"
    text-anchor="middle"
    fill="black"
  >
    ${safeStudentName}
  </text>

  <text
    x="${toNumber(
      coursePosition.x,
      600
    )}"
    y="${toNumber(
      coursePosition.y,
      450
    )}"
    font-size="45"
    font-family="Arial, sans-serif"
    text-anchor="middle"
    fill="black"
  >
    ${safeCourseName}
  </text>

  <text
    x="${toNumber(
      datePosition.x,
      600
    )}"
    y="${toNumber(
      datePosition.y,
      520
    )}"
    font-size="30"
    font-family="Arial, sans-serif"
    text-anchor="middle"
    fill="black"
  >
    ${safeIssueDate}
  </text>

</svg>
`;

    // ===================================================
    // OUTPUT IMAGE
    // ===================================================

    const outputImage =
      path.join(
        uploadDir,
        `${id}.png`
      );

    // ===================================================
    // CREATE CERTIFICATE IMAGE
    // ===================================================

    await sharp(
      finalTemplate
    )
      .composite([
        {
          input:
            Buffer.from(
              svg
            ),
          top: 0,
          left: 0,
        },

        {
          input:
            resizedQrPath,
          top: Math.round(
            qrY
          ),
          left: Math.round(
            qrX
          ),
        },
      ])
      .png()
      .toFile(
        outputImage
      );

    // ===================================================
    // CONVERT IMAGE TO PDF
    // ===================================================

    const pdfPath =
      path.join(
        uploadDir,
        `${id}.pdf`
      );

    const pdfDoc =
      await PDFDocument.create();

    const imageBytes =
      fs.readFileSync(
        outputImage
      );

    const image =
      await pdfDoc.embedPng(
        imageBytes
      );

    const page =
      pdfDoc.addPage([
        1200,
        800,
      ]);

    page.drawImage(
      image,
      {
        x: 0,
        y: 0,
        width: 1200,
        height: 800,
      }
    );

    const pdfBytes =
      await pdfDoc.save();

    fs.writeFileSync(
      pdfPath,
      pdfBytes
    );

    // ===================================================
    // RETURN
    // ===================================================

    return {
      credentialId: id,

      certificateFile:
        `/uploads/certificates/${id}.pdf`,

      qrCode:
        `/uploads/certificates/${id}-qr.png`,

      verifyUrl,

      qrPosition: {
        x: qrX,
        y: qrY,
        width: qrWidth,
        height: qrHeight,
      },
    };
  } catch (error) {
    console.error(
      "Certificate Generator Error:",
      error
    );

    throw error;
  }
};