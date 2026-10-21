import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";

const getUserRole = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const role = String(user?.role || "")
      .toLowerCase();

    if (["admin", "superadmin", "super_admin"].includes(role)) {
      return "control";
    }

    return role;
  } catch {
    return "";
  }
};

const getRoleRoot = (role) => ({
  student: "/student",
  recruiter: "/recruiter",
  employee: "/employee",
  ambassador: "/ambassador",
  control: "/control",
}[role] || "");

const NotificationBell = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      const payload = response?.data;

      const list =
        payload?.notifications ||
        payload?.data?.notifications ||
        payload?.data ||
        [];

      setNotifications(
        Array.isArray(list) ? list : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error?.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error?.response?.data || error.message
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);

      await api.put("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error?.response?.data || error.message
      );
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    if (!notification.isRead && notification._id) {
      await markAsRead(notification._id);
    }

    setOpen(false);

    const rawLink =
      notification.link ||
      notification.url ||
      notification.actionUrl;

    if (typeof rawLink !== "string" || !rawLink.trim()) {
      return;
    }

    try {
      const destination = new URL(
        rawLink,
        window.location.origin
      );

      // Do not reload the app or navigate to external websites.
      if (destination.origin !== window.location.origin) {
        console.warn("Ignored external notification URL.");
        return;
      }

      const roleRoot = getRoleRoot(getUserRole());

      const path =
        destination.pathname +
        destination.search +
        destination.hash;

      if (
        !roleRoot ||
        path === "/" ||
        /^\/(login|register)(\/|$)/.test(destination.pathname)
      ) {
        return;
      }

      if (
        destination.pathname !== roleRoot &&
        !destination.pathname.startsWith(`${roleRoot}/`)
      ) {
        console.warn("Ignored notification for another role.");
        return;
      }

      navigate(path);
    } catch (error) {
      console.warn("Invalid notification link ignored:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "";
    }

    return value.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-white text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
        aria-label="Notifications"
      >
        <FiBell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-[100] w-[min(360px,90vw)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
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
                notifications.map((notification) => (
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
                          handleNotificationClick(notification)
                        }
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="font-semibold text-gray-900">
                          {notification.title || "Notification"}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-gray-600">
                          {notification.message || ""}
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                          {formatDate(notification.createdAt)}
                        </p>
                      </button>

                      <div className="flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(notification._id)
                            }
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#B28A10]"
                            title="Mark as read"
                          >
                            <FiCheck size={15} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteNotification(notification._id)
                          }
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;