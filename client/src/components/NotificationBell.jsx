import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      const data = res?.data;

      const items =
        data?.notifications ||
        data?.data ||
        [];

      setNotifications(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      30000
    );

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const markAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);

      await api.put(
        "/notifications/read-all"
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(
        `/notifications/${id}`
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  };

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification.isRead) {
      await markAsRead(
        notification._id
      );
    }

    if (notification.link) {
      window.location.href =
        notification.link;
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "";
    }

    return value.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-white text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
        aria-label="Notifications"
      >
        <FiBell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
            }}
            className="absolute right-0 top-12 z-[100] w-[360px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Notifications
                </h3>

                <p className="text-xs text-gray-500">
                  {unreadCount} unread
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs font-medium text-[#B28A10] hover:underline disabled:opacity-50"
                >
                  <FiCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[430px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <FiBell
                    size={30}
                    className="mx-auto mb-3 text-gray-300"
                  />

                  <p className="font-medium text-gray-600">
                    No notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    You are all caught up.
                  </p>
                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <div
                      key={notification._id}
                      className={`group border-b border-black/5 px-4 py-3 transition ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-[#D4AF37]/5"
                      }`}
                    >
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-start gap-2">
                            {!notification.isRead && (
                              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#D4AF37]" />
                            )}

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900">
                                {notification.title ||
                                  "Notification"}
                              </p>

                              <p className="mt-1 text-sm leading-5 text-gray-600">
                                {notification.message ||
                                  ""}
                              </p>

                              <p className="mt-2 text-[11px] text-gray-400">
                                {formatDate(
                                  notification.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </button>

                        <div className="flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                          {!notification.isRead && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification._id
                                )
                              }
                              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#B28A10]"
                              title="Mark as read"
                            >
                              <FiCheck
                                size={15}
                              />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification._id
                              )
                            }
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <FiTrash2
                              size={15}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;