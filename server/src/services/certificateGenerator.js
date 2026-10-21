import fs from "fs";
import path from "path";

import QRCode from "qrcode";
import sharp from "sharp";

import {
  PDFDocument,
} from "pdf-lib";

import {
  v4 as uuidv4,
} from "uuid";

import {
  execSync,
} from "child_process";


// =====================================================
// CONSTANTS
// =====================================================

// Certificate template editor currently uses a
// 1200 x 800 coordinate system.
//
// If the uploaded template has another resolution,
// configured positions are scaled automatically.
const BASE_CANVAS_WIDTH = 1200;
const BASE_CANVAS_HEIGHT = 800;


// =====================================================
// HELPERS
// =====================================================

// -----------------------------------------------------
// Escape XML / SVG text
// -----------------------------------------------------

const escapeXml = (
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


// -----------------------------------------------------
// Number helper
// -----------------------------------------------------

const toNumber = (
  value,
  fallback = 0
) => {
  const number = Number(
    value
  );

  return Number.isFinite(number)
    ? number
    : fallback;
};


// -----------------------------------------------------
// Clamp
// -----------------------------------------------------

const clamp = (
  value,
  min,
  max
) => {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
};


// -----------------------------------------------------
// Scale X
// -----------------------------------------------------

const scaleX = (
  value,
  actualWidth
) => {
  return (
    toNumber(
      value,
      0
    ) *
    (actualWidth /
      BASE_CANVAS_WIDTH)
  );
};


// -----------------------------------------------------
// Scale Y
// -----------------------------------------------------

const scaleY = (
  value,
  actualHeight
) => {
  return (
    toNumber(
      value,
      0
    ) *
    (actualHeight /
      BASE_CANVAS_HEIGHT)
  );
};


// -----------------------------------------------------
// Scale size
// -----------------------------------------------------

const scaleSize = (
  value,
  actualWidth,
  actualHeight,
  fallback
) => {
  const safeValue =
    toNumber(
      value,
      fallback
    );

  const scale =
    Math.min(
      actualWidth /
        BASE_CANVAS_WIDTH,
      actualHeight /
        BASE_CANVAS_HEIGHT
    );

  return safeValue * scale;
};


// -----------------------------------------------------
// Date formatter
// -----------------------------------------------------

const formatDate = (
  value
) => {
  if (!value) {
    return new Date().toLocaleDateString(
      "en-IN"
    );
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return String(value);
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// -----------------------------------------------------
// Text normalization
// -----------------------------------------------------

const normalizeText = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(
    value
  ).trim();
};


// -----------------------------------------------------
// Simple text wrapping
// -----------------------------------------------------

const wrapText = (
  value,
  maxChars = 55
) => {
  const text =
    normalizeText(value);

  if (!text) {
    return [];
  }

  const words =
    text.split(/\s+/);

  const lines = [];

  let current = "";

  for (
    const word of words
  ) {
    const candidate =
      current
        ? `${current} ${word}`
        : word;

    if (
      candidate.length <=
      maxChars
    ) {
      current =
        candidate;
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

  return lines;
};


// -----------------------------------------------------
// Template path resolver
// -----------------------------------------------------

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

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  ) {
    return value;
  }

  return path.resolve(
    process.cwd(),
    value.replace(
      /^\/+/,
      ""
    )
  );
};


// =====================================================
// GENERATE CERTIFICATE
// =====================================================

export const generateCertificate =
  async ({
    templatePath,

    positions = {},

    fields = null,

    studentName = "",

    courseName = "",

    marks = "",

    grade = "",

    duration = "",

    attendance = "",

    performance = "",

    feedback = "",

    certificateId = "",

    credentialId,

    issueDate,
  }) => {

    try {

      // =================================================
      // CERTIFICATE ID
      // =================================================

      const id =
        credentialId ||
        certificateId ||
        `SV-${uuidv4()
          .slice(0, 8)
          .toUpperCase()}`;


      // =================================================
      // UPLOAD DIRECTORY
      // =================================================

      const uploadDir =
        path.join(
          process.cwd(),
          "uploads",
          "certificates"
        );


      if (
        !fs.existsSync(
          uploadDir
        )
      ) {
        fs.mkdirSync(
          uploadDir,
          {
            recursive: true,
          }
        );
      }


      // =================================================
      // RESOLVE TEMPLATE
      // =================================================

      const resolvedTemplatePath =
        resolveTemplatePath(
          templatePath
        );


      if (
        !resolvedTemplatePath
      ) {
        throw new Error(
          "Certificate template file is missing."
        );
      }


      if (
        resolvedTemplatePath.startsWith(
          "http://"
        ) ||
        resolvedTemplatePath.startsWith(
          "https://"
        )
      ) {
        throw new Error(
          "Remote certificate template URLs are not supported. Please upload the template file."
        );
      }


      if (
        !fs.existsSync(
          resolvedTemplatePath
        )
      ) {
        throw new Error(
          "Certificate template file not found."
        );
      }


      // =================================================
      // PUBLIC VERIFICATION URL
      // =================================================

      const frontendBaseUrl =
        process.env.FRONTEND_URL ||
        process.env.CLIENT_URL ||
        "http://localhost:5173";


      const verifyUrl =
        `${frontendBaseUrl.replace(
          /\/+$/,
          ""
        )}/verify-certificate/${encodeURIComponent(
          id
        )}`;


      // =================================================
      // TEMPLATE EXTENSION
      // =================================================

      const extension =
        path
          .extname(
            resolvedTemplatePath
          )
          .toLowerCase();


      // =================================================
      // CONVERT PDF TEMPLATE TO PNG
      // =================================================

      let finalTemplate =
        resolvedTemplatePath;


      let temporaryTemplateDir =
        null;


      if (
        extension === ".pdf"
      ) {

        temporaryTemplateDir =
          path.join(
            uploadDir,
            `${id}-template`
          );


        if (
          !fs.existsSync(
            temporaryTemplateDir
          )
        ) {
          fs.mkdirSync(
            temporaryTemplateDir,
            {
              recursive: true,
            }
          );
        }


        const outputPrefix =
          path.join(
            temporaryTemplateDir,
            "certificate"
          );


        try {

          execSync(
            `pdftoppm -png -f 1 -singlefile "${resolvedTemplatePath}" "${outputPrefix}"`,
            {
              stdio:
                "pipe",
            }
          );

        } catch (error) {

          console.error(
            "PDF TEMPLATE CONVERSION ERROR:",
            error
          );

          throw new Error(
            "Unable to convert certificate PDF template to image. Make sure pdftoppm is installed on the server."
          );
        }


        finalTemplate =
          `${outputPrefix}.png`;
      }


      // =================================================
      // READ TEMPLATE METADATA
      // =================================================

      const metadata =
        await sharp(
          finalTemplate
        ).metadata();


      const actualWidth =
        Math.round(
          toNumber(
            metadata.width,
            BASE_CANVAS_WIDTH
          )
        );


      const actualHeight =
        Math.round(
          toNumber(
            metadata.height,
            BASE_CANVAS_HEIGHT
          )
        );


      if (
        !actualWidth ||
        !actualHeight
      ) {
        throw new Error(
          "Unable to determine certificate template dimensions."
        );
      }


      // =================================================
      // FIELD CONFIG
      //
      // If fields are not supplied, all common fields
      // remain enabled according to the data available.
      // =================================================

      const enabledFields = {
        studentName:
          fields?.studentName !==
          false,

        courseName:
          fields?.courseName !==
          false,

        marks:
          fields?.marks === true,

        grade:
          fields?.grade === true,

        duration:
          fields?.duration !==
          false,

        attendance:
          fields?.attendance ===
          true,

        performance:
          fields?.performance ===
          true,

        feedback:
          fields?.feedback ===
          true,

        issueDate:
          fields?.issueDate !==
          false,

        certificateId:
          fields?.certificateId !==
          false,

        qrCode:
          fields?.qrCode !==
          false,
      };


      // =================================================
      // POSITION HELPERS
      // =================================================

      const getPosition = (
        field,
        fallback = {}
      ) => {

        return {
          ...(fallback || {}),
          ...(positions?.[field] ||
            {}),
        };
      };


      // =================================================
      // FIELD VALUES
      // =================================================

      const values = {

        studentName:
          normalizeText(
            studentName ||
            "Student"
          ),

        courseName:
          normalizeText(
            courseName ||
            "SkilVira Program"
          ),

        marks:
          normalizeText(
            marks
          ),

        grade:
          normalizeText(
            grade
          ),

        duration:
          normalizeText(
            duration
          ),

        attendance:
          normalizeText(
            attendance
          ),

        performance:
          normalizeText(
            performance
          ),

        feedback:
          normalizeText(
            feedback
          ),

        issueDate:
          formatDate(
            issueDate
          ),

        certificateId:
          normalizeText(
            id
          ),
      };


      // =================================================
      // DEFAULT POSITIONS
      //
      // These preserve the old 1200 x 800 editor
      // coordinate system and are scaled to the actual
      // uploaded template dimensions.
      // =================================================

      const defaultPositions = {

        studentName: {
          x: 600,
          y: 350,
        },

        courseName: {
          x: 600,
          y: 450,
        },

        marks: {
          x: 600,
          y: 500,
        },

        grade: {
          x: 600,
          y: 540,
        },

        duration: {
          x: 600,
          y: 480,
        },

        attendance: {
          x: 600,
          y: 520,
        },

        performance: {
          x: 600,
          y: 560,
        },

        feedback: {
          x: 600,
          y: 610,
        },

        issueDate: {
          x: 160,
          y: 730,
        },

        certificateId: {
          x: 600,
          y: 750,
        },

        qrCode: {
          x: 1030,
          y: 620,
          width: 120,
          height: 120,
        },
      };


      // =================================================
      // TEXT FIELD STYLE
      // =================================================

      const fieldStyles = {

        studentName: {
          fontSize:
            60,
          fontWeight:
            700,
          maxChars:
            32,
          anchor:
            "middle",
        },

        courseName: {
          fontSize:
            42,
          fontWeight:
            500,
          maxChars:
            48,
          anchor:
            "middle",
        },

        marks: {
          fontSize:
            32,
          fontWeight:
            600,
          maxChars:
            28,
          anchor:
            "middle",
        },

        grade: {
          fontSize:
            32,
          fontWeight:
            600,
          maxChars:
            28,
          anchor:
            "middle",
        },

        duration: {
          fontSize:
            28,
          fontWeight:
            500,
          maxChars:
            35,
          anchor:
            "middle",
        },

        attendance: {
          fontSize:
            28,
          fontWeight:
            500,
          maxChars:
            35,
          anchor:
            "middle",
        },

        performance: {
          fontSize:
            28,
          fontWeight:
            500,
          maxChars:
            45,
          anchor:
            "middle",
        },

        feedback: {
          fontSize:
            24,
          fontWeight:
            400,
          maxChars:
            65,
          anchor:
            "middle",
        },

        issueDate: {
          fontSize:
            24,
          fontWeight:
            500,
          maxChars:
            25,
          anchor:
            "middle",
        },

        certificateId: {
          fontSize:
            20,
          fontWeight:
            500,
          maxChars:
            40,
          anchor:
            "middle",
        },
      };


      // =================================================
      // SVG TEXT ELEMENT BUILDER
      // =================================================

      const buildTextElement = (
        field
      ) => {

        if (
          !enabledFields[field]
        ) {
          return "";
        }


        const value =
          values[field];


        if (!value) {
          return "";
        }


        const position =
          getPosition(
            field,
            defaultPositions[field]
          );


        const style =
          fieldStyles[field];


        const x =
          clamp(
            scaleX(
              position.x,
              actualWidth
            ),
            0,
            actualWidth
          );


        const y =
          clamp(
            scaleY(
              position.y,
              actualHeight
            ),
            0,
            actualHeight
          );


        const fontSize =
          Math.max(
            10,
            Math.round(
              scaleSize(
                position.fontSize ??
                  style.fontSize,
                actualWidth,
                actualHeight,
                style.fontSize
              )
            )
          );


        const fontWeight =
          position.fontWeight ??
          style.fontWeight;


        const anchor =
          position.textAnchor ||
          position.anchor ||
          style.anchor ||
          "middle";


        const fill =
          position.color ||
          position.fill ||
          "black";


        const maxChars =
          Math.max(
            10,
            Math.round(
              toNumber(
                position.maxChars,
                style.maxChars
              )
            )
          );


        const lineHeight =
          Math.round(
            fontSize *
            1.25
          );


        const lines =
          wrapText(
            value,
            maxChars
          );


        const safeLines =
          lines.length
            ? lines
            : [value];


        // Single line
        if (
          safeLines.length ===
          1
        ) {

          return `
            <text
              x="${x}"
              y="${y}"
              font-size="${fontSize}"
              font-family="Arial, Helvetica, sans-serif"
              font-weight="${fontWeight}"
              text-anchor="${escapeXml(anchor)}"
              fill="${escapeXml(fill)}"
              dominant-baseline="alphabetic"
            >${escapeXml(
              safeLines[0]
            )}</text>
          `;
        }


        // Multiple lines
        const startY =
          y -
          (
            (safeLines.length -
              1) *
            lineHeight
          ) /
            2;


        const tspans =
          safeLines
            .map(
              (
                line,
                index
              ) => {
                return `
                  <tspan
                    x="${x}"
                    dy="${
                      index === 0
                        ? 0
                        : lineHeight
                    }"
                  >${escapeXml(
                    line
                  )}</tspan>
                `;
              }
            )
            .join("");


        return `
          <text
            x="${x}"
            y="${startY}"
            font-size="${fontSize}"
            font-family="Arial, Helvetica, sans-serif"
            font-weight="${fontWeight}"
            text-anchor="${escapeXml(anchor)}"
            fill="${escapeXml(fill)}"
            dominant-baseline="alphabetic"
          >${tspans}</text>
        `;
      };


      // =================================================
      // SVG TEXT LAYER
      // =================================================

      const textElements = [
        "studentName",
        "courseName",
        "marks",
        "grade",
        "duration",
        "attendance",
        "performance",
        "feedback",
        "issueDate",
        "certificateId",
      ]
        .map(
          buildTextElement
        )
        .join("");


      const svg = `
        <svg
          width="${actualWidth}"
          height="${actualHeight}"
          viewBox="0 0 ${actualWidth} ${actualHeight}"
          xmlns="http://www.w3.org/2000/svg"
        >
          ${textElements}
        </svg>
      `;


      // =================================================
      // QR CONFIGURATION
      //
      // The QR position and size come directly from the
      // certificate template configuration.
      // =================================================

      const qrConfig = {
        ...defaultPositions.qrCode,
        ...(positions?.qrCode ||
          {}),
      };


      const qrX =
        clamp(
          scaleX(
            qrConfig.x,
            actualWidth
          ),
          0,
          actualWidth
        );


      const qrY =
        clamp(
          scaleY(
            qrConfig.y,
            actualHeight
          ),
          0,
          actualHeight
        );


      let qrWidth =
        Math.max(
          40,
          Math.round(
            scaleSize(
              qrConfig.width,
              actualWidth,
              actualHeight,
              120
            )
          )
        );


      let qrHeight =
        Math.max(
          40,
          Math.round(
            scaleSize(
              qrConfig.height,
              actualWidth,
              actualHeight,
              120
            )
          )
        );


      // Prevent QR from extending outside template.
      qrWidth =
        Math.min(
          qrWidth,
          actualWidth -
            Math.round(qrX)
        );


      qrHeight =
        Math.min(
          qrHeight,
          actualHeight -
            Math.round(qrY)
        );


      if (
        qrWidth <= 0 ||
        qrHeight <= 0
      ) {
        throw new Error(
          "Certificate QR position is outside the template boundaries."
        );
      }


      // =================================================
      // QR GENERATION
      // =================================================

      let qrPath =
        null;

      let resizedQrPath =
        null;


      if (
        enabledFields.qrCode
      ) {

        qrPath =
          path.join(
            uploadDir,
            `${id}-qr.png`
          );


        await QRCode.toFile(
          qrPath,
          verifyUrl,
          {
            type:
              "png",

            width:
              Math.max(
                qrWidth,
                qrHeight,
                256
              ),

            margin:
              2,

            errorCorrectionLevel:
              "H",
          }
        );


        resizedQrPath =
          path.join(
            uploadDir,
            `${id}-qr-resized.png`
          );


        await sharp(
          qrPath
        )
          .resize({
            width:
              Math.round(
                qrWidth
              ),

            height:
              Math.round(
                qrHeight
              ),

            fit:
              "fill",

            kernel:
              sharp
                .kernel
                .nearest,
          })
          .png()
          .toFile(
            resizedQrPath
          );
      }


      // =================================================
      // OUTPUT IMAGE
      // =================================================

      const outputImage =
        path.join(
          uploadDir,
          `${id}.png`
        );


      // =================================================
      // COMPOSITE OPERATIONS
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


      if (
        enabledFields.qrCode &&
        resizedQrPath
      ) {

        composites.push({
          input:
            resizedQrPath,

          top:
            Math.round(
              qrY
            ),

          left:
            Math.round(
              qrX
            ),
        });
      }


      // =================================================
      // CREATE CERTIFICATE IMAGE
      // =================================================

      await sharp(
        finalTemplate
      )
        .resize({
          width:
            actualWidth,

          height:
            actualHeight,

          fit:
            "fill",
        })
        .composite(
          composites
        )
        .png()
        .toFile(
          outputImage
        );


      // =================================================
      // OUTPUT PDF
      // =================================================

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
          actualWidth,
          actualHeight,
        ]);


      page.drawImage(
        image,
        {
          x:
            0,

          y:
            0,

          width:
            actualWidth,

          height:
            actualHeight,
        }
      );


      const pdfBytes =
        await pdfDoc.save();


      fs.writeFileSync(
        pdfPath,
        pdfBytes
      );


      // =================================================
      // RETURN
      // =================================================

      return {

        credentialId:
          id,

        certificateFile:
          `/uploads/certificates/${id}.pdf`,

        certificateImage:
          `/uploads/certificates/${id}.png`,

        qrCode:
          enabledFields.qrCode
            ? `/uploads/certificates/${id}-qr.png`
            : "",

        verifyUrl,

        qrPosition: {
          x:
            Math.round(
              qrX
            ),

          y:
            Math.round(
              qrY
            ),

          width:
            Math.round(
              qrWidth
            ),

          height:
            Math.round(
              qrHeight
            ),
        },

        templateDimensions: {
          width:
            actualWidth,

          height:
            actualHeight,
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