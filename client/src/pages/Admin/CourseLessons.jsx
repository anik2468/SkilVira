import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiList,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiVideo,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  createLesson,
  getCourseLessons,
} from "../../services/lessonService";
import api from "../../services/api";

const GOLD = "#D4AF37";

const CourseLessons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const liveClassBasePath = location.pathname.startsWith("/admin")
    ? "/admin/live-class/"
    : location.pathname.startsWith("/control")
      ? "/control/live-class/"
      : "/employee/live-class/";

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    notesUrl: "",
    duration: "",
    order: 0,
  });

  const [videoSource, setVideoSource] = useState("link");
  const [videoFile, setVideoFile] = useState(null);
  const [videoInputKey, setVideoInputKey] = useState(0);
  const [notesFile, setNotesFile] = useState(null);
  const [notesInputKey, setNotesInputKey] = useState(0);

  const [liveClasses, setLiveClasses] = useState([]);
  const [liveClassTitle, setLiveClassTitle] = useState("");
  const [liveClassDescription, setLiveClassDescription] = useState("");
  const [liveClassScheduledAt, setLiveClassScheduledAt] = useState("");
  const [liveClassDuration, setLiveClassDuration] = useState(60);
  const [liveClassSubmitting, setLiveClassSubmitting] = useState(false);
  const [liveClassError, setLiveClassError] = useState("");
  const [liveClassMessage, setLiveClassMessage] = useState("");


  const [assessmentForm, setAssessmentForm] = useState({
    lessonId: "",
    title: "",
    type: "quiz",
    description: "",
    durationMinutes: 15,
    negativeMarking: 0,
    maxAttempts: 1,
    totalMarks: 10,
  });
  const [assessmentQuestions, setAssessmentQuestions] = useState([
    {
      prompt: "",
      type: "mcq",
      optionsText: "Option A\\nOption B\\nOption C\\nOption D",
      correctAnswersText: "",
      marks: 1,
    },
  ]);
  const [assessmentSaving, setAssessmentSaving] = useState(false);


  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      loadLessons();
    }
  }, [id]);

  const loadLessons = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getCourseLessons(id);

      const list =
        data?.lessons ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      const safeList = Array.isArray(list)
        ? list
        : [];

      safeList.sort(
        (a, b) =>
          Number(a?.order || 0) -
          Number(b?.order || 0)
      );

      setLessons(safeList);
    } catch (err) {
      console.error(
        "COURSE LESSONS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load course lessons."
      );

      setLessons([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  const loadLiveClasses = async () => {
    try {
      const { data } = await api.get(`/live-classes/course/${id}`);
      setLiveClasses(Array.isArray(data?.classes) ? data.classes : []);
      setLiveClassError("");
    } catch (err) {
      setLiveClasses([]);
      setLiveClassError(
        err?.response?.data?.message ||
        "Unable to load live classes for this course."
      );
    }
  };

  useEffect(() => {
    if (id) loadLiveClasses();
  }, [id]);

  const submitLiveClass = async () => {
    if (!liveClassTitle.trim() || !liveClassScheduledAt) {
      setLiveClassError("Enter a class title and date/time.");
      return;
    }

    const scheduledDate = new Date(liveClassScheduledAt);
    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      setLiveClassError("Choose a future date and time.");
      return;
    }

    try {
      setLiveClassSubmitting(true);
      setLiveClassError("");
      setLiveClassMessage("");

      const { data } = await api.post(`/live-classes/course/${id}`, {
        title: liveClassTitle.trim(),
        description: liveClassDescription.trim(),
        scheduledAt: scheduledDate.toISOString(),
        durationMinutes: Number(liveClassDuration),
      });

      if (!data?.success) {
        throw new Error(data?.message || "Unable to schedule live class.");
      }

      setLiveClassTitle("");
      setLiveClassDescription("");
      setLiveClassScheduledAt("");
      setLiveClassDuration(60);
      setLiveClassMessage("Live class scheduled successfully.");
      await loadLiveClasses();
    } catch (err) {
      setLiveClassError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to schedule live class."
      );
    } finally {
      setLiveClassSubmitting(false);
    }
  };

  const openLiveClass = async (liveClass) => {
    try {
      setLiveClassError("");
      if (liveClass.status === "scheduled") {
        const { data } = await api.post(`/live-classes/${liveClass._id}/start`);
        if (!data?.success) {
          throw new Error(data?.message || "Unable to start class.");
        }
      } else if (liveClass.status !== "live") {
        return;
      }

      navigate(`${liveClassBasePath}${liveClass._id}`);
    } catch (err) {
      setLiveClassError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to open live classroom."
      );
      await loadLiveClasses();
    }
  };

  const submitLesson = async () => {
    if (!form.title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    if (!String(form.notesUrl || "").trim() && !notesFile) {
      setError("Upload a notes PDF or provide a Notes URL.");
      return;
    }

    if (videoSource === "upload" && !videoFile) {
      setError("Choose a video file or select No Video.");
      return;
    }

    if (!id) {
      setError("Course ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      let uploadedVideoUrl = "";

      if (videoSource === "link") {
        uploadedVideoUrl = form.videoUrl.trim();
      } else if (videoSource === "upload" && videoFile) {
        const videoData = new FormData();
        videoData.append("video", videoFile);

        const { data: uploadResult } = await api.post(
          "/upload/course-video",
          videoData
        );

        uploadedVideoUrl = uploadResult?.url || "";

        if (!uploadedVideoUrl) {
          throw new Error("Video upload did not return a file URL.");
        }
      }

      let uploadedNotesUrl = String(form.notesUrl || "").trim();

      if (notesFile) {
        const notesData = new FormData();
        notesData.append("pdf", notesFile);

        const { data: notesUploadResult } = await api.post(
          "/upload/course-notes",
          notesData
        );

        uploadedNotesUrl = notesUploadResult?.url || "";

        if (!uploadedNotesUrl) {
          throw new Error("Notes PDF upload did not return a URL.");
        }
      }

      await createLesson({
        title: form.title.trim(),
        description:
          form.description.trim(),
        videoUrl: uploadedVideoUrl,
        notesUrl: uploadedNotesUrl,
        duration:
          form.duration.trim(),
        course: id,
        order: Number(form.order || 0),
      });

      setForm({
        title: "",
        description: "",
        videoUrl: "",
        notesUrl: "",
        duration: "",
        order:
          lessons.length + 1,
      });

      setVideoFile(null);
      setNotesFile(null);
      setNotesInputKey((value) => value + 1);
      setVideoSource("link");
      setVideoInputKey((value) => value + 1);

      setSuccess(
        "Lesson added successfully."
      );

      await loadLessons();

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "CREATE LESSON ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create lesson."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const submitAssessment = async () => {
    const lessonId = assessmentForm.lessonId;
    const title = assessmentForm.title.trim();

    if (!lessonId || !title) {
      setError("Select a lesson and enter an assessment title.");
      return;
    }

    if (assessmentForm.type === "assignment") {
      const totalMarks = Number(assessmentForm.totalMarks);
      if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
        setError("Assignment total marks must be greater than zero.");
        return;
      }
    }

    let questions = [];
    let calculatedTotal = 0;

    if (assessmentForm.type !== "assignment") {
      questions = assessmentQuestions.map((question) => {
        const options = question.type === "fill_blank"
          ? []
          : String(question.optionsText || "")
              .split(/\r?\n/)
              .map((item) => item.trim())
              .filter(Boolean);

        const rawCorrectAnswers = String(question.correctAnswersText || "")
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean);

        // Accept option text or its 1-based number: 1, 2, 3...
        const correctAnswers = rawCorrectAnswers.map((answer) => {
          if (/^\d+$/.test(answer)) {
            const index = Number(answer) - 1;
            if (index >= 0 && options[index] !== undefined) {
              return options[index];
            }
          }
          return answer;
        });

        const marks = Number(question.marks);
        calculatedTotal += Number.isFinite(marks) ? marks : 0;

        return {
          prompt: question.prompt.trim(),
          type: question.type,
          options,
          correctAnswers,
          marks,
        };
      });

      const invalidQuestion = questions.some((question) =>
        !question.prompt ||
        !question.correctAnswers.length ||
        !Number.isFinite(question.marks) ||
        question.marks <= 0 ||
        (question.type === "mcq" &&
          (question.options.length < 2 || question.correctAnswers.length !== 1)) ||
        (question.type === "multiple_select" &&
          (question.options.length < 2 ||
            question.correctAnswers.some((answer) => !question.options.includes(answer)))) ||
        (question.type === "mcq" &&
          !question.options.includes(question.correctAnswers[0]))
      );

      if (invalidQuestion) {
        setError(
          "Check every question: add question text, valid options, correct answer(s), and positive marks."
        );
        return;
      }
    }

    const payload = {
      title,
      type: assessmentForm.type,
      description: assessmentForm.description.trim(),
      durationMinutes: Number(assessmentForm.durationMinutes) || 0,
      negativeMarking: Number(assessmentForm.negativeMarking) || 0,
      maxAttempts: Number(assessmentForm.maxAttempts) || 1,
      totalMarks: assessmentForm.type === "assignment"
        ? Number(assessmentForm.totalMarks)
        : calculatedTotal,
      questions,
    };

    try {
      setAssessmentSaving(true);
      setError("");
      setSuccess("");

      const { data } = await api.post(
        `/lessons/${lessonId}/assessments`,
        payload
      );

      setSuccess(data?.message || "Assessment created successfully.");
      setAssessmentForm((previous) => ({
        ...previous,
        title: "",
        description: "",
        type: "quiz",
        totalMarks: 10,
      }));
      setAssessmentQuestions([
        {
          prompt: "",
          type: "mcq",
          optionsText: "Option A\\\\nOption B\\\\nOption C\\\\nOption D",
          correctAnswersText: "",
          marks: 1,
        },
      ]);

      await loadLessons(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create assessment."
      );
    } finally {
      setAssessmentSaving(false);
    }
  };

  const filteredLessons = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return lessons;

    return lessons.filter((lesson) => {
      const text = [
        lesson?.title,
        lesson?.description,
        lesson?.duration,
        lesson?.order,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [lessons, search]);

  const totalDuration = useMemo(() => {
    return lessons.reduce(
      (total, lesson) => {
        const duration =
          lesson?.duration;

        const number =
          parseFloat(duration);

        return Number.isFinite(number)
          ? total + number
          : total;
      },
      0
    );
  }, [lessons]);

  if (loading) {
    return <CourseLessonsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
            >
              <FiArrowLeft />
              Back to Courses
            </button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <FiBookOpen
                    size={14}
                    style={{ color: GOLD }}
                  />

                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                    Course Content Studio
                  </span>
                </div>

                <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                  Course Lessons
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Build the learning journey for this course by adding
                  structured video lessons, notes and ordered modules.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadLessons(true)
                }
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
              >
                <FiRefreshCw
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
          </div>
        </section>


        {/* LIVE CLASS STUDIO */}
        <section className="space-y-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9B7B16]">
                Interactive classroom
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">
                Live Class Studio
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Schedule an online class, teach inside SkilVira, interact with students
                through live chat, and launch MCQ quizzes during the session.
              </p>
            </div>
            <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1.5 text-xs font-bold text-[#80620D]">
              LiveKit Classroom
            </span>
          </div>

          {liveClassError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {liveClassError}
            </div>
          )}
          {liveClassMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {liveClassMessage}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-sm font-semibold text-gray-800">
              Class title
              <input
                value={liveClassTitle}
                onChange={(event) => setLiveClassTitle(event.target.value)}
                maxLength={160}
                placeholder="e.g. React Hooks — Live Session"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#D4AF37]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-gray-800">
              Date and time
              <input
                type="datetime-local"
                value={liveClassScheduledAt}
                onChange={(event) => setLiveClassScheduledAt(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#D4AF37]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-gray-800">
              Duration
              <select
                value={liveClassDuration}
                onChange={(event) => setLiveClassDuration(Number(event.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#D4AF37]"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-gray-800">
              Description (optional)
              <input
                value={liveClassDescription}
                onChange={(event) => setLiveClassDescription(event.target.value)}
                maxLength={2000}
                placeholder="Topics covered in the session"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#D4AF37]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={submitLiveClass}
            disabled={liveClassSubmitting}
            className="rounded-xl bg-[#D4AF37] px-5 py-3 font-black text-gray-950 transition hover:bg-[#c6a027] disabled:opacity-60"
          >
            {liveClassSubmitting ? "Scheduling..." : "Schedule Live Class"}
          </button>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-lg font-black text-gray-950">Scheduled Sessions</h3>
            {liveClasses.length === 0 ? (
              <p className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                No live classes scheduled for this course yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {liveClasses.map((liveClass) => (
                  <div
                    key={liveClass._id}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-gray-950">{liveClass.title}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(liveClass.scheduledAt).toLocaleString()} · {liveClass.durationMinutes} min
                      </p>
                      <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        liveClass.status === "live"
                          ? "bg-red-100 text-red-700"
                          : liveClass.status === "ended"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-50 text-blue-700"
                      }`}>
                        {liveClass.status === "live" ? "LIVE NOW" : liveClass.status.toUpperCase()}
                      </span>
                    </div>
                    {liveClass.status !== "ended" && (
                      <button
                        type="button"
                        onClick={() => openLiveClass(liveClass)}
                        className="shrink-0 rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800"
                      >
                        {liveClass.status === "live" ? "Open Classroom" : "Start & Open Classroom"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={loadLiveClasses}
              className="mt-3 text-sm font-semibold text-[#80620D] hover:underline"
            >
              Refresh sessions
            </button>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total Lessons"
            value={lessons.length}
            icon={<FiList />}
            tone="gold"
          />

          <MetricCard
            label="Video Lessons"
            value={
              lessons.filter(
                (lesson) =>
                  Boolean(
                    lesson?.videoUrl
                  )
              ).length
            }
            icon={<FiVideo />}
            tone="blue"
          />

          <MetricCard
            label="Notes Available"
            value={
              lessons.filter(
                (lesson) =>
                  Boolean(
                    lesson?.notesUrl
                  )
              ).length
            }
            icon={<FiFileText />}
            tone="green"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">

          {/* CREATE */}
          <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Lesson Builder
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Add New Lesson
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add the next learning unit to this course.
              </p>
            </div>

            <div className="space-y-4">
              <Field
                label="Lesson Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to JavaScript"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe what students will learn..."
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800">
                  Video (optional)
                </label>

                <select
                  value={videoSource}
                  onChange={(event) => setVideoSource(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="link">YouTube / video link</option>
                  <option value="upload">Upload video file</option>
                  <option value="none">No video</option>
                </select>

                {videoSource === "link" && (
                  <Field
                    label="Video URL"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    placeholder="Paste YouTube or supported video URL"
                    icon={<FiVideo />}
                  />
                )}

                {videoSource === "upload" && (
                  <div className="space-y-2">
                    <input
                      key={videoInputKey}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(event) =>
                        setVideoFile(event.target.files?.[0] || null)
                      }
                      className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      MP4, WEBM or MOV · Maximum 500 MB
                    </p>
                    {videoFile && (
                      <p className="text-sm text-green-700">
                        Selected: {videoFile.name}
                      </p>
                    )}
                  </div>
                )}

                {videoSource === "none" && (
                  <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                    This lesson will contain notes without a video.
                  </p>
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800">
                    Notes PDF
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a PDF for students to read. PDF only · Maximum 50 MB.
                  </p>
                </div>

                <input
                  key={notesInputKey}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;

                    if (file && file.size > 50 * 1024 * 1024) {
                      setError("Notes PDF must be 50 MB or smaller.");
                      setNotesFile(null);
                      event.target.value = "";
                      return;
                    }

                    if (file && !/\.pdf$/i.test(file.name)) {
                      setError("Please select a PDF file.");
                      setNotesFile(null);
                      event.target.value = "";
                      return;
                    }

                    setError("");
                    setNotesFile(file);
                  }}
                  className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm"
                />

                {notesFile && (
                  <p className="text-sm font-medium text-green-700">
                    Selected: {notesFile.name} · {(notesFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <p className="mb-2 text-xs font-bold text-gray-500">
                    Or use an existing Notes / resource URL
                  </p>
                  <Field
                    label="Notes URL"
                    name="notesUrl"
                    value={form.notesUrl}
                    onChange={handleChange}
                    placeholder="https://... (optional when PDF is uploaded)"
                    icon={<FiFileText />}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 25 min"
                  icon={<FiClock />}
                />

                <Field
                  label="Lesson Order"
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>

              <button
                type="button"
                onClick={submitLesson}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiPlus />

                {submitting
                  ? "Adding Lesson..."
                  : "Add Lesson"}
              </button>
            </div>
          </section>

          {/* LIST */}
          <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Curriculum
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Lesson Library
                </h2>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <FiSearch
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search lessons..."
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {filteredLessons.length ===
            0 ? (
              <EmptyLessons
                hasSearch={Boolean(
                  search.trim()
                )}
              />
            ) : (
              <div className="space-y-3">
                {filteredLessons.map(
                  (lesson, index) => (
                    <LessonCard
                      key={
                        lesson?._id ||
                        index
                      }
                      lesson={lesson}
                    />
                  )
                )}
              </div>
            )}

            {lessons.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#FAFAF8] p-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Curriculum summary
                  </p>

                  <p className="mt-1 text-sm font-black text-gray-800">
                    {lessons.length} lessons
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-400">
                    Numeric duration total
                  </p>

                  <p className="mt-1 text-sm font-black text-gray-800">
                    {totalDuration || 0}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ASSESSMENT BUILDER */}
        <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: GOLD }}>
              Assessment Builder
            </p>
            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Create Assignment, Quiz or Test
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add questions, answer keys and marks to a lesson.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">Lesson</label>
              <select
                value={assessmentForm.lessonId}
                onChange={(event) => setAssessmentForm((p) => ({ ...p, lessonId: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                required
              >
                <option value="">Select lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">Assessment Type</label>
              <select
                value={assessmentForm.type}
                onChange={(event) => setAssessmentForm((p) => ({ ...p, type: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              >
                <option value="assignment">Assignment</option>
                <option value="dpp">DPP / Daily Practice Problems</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test / Exam</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">Title</label>
              <input
                value={assessmentForm.title}
                onChange={(event) => setAssessmentForm((p) => ({ ...p, title: event.target.value }))}
                placeholder="e.g. HTML Basics Quiz"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </div>

            {assessmentForm.type === "assignment" && (
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">Total Marks</label>
                <input
                  type="number"
                  min="1"
                  value={assessmentForm.totalMarks}
                  onChange={(event) => setAssessmentForm((p) => ({ ...p, totalMarks: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">Duration (minutes)</label>
              <input
                type="number"
                min="0"
                value={assessmentForm.durationMinutes}
                onChange={(event) => setAssessmentForm((p) => ({ ...p, durationMinutes: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">Maximum Attempts</label>
              <input
                type="number"
                min="1"
                value={assessmentForm.maxAttempts}
                onChange={(event) => setAssessmentForm((p) => ({ ...p, maxAttempts: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">Negative Marks per Wrong Answer</label>
              <input
                type="number"
                min="0"
                step="0.25"
                value={assessmentForm.negativeMarking}
                onChange={(event) => setAssessmentForm((p) => ({ ...p, negativeMarking: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold text-gray-800">
              Instructions / Description
            </label>
            <textarea
              rows={3}
              value={assessmentForm.description}
              onChange={(event) => setAssessmentForm((p) => ({ ...p, description: event.target.value }))}
              placeholder="Enter instructions for students..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          {assessmentForm.type !== "assignment" && (
            <div className="mt-6 space-y-4">
              {assessmentQuestions.map((question, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 bg-[#FAFAF8] p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-black text-gray-900">Question {index + 1}</h3>
                    {assessmentQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setAssessmentQuestions((list) => list.filter((_, i) => i !== index))}
                        className="text-sm font-bold text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-bold text-gray-800">Question Text</label>
                      <textarea
                        rows={2}
                        value={question.prompt}
                        onChange={(event) => setAssessmentQuestions((list) => list.map((q, i) => i === index ? { ...q, prompt: event.target.value } : q))}
                        placeholder="Write your question..."
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">Question Format</label>
                      <select
                        value={question.type}
                        onChange={(event) => setAssessmentQuestions((list) => list.map((q, i) => i === index ? { ...q, type: event.target.value } : q))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                      >
                        <option value="mcq">MCQ — Single Answer</option>
                        <option value="multiple_select">Multiple Select</option>
                        <option value="fill_blank">Fill in the Blanks</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">Marks</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.25"
                        value={question.marks}
                        onChange={(event) => setAssessmentQuestions((list) => list.map((q, i) => i === index ? { ...q, marks: event.target.value } : q))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                      />
                    </div>

                    {question.type !== "fill_blank" && (
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-800">Options (one per line)</label>
                        <textarea
                          rows={4}
                          value={question.optionsText}
                          onChange={(event) => setAssessmentQuestions((list) => list.map((q, i) => i === index ? { ...q, optionsText: event.target.value } : q))}
                          placeholder={"Option A\nOption B\nOption C\nOption D"}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Correct Answer(s) — one per line
                      </label>
                      <textarea
                        rows={question.type === "multiple_select" ? 3 : 2}
                        value={question.correctAnswersText}
                        onChange={(event) => setAssessmentQuestions((list) => list.map((q, i) => i === index ? { ...q, correctAnswersText: event.target.value } : q))}
                        placeholder={question.type === "fill_blank" ? "Expected answer" : question.type === "multiple_select" ? "Choose every correct option, each on a new line" : "Exact option text"}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setAssessmentQuestions((list) => [...list, {
                  prompt: "",
                  type: "mcq",
                  optionsText: "Option A\\\\nOption B\\\\nOption C\\\\nOption D",
                  correctAnswersText: "",
                  marks: 1,
                }])}
                className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:border-[#D4AF37]"
              >
                + Add Another Question
              </button>

              <p className="text-sm font-black text-gray-800">
                Calculated Total Marks: {assessmentQuestions.reduce((sum, q) => sum + (Number(q.marks) > 0 ? Number(q.marks) : 0), 0)}
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={assessmentSaving || lessons.length === 0}
            onClick={submitAssessment}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#D4AF37] px-5 py-3 font-black text-black disabled:opacity-50"
          >
            {assessmentSaving ? "Saving..." : "Create Assessment"}
          </button>
        </section>

        <AssessmentGradingPanel
          lessons={lessons}
          onGraded={() => loadLessons(true)}
        />

      </div>
    </div>
  );
};

const AssessmentGradingPanel = ({ lessons, onGraded }) => {
  const [grades, setGrades] = useState({});
  const [saving, setSaving] = useState("");
  const [messages, setMessages] = useState({});

  const pending = [];
  (lessons || []).forEach((lesson) => {
    (lesson.assessments || []).forEach((assessment) => {
      if (assessment.type !== "assignment") return;
      (assessment.attempts || []).forEach((attempt) => {
        if (attempt.status !== "graded") {
          pending.push({ lesson, assessment, attempt });
        }
      });
    });
  });

  const saveGrade = async (item) => {
    const { lesson, assessment, attempt } = item;
    const key = String(attempt._id);
    const form = grades[key] || {};
    const score = Number(form.score);
    const maxMarks = Number(
      attempt.maxMarks ?? assessment.totalMarks ?? 0
    );

    if (form.score === undefined || form.score === "" ||
        !Number.isFinite(score) || score < 0 || score > maxMarks) {
      setMessages((prev) => ({
        ...prev,
        [key]: { error: `Enter marks from 0 to ${maxMarks}.` },
      }));
      return;
    }

    setSaving(key);
    setMessages((prev) => ({ ...prev, [key]: null }));

    try {
      await api.patch(
        `/lessons/${lesson._id}/assessments/${assessment._id}/attempts/${attempt._id}/grade`,
        {
          score,
          feedback: form.feedback || "",
        }
      );

      setMessages((prev) => ({
        ...prev,
        [key]: { success: "Grade saved successfully." },
      }));
      await onGraded();
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [key]: {
          error:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Could not save grade. Please try again.",
        },
      }));
    } finally {
      setSaving("");
    }
  };

  const updateField = (key, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return (
    <section className="mt-6 rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B99520]">
        Employee Grading
      </p>
      <h2 className="mt-1 text-2xl font-black text-gray-950">
        Assignment Submissions
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Review student work, assign marks and provide feedback.
      </p>

      {pending.length === 0 ? (
        <div className="mt-5 rounded-xl bg-gray-50 p-5 text-sm text-gray-600">
          No pending assignment submissions.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {pending.map(({ lesson, assessment, attempt }) => {
            const key = String(attempt._id);
            const student = attempt.user;
            const studentLabel =
              typeof student === "object" && student
                ? student.name || student.email || student._id || "Student"
                : student || "Student";

            const maxMarks = Number(
              attempt.maxMarks ?? assessment.totalMarks ?? 0
            );

            return (
              <div
                key={key}
                className="rounded-2xl border border-gray-200 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-gray-900">
                      {assessment.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Lesson: {lesson.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Student: {String(studentLabel)}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                    Pending grading
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-500">
                    Student submission
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                    {attempt.submissionText || "No text submission provided."}
                  </p>
                  {attempt.submittedAt && (
                    <p className="mt-2 text-xs text-gray-500">
                      Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Marks (out of {maxMarks})
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      step="0.5"
                      value={grades[key]?.score ?? ""}
                      onChange={(event) =>
                        updateField(key, "score", event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 font-medium outline-none focus:border-[#D4AF37]"
                      placeholder={`0–${maxMarks}`}
                    />
                  </label>

                  <label className="block text-sm font-bold text-gray-800">
                    Feedback
                    <textarea
                      rows={3}
                      value={grades[key]?.feedback ?? ""}
                      onChange={(event) =>
                        updateField(key, "feedback", event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 font-medium outline-none focus:border-[#D4AF37]"
                      placeholder="Feedback for the student (optional)"
                    />
                  </label>
                </div>

                {messages[key]?.error && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {messages[key].error}
                  </p>
                )}
                {messages[key]?.success && (
                  <p className="mt-3 text-sm font-semibold text-green-700">
                    {messages[key].success}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => saveGrade({ lesson, assessment, attempt })}
                  disabled={saving === key}
                  className="mt-4 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                >
                  {saving === key ? "Saving grade..." : "Save Grade"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const LessonCard = ({
  lesson,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 transition hover:bg-white hover:shadow-md sm:p-5">
    <div className="flex items-start gap-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        <span className="text-sm font-black">
          {Number(
            lesson?.order || 0
          )}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">
              {lesson?.title ||
                "Untitled Lesson"}
            </h3>

            {lesson?.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                {lesson.description}
              </p>
            )}
          </div>

          {lesson?.duration && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
              <FiClock />
              {lesson.duration}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {lesson?.videoUrl && (
            <a
              href={lesson.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
            >
              <FiVideo />
              Video
              <FiExternalLink />
            </a>
          )}

          {lesson?.notesUrl && (
            <a
              href={lesson.notesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700"
            >
              <FiFileText />
              Notes
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
}) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
      {icon && (
        <span className="text-gray-400">
          {icon}
        </span>
      )}

      {label}

      {required && (
        <span className="text-red-500">
          *
        </span>
      )}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
    />
  </div>
);

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const EmptyLessons = ({
  hasSearch,
}) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <FiBookOpen
      className="mx-auto text-gray-300"
      size={34}
    />

    <h3 className="mt-4 text-xl font-black text-gray-950">
      {hasSearch
        ? "No Matching Lessons"
        : "No Lessons Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasSearch
        ? "Try a different lesson search."
        : "Add the first lesson from the Lesson Builder."}
    </p>
  </div>
);

const CourseLessonsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1500px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[650px] rounded-[30px] bg-white" />
        <div className="h-[650px] rounded-[30px] bg-white" />
      </div>
    </div>
  </div>
);

export default CourseLessons;