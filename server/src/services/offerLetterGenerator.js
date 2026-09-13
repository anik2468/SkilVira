import fs from "fs";
import path from "path";

import QRCode from "qrcode";
import sharp from "sharp";

import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";


// =====================================================
// GENERATE OFFER LETTER
// =====================================================

export const generateOfferLetter = async ({
  templatePath,
  positions = {},

  studentName,
  role,
  companyName,
  duration,
  joiningDate,
  endDate,
  stipend,
  location,
  workMode,
  offerId,
  issueDate,
  reportingManager,

}) => {

  try {

    // -------------------------------------------------
    // OFFER ID
    // -------------------------------------------------

    const id =
      offerId ||
      `OFF-${uuidv4()
        .slice(0, 8)
        .toUpperCase()}`;


    // -------------------------------------------------
    // UPLOAD DIRECTORY
    // -------------------------------------------------

    const uploadDir =
      path.join(
        process.cwd(),
        "uploads",
        "offer-letters"
      );


    if (!fs.existsSync(uploadDir)) {

      fs.mkdirSync(
        uploadDir,
        {
          recursive: true,
        }
      );

    }


    // -------------------------------------------------
    // VERIFY URL
    // -------------------------------------------------

    const verifyBaseUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";


    const verifyUrl =
      `${verifyBaseUrl}/verify-offer/${id}`;


    // -------------------------------------------------
    // QR CODE
    // -------------------------------------------------

    const qrPath =
      path.join(
        uploadDir,
        `${id}-qr.png`
      );


    await QRCode.toFile(
      qrPath,
      verifyUrl
    );


    // -------------------------------------------------
    // TEMPLATE
    // -------------------------------------------------

    let finalTemplate =
      templatePath;


    const extension =
      path.extname(templatePath)
        .toLowerCase();


    // -------------------------------------------------
    // PDF TEMPLATE → PNG
    // -------------------------------------------------

    if (extension === ".pdf") {

      const pdfOutputDir =
        path.join(
          uploadDir,
          `${id}-template`
        );


      if (!fs.existsSync(pdfOutputDir)) {

        fs.mkdirSync(
          pdfOutputDir,
          {
            recursive: true,
          }
        );

      }


      execSync(

        `pdftoppm -png -f 1 -singlefile "${templatePath}" "${pdfOutputDir}/offer"`,

        {
          stdio: "ignore",
        }

      );


      finalTemplate =
        path.join(
          pdfOutputDir,
          "offer.png"
        );

    }


    // -------------------------------------------------
    // POSITIONS
    // -------------------------------------------------

    const studentPosition =
      positions.studentName || {
        x: 600,
        y: 250,
      };


    const rolePosition =
      positions.role || {
        x: 600,
        y: 320,
      };


    const companyPosition =
      positions.companyName || {
        x: 600,
        y: 380,
      };


    const durationPosition =
      positions.duration || {
        x: 600,
        y: 430,
      };


    const joiningPosition =
      positions.joiningDate || {
        x: 600,
        y: 480,
      };


    const endPosition =
      positions.endDate || {
        x: 600,
        y: 530,
      };


    const stipendPosition =
      positions.stipend || {
        x: 600,
        y: 580,
      };


    const locationPosition =
      positions.location || {
        x: 600,
        y: 630,
      };


    const workModePosition =
      positions.workMode || {
        x: 600,
        y: 680,
      };


    const issueDatePosition =
      positions.issueDate || {
        x: 600,
        y: 730,
      };


    const offerIdPosition =
      positions.offerId || {
        x: 600,
        y: 780,
      };


    const managerPosition =
      positions.reportingManager || {
        x: 600,
        y: 830,
      };


    const qrPosition =
      positions.qrCode || {
        x: 950,
        y: 650,
      };


    // -------------------------------------------------
    // SVG ESCAPE
    // -------------------------------------------------

    const escapeSvg =
      (value = "") =>
        String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");


    // -------------------------------------------------
    // SVG TEXT LAYER
    // -------------------------------------------------

    const svg = `

      <svg
        width="1200"
        height="900"
        xmlns="http://www.w3.org/2000/svg"
      >

        <text
          x="${studentPosition.x}"
          y="${studentPosition.y}"
          font-size="45"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(studentName)}
        </text>


        <text
          x="${rolePosition.x}"
          y="${rolePosition.y}"
          font-size="34"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(role)}
        </text>


        <text
          x="${companyPosition.x}"
          y="${companyPosition.y}"
          font-size="32"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(companyName)}
        </text>


        <text
          x="${durationPosition.x}"
          y="${durationPosition.y}"
          font-size="28"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(duration)}
        </text>


        <text
          x="${joiningPosition.x}"
          y="${joiningPosition.y}"
          font-size="26"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(joiningDate)}
        </text>


        <text
          x="${endPosition.x}"
          y="${endPosition.y}"
          font-size="26"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(endDate)}
        </text>


        <text
          x="${stipendPosition.x}"
          y="${stipendPosition.y}"
          font-size="26"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(stipend)}
        </text>


        <text
          x="${locationPosition.x}"
          y="${locationPosition.y}"
          font-size="26"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(location)}
        </text>


        <text
          x="${workModePosition.x}"
          y="${workModePosition.y}"
          font-size="26"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(workMode)}
        </text>


        <text
          x="${issueDatePosition.x}"
          y="${issueDatePosition.y}"
          font-size="24"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(
            issueDate ||
            new Date().toLocaleDateString("en-IN")
          )}
        </text>


        <text
          x="${offerIdPosition.x}"
          y="${offerIdPosition.y}"
          font-size="22"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(id)}
        </text>


        <text
          x="${managerPosition.x}"
          y="${managerPosition.y}"
          font-size="24"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(reportingManager)}
        </text>

      </svg>

    `;


    // -------------------------------------------------
    // OUTPUT IMAGE
    // -------------------------------------------------

    const outputImage =
      path.join(
        uploadDir,
        `${id}.png`
      );


    await sharp(finalTemplate)
      .composite([

        {
          input: Buffer.from(svg),
          top: 0,
          left: 0,
        },

        {
          input: qrPath,
          top: qrPosition.y,
          left: qrPosition.x,
        },

      ])
      .png()
      .toFile(outputImage);


    // -------------------------------------------------
    // IMAGE → PDF
    // -------------------------------------------------

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
        900,
      ]);


    page.drawImage(
      image,
      {
        x: 0,
        y: 0,
        width: 1200,
        height: 900,
      }
    );


    const pdfBytes =
      await pdfDoc.save();


    fs.writeFileSync(
      pdfPath,
      pdfBytes
    );


    // -------------------------------------------------
    // RESULT
    // -------------------------------------------------

    return {

      offerId: id,

      offerLetterFile:
        `/uploads/offer-letters/${id}.pdf`,

      verifyUrl,

    };


  } catch (error) {

    console.error(
      "Offer Letter Generator Error:",
      error
    );

    throw error;

  }

};