import { useEffect, useMemo, useRef, useState } from "react";
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





const resourceUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const apiOrigin = String(import.meta.env.VITE_API_URL || "")
    .replace(/\/api\/?$/i, "")
    .replace(/\/+$/, "");

  return apiOrigin ? `${apiOrigin}/${raw.replace(/^\/+/, "")}` : raw;
};

const youtubeEmbedUrl = (value) => {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host.endsWith("youtube.com")) {
      videoId =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ||
        "";
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
};

function LessonAssessmentCard({ lesson, assessment }) {
  const [phase, setPhase] = useState("card");
  const [answers, setAnswers] = useState({});
  const [submissionText, setSubmissionText] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [attemptCount, setAttemptCount] = useState(
    Number(assessment.studentAttemptCount) || 0
  );
  const [latestSubmission, setLatestSubmission] = useState(
    assessment.studentAttempts?.[0] || null
  );
  const [deadlineAt, setDeadlineAt] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const autoSubmitting = useRef(false);
  const submitRef = useRef(null);

  const maxAttempts = Math.max(1, Number(assessment.maxAttempts) || 1);
  const attemptsRemaining = Math.max(0, maxAttempts - attemptCount);

  useEffect(() => {
    const savedAttempts = assessment.studentAttempts || [];
    setAttemptCount(Number(assessment.studentAttemptCount) || savedAttempts.length);
    setLatestSubmission(savedAttempts[0] || null);
  }, [assessment._id, assessment.studentAttemptCount, assessment.studentAttempts]);

  const formatSubmittedAt = (value) => {
    if (!value) return "time unavailable";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "time unavailable"
      : date.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  const isAssignment = assessment.type === "assignment";
  const hasTimer = isAssignment
    ? Number(assessment.durationMinutes) > 0
    : true;

  const durationSeconds = Math.max(
    60,
    (Number(assessment.durationMinutes) || 15) * 60
  );

  const formatTime = (seconds) =>
    `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(Math.max(0, seconds) % 60).padStart(2, "0")}`;

  const updateAnswer = (questionId, value) => {
    setAnswers((previous) => ({ ...previous, [questionId]: value }));
  };

  const submit = async (automatic = false) => {
    if (busy) return;

    const questions = assessment.questions || [];

    if (isAssignment && !submissionText.trim() && !automatic) {
      setMessage({ error: "Please enter your assignment submission." });
      return;
    }

    if (!isAssignment && !automatic) {
      const unanswered = questions.some((question) => {
        const answer = answers[question._id];
        return answer === undefined || answer === "" ||
          (Array.isArray(answer) && answer.length === 0);
      });

      if (unanswered) {
        setMessage({ error: "Please answer every question before submitting." });
        return;
      }
    }

    const answerPayload = {};
    questions.forEach((question) => {
      if (answers[question._id] !== undefined) {
        answerPayload[question._id] = answers[question._id];
      }
    });

    setBusy(true);
    setMessage(null);

    try {
      const { data } = await api.post(
        `/lessons/${lesson._id}/assessments/${assessment._id}/submit`,
        {
          answers: answerPayload,
          submissionText,
          autoSubmitted: automatic,
        }
      );

      const result = data?.result || data?.attempt || data?.data || data;
      const submittedAt =
        data?.attempt?.submittedAt ||
        data?.result?.submittedAt ||
        new Date().toISOString();

      const savedSummary = {
        status: data?.attempt?.status || result?.status ||
          (isAssignment ? "pending_grade" : "graded"),
        submittedAt,
        score: result?.score,
        maxMarks: result?.maxMarks ?? result?.totalMarks ?? assessment.totalMarks,
        feedback: result?.feedback,
      };

      setLatestSubmission(savedSummary);
      setAttemptCount(Number(data?.attemptCount ?? (attemptCount + 1)));
      setMessage({
        success: true,
        text: automatic
          ? "Time is over. Your answers were submitted automatically."
          : isAssignment
            ? "Assignment submitted successfully."
            : "Assessment submitted successfully.",
        result: { ...result, ...savedSummary },
      });
      setDeadlineAt(0);
      setPhase("card");
    } catch (error) {
      setMessage({
        error:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Submission failed. Please try again.",
      });
      autoSubmitting.current = false;
    } finally {
      setBusy(false);
    }
  };

  submitRef.current = submit;

  useEffect(() => {
    if (phase !== "active" || !hasTimer || !deadlineAt) {
      return undefined;
    }

    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
      setRemaining(seconds);

      if (seconds === 0 && !autoSubmitting.current) {
        autoSubmitting.current = true;
        void submitRef.current?.(true);
      }
    };

    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [phase, hasTimer, deadlineAt]);

  const start = () => {
    if (attemptsRemaining <= 0) {
      setMessage({ error: "You have reached the maximum attempt limit for this assessment." });
      setPhase("submitted");
      return;
    }
    setMessage(null);
    autoSubmitting.current = false;

    if (hasTimer) {
      const deadline = Date.now() + durationSeconds * 1000;
      setDeadlineAt(deadline);
      setRemaining(durationSeconds);
    }

    setPhase("active");
  };

  if (phase === "card") {
    const attemptsExhausted = attemptsRemaining === 0;
    const openSavedStatus = isAssignment && Boolean(latestSubmission);

    return (
      <button
        type="button"
        onClick={() => {
          if (attemptsExhausted || openSavedStatus) {
            setMessage(null);
            setPhase("submitted");
          } else {
            setMessage(null);
            setPhase("instructions");
          }
        }}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#D4AF37] hover:shadow-md"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2 font-bold text-gray-900">
            {assessment.title}
            {latestSubmission && (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                {isAssignment ? "Submitted" : "Attempt recorded"}
              </span>
            )}
            {attemptsExhausted && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                Attempt limit reached
              </span>
            )}
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            {hasTimer ? `${assessment.durationMinutes || 15} minutes` : "No time limit"}
            {" · "}{assessment.totalMarks ?? 0} marks
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            Attempts used: {attemptCount}/{maxAttempts}
          </span>
          {latestSubmission?.submittedAt && (
            <span className="mt-1 block text-xs text-green-700">
              Last submitted: {formatSubmittedAt(latestSubmission.submittedAt)}
            </span>
          )}
        </span>
        <span className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold ${
          attemptsExhausted
            ? "bg-gray-100 text-gray-500"
            : "bg-[#FFF5D5] text-[#84640A] group-hover:bg-[#D4AF37] group-hover:text-gray-950"
        }`}>
          {attemptsExhausted ? "View status" : openSavedStatus ? "View submission" : "Open →"}
        </span>
      </button>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <button
        type="button"
        disabled={phase === "active"}
        onClick={() => setPhase("card")}
        className="mb-5 text-sm font-bold text-gray-600 hover:text-[#8B6E12] disabled:opacity-40"
      >
        ← Back to lesson
      </button>

      {phase === "instructions" && (
        <>
          <p className="text-xs font-black uppercase tracking-widest text-[#9A7914]">
            Instructions
          </p>
          <h4 className="mt-2 text-2xl font-black text-gray-950">
            {assessment.title}
          </h4>
          {assessment.description && (
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
              {assessment.description}
            </p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Duration", hasTimer ? `${assessment.durationMinutes || 15} min` : "Untimed"],
              ["Total marks", assessment.totalMarks ?? 0],
              ["Maximum attempts", assessment.maxAttempts || 1],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-1 text-lg font-black text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <p className="font-black">Before you begin</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Questions appear only after you press Start.</li>
              <li>Read every question and select your answer carefully.</li>
              <li>{hasTimer ? "When the timer reaches zero, the page will submit your current answers automatically." : "Review your work before submitting your assignment."}</li>
              <li>You can submit early using the Submit button.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={start}
            className="mt-6 w-full rounded-xl bg-[#D4AF37] px-5 py-3.5 font-black text-gray-950 transition hover:bg-[#edcf55] sm:w-auto"
          >
            Start {isAssignment ? "Assignment" : "Test"} →
          </button>
        </>
      )}

      {phase === "active" && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-950 p-4 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Assessment in progress
              </p>
              <p className="mt-1 font-black">{assessment.title}</p>
            </div>
            {hasTimer && (
              <span className={`rounded-xl px-4 py-2 text-lg font-black tabular-nums ${
                remaining <= 60 ? "bg-red-500/20 text-red-300" : "bg-[#D4AF37]/15 text-[#E8C64A]"
              }`}>
                {formatTime(remaining)}
              </span>
            )}
          </div>

          {isAssignment ? (
            <textarea
              value={submissionText}
              onChange={(event) => setSubmissionText(event.target.value)}
              rows={8}
              placeholder="Write your assignment response or add a shareable link..."
              className="w-full rounded-xl border border-gray-300 p-4 text-sm outline-none focus:border-[#D4AF37]"
            />
          ) : (
            <div className="space-y-5">
              {(assessment.questions || []).map((question, index) => {
                const value = answers[question._id] ??
                  (question.type === "multiple_select" ? [] : "");

                return (
                  <fieldset key={question._id || index} className="rounded-xl border border-gray-200 p-4">
                    <legend className="px-2 text-sm font-bold leading-6 text-gray-900">
                      {index + 1}. {question.prompt}
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        ({question.marks} marks)
                      </span>
                    </legend>

                    {question.type === "fill_blank" ? (
                      <input
                        value={value}
                        onChange={(event) => updateAnswer(question._id, event.target.value)}
                        placeholder="Enter your answer"
                        className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm"
                      />
                    ) : (
                      <div className="mt-2 space-y-2">
                        {(question.options || []).map((option, optionIndex) => {
                          const label = typeof option === "string"
                            ? option
                            : option?.text || option?.label || "";
                          const multiple = question.type === "multiple_select";

                          return (
                            <label key={`${question._id}-${optionIndex}`} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm text-gray-800 hover:border-[#D4AF37]">
                              <input
                                type={multiple ? "checkbox" : "radio"}
                                name={`${assessment._id}-${question._id}`}
                                checked={multiple
                                  ? Array.isArray(value) && value.includes(label)
                                  : value === label}
                                onChange={(event) => {
                                  if (!multiple) {
                                    updateAnswer(question._id, label);
                                    return;
                                  }
                                  const current = Array.isArray(value) ? value : [];
                                  updateAnswer(
                                    question._id,
                                    event.target.checked
                                      ? [...current, label]
                                      : current.filter((item) => item !== label)
                                  );
                                }}
                                className="accent-[#D4AF37]"
                              />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </fieldset>
                );
              })}
            </div>
          )}

          {message?.error && (
            <p role="alert" className="mt-4 text-sm text-red-600">{message.error}</p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => submit(false)}
            className="mt-6 w-full rounded-xl bg-[#D4AF37] px-5 py-3.5 font-black text-gray-950 disabled:opacity-50 sm:w-auto"
          >
            {busy ? "Submitting..." : isAssignment ? "Submit Assignment" : "Submit Test"}
          </button>
        </>
      )}

      {phase === "submitted" && (
        <div className="py-5">
          <p className="text-xs font-black uppercase tracking-widest text-[#9A7914]">
            {attemptsRemaining === 0 ? "Attempt status" : "Submission record"}
          </p>
          <h4 className="mt-2 text-xl font-black text-gray-950">
            {attemptsRemaining === 0
              ? "You have reached the maximum attempt limit"
              : isAssignment
                ? "Assignment submitted successfully"
                : "Latest attempt details"}
          </h4>
          {(latestSubmission?.submittedAt || message?.result?.submittedAt) && (
            <p className="mt-2 text-sm text-gray-600">
              {isAssignment ? "You submitted this assignment successfully on " : "Last submission: "}
              <strong>
                {formatSubmittedAt(
                  latestSubmission?.submittedAt || message?.result?.submittedAt
                )}
              </strong>
            </p>
          )}
          <p className="mt-2 text-sm text-gray-600">
            Status: {
              latestSubmission?.status === "graded"
                ? "Graded"
                : latestSubmission?.status === "pending_grade"
                  ? "Pending review"
                  : latestSubmission
                    ? "Submitted"
                    : "No saved submission details available"
            }
          </p>
          {latestSubmission?.score !== undefined && latestSubmission?.score !== null && (
            <p className="mt-2 font-bold text-gray-900">
              Score: {latestSubmission.score} / {latestSubmission.maxMarks ?? assessment.totalMarks}
            </p>
          )}
          {latestSubmission?.feedback && (
            <p className="mt-2 text-sm text-gray-600">
              Feedback: {latestSubmission.feedback}
            </p>
          )}
          {attemptsRemaining === 0 && (
            <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
              You have reached the maximum attempt limit for this assessment.
            </p>
          )}
          {message?.error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {message.error}
            </p>
          )}
          {isAssignment && attemptsRemaining > 0 && (
            <button
              type="button"
              onClick={() => {
                setSubmissionText("");
                setPhase("instructions");
              }}
              className="mt-5 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-black text-gray-950"
            >
              Start another attempt
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setPhase("card");
              setMessage(null);
            }}
            className="mt-5 ml-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700"
          >
            Back to assessments
          </button>
        </div>
      )}
    </section>
  );
}

function LessonLearningContent({ lesson }) {
  const [showPdf, setShowPdf] = useState(false);

  if (!lesson) return null;

  const notesUrl = resourceUrl(lesson.notesUrl);
  const pdf = /\.pdf(?:$|[?#])/i.test(notesUrl);
  const notesVideo = youtubeEmbedUrl(notesUrl);
  const types = [
    { id: "quiz", title: "Quizzes", subtitle: "Timed questions and instant scoring" },
    { id: "dpp", title: "Daily Practice Problems", subtitle: "Practice questions for this lesson" },
    { id: "test", title: "Tests", subtitle: "Timed assessments" },
    { id: "assignment", title: "Assignments", subtitle: "Submit work for review and grading" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#9A7914]">Lesson material</p>
            <h3 className="mt-1 text-xl font-black text-gray-950">Notes & study material</h3>
            <p className="mt-1 text-sm text-gray-500">{lesson.title}</p>
          </div>
          {notesUrl && (
            <a
              href={notesUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-black text-gray-950"
            >
              Open notes ↗
            </a>
          )}
        </div>

        {!notesUrl ? (
          <p className="mt-5 rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500">
            Notes have not been added for this lesson yet.
          </p>
        ) : pdf ? (
          <>
            <button
              type="button"
              onClick={() => setShowPdf((value) => !value)}
              className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700"
            >
              {showPdf ? "Hide PDF preview" : "Preview PDF"}
            </button>
            <a
              href={notesUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="ml-2 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700"
            >
              Download PDF
            </a>
            {showPdf && (
              <iframe
                title={`${lesson.title} PDF notes`}
                src={notesUrl}
                className="mt-4 h-[65vh] min-h-[420px] w-full rounded-xl border border-gray-200 bg-white"
              />
            )}
          </>
        ) : notesVideo ? (
          <iframe
            title={`${lesson.title} notes video`}
            src={notesVideo}
            className="mt-5 aspect-video w-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            This lesson has a resource link. For an inline notes preview, add a PDF URL.
          </p>
        )}
      </section>

      {types.map((type) => {
        const items = (lesson.assessments || []).filter(
          (item) => item.type === type.id && item.isPublished !== false
        );

        return (
          <section key={type.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-gray-950">{type.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{type.subtitle}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                No {type.title.toLowerCase()} published for this lesson yet.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((assessment) => (
                  <LessonAssessmentCard
                    key={assessment._id}
                    lesson={lesson}
                    assessment={assessment}
                  />
                ))}
              </div>
            )}
          </section>
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

  const [lessonView, setLessonView] = useState(false);

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

      // The API returns a count and a separate list of completed lessons.
      const completed =
        progressData?.completedLessonList ||
        progressData?.data?.completedLessonList ||
        (Array.isArray(progressData?.completedLessons)
          ? progressData.completedLessons
          : Array.isArray(progressData?.data?.completedLessons)
            ? progressData.data.completedLessons
            : []);

      const completedIds =
        Array.isArray(completed)
          ? completed
              .map((entry) =>
                getLessonId(entry?.lesson) ||
                entry?.lesson?._id ||
                entry?.lessonId ||
                getLessonId(entry)
              )
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
        setLessonView(true);

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


      {/* Professional course dashboard and lesson details */}
      {lessons.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FiBookOpen size={42} className="mx-auto text-gray-300" />
          <h2 className="mt-5 text-xl font-black text-gray-900">No lessons available</h2>
          <p className="mt-2 text-sm text-gray-500">
            Lessons for this course have not been published yet.
          </p>
        </section>
      ) : !lessonView || !selectedLesson ? (
        <section className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#9A7914]">Course curriculum</p>
            <h2 className="mt-1 text-2xl font-black text-gray-950">Continue learning</h2>
            <p className="mt-1 text-sm text-gray-500">
              Open a lesson to watch its video, read notes and complete assessments.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lessons.map((lesson, index) => {
              const done = completedLessons.some(
                (item) => String(item) === String(lesson._id)
              );

              const assessmentCount = (lesson.assessments || []).filter(
                (item) => item.isPublished !== false
              ).length;

              return (
                <button
                  key={lesson._id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson)}
                  className="group flex min-h-[205px] flex-col rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF5D5] font-black text-[#8B6E12]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      done ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {done ? "Completed" : "Not completed"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black text-gray-900 group-hover:text-[#8B6E12]">
                    {lesson.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {lesson.description || "Open this lesson to continue learning."}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4 text-xs font-semibold text-gray-500">
                    {lesson.videoUrl && <span className="rounded-lg bg-gray-100 px-2.5 py-1.5">Video</span>}
                    {lesson.notesUrl && <span className="rounded-lg bg-gray-100 px-2.5 py-1.5">Notes</span>}
                    {assessmentCount > 0 && (
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1.5">
                        {assessmentCount} assessment{assessmentCount === 1 ? "" : "s"}
                      </span>
                    )}
                    {lesson.duration && <span className="rounded-lg bg-gray-100 px-2.5 py-1.5">{lesson.duration}</span>}
                  </div>
                  <span className="mt-4 text-sm font-black text-[#8B6E12]">Open lesson →</span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setLessonView(false)}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#8B6E12]"
            >
              <FiArrowLeft /> All lessons
            </button>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200">
              Lesson {lessonNumber} of {totalLessons}
            </span>
          </div>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative bg-gray-950">
              {selectedLesson.videoUrl ? (
                <iframe
                  src={
                    youtubeEmbedUrl(resourceUrl(selectedLesson.videoUrl)) ||
                    resourceUrl(selectedLesson.videoUrl)
                  }
                  title={selectedLesson.title || "Course lesson"}
                  className="aspect-video max-h-[70vh] w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center text-white sm:min-h-[400px]">
                  <FiPlay size={44} className="text-gray-500" />
                  <p className="mt-4 text-lg font-bold">Video not available</p>
                  <p className="mt-1 max-w-md text-sm text-gray-400">
                    You can still study from notes and complete the assessments below.
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-7">
              <p className="text-xs font-black uppercase tracking-widest text-[#9A7914]">
                Lesson {lessonNumber}{selectedLesson.duration ? ` · ${selectedLesson.duration}` : ""}
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">
                {selectedLesson.title}
              </h2>
              {selectedLesson.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {selectedLesson.description}
                </p>
              )}
            </div>
          </section>

          <LessonLearningContent lesson={selectedLesson} />

          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="font-black text-gray-900">Lesson progress</p>
              <p className="mt-1 text-sm text-gray-500">
                Mark this lesson complete when you finish studying it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleComplete}
                disabled={selectedLessonCompleted || completing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-gray-950 transition hover:bg-[#edcf55] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
              >
                {completing ? "Saving..." : selectedLessonCompleted ? "✓ Completed" : "Mark Complete"}
              </button>
              <button
                type="button"
                onClick={handleNextLesson}
                disabled={lessonNumber >= lessons.length}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next lesson →
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};


export default LearnCourse;