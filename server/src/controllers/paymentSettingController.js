import PaymentSetting from "../models/PaymentSetting.js";


// =====================================================
// GET ACTIVE PAYMENT SETTINGS
// Student + Employee
// =====================================================

export const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSetting.findOne({
      isActive: true,
    }).sort({
      updatedAt: -1,
    });

    if (!settings) {
      settings = await PaymentSetting.create({
        isActive: true,
      });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "GET PAYMENT SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment settings.",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE PAYMENT SETTINGS
// EMPLOYEE / CONTROL
// =====================================================

export const updatePaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSetting.findOne({
      isActive: true,
    });

    if (!settings) {
      settings = new PaymentSetting({
        isActive: true,
      });
    }

    const {
      upiId,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branch,
      paymentInstructions,
      isActive,
    } = req.body;


    if (upiId !== undefined) {
      settings.upiId = upiId;
    }

    if (accountHolderName !== undefined) {
      settings.accountHolderName =
        accountHolderName;
    }

    if (accountNumber !== undefined) {
      settings.accountNumber =
        accountNumber;
    }

    if (ifscCode !== undefined) {
      settings.ifscCode =
        ifscCode;
    }

    if (bankName !== undefined) {
      settings.bankName =
        bankName;
    }

    if (branch !== undefined) {
      settings.branch =
        branch;
    }

    if (paymentInstructions !== undefined) {
      settings.paymentInstructions =
        paymentInstructions;
    }

    if (isActive !== undefined) {
      settings.isActive =
        Boolean(isActive);
    }


    settings.updatedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    await settings.save();


    return res.status(200).json({
      success: true,
      message:
        "Payment settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "UPDATE PAYMENT SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update payment settings.",
      error: error.message,
    });
  }
};


// =====================================================
// UPLOAD QR CODE
// =====================================================

export const uploadPaymentQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "QR code image is required.",
      });
    }


    let settings = await PaymentSetting.findOne({
      isActive: true,
    });

    if (!settings) {
      settings = new PaymentSetting({
        isActive: true,
      });
    }


    settings.qrCode =
      `/uploads/${req.file.filename}`;


    settings.updatedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    await settings.save();


    return res.status(200).json({
      success: true,
      message:
        "Payment QR code uploaded successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "UPLOAD PAYMENT QR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload payment QR code.",
      error: error.message,
    });
  }
};


// =====================================================
// REMOVE QR CODE
// =====================================================

export const removePaymentQR = async (req, res) => {
  try {
    const settings =
      await PaymentSetting.findOne({
        isActive: true,
      });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message:
          "Payment settings not found.",
      });
    }


    settings.qrCode = "";


    settings.updatedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    await settings.save();


    return res.status(200).json({
      success: true,
      message:
        "Payment QR code removed successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "REMOVE PAYMENT QR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove payment QR code.",
      error: error.message,
    });
  }
};