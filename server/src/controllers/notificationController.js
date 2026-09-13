import Notification from "../models/Notification.js";



// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

export const getMyNotifications = async (
  req,
  res
) => {

  try {

    const notifications =
      await Notification.find({

        recipient:
          req.user.id,

        isDeleted:
          false,

      })
        .sort({
          createdAt: -1,
        })
        .limit(100);


    return res.status(200).json({

      success: true,

      count:
        notifications.length,

      unreadCount:
        notifications.filter(
          (item) => !item.isRead
        ).length,

      notifications,

    });

  } catch (error) {

    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch notifications.",

      error:
        error.message,

    });

  }

};



// =====================================================
// MARK SINGLE AS READ
// =====================================================

export const markNotificationAsRead = async (
  req,
  res
) => {

  try {

    const notification =
      await Notification.findOneAndUpdate(

        {
          _id:
            req.params.id,

          recipient:
            req.user.id,

          isDeleted:
            false,
        },

        {
          isRead:
            true,

          readAt:
            new Date(),
        },

        {
          new: true,
        }

      );


    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found.",

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Notification marked as read.",

      notification,

    });

  } catch (error) {

    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update notification.",

      error:
        error.message,

    });

  }

};



// =====================================================
// MARK ALL AS READ
// =====================================================

export const markAllNotificationsAsRead = async (
  req,
  res
) => {

  try {

    await Notification.updateMany(

      {
        recipient:
          req.user.id,

        isRead:
          false,

        isDeleted:
          false,
      },

      {
        isRead:
          true,

        readAt:
          new Date(),
      }

    );


    return res.status(200).json({

      success: true,

      message:
        "All notifications marked as read.",

    });

  } catch (error) {

    console.error(
      "MARK ALL NOTIFICATIONS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update notifications.",

      error:
        error.message,

    });

  }

};



// =====================================================
// DELETE NOTIFICATION
// =====================================================

export const deleteNotification = async (
  req,
  res
) => {

  try {

    const notification =
      await Notification.findOneAndUpdate(

        {
          _id:
            req.params.id,

          recipient:
            req.user.id,
        },

        {
          isDeleted:
            true,
        },

        {
          new: true,
        }

      );


    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found.",

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Notification deleted.",

    });

  } catch (error) {

    console.error(
      "DELETE NOTIFICATION ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to delete notification.",

      error:
        error.message,

    });

  }

};