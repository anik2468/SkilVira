import Notification from "../models/Notification.js";


// =====================================================
// CREATE NOTIFICATION
// =====================================================

export const createNotification = async ({
  recipient,
  type = "system",
  title,
  message,
  referenceId = null,
  referenceModel = null,
  link = "",
}) => {

  try {

    if (!recipient) {
      throw new Error(
        "Notification recipient is required."
      );
    }


    if (!title) {
      throw new Error(
        "Notification title is required."
      );
    }


    if (!message) {
      throw new Error(
        "Notification message is required."
      );
    }


    const notification =
      await Notification.create({

        recipient,

        type,

        title,

        message,

        referenceId,

        referenceModel,

        link,

      });


    return notification;

  } catch (error) {

    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    throw error;

  }

};



// =====================================================
// EMPLOYEE PAYMENT NOTIFICATION
// =====================================================

export const notifyEmployeePaymentApproval = async ({
  employeeId,
  paymentId,
  studentName,
  purchaseType,
  itemName,
}) => {

  return createNotification({

    recipient: employeeId,

    type: "payment",

    title:
      "Payment Approval Required",

    message:
      `${studentName || "A student"} has purchased ${purchaseType || "a program"}${itemName ? ` - ${itemName}` : ""}. Please review the payment.`,

    referenceId:
      paymentId,

    referenceModel:
      "Payment",

    link:
      "/employee/payments",

  });

};



// =====================================================
// OFFER LETTER NOTIFICATION
// =====================================================

export const notifyEmployeeOfferLetter = async ({
  employeeId,
  offerLetterId,
  studentName,
  itemName,
}) => {

  return createNotification({

    recipient: employeeId,

    type: "offer_letter",

    title:
      "New Offer Letter Review",

    message:
      `Offer letter for ${studentName || "a student"}${itemName ? ` (${itemName})` : ""} is ready for review and approval.`,

    referenceId:
      offerLetterId,

    referenceModel:
      "GeneratedOfferLetter",

    link:
      "/employee/offer-letters",

  });

};



// =====================================================
// CERTIFICATE NOTIFICATION
// =====================================================

export const notifyEmployeeCertificate = async ({
  employeeId,
  certificateId,
  studentName,
  itemName,
}) => {

  return createNotification({

    recipient: employeeId,

    type: "certificate",

    title:
      "New Certificate Review",

    message:
      `Certificate for ${studentName || "a student"}${itemName ? ` (${itemName})` : ""} is ready for review.`,

    referenceId:
      certificateId,

    referenceModel:
      "GeneratedCertificate",

    link:
      "/employee/certificates",

  });

};



// =====================================================
// REPORT NOTIFICATION
// =====================================================

export const notifyEmployeeReport = async ({
  employeeId,
  reportId,
  studentName,
  itemName,
}) => {

  return createNotification({

    recipient: employeeId,

    type: "report",

    title:
      "New Report Review",

    message:
      `Report for ${studentName || "a student"}${itemName ? ` (${itemName})` : ""} is ready for review.`,

    referenceId:
      reportId,

    referenceModel:
      "GeneratedReport",

    link:
      "/employee/reports",

  });

};



// =====================================================
// GENERIC EMPLOYEE NOTIFICATION
// =====================================================

export const notifyEmployee = async ({
  employeeId,
  type,
  title,
  message,
  referenceId = null,
  referenceModel = null,
  link = "",
}) => {

  return createNotification({

    recipient: employeeId,

    type,

    title,

    message,

    referenceId,

    referenceModel,

    link,

  });

};