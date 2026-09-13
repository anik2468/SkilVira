import fs from "fs";
import path from "path";

import QRCode from "qrcode";
import sharp from "sharp";

import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";


// =====================================================
// GENERATE REPORT
// =====================================================

export const generateReport = async ({
  templatePath,
  positions = {},

  studentName,
  courseName,
  marks,
  grade,
  attendance,
  duration,
  performance,
  feedback,
  issueDate,
  reportId,
  instructorName,

}) => {

  try {

    // -------------------------------------------------
    // REPORT ID
    // -------------------------------------------------

    const id =
      reportId ||
      `RPT-${uuidv4()
        .slice(0, 8)
        .toUpperCase()}`;


    // -------------------------------------------------
    // UPLOAD DIRECTORY
    // -------------------------------------------------

    const uploadDir =
      path.join(
        process.cwd(),
        "uploads",
        "reports"
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
      `${verifyBaseUrl}/verify-report/${id}`;


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

        `pdftoppm -png -f 1 -singlefile "${templatePath}" "${pdfOutputDir}/report"`,

        {
          stdio: "ignore",
        }

      );


      finalTemplate =
        path.join(
          pdfOutputDir,
          "report.png"
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


    const coursePosition =
      positions.courseName || {
        x: 600,
        y: 320,
      };


    const marksPosition =
      positions.marks || {
        x: 300,
        y: 420,
      };


    const gradePosition =
      positions.grade || {
        x: 850,
        y: 420,
      };


    const attendancePosition =
      positions.attendance || {
        x: 300,
        y: 480,
      };


    const durationPosition =
      positions.duration || {
        x: 850,
        y: 480,
      };


    const performancePosition =
      positions.performance || {
        x: 600,
        y: 540,
      };


    const feedbackPosition =
      positions.feedback || {
        x: 600,
        y: 620,
      };


    const datePosition =
      positions.issueDate || {
        x: 600,
        y: 700,
      };


    const reportIdPosition =
      positions.reportId || {
        x: 600,
        y: 750,
      };


    const instructorPosition =
      positions.instructorName || {
        x: 600,
        y: 780,
      };


    const qrPosition =
      positions.qrCode || {
        x: 950,
        y: 600,
      };


    // -------------------------------------------------
    // ESCAPE SVG TEXT
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
    // SVG DATA LAYER
    // -------------------------------------------------

    const svg = `

      <svg
        width="1200"
        height="900"
        xmlns="http://www.w3.org/2000/svg"
      >

        <!-- Student -->

        <text
          x="${studentPosition.x}"
          y="${studentPosition.y}"
          font-size="50"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(studentName)}
        </text>


        <!-- Course -->

        <text
          x="${coursePosition.x}"
          y="${coursePosition.y}"
          font-size="38"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(courseName)}
        </text>


        <!-- Marks -->

        <text
          x="${marksPosition.x}"
          y="${marksPosition.y}"
          font-size="30"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(marks)}
        </text>


        <!-- Grade -->

        <text
          x="${gradePosition.x}"
          y="${gradePosition.y}"
          font-size="30"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(grade)}
        </text>


        <!-- Attendance -->

        <text
          x="${attendancePosition.x}"
          y="${attendancePosition.y}"
          font-size="28"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(attendance)}
        </text>


        <!-- Duration -->

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


        <!-- Performance -->

        <text
          x="${performancePosition.x}"
          y="${performancePosition.y}"
          font-size="30"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(performance)}
        </text>


        <!-- Feedback -->

        <text
          x="${feedbackPosition.x}"
          y="${feedbackPosition.y}"
          font-size="25"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(feedback)}
        </text>


        <!-- Issue Date -->

        <text
          x="${datePosition.x}"
          y="${datePosition.y}"
          font-size="25"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(
            issueDate ||
            new Date().toLocaleDateString("en-IN")
          )}
        </text>


        <!-- Report ID -->

        <text
          x="${reportIdPosition.x}"
          y="${reportIdPosition.y}"
          font-size="22"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(id)}
        </text>


        <!-- Instructor -->

        <text
          x="${instructorPosition.x}"
          y="${instructorPosition.y}"
          font-size="25"
          font-family="Arial"
          text-anchor="middle"
          fill="black"
        >
          ${escapeSvg(instructorName)}
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
    // RETURN
    // -------------------------------------------------

    return {

      reportId: id,

      reportFile:
        `/uploads/reports/${id}.pdf`,

      verifyUrl,

    };


  } catch (error) {

    console.error(
      "Report Generator Error:",
      error
    );

    throw error;

  }

};