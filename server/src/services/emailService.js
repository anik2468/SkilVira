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


// =====================================================
// PASSWORD RESET EMAIL
// =====================================================

export const sendPasswordResetEmail = async ({
  to,
  resetURL,
}) => {
  if (!to || !resetURL) {
    throw new Error("Recipient and reset URL are required.");
  }

  const transporter = createTransporter();

  const safeResetURL = String(resetURL)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Reset your SkilVira password",
    text: `You requested a SkilVira password reset.

Reset your password using this link:
${resetURL}

This link expires in 15 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="max-width:600px;margin:auto;padding:28px;font-family:Arial,sans-serif;color:#1f2937;border:1px solid #e5e7eb;border-radius:14px;">
        <h2 style="color:#b58b19;">SkilVira Password Reset</h2>
        <p>We received a request to reset your SkilVira account password.</p>
        <p>
          <a href="${safeResetURL}"
             style="display:inline-block;padding:13px 22px;background:#D4AF37;color:#111827;text-decoration:none;border-radius:8px;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p>This link expires in <strong>15 minutes</strong>.</p>
        <p>If you did not request this password reset, you can safely ignore this email.</p>
        <p style="color:#6b7280;font-size:12px;">SkilVira Security Team</p>
      </div>
    `,
  });
};
