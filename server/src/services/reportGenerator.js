import fs from "fs";
import path from "path";

import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";


// =====================================================
// HELPERS
// =====================================================

const ensureDirectory = (
  directory
) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true,
    });
  }
};


// =====================================================
// SVG ESCAPE
// =====================================================

const escapeSvg = (
  value = ""
) => {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&apos;"
    );
};


// =====================================================
// CLEAN VALUE
// =====================================================

const cleanValue = (
  value,
  fallback = ""
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  return String(value);
};


// =====================================================
// POSITION HELPER
// =====================================================

const getPosition = (
  positions,
  key,
  fallback
) => {
  const position =
    positions?.[key];

  if (!position) {
    return {
      ...fallback,
    };
  }

  return {
    x:
      Number.isFinite(
        Number(position.x)
      )
        ? Number(position.x)
        : fallback.x,

    y:
      Number.isFinite(
        Number(position.y)
      )
        ? Number(position.y)
        : fallback.y,

    width:
      Number.isFinite(
        Number(position.width)
      )
        ? Number(position.width)
        : fallback.width,

    height:
      Number.isFinite(
        Number(position.height)
      )
        ? Number(position.height)
        : fallback.height,
  };
};


// =====================================================
// FIELD ENABLED
// =====================================================

const getFieldEnabled = (
  fields,
  key,
  defaultValue = true
) => {

  if (
    !fields ||
    typeof fields !== "object"
  ) {
    return defaultValue;
  }

  if (
    fields[key] === undefined ||
    fields[key] === null
  ) {
    return defaultValue;
  }

  return Boolean(
    fields[key]
  );
};


// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (
  dateValue
) => {

  if (!dateValue) {
    return new Date().toLocaleDateString(
      "en-IN"
    );
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(
      dateValue
    );
  }

  return date.toLocaleDateString(
    "en-IN"
  );
};


// =====================================================
// SAFE FILE NAME
// =====================================================

const safeFileName = (
  value
) => {
  return String(value)
    .replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    )
    .replace(
      /_+/g,
      "_"
    );
};


// =====================================================
// WORD WRAP
// =====================================================

const wrapText = (
  text,
  maxCharacters = 70
) => {

  const value =
    cleanValue(text);

  if (!value) {
    return [""];
  }

  const words =
    value.split(
      /\s+/
    );

  const lines = [];

  let current = "";


  for (
    const word of words
  ) {

    const next =
      current.length === 0
        ? word
        : `${current} ${word}`;


    if (
      next.length <=
      maxCharacters
    ) {

      current =
        next;

    } else {

      if (current) {
        lines.push(
          current
        );
      }

      current =
        word;
    }
  }


  if (current) {
    lines.push(
      current
    );
  }


  return lines.length
    ? lines
    : [value];
};


// =====================================================
// CREATE SVG TEXT ELEMENT
// =====================================================

const createTextElement = ({
  x,
  y,
  value,
  fontSize = 30,
  fontWeight = "400",
  anchor = "middle",
  maxCharacters,
  lineHeight,
}) => {

  const text =
    cleanValue(value);

  if (!text) {
    return "";
  }


  const lines =
    maxCharacters
      ? wrapText(
          text,
          maxCharacters
        )
      : [text];


  const safeLines =
    lines.map(
      escapeSvg
    );


  const actualLineHeight =
    lineHeight ||
    Math.round(
      fontSize * 1.3
    );


  // -----------------------------------------------
  // SINGLE LINE
  // -----------------------------------------------

  if (
    safeLines.length === 1
  ) {

    return `
      <text
        x="${x}"
        y="${y}"
        font-size="${fontSize}"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="${fontWeight}"
        text-anchor="${anchor}"
        fill="black"
      >${safeLines[0]}</text>
    `;
  }


  // -----------------------------------------------
  // MULTIPLE LINES
  // -----------------------------------------------

  const tspans =
    safeLines
      .map(
        (
          line,
          index
        ) => `
          <tspan
            x="${x}"
            dy="${
              index === 0
                ? 0
                : actualLineHeight
            }"
          >${line}</tspan>
        `
      )
      .join("");


  return `
    <text
      x="${x}"
      y="${y}"
      font-size="${fontSize}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="${fontWeight}"
      text-anchor="${anchor}"
      fill="black"
    >${tspans}</text>
  `;
};


// =====================================================
// GET TEMPLATE FILE
// =====================================================

const resolveTemplatePath = (
  templatePath
) => {

  if (!templatePath) {
    return "";
  }

  const value =
    String(
      templatePath
    ).trim();

  if (!value) {
    return "";
  }

  // Already absolute local path
  if (
    path.isAbsolute(value)
  ) {
    return value;
  }

  // /uploads/... -> server/uploads/...
  return path.resolve(
    process.cwd(),
    value.replace(
      /^\/+/,
      ""
    )
  );
};


// =====================================================
// GENERATE REPORT
//
// IMPORTANT:
// - No public verification URL
// - No QR generation
// - Report is internal verification only
// - Certificate is the only publicly verifiable document
// =====================================================

export const generateReport =
  async ({
    templatePath,

    positions = {},

    fields = {},

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

    let temporaryTemplateDir =
      null;


    try {

      // =================================================
      // TEMPLATE PATH
      // =================================================

      if (!templatePath) {
        throw new Error(
          "Report template path is required."
        );
      }


      const resolvedTemplatePath =
        resolveTemplatePath(
          templatePath
        );


      if (
        !resolvedTemplatePath
      ) {
        throw new Error(
          "Invalid report template path."
        );
      }


      if (
        !fs.existsSync(
          resolvedTemplatePath
        )
      ) {
        throw new Error(
          `Report template not found: ${resolvedTemplatePath}`
        );
      }


      // =================================================
      // REPORT ID
      // =================================================

      const id =
        reportId ||
        `RPT-${uuidv4()
          .replace(
            /-/g,
            ""
          )
          .slice(
            0,
            8
          )
          .toUpperCase()}`;


      // =================================================
      // UPLOAD DIRECTORY
      // =================================================

      const uploadDir =
        path.join(
          process.cwd(),
          "uploads",
          "reports"
        );


      ensureDirectory(
        uploadDir
      );


      // =================================================
      // PREPARE TEMPLATE
      // =================================================

      let finalTemplate =
        resolvedTemplatePath;


      const extension =
        path.extname(
          resolvedTemplatePath
        )
          .toLowerCase();


      // =================================================
      // PDF TEMPLATE -> PNG
      // =================================================

      if (
        extension === ".pdf"
      ) {

        temporaryTemplateDir =
          path.join(
            uploadDir,
            `${safeFileName(
              id
            )}-template`
          );


        ensureDirectory(
          temporaryTemplateDir
        );


        const outputPrefix =
          path.join(
            temporaryTemplateDir,
            "report"
          );


        try {

          execSync(
            `pdftoppm -png -f 1 -singlefile -r 150 "${resolvedTemplatePath}" "${outputPrefix}"`,
            {
              stdio:
                "ignore",
            }
          );

        } catch (error) {

          throw new Error(
            "Unable to convert PDF report template to image. Make sure pdftoppm is installed."
          );
        }


        finalTemplate =
          `${outputPrefix}.png`;


        if (
          !fs.existsSync(
            finalTemplate
          )
        ) {

          throw new Error(
            "Converted report template image was not created."
          );
        }
      }


      // =================================================
      // TEMPLATE METADATA
      // =================================================

      const metadata =
        await sharp(
          finalTemplate
        ).metadata();


      const canvasWidth =
        Number(
          metadata.width
        ) ||
        1200;


      const canvasHeight =
        Number(
          metadata.height
        ) ||
        900;


      // =================================================
      // FIELD POSITIONS
      // =================================================

      const studentPosition =
        getPosition(
          positions,
          "studentName",
          {
            x:
              canvasWidth / 2,

            y:
              250,
          }
        );


      const coursePosition =
        getPosition(
          positions,
          "courseName",
          {
            x:
              canvasWidth / 2,

            y:
              320,
          }
        );


      const marksPosition =
        getPosition(
          positions,
          "marks",
          {
            x:
              canvasWidth * 0.25,

            y:
              420,
          }
        );


      const gradePosition =
        getPosition(
          positions,
          "grade",
          {
            x:
              canvasWidth * 0.70,

            y:
              420,
          }
        );


      const attendancePosition =
        getPosition(
          positions,
          "attendance",
          {
            x:
              canvasWidth * 0.25,

            y:
              480,
          }
        );


      const durationPosition =
        getPosition(
          positions,
          "duration",
          {
            x:
              canvasWidth * 0.70,

            y:
              480,
          }
        );


      const performancePosition =
        getPosition(
          positions,
          "performance",
          {
            x:
              canvasWidth / 2,

            y:
              540,
          }
        );


      const feedbackPosition =
        getPosition(
          positions,
          "feedback",
          {
            x:
              canvasWidth / 2,

            y:
              620,
          }
        );


      const datePosition =
        getPosition(
          positions,
          "issueDate",
          {
            x:
              canvasWidth / 2,

            y:
              700,
          }
        );


      const reportIdPosition =
        getPosition(
          positions,
          "reportId",
          {
            x:
              canvasWidth / 2,

            y:
              750,
          }
        );


      const instructorPosition =
        getPosition(
          positions,
          "instructorName",
          {
            x:
              canvasWidth / 2,

            y:
              790,
          }
        );


      // =================================================
      // VALUES
      // =================================================

      const finalStudentName =
        cleanValue(
          studentName
        );


      const finalCourseName =
        cleanValue(
          courseName
        );


      const finalMarks =
        cleanValue(
          marks
        );


      const finalGrade =
        cleanValue(
          grade
        );


      const finalAttendance =
        cleanValue(
          attendance
        );


      const finalDuration =
        cleanValue(
          duration
        );


      const finalPerformance =
        cleanValue(
          performance
        );


      const finalFeedback =
        cleanValue(
          feedback
        );


      const finalIssueDate =
        formatDate(
          issueDate
        );


      const finalInstructor =
        cleanValue(
          instructorName
        );


      // =================================================
      // SVG DATA LAYER
      // =================================================

      const svgParts = [];


      svgParts.push(
        `
          <svg
            width="${canvasWidth}"
            height="${canvasHeight}"
            viewBox="0 0 ${canvasWidth} ${canvasHeight}"
            xmlns="http://www.w3.org/2000/svg"
          >
        `
      );


      // =================================================
      // STUDENT NAME
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "studentName",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              studentPosition.x,

            y:
              studentPosition.y,

            value:
              finalStudentName,

            fontSize:
              50,

            fontWeight:
              "700",

            maxCharacters:
              38,
          })
        );
      }


      // =================================================
      // COURSE NAME
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "courseName",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              coursePosition.x,

            y:
              coursePosition.y,

            value:
              finalCourseName,

            fontSize:
              38,

            fontWeight:
              "600",

            maxCharacters:
              48,
          })
        );
      }


      // =================================================
      // MARKS
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "marks",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              marksPosition.x,

            y:
              marksPosition.y,

            value:
              finalMarks,

            fontSize:
              30,

            fontWeight:
              "600",
          })
        );
      }


      // =================================================
      // GRADE
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "grade",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              gradePosition.x,

            y:
              gradePosition.y,

            value:
              finalGrade,

            fontSize:
              30,

            fontWeight:
              "600",
          })
        );
      }


      // =================================================
      // ATTENDANCE
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "attendance",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              attendancePosition.x,

            y:
              attendancePosition.y,

            value:
              finalAttendance,

            fontSize:
              28,

            fontWeight:
              "500",
          })
        );
      }


      // =================================================
      // DURATION
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "duration",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              durationPosition.x,

            y:
              durationPosition.y,

            value:
              finalDuration,

            fontSize:
              28,

            fontWeight:
              "500",
          })
        );
      }


      // =================================================
      // PERFORMANCE
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "performance",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              performancePosition.x,

            y:
              performancePosition.y,

            value:
              finalPerformance,

            fontSize:
              30,

            fontWeight:
              "600",

            maxCharacters:
              50,
          })
        );
      }


      // =================================================
      // FEEDBACK
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "feedback",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              feedbackPosition.x,

            y:
              feedbackPosition.y,

            value:
              finalFeedback,

            fontSize:
              25,

            fontWeight:
              "400",

            maxCharacters:
              65,

            lineHeight:
              34,
          })
        );
      }


      // =================================================
      // ISSUE DATE
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "issueDate",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              datePosition.x,

            y:
              datePosition.y,

            value:
              finalIssueDate,

            fontSize:
              25,

            fontWeight:
              "500",
          })
        );
      }


      // =================================================
      // REPORT ID
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "reportId",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              reportIdPosition.x,

            y:
              reportIdPosition.y,

            value:
              id,

            fontSize:
              22,

            fontWeight:
              "500",
          })
        );
      }


      // =================================================
      // INSTRUCTOR
      // =================================================

      if (
        getFieldEnabled(
          fields,
          "instructorName",
          true
        )
      ) {

        svgParts.push(
          createTextElement({
            x:
              instructorPosition.x,

            y:
              instructorPosition.y,

            value:
              finalInstructor,

            fontSize:
              25,

            fontWeight:
              "500",
          })
        );
      }


      // =================================================
      // CLOSE SVG
      // =================================================

      svgParts.push(
        "</svg>"
      );


      const svg =
        svgParts.join(
          ""
        );


      // =================================================
      // OUTPUT IMAGE
      // =================================================

      const outputImage =
        path.join(
          uploadDir,
          `${safeFileName(
            id
          )}.png`
        );


      // =================================================
      // COMPOSITE DATA
      // =================================================

      const composites = [
        {
          input:
            Buffer.from(
              svg
            ),

          top:
            0,

          left:
            0,
        },
      ];


      // =================================================
      // GENERATE PNG
      // =================================================

      await sharp(
        finalTemplate
      )
        .composite(
          composites
        )
        .png()
        .toFile(
          outputImage
        );


      // =================================================
      // GENERATE PDF
      // =================================================

      const pdfPath =
        path.join(
          uploadDir,
          `${safeFileName(
            id
          )}.pdf`
        );


      const pdfDoc =
        await PDFDocument.create();


      const imageBytes =
        await fs.promises.readFile(
          outputImage
        );


      const image =
        await pdfDoc.embedPng(
          imageBytes
        );


      const page =
        pdfDoc.addPage([
          canvasWidth,
          canvasHeight,
        ]);


      page.drawImage(
        image,
        {
          x:
            0,

          y:
            0,

          width:
            canvasWidth,

          height:
            canvasHeight,
        }
      );


      const pdfBytes =
        await pdfDoc.save();


      await fs.promises.writeFile(
        pdfPath,
        pdfBytes
      );


      // =================================================
      // CLEAN TEMPORARY FILES
      // =================================================

      if (
        temporaryTemplateDir &&
        fs.existsSync(
          temporaryTemplateDir
        )
      ) {

        try {

          fs.rmSync(
            temporaryTemplateDir,
            {
              recursive:
                true,

              force:
                true,
            }
          );

        } catch (
          cleanupError
        ) {

          console.warn(
            "Temporary report template cleanup failed:",
            cleanupError.message
          );
        }
      }


      // =================================================
      // RETURN
      // =================================================

      return {

        reportId:
          id,

        reportFile:
          `/uploads/reports/${safeFileName(
            id
          )}.pdf`,

        reportImage:
          `/uploads/reports/${safeFileName(
            id
          )}.png`,

        // Kept as null for compatibility.
        // Reports have NO public QR verification.
        qrCode:
          null,

        verifyUrl:
          null,
      };


    } catch (error) {

      // =================================================
      // CLEANUP ON ERROR
      // =================================================

      if (
        temporaryTemplateDir &&
        fs.existsSync(
          temporaryTemplateDir
        )
      ) {

        try {

          fs.rmSync(
            temporaryTemplateDir,
            {
              recursive:
                true,

              force:
                true,
            }
          );

        } catch (
          cleanupError
        ) {

          console.warn(
            "Temporary report template cleanup failed:",
            cleanupError.message
          );
        }
      }


      console.error(
        "Report Generator Error:",
        error
      );


      throw error;
    }
  };