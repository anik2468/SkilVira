import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../services/notificationService";


// =====================================================
// HELPERS
// =====================================================

const getNotificationId = (item) => {
  return (
    item?._id ||
    item?.id ||
    ""
  );
};


const getNotificationTitle = (
  item
) => {
  return (
    item?.title ||
    item?.subject ||
    "Notification"
  );
};


const getNotificationMessage = (
  item
) => {
  return (
    item?.message ||
    item?.description ||
    item?.body ||
    "You have a new notification."
  );
};


const getNotificationDate = (
  item
) => {
  const value =
    item?.createdAt ||
    item?.date ||
    item?.updatedAt;

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const isReadNotification = (
  item
) => {
  return (
    item?.isRead === true ||
    item?.read === true ||
    item?.status === "read"
  );
};


// =====================================================
// COMPONENT
// =====================================================

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [processingId, setProcessingId] =
    useState("");

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] =
    useState("");


  // ======================================
  // Load Notifications
  // ======================================

  const loadNotifications = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getNotifications();

      const list =
        response?.notifications ||
        response?.data?.notifications ||
        response?.data ||
        [];

      setNotifications(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "loadNotifications error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadNotifications();
  }, []);


  // ======================================
  // Mark Single Read
  // ======================================

  const handleMarkRead = async (
    notification
  ) => {
    const id =
      getNotificationId(
        notification
      );

    if (
      !id ||
      isReadNotification(
        notification
      )
    ) {
      return;
    }

    try {
      setProcessingId(id);

      await markNotificationRead(
        id
      );

      setNotifications(
        (current) =>
          current.map((item) =>
            getNotificationId(item) ===
            id
              ? {
                  ...item,
                  isRead: true,
                  read: true,
                  status: "read",
                }
              : item
          )
      );
    } catch (err) {
      console.error(
        "mark notification read error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setProcessingId("");
    }
  };


  // ======================================
  // Mark All Read
  // ======================================

  const handleMarkAllRead = async () => {
    if (!notifications.length) {
      return;
    }

    try {
      setMarkingAll(true);

      await markAllNotificationsRead();

      setNotifications(
        (current) =>
          current.map((item) => ({
            ...item,
            isRead: true,
            read: true,
            status: "read",
          }))
      );
    } catch (err) {
      console.error(
        "mark all notifications error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };


  // ======================================
  // Delete
  // ======================================

  const handleDelete = async (
    notification
  ) => {
    const id =
      getNotificationId(
        notification
      );

    if (!id) {
      return;
    }

    try {
      setProcessingId(id);

      await deleteNotification(
        id
      );

      setNotifications(
        (current) =>
          current.filter(
            (item) =>
              getNotificationId(
                item
              ) !== id
          )
      );
    } catch (err) {
      console.error(
        "delete notification error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete notification."
      );
    } finally {
      setProcessingId("");
    }
  };


  // ======================================
  // Open Notification Link
  // ======================================

  const handleNotificationClick =
    async (notification) => {
      await handleMarkRead(
        notification
      );

      const link =
        notification?.link ||
        notification?.url ||
        notification?.actionUrl;

      if (!link) {
        return;
      }

      if (
        link.startsWith("http://") ||
        link.startsWith("https://")
      ) {
        window.location.href =
          link;
        return;
      }

      navigate(link);
    };


  // ======================================
  // Stats
  // ======================================

  const unreadCount =
    notifications.filter(
      (item) =>
        !isReadNotification(item)
    ).length;


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

        <div className="h-5 w-80 max-w-full animate-pulse rounded bg-gray-100" />

        <div className="space-y-3">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-gray-100"
              />
            )
          )}
        </div>
      </div>
    );
  }


  // ======================================
  // UI
  // ======================================

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiBell
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Student Updates
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Stay updated about your courses,
            internships, payments and documents.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              loadNotifications(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520] disabled:opacity-60"
            >
              {markingAll ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <FiCheck />
              )}

              Mark All Read
            </button>
          )}
        </div>
      </div>


      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiBell />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Notifications
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <FiInfo />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Unread
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}


      {/* Empty */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 sm:p-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiBell size={36} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            No Notifications Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Important updates about your SkilVira
            activities will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(
            (notification) => {
              const id =
                getNotificationId(
                  notification
                );

              const read =
                isReadNotification(
                  notification
                );

              const processing =
                processingId === id;

              return (
                <article
                  key={id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                    read
                      ? "border-gray-100"
                      : "border-[#D4AF37]/30 bg-[#D4AF37]/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        read
                          ? "bg-gray-100 text-gray-500"
                          : "bg-[#D4AF37] text-white"
                      }`}
                    >
                      {read ? (
                        <FiCheckCircle />
                      ) : (
                        <FiBell />
                      )}
                    </div>


                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-gray-900">
                              {getNotificationTitle(
                                notification
                              )}
                            </h2>

                            {!read && (
                              <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                New
                              </span>
                            )}
                          </div>

                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                            {getNotificationMessage(
                              notification
                            )}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-gray-400">
                          {getNotificationDate(
                            notification
                          )}
                        </span>
                      </div>


                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {(notification?.link ||
                          notification?.url ||
                          notification?.actionUrl) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37]/10 px-3 py-2 text-xs font-bold text-[#8B6E12] transition hover:bg-[#D4AF37]/20"
                          >
                            Open
                            <FiArrowRight />
                          </button>
                        )}

                        {!read && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkRead(
                                notification
                              )
                            }
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:opacity-50"
                          >
                            <FiCheck />
                            Mark Read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              notification
                            )
                          }
                          disabled={processing}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        >
                          {processing ? (
                            <FiRefreshCw className="animate-spin" />
                          ) : (
                            <FiTrash2 />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};


export default Notifications;