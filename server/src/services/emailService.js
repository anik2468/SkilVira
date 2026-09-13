import nodemailer from "nodemailer";
import path from "path";


// =====================================================
// TRANSPORTER
// =====================================================

const createTransporter = () => {

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {

    throw new Error(
      "SMTP email configuration is missing."
    );

  }


  return nodemailer.createTransport({

    host:
      process.env.SMTP_HOST,

    port:
      Number(process.env.SMTP_PORT),

    secure:
      String(
        process.env.SMTP_SECURE
      ).toLowerCase() === "true",

    auth: {

      user:
        process.env.SMTP_USER,

      pass:
        process.env.SMTP_PASS,

    },

  });

};



// =====================================================
// FILE PATH
// =====================================================

const getAbsoluteFilePath = (
  filePath
) => {

  if (!filePath) {
    throw new Error(
      "Attachment file is missing."
    );
  }


  if (
    path.isAbsolute(filePath)
  ) {

    return filePath;

  }


  return path.join(
    process.cwd(),
    filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath
  );

};



// =====================================================
// OFFER LETTER EMAIL
// =====================================================

export const sendOfferLetterEmail = async ({
  to,
  studentName,
  role,
  companyName,
  offerId,
  offerLetterFile,
}) => {

  const transporter =
    createTransporter();


  const filePath =
    getAbsoluteFilePath(
      offerLetterFile
    );


  await transporter.sendMail({

    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to,

    subject:
      `SkilVira Offer Letter - ${offerId}`,

    html: `

      <div style="
        max-width:700px;
        margin:auto;
        padding:30px;
        font-family:Arial,sans-serif;
        border:1px solid #e5e7eb;
        border-radius:16px;
      ">

        <h2 style="
          color:#D4AF37;
        ">
          Congratulations, ${studentName || "Student"}!
        </h2>

        <p>
          Your offer letter has been reviewed and approved by the SkilVira team.
        </p>

        <p>
          <strong>Role:</strong>
          ${role || "Program Participant"}
        </p>

        <p>
          <strong>Company:</strong>
          ${companyName || "SkilVira"}
        </p>

        <p>
          <strong>Offer ID:</strong>
          ${offerId}
        </p>

        <p>
          Please find your approved offer letter attached to this email.
        </p>

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>SkilVira Team</strong>
        </p>

      </div>

    `,

    attachments: [

      {

        filename:
          `${offerId}.pdf`,

        path:
          filePath,

      },

    ],

  });

};



// =====================================================
// CERTIFICATE EMAIL
// =====================================================

export const sendCertificateEmail = async ({
  to,
  studentName,
  courseName,
  certificateId,
  certificateFile,
}) => {

  const transporter =
    createTransporter();


  const filePath =
    getAbsoluteFilePath(
      certificateFile
    );


  await transporter.sendMail({

    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to,

    subject:
      `SkilVira Certificate - ${certificateId}`,

    html: `

      <div style="
        max-width:700px;
        margin:auto;
        padding:30px;
        font-family:Arial,sans-serif;
        border:1px solid #e5e7eb;
        border-radius:16px;
      ">

        <h2 style="
          color:#D4AF37;
        ">
          Congratulations, ${studentName || "Student"}!
        </h2>

        <p>
          Your certificate for
          <strong>
            ${courseName || "your program"}
          </strong>
          has been reviewed and approved by the SkilVira team.
        </p>

        <p>
          <strong>Certificate ID:</strong>
          ${certificateId}
        </p>

        <p>
          Your verified certificate is attached to this email.
        </p>

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>SkilVira Team</strong>
        </p>

      </div>

    `,

    attachments: [

      {

        filename:
          `${certificateId}.pdf`,

        path:
          filePath,

      },

    ],

  });

};



// =====================================================
// REPORT EMAIL
// =====================================================

export const sendReportEmail = async ({
  to,
  studentName,
  courseName,
  reportId,
  reportFile,
}) => {

  const transporter =
    createTransporter();


  const filePath =
    getAbsoluteFilePath(
      reportFile
    );


  await transporter.sendMail({

    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to,

    subject:
      `SkilVira Report - ${reportId}`,

    html: `

      <div style="
        max-width:700px;
        margin:auto;
        padding:30px;
        font-family:Arial,sans-serif;
        border:1px solid #e5e7eb;
        border-radius:16px;
      ">

        <h2 style="
          color:#D4AF37;
        ">
          Your SkilVira Report is Ready
        </h2>

        <p>
          Hello ${studentName || "Student"},
        </p>

        <p>
          Your report for
          <strong>
            ${courseName || "your program"}
          </strong>
          has been reviewed and approved.
        </p>

        <p>
          <strong>Report ID:</strong>
          ${reportId}
        </p>

        <p>
          Your approved report is attached to this email.
        </p>

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>SkilVira Team</strong>
        </p>

      </div>

    `,

    attachments: [

      {

        filename:
          `${reportId}.pdf`,

        path:
          filePath,

      },

    ],

  });

};