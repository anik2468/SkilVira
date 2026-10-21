import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiArrowLeft,
  FiBookOpen,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getCourseLessons,
} from "../../services/lessonService";

import api from "../../services/api";

import {
  completeLesson,
  getCourseProgress,
} from "../../services/enrollmentService";

const getStoredUser = () => {
  try {
    const stored =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return stored
      ? JSON.parse(stored)
      : null;
  } catch (error) {
    console.error(
      "Failed to read user:",
      error
    );

    return null;
  }
};



const LiveClassesPanel = ({ courseId }) => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get(`/live-classes/course/${courseId}`);
        if (!active) return;
        setClasses(Array.isArray(data?.classes) ? data.classes : []);
        setError("");
      } catch (err) {
        if (!active) return;
        setClasses([]);
        setError(
          err?.response?.data?.message ||
          "Live classes are unavailable for this account."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const timer = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [courseId]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">Loading live classes...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#9B7B16]">
            Live classroom
          </p>
          <h2 className="mt-1 text-xl font-black text-gray-950">
            Live Classes
          </h2>
        </div>
        <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1.5 text-xs font-bold text-[#80620D]">
          Video · Chat · Live Quiz
        </span>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </p>
      ) : classes.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No live sessions are scheduled for this course yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {classes.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-gray-950">{item.title}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(item.scheduledAt).toLocaleString()} · {item.durationMinutes} min
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                )}
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.status === "live"
                    ? "bg-red-100 text-red-700"
                    : item.status === "ended"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-50 text-blue-700"
                }`}>
                  {item.status === "live" ? "LIVE NOW" : item.status.toUpperCase()}
                </span>
              </div>
              {item.status === "live" && (
                <a
                  href={`/student/live-class/${item._id}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-black text-gray-950 hover:bg-[#c6a027]"
                >
                  Join Live Class
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const getLessonId = (item) => {
  if (!item) return "";

  if (
    typeof item === "string"
  ) {
    return item;
  }

  return (
    item.lesson?._id ||
    item.lesson?.id ||
    item.lesson ||
    item._id ||
    item.id ||
    ""
  );
};


const getProgressValue = (
  completedCount,
  totalCount
) => {
  if (!totalCount) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (completedCount /
          totalCount) *
          100
      )
    )
  );
};




function LessonAssessments({ lesson }) {
  const [answers, setAnswers] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [messages, setMessages] = useState({});
  const [busy, setBusy] = useState("");

  const assessments = (lesson?.assessments || []).filter(
    (item) => item.isPublished !== false
  );

  if (!lesson || assessments.length === 0) return null;

  const optionLabel = (option) =>
    typeof option === "string"
      ? option
      : option?.text || option?.label || "";

  const submit = async (assessment) => {
    const assessmentId = assessment._id;
    const questions = assessment.questions || [];
    let payload;

    if (assessment.type === "assignment") {
      const submissionText = submissions[assessmentId]?.trim() || "";
      if (!submissionText) {
        setMessages((prev) => ({
          ...prev,
          [assessmentId]: {
            error: "Please write your assignment submission first.",
          },
        }));
        return;
      }
      payload = { submissionText };
    } else {
      const submittedAnswers = {};
      for (const question of questions) {
        const answer = answers[assessmentId]?.[question._id];
        if (
          answer === undefined ||
          answer === "" ||
          (Array.isArray(answer) && answer.length === 0)
        ) {
          setMessages((prev) => ({
            ...prev,
            [assessmentId]: {
              error: "Please answer every question before submitting.",
            },
          }));
          return;
        }
        submittedAnswers[question._id] = answer;
      }
      payload = { answers: submittedAnswers };
    }

    setBusy(assessmentId);
    setMessages((prev) => ({ ...prev, [assessmentId]: null }));

    try {
      const response = await api.post(
        `/lessons/${lesson._id}/assessments/${assessmentId}/submit`,
        payload
      );

      const data = response?.data || {};
      const result =
        data.attempt ||
        data.result ||
        data.data?.attempt ||
        data.data ||
        data;

      setMessages((prev) => ({
        ...prev,
        [assessmentId]: {
          success: true,
          result,
          text:
            assessment.type === "assignment"
              ? "Assignment submitted successfully. It is pending employee grading."
              : "Assessment submitted successfully.",
        },
      }));
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [assessmentId]: {
          error:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Submission failed. Please try again.",
        },
      }));
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="mt-8 space-y-5 border-t border-gray-700 pt-6">
      <div>
        <h3 className="text-lg font-bold text-white">Assessments</h3>
        <p className="mt-1 text-sm text-gray-400">
          Complete the quiz, test, or assignment for this lesson.
        </p>
      </div>

      {assessments.map((assessment) => {
        const questions = assessment.questions || [];
        const message = messages[assessment._id];
        const isAssignment = assessment.type === "assignment";

        return (
          <form
            key={assessment._id}
            onSubmit={(event) => {
              event.preventDefault();
              submit(assessment);
            }}
            className="space-y-5 rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-white">
                  {assessment.title}
                </h4>
                <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs capitalize text-gray-300">
                  {(assessment.type || "quiz").replace("_", " ")}
                </span>
              </div>
              {assessment.description && (
                <p className="mt-2 whitespace-pre-line text-sm text-gray-300">
                  {assessment.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                {assessment.durationMinutes
                  ? `${assessment.durationMinutes} minutes`
                  : "No time limit shown"}
                {" · "}
                {assessment.totalMarks ?? 0} marks
                {" · "}
                Max attempts: {assessment.maxAttempts || 1}
              </p>
            </div>

            {isAssignment ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-200">
                  Your assignment submission
                </span>
                <textarea
                  value={submissions[assessment._id] || ""}
                  onChange={(event) =>
                    setSubmissions((prev) => ({
                      ...prev,
                      [assessment._id]: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Write your answer or paste a shareable link to your work..."
                  className="w-full rounded-lg border border-gray-600 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
            ) : (
              <div className="space-y-5">
                {questions.map((question, index) => {
                  const value =
                    answers[assessment._id]?.[question._id] ??
                    (question.type === "multiple_select" ? [] : "");
                  const options = question.options || [];

                  return (
                    <fieldset
                      key={question._id || index}
                      className="space-y-3"
                    >
                      <legend className="text-sm font-semibold leading-6 text-gray-100">
                        {index + 1}. {question.prompt}
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          ({question.marks} marks)
                        </span>
                      </legend>

                      {question.type === "fill_blank" ? (
                        <input
                          type="text"
                          value={value}
                          onChange={(event) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [assessment._id]: {
                                ...prev[assessment._id],
                                [question._id]: event.target.value,
                              },
                            }))
                          }
                          placeholder="Enter your answer"
                          className="w-full rounded-lg border border-gray-600 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                        />
                      ) : options.map((option, optionIndex) => {
                        const label = optionLabel(option);
                        const multiple =
                          question.type === "multiple_select";

                        return (
                          <label
                            key={`${question._id}-${optionIndex}`}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 p-3 text-sm text-gray-200 hover:border-gray-500"
                          >
                            <input
                              type={multiple ? "checkbox" : "radio"}
                              name={`${assessment._id}-${question._id}`}
                              checked={
                                multiple
                                  ? Array.isArray(value) && value.includes(label)
                                  : value === label
                              }
                              onChange={(event) => {
                                setAnswers((prev) => {
                                  const current =
                                    prev[assessment._id]?.[question._id];
                                  let nextValue;

                                  if (multiple) {
                                    const selected = Array.isArray(current)
                                      ? current
                                      : [];
                                    nextValue = event.target.checked
                                      ? [...selected, label]
                                      : selected.filter((item) => item !== label);
                                  } else {
                                    nextValue = label;
                                  }

                                  return {
                                    ...prev,
                                    [assessment._id]: {
                                      ...prev[assessment._id],
                                      [question._id]: nextValue,
                                    },
                                  };
                                });
                              }}
                              className="accent-[#D4AF37]"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </fieldset>
                  );
                })}
              </div>
            )}

            {message?.error && (
              <p role="alert" className="text-sm text-red-400">
                {message.error}
              </p>
            )}

            {message?.success && (
              <div className="rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-300">
                <p>{message.text}</p>
                {!isAssignment &&
                  message.result?.score !== undefined && (
                    <p className="mt-1 font-bold">
                      Score: {message.result.score} /{" "}
                      {message.result.maxMarks ?? assessment.totalMarks}
                    </p>
                  )}
                {isAssignment && message.result?.score !== undefined && (
                  <p className="mt-1">
                    Marks: {message.result.score} /{" "}
                    {message.result.maxMarks ?? assessment.totalMarks}
                  </p>
                )}
                {isAssignment &&
                  message.result?.status !== "graded" && (
                    <p className="mt-1">Status: Pending grading</p>
                  )}
                {message.result?.feedback && (
                  <p className="mt-1">
                    Feedback: {message.result.feedback}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={busy === assessment._id}
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === assessment._id
                ? "Submitting..."
                : isAssignment
                  ? "Submit Assignment"
                  : "Submit Assessment"}
            </button>
          </form>
        );
      })}
    </div>
  );
}


const LearnCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] =
    useState([]);

  const [
    completedLessons,
    setCompletedLessons,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [completing, setCompleting] =
    useState(false);

  const [selectedLesson, setSelectedLesson] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  const [error, setError] =
    useState("");

  const [user] = useState(
    getStoredUser
  );


  // ======================================
  // Derived
  // ======================================

  const studentId =
    user?._id ||
    user?.id;

  const selectedLessonCompleted =
    selectedLesson
      ? completedLessons.includes(
          selectedLesson._id
        )
      : false;


  const completedCount =
    completedLessons.length;

  const totalLessons =
    lessons.length;

  const remainingLessons =
    Math.max(
      0,
      totalLessons -
        completedCount
    );


  const courseCompleted =
    totalLessons > 0 &&
    progress >= 100;


  const lessonNumber =
    useMemo(() => {
      if (!selectedLesson) {
        return 0;
      }

      return (
        lessons.findIndex(
          (lesson) =>
            lesson._id ===
            selectedLesson._id
        ) + 1
      );
    }, [
      lessons,
      selectedLesson,
    ]);


  // ======================================
  // Load Course
  // ======================================

  const loadCourse = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      if (!id) {
        throw new Error(
          "Course ID is missing."
        );
      }

      if (!studentId) {
        throw new Error(
          "Student session not found. Please login again."
        );
      }

      const lessonData =
        await getCourseLessons(id);

      const courseLessons =
        lessonData?.lessons ||
        lessonData?.data?.lessons ||
        lessonData?.data ||
        [];

      const normalizedLessons =
        Array.isArray(
          courseLessons
        )
          ? courseLessons
          : [];

      setLessons(
        normalizedLessons
      );


      // Keep selected lesson when
      // refreshing if it still exists.
      if (
        normalizedLessons.length >
        0
      ) {
        setSelectedLesson(
          (current) => {
            const existing =
              normalizedLessons.find(
                (lesson) =>
                  lesson._id ===
                  current?._id
              );

            return (
              existing ||
              normalizedLessons[0]
            );
          }
        );
      } else {
        setSelectedLesson(null);
      }


      const progressData =
        await getCourseProgress(
          studentId,
          id
        );

      const completed =
        progressData?.completedLessons ||
        progressData?.data
          ?.completedLessons ||
        [];

      const completedIds =
        Array.isArray(completed)
          ? completed
              .map(getLessonId)
              .filter(Boolean)
          : [];

      setCompletedLessons(
        completedIds
      );


      // Prefer backend percentage
      // when available, otherwise
      // calculate from lessons.
      const backendProgress =
        Number(
          progressData?.progress ??
            progressData?.percentage ??
            progressData?.completionPercentage
        );

      const calculatedProgress =
        getProgressValue(
          completedIds.length,
          normalizedLessons.length
        );

      const finalProgress =
        Number.isFinite(
          backendProgress
        ) &&
        backendProgress >= 0
          ? Math.min(
              100,
              Math.max(
                0,
                Math.round(
                  backendProgress
                )
              )
            )
          : calculatedProgress;

      setProgress(
        finalProgress
      );
    } catch (err) {
      console.error(
        "loadCourse error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load course."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadCourse();
  }, [id, studentId]);


  // ======================================
  // Complete Lesson
  // ======================================

  const handleComplete =
    async () => {
      if (
        !selectedLesson ||
        !studentId
      ) {
        return;
      }

      if (
        completedLessons.includes(
          selectedLesson._id
        )
      ) {
        return;
      }

      try {
        setCompleting(true);

        await completeLesson({
          student: studentId,
          course: id,
          lesson:
            selectedLesson._id,
        });

        await loadCourse(true);
      } catch (err) {
        console.error(
          "handleComplete error:",
          err
        );

        alert(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to mark lesson complete."
        );
      } finally {
        setCompleting(false);
      }
    };


  // ======================================
  // Lesson Navigation
  // ======================================

  const handleSelectLesson =
    (lesson) => {
      setSelectedLesson(
        lesson
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };


  const handleNextLesson =
    () => {
      if (!selectedLesson) {
        return;
      }

      const currentIndex =
        lessons.findIndex(
          (lesson) =>
            lesson._id ===
            selectedLesson._id
        );

      if (
        currentIndex === -1 ||
        currentIndex >=
          lessons.length - 1
      ) {
        return;
      }

      setSelectedLesson(
        lessons[currentIndex + 1]
      );
    };


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-gray-100" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />

          <div className="h-[500px] animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }


  // ======================================
  // Error
  // ======================================

  if (error && lessons.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle
              size={30}
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Unable to Load Course
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student/courses"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
            >
              <FiArrowLeft />
              Back to Courses
            </button>

            <button
              type="button"
              onClick={() =>
                loadCourse(true)
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }


  // ======================================
  // UI
  // ======================================

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/courses"
              )
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#8B6E12]"
          >
            <FiArrowLeft />
            Back to My Courses
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiBookOpen
                size={22}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Learning Course
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Continue your learning
                and complete every lesson.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            loadCourse(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:opacity-60"
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
      </div>


      {/* Progress */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Course Progress
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {progress}%
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {completedCount} of{" "}
            {totalLessons} lessons
            completed
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>
            Completed:{" "}
            <strong className="text-gray-800">
              {completedCount}
            </strong>
          </span>

          <span>
            Remaining:{" "}
            <strong className="text-gray-800">
              {remainingLessons}
            </strong>
          </span>

          {courseCompleted && (
            <span className="font-semibold text-green-600">
              Course completed
            </span>
          )}
        </div>
      </section>


      {/* LIVE CLASSES PANEL */}
      <LiveClassesPanel courseId={id} />

      {/* Inline Error */}
      {error && lessons.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <FiAlertCircle
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}


      {/* No Lessons */}
      {lessons.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
          <FiBookOpen
            size={42}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No Lessons Available
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Lessons for this course have
            not been added yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video / Content */}
          <section className="overflow-hidden rounded-2xl bg-gray-950 shadow-sm lg:col-span-2">
            {selectedLesson ? (
              <>
                {/* Video */}
                <div className="relative bg-black">
                  {selectedLesson.videoUrl ? (
                    <iframe
                      src={
                        selectedLesson.videoUrl
                      }
                      title={
                        selectedLesson.title ||
                        "Course Lesson"
                      }
                      className="h-[260px] w-full sm:h-[420px] lg:h-[500px]"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <div className="flex h-[260px] flex-col items-center justify-center px-6 text-center text-white sm:h-[420px] lg:h-[500px]">
                      <FiPlay
                        size={48}
                        className="text-gray-600"
                      />

                      <p className="mt-4 text-lg font-semibold">
                        Video not available
                      </p>

                      <p className="mt-1 max-w-md text-sm text-gray-400">
                        This lesson does not have
                        a video attached yet.
                      </p>
                    </div>
                  )}
                </div>


                {/* Lesson Content */}
                <div className="p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>
                      Lesson{" "}
                      {lessonNumber}
                    </span>

                    {selectedLesson.duration && (
                      <>
                        <span>•</span>

                        <span className="inline-flex items-center gap-1">
                          <FiClock
                            size={12}
                          />
                          {
                            selectedLesson.duration
                          }
                        </span>
                      </>
                    )}

                    {selectedLessonCompleted && (
                      <>
                        <span>•</span>

                        <span className="font-semibold text-green-400">
                          Completed
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    {selectedLesson.title}
                  </h2>

                  {selectedLesson.description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">
                      {
                        selectedLesson.description
                      }
                    </p>
                  )}


                  <LessonAssessments lesson={selectedLesson} />

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={
                        handleComplete
                      }
                      disabled={
                        selectedLessonCompleted ||
                        completing
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                      {completing ? (
                        <>
                          <FiRefreshCw className="animate-spin" />
                          Saving...
                        </>
                      ) : selectedLessonCompleted ? (
                        <>
                          <FiCheckCircle />
                          Completed
                        </>
                      ) : (
                        <>
                          <FiCheckCircle />
                          Mark Complete
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleNextLesson
                      }
                      disabled={
                        lessonNumber >=
                        lessons.length
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Lesson
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center text-white">
                <div className="text-center">
                  <FiPlay
                    size={42}
                    className="mx-auto text-gray-500"
                  />

                  <p className="mt-4 font-semibold">
                    Select a lesson
                  </p>
                </div>
              </div>
            )}
          </section>


          {/* Lesson Sidebar */}
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Lessons
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {completedCount} /{" "}
                  {totalLessons} completed
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiBookOpen />
              </div>
            </div>


            <div className="mt-5 max-h-[620px] space-y-2 overflow-y-auto pr-1">
              {lessons.map(
                (
                  lesson,
                  index
                ) => {
                  const completed =
                    completedLessons.includes(
                      lesson._id
                    );

                  const selected =
                    selectedLesson?._id ===
                    lesson._id;

                  return (
                    <button
                      key={
                        lesson._id ||
                        index
                      }
                      type="button"
                      onClick={() =>
                        handleSelectLesson(
                          lesson
                        )
                      }
                      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          completed
                            ? "bg-green-50 text-green-600"
                            : selected
                            ? "bg-[#D4AF37] text-white"
                            : "bg-white text-gray-400"
                        }`}
                      >
                        {completed ? (
                          <FiCheckCircle
                            size={16}
                          />
                        ) : (
                          <FiPlay
                            size={14}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-400">
                          Lesson{" "}
                          {index + 1}
                        </p>

                        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-800">
                          {
                            lesson.title
                          }
                        </h3>

                        {lesson.duration && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <FiClock
                              size={11}
                            />
                            {
                              lesson.duration
                            }
                          </p>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};


export default LearnCourse;