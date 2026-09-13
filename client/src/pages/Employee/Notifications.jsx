import { useEffect, useState } from "react";
import {
  FiBell,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiAlertCircle,
  FiChevronRight,
} from "react-icons/fi";

import api from "../../services/api";

const Notifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

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

      const response = await api.get(
        "/notifications"
      );

      const data =
        response?.data || {};

      setNotifications(
        Array.isArray(
          data?.notifications
        )
          ? data.notifications
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (err) {
      console.error(
        "Load employee notifications error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id) => {
    if (!id) {
      return;
    }

    try {
      await api.put(
        `/notifications/${id}/read`
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item?._id === id
            ? {
                ...item,
                read: true,
                isRead: true,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Mark notification read error:",
        err
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      setError("");

      await api.put(
        "/notifications/read-all"
      );

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          read: true,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error(
        "Mark all notifications read error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to mark all notifications as read."
      );
    }
  };

  const unreadCount =
    notifications.filter(
      (item) =>
        !item?.read &&
        !item?.isRead
    ).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiBell size={13} />
              Operations Center
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Stay updated with important SkilVira operational alerts,
              approvals and platform activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadNotifications(true)
            }
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="All Notifications"
          value={notifications.length}
          icon={<FiBell size={20} />}
        />

        <SummaryCard
          label="Unread"
          value={unreadCount}
          icon={<FiClock size={20} />}
        />

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Notification Center
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {unreadCount > 0
                  ? "Attention Required"
                  : "All Caught Up"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              {unreadCount > 0 ? (
                <FiAlertCircle
                  size={21}
                />
              ) : (
                <FiCheckCircle
                  size={21}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Notification list */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Important updates related to your employee activities.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/5"
            >
              <FiCheckCircle size={16} />
              Mark All Read
            </button>
          )}
        </div>

        {loading ? (
          <LoadingState />
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(
              (notification) => (
                <NotificationItem
                  key={
                    notification?._id ||
                    notification?.id ||
                    `${notification?.title}-${notification?.createdAt}`
                  }
                  notification={
                    notification
                  }
                  onRead={markAsRead}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};


// =====================================================
// NOTIFICATION ITEM
// =====================================================

const NotificationItem = ({
  notification,
  onRead,
}) => {
  const isRead =
    Boolean(
      notification?.read ||
        notification?.isRead
    );

  const type = String(
    notification?.type ||
      notification?.category ||
      "info"
  ).toLowerCase();

  const createdAt =
    notification?.createdAt ||
    notification?.date;

  const title =
    notification?.title ||
    notification?.subject ||
    "Notification";

  const message =
    notification?.message ||
    notification?.body ||
    notification?.description ||
    "";

  return (
    <div
      className={`group p-5 transition hover:bg-gray-50 sm:p-6 ${
        !isRead
          ? "bg-[#D4AF37]/[0.03]"
          : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <NotificationIcon
          type={type}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {title}
                </h3>

                {!isRead && (
                  <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9B7D12]">
                    New
                  </span>
                )}
              </div>

              {message && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {message}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {createdAt && (
                <span className="text-xs text-gray-400">
                  {formatDate(
                    createdAt
                  )}
                </span>
              )}

              {!isRead &&
                notification?._id && (
                  <button
                    type="button"
                    onClick={() =>
                      onRead(
                        notification._id
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#D4AF37] opacity-100 transition hover:bg-[#D4AF37]/10"
                  >
                    <FiCheckCircle
                      size={13}
                    />
                    Read
                  </button>
                )}
            </div>
          </div>

          {notification?.link && (
            <a
              href={notification.link}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition hover:text-[#9B7D12]"
            >
              View Details
              <FiChevronRight
                size={14}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


// =====================================================
// NOTIFICATION ICON
// =====================================================

const NotificationIcon = ({
  type,
}) => {
  if (
    type.includes("success") ||
    type.includes("approved") ||
    type.includes("approval")
  ) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <FiCheckCircle
          size={21}
        />
      </div>
    );
  }

  if (
    type.includes("warning") ||
    type.includes("pending")
  ) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <FiClock size={21} />
      </div>
    );
  }

  if (
    type.includes("error") ||
    type.includes("rejected") ||
    type.includes("danger")
  ) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <FiAlertCircle
          size={21}
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
      <FiInfo size={21} />
    </div>
  );
};


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <FiBell
          size={16}
          className="text-gray-300"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// LOADING
// =====================================================

const LoadingState = () => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
          <FiRefreshCw
            size={18}
            className="text-[#D4AF37]"
          />
        </div>

        <p className="mt-4 font-semibold text-gray-900">
          Loading notifications...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching your latest updates.
        </p>
      </div>
    </div>
  );
};


// =====================================================
// EMPTY
// =====================================================

const EmptyState = () => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <FiBell size={25} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No notifications yet
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Important operational updates will appear here when available.
        </p>
      </div>
    </div>
  );
};


// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (date) => {
  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "-";
  }
};

export default Notifications;