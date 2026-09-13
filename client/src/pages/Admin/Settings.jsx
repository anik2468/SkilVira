import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiGlobe,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiSave,
  FiServer,
  FiShield,
  FiSmartphone,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

const GOLD = "#D4AF37";

const DEFAULT_SETTINGS = {
  platformName: "SkilVira",
  maintenance: false,
  emailNotification: true,
  smsNotification: false,
  allowRegistration: true,
};

const Settings = () => {
  const [settings, setSettings] =
    useState(
      DEFAULT_SETTINGS
    );

  const [saved, setSaved] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("platform");

  useEffect(() => {
    try {
      const savedSettings =
        localStorage.getItem(
          "adminSettings"
        );

      if (savedSettings) {
        const parsed =
          JSON.parse(
            savedSettings
          );

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        "ADMIN SETTINGS LOAD ERROR:",
        error
      );
    }
  }, []);

  const changeHandler = (
    e
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "adminSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const resetSettings = () => {
    const confirmed =
      window.confirm(
        "Reset all admin settings to their default values?"
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "adminSettings"
    );

    setSettings(
      DEFAULT_SETTINGS
    );

    setSaved(false);
  };

  const sections = [
    {
      id: "platform",
      label: "Platform",
      icon: <FiGlobe />,
    },
    {
      id: "security",
      label: "Security & Access",
      icon: <FiShield />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiServer
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Platform Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Admin Settings
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Configure the platform identity, account access and
                communication preferences from the central administration
                panel.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor:
                    GOLD,
                }}
              >
                <FiServer size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* STATUS */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatusTile
            icon={<FiGlobe />}
            label="Platform"
            value={
              settings.platformName ||
              "SkilVira"
            }
            description="Current platform identity."
          />

          <StatusTile
            icon={<FiUsers />}
            label="Registration"
            value={
              settings.allowRegistration
                ? "Open"
                : "Restricted"
            }
            description="New account registration state."
          />

          <StatusTile
            icon={<FiServer />}
            label="System Mode"
            value={
              settings.maintenance
                ? "Maintenance"
                : "Live"
            }
            description="Current platform operating mode."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">

          {/* NAV */}
          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
              Configuration
            </p>

            <div className="space-y-1">
              {sections.map(
                (section) => (
                  <button
                    key={
                      section.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        section.id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                      activeSection ===
                      section.id
                        ? "text-black"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    style={
                      activeSection ===
                      section.id
                        ? {
                            backgroundColor:
                              `${GOLD}25`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className={
                        activeSection ===
                        section.id
                          ? "text-[#8D7414]"
                          : "text-gray-400"
                      }
                    >
                      {section.icon}
                    </span>

                    {section.label}
                  </button>
                )
              )}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() =>
                  setActiveSection(
                    "danger"
                  )
                }
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black ${
                  activeSection ===
                  "danger"
                    ? "bg-red-50 text-red-700"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <FiTrash2 />
                Danger Zone
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="space-y-6">

            {activeSection ===
              "platform" && (
              <>
                <SettingsSection
                  eyebrow="Platform Identity"
                  title="Platform Configuration"
                  description="Control the basic identity and operational state shown across the administration system."
                  icon={<FiGlobe />}
                >
                  <Field
                    label="Platform Name"
                    name="platformName"
                    value={
                      settings.platformName
                    }
                    onChange={
                      changeHandler
                    }
                    placeholder="SkilVira"
                    icon={<FiGlobe />}
                  />

                  <ToggleRow
                    name="maintenance"
                    checked={
                      settings.maintenance
                    }
                    onChange={
                      changeHandler
                    }
                    title="Maintenance Mode"
                    description="Temporarily indicate that the platform is under maintenance."
                    icon={<FiServer />}
                  />
                </SettingsSection>

                <InfoPanel
                  title="Current Operating State"
                  value={
                    settings.maintenance
                      ? "Maintenance Mode"
                      : "Live Mode"
                  }
                  description={
                    settings.maintenance
                      ? "Platform configuration currently indicates maintenance mode."
                      : "Platform configuration currently indicates normal live operation."
                  }
                />
              </>
            )}

            {activeSection ===
              "security" && (
              <>
                <SettingsSection
                  eyebrow="Access Control"
                  title="Security & Access"
                  description="Manage platform-wide account registration behaviour."
                  icon={<FiShield />}
                >
                  <ToggleRow
                    name="allowRegistration"
                    checked={
                      settings.allowRegistration
                    }
                    onChange={
                      changeHandler
                    }
                    title="Allow New User Registration"
                    description="Permit new users to create accounts on the platform."
                    icon={<FiUsers />}
                  />
                </SettingsSection>

                <InfoPanel
                  title="Access Policy"
                  value={
                    settings.allowRegistration
                      ? "Registration Open"
                      : "Registration Restricted"
                  }
                  description={
                    settings.allowRegistration
                      ? "New registrations are currently allowed."
                      : "New registrations are currently disabled by this setting."
                  }
                />
              </>
            )}

            {activeSection ===
              "notifications" && (
              <>
                <SettingsSection
                  eyebrow="Communication"
                  title="Notification Preferences"
                  description="Configure the communication channels used by the platform settings."
                  icon={<FiBell />}
                >
                  <ToggleRow
                    name="emailNotification"
                    checked={
                      settings.emailNotification
                    }
                    onChange={
                      changeHandler
                    }
                    title="Email Notifications"
                    description="Enable platform email notification preference."
                    icon={<FiMail />}
                  />

                  <ToggleRow
                    name="smsNotification"
                    checked={
                      settings.smsNotification
                    }
                    onChange={
                      changeHandler
                    }
                    title="SMS Notifications"
                    description="Enable SMS notification preference."
                    icon={<FiSmartphone />}
                  />
                </SettingsSection>

                <InfoPanel
                  title="Communication Channels"
                  value={`${[
                    settings.emailNotification
                      ? "Email"
                      : null,
                    settings.smsNotification
                      ? "SMS"
                      : null,
                  ]
                    .filter(Boolean)
                    .join(
                      " + "
                    ) ||
                    "None Enabled"}`}
                  description="Current notification preferences selected above."
                />
              </>
            )}

            {activeSection ===
              "danger" && (
              <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <FiTrash2 />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">
                      Critical Controls
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-gray-950">
                      Danger Zone
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                      Resetting these preferences removes the locally
                      stored admin configuration and restores the default
                      values.
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black text-red-800">
                        Reset Admin Settings
                      </p>

                      <p className="mt-1 text-sm text-red-700/80">
                        Restore the default local configuration.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        resetSettings
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-700"
                    >
                      <FiRefreshCw />
                      Reset Settings
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* SAVE BAR */}
            {activeSection !==
              "danger" && (
              <div className="sticky bottom-5 rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      Configuration changes
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Save after changing any platform preference.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      saveSettings
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    {saved ? (
                      <FiCheck />
                    ) : (
                      <FiSave />
                    )}

                    {saved
                      ? "Settings Saved"
                      : "Save Settings"}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const SettingsSection = ({
  eyebrow,
  title,
  description,
  icon,
  children,
}) => (
  <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex items-start gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>

      <div>
        <p
          className="text-xs font-black uppercase tracking-[0.18em]"
          style={{
            color: GOLD,
          }}
        >
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black text-gray-950">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>

    <div className="mt-7 space-y-5">
      {children}
    </div>
  </section>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
}) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
      <span className="text-gray-400">
        {icon}
      </span>

      {label}
    </label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
    />
  </div>
);

const ToggleRow = ({
  name,
  checked,
  onChange,
  title,
  description,
  icon,
}) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-gray-900">
          {title}
        </p>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>

    <label className="relative inline-flex cursor-pointer items-center self-end sm:self-auto">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      <div
        className="h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-[#D4AF37]"
      />

      <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
    </label>
  </div>
);

const StatusTile = ({
  icon,
  label,
  value,
  description,
}) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-500">
          {label}
        </p>

        <p className="mt-2 text-2xl font-black text-gray-950">
          {value}
        </p>

        <p className="mt-2 text-xs text-gray-400">
          {description}
        </p>
      </div>

      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const InfoPanel = ({
  title,
  value,
  description,
}) => (
  <section className="rounded-3xl border border-gray-200 bg-black p-6 text-white shadow-2xl sm:p-7">
    <p
      className="text-xs font-black uppercase tracking-[0.18em]"
      style={{
        color: GOLD,
      }}
    >
      Configuration Snapshot
    </p>

    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-2xl font-black">
          {title}
        </h3>

        <p className="mt-1 text-3xl font-black text-[#D4AF37]">
          {value}
        </p>
      </div>

      <div className="max-w-xl text-sm leading-6 text-gray-400">
        {description}
      </div>
    </div>
  </section>
);

export default Settings;