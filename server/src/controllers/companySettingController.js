import CompanySetting from "../models/CompanySetting.js";
import { unlink } from "node:fs/promises";

export const getCompanySetting = async (_req, res) => {
  try {
    let setting = await CompanySetting.findOne();
    if (!setting) setting = await CompanySetting.create({});
    return res.status(200).json({ success: true, setting });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCompanySetting = async (req, res) => {
  try {
    let setting = await CompanySetting.findOne();
    if (!setting) setting = new CompanySetting();

    const editableFields = [
      "companyName", "about", "email", "phone", "address", "website",
      "supportEmail", "instagram", "linkedin", "youtube", "facebook",
      "twitter", "mapUrl", "supportHours",
    ];

    for (const field of editableFields) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
        setting[field] = String(req.body[field] ?? "").trim();
      }
    }

    setting.updatedBy = req.user?.id || req.user?._id || null;
    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Company settings updated",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadCompanyAssets = async (req, res) => {
  try {
    const uploaded = Object.values(req.files || {}).flat();
    const oversizedImages = uploaded.filter(
      (file) => file.fieldname !== "brochure" && file.size > 5 * 1024 * 1024
    );

    if (oversizedImages.length) {
      await Promise.all(uploaded.map((file) => unlink(file.path).catch(() => {})));
      return res.status(400).json({
        success: false,
        message: "Logo, QR and gallery images must each be 5 MB or smaller.",
      });
    }

    let setting = await CompanySetting.findOne();
    if (!setting) setting = new CompanySetting();

    if (req.files?.logo?.[0]) {
      setting.logo = `/uploads/${req.files.logo[0].filename}`;
    }

    if (req.files?.qrCode?.[0]) {
      setting.qrCode = `/uploads/${req.files.qrCode[0].filename}`;
    }

    if (req.files?.brochure?.[0]) {
      setting.brochure = `/uploads/${req.files.brochure[0].filename}`;
    }

    if (req.files?.gallery?.length) {
      const newImages = req.files.gallery.map(
        (file) => `/uploads/${file.filename}`
      );
      setting.gallery = [...(setting.gallery || []), ...newImages];
    }

    setting.updatedBy = req.user?.id || req.user?._id || null;
    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Company assets uploaded successfully.",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCompanyGalleryImage = async (req, res) => {
  try {
    const index = Number.parseInt(req.params.index, 10);
    const setting = await CompanySetting.findOne();

    if (!setting || !Number.isInteger(index) || index < 0 ||
        index >= (setting.gallery || []).length) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const gallery = [...setting.gallery];
    gallery.splice(index, 1);
    setting.gallery = gallery;
    setting.updatedBy = req.user?.id || req.user?._id || null;
    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image removed.",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCompanyBrochure = async (req, res) => {
  try {
    const setting = await CompanySetting.findOne();
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Company settings not found.",
      });
    }

    setting.brochure = "";
    setting.updatedBy = req.user?.id || req.user?._id || null;
    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Brochure removed from the website.",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
