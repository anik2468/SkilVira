import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLogOut,
  FiRadio,
  FiRefreshCw,
  FiSend,
  FiXCircle,
} from "react-icons/fi";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

import api from "../services/api";

const LiveClassroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [isInstructor, setIsInstructor] = useState(false);
  const [liveClass, setLiveClass] = useState(null);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [correctOption, setCorrectOption] = useState("1");
  const [selectedOption, setSelectedOption] = useState("");
  const [quizBusy, setQuizBusy] = useState(false);
  const [roomEnded, setRoomEnded] = useState(false);

  const isControl = location.pathname.startsWith("/control");

  useEffect(() => {
    let active = true;

    const join = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.post(`/live-classes/${id}/token`);
        if (!data?.success || !data?.token || !data?.serverUrl) {
          throw new Error(data?.message || "Unable to join live class.");
        }

        if (!active) return;
        setToken(data.token);
        setServerUrl(data.serverUrl);
        setIsInstructor(Boolean(data.isInstructor));
        setLiveClass(data.liveClass);
      } catch (err) {
        if (!active) return;
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to join live class."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    join();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!token || roomEnded) return undefined;
    let active = true;

    const loadQuiz = async () => {
      try {
        const { data } = await api.get(`/live-classes/${id}/quiz`);
        if (active && data?.success) {
          setQuiz(data.quiz || null);
          if (data.quiz?.hasAnswered) {
            setSelectedOption(String(data.quiz.userAnswerIndex));
          }
        }
      } catch (err) {
        // Room connection is independent from the optional quiz panel.
        console.warn("Live quiz refresh failed:", err?.message || err);
      }
    };

    loadQuiz();
    const timer = setInterval(loadQuiz, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [id, token, roomEnded]);

  const launchQuiz = async () => {
    const options = optionsText
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    const answerIndex = Number(correctOption) - 1;

    if (!question.trim() || options.length < 2 || options.length > 6) {
      setError("Enter a question and between 2 and 6 options.");
      return;
    }

    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) {
      setError("Choose a valid correct option number.");
      return;
    }

    try {
      setQuizBusy(true);
      setError("");
      const { data } = await api.post(`/live-classes/${id}/quiz`, {
        question: question.trim(),
        options,
        correctOptionIndex: answerIndex,
      });
      if (!data?.success) throw new Error(data?.message || "Unable to launch quiz.");
      setQuestion("");
      setOptionsText("");
      setCorrectOption("1");
      const refreshed = await api.get(`/live-classes/${id}/quiz`);
      setQuiz(refreshed.data?.quiz || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to launch quiz.");
    } finally {
      setQuizBusy(false);
    }
  };

  const submitAnswer = async () => {
    if (selectedOption === "") return;
    try {
      setQuizBusy(true);
      setError("");
      await api.post(`/live-classes/${id}/quiz/answer`, {
        optionIndex: Number(selectedOption),
      });
      const refreshed = await api.get(`/live-classes/${id}/quiz`);
      setQuiz(refreshed.data?.quiz || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to submit answer.");
    } finally {
      setQuizBusy(false);
    }
  };

  const closeQuiz = async () => {
    try {
      setQuizBusy(true);
      const { data } = await api.post(`/live-classes/${id}/quiz/close`);
      if (!data?.success) throw new Error(data?.message || "Unable to close quiz.");
      const refreshed = await api.get(`/live-classes/${id}/quiz`);
      setQuiz(refreshed.data?.quiz || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to close quiz.");
    } finally {
      setQuizBusy(false);
    }
  };

  const endClass = async () => {
    const confirmed = window.confirm("End this live class for all participants?");
    if (!confirmed) return;

    try {
      setQuizBusy(true);
      const { data } = await api.post(`/live-classes/${id}/end`);
      if (!data?.success) throw new Error(data?.message || "Unable to end class.");
      setRoomEnded(true);
      const courseId = liveClass?.course;
      if (courseId) {
        navigate(
          isControl
            ? `/control/courses/${courseId}/lessons`
            : `/employee/courses/${courseId}/lessons`,
          { replace: true }
        );
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to end class.");
    } finally {
      setQuizBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        <FiRefreshCw className="mr-2 animate-spin" /> Connecting to live classroom...
      </div>
    );
  }

  if (error && !token) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-14">
        <div className="rounded-2xl border border-red-200 bg-white p-7">
          <FiXCircle className="text-red-600" size={28} />
          <h1 className="mt-3 text-2xl font-black text-gray-950">Unable to join live class</h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-[#D4AF37] px-4 py-3 font-bold text-gray-950"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0d12] px-3 py-4 text-white sm:px-5">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white"
            >
              <FiArrowLeft /> Back
            </button>
            <h1 className="text-xl font-black sm:text-2xl">
              {liveClass?.title || "SkilVira Live Classroom"}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {isInstructor ? "Instructor mode" : "Student mode"} · In-page video, screen sharing and chat
            </p>
          </div>
          {isInstructor && (
            <button
              type="button"
              onClick={endClass}
              disabled={quizBusy}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              <FiLogOut /> End Class
            </button>
          )}
        </header>

        {error && (
          <div role="alert" className="rounded-xl border border-red-400/30 bg-red-900/30 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!roomEnded && token && serverUrl && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <LiveKitRoom
              token={token}
              serverUrl={serverUrl}
              connect={true}
              video={isInstructor}
              audio={isInstructor}
              data-lk-theme="default"
              style={{ height: "min(76vh, 900px)", minHeight: "480px" }}
              onError={(roomError) => setError(roomError?.message || "LiveKit connection error.")}
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                <FiRadio /> Live interaction
              </div>
              <h2 className="mt-2 text-xl font-black">Live MCQ Quiz</h2>
              <p className="mt-1 text-sm text-gray-400">
                The teacher can launch a question while teaching. Students can submit one answer per quiz.
              </p>
            </div>
            {isInstructor && quiz?.status === "active" && (
              <button
                type="button"
                onClick={closeQuiz}
                disabled={quizBusy}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10 disabled:opacity-60"
              >
                Close Quiz & Reveal Results
              </button>
            )}
          </div>

          {isInstructor && (
            <div className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <label className="space-y-1.5 text-sm font-semibold text-gray-200">
                Question
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  maxLength={1000}
                  placeholder="Enter the live quiz question"
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
              <label className="space-y-1.5 text-sm font-semibold text-gray-200">
                Options (one per line, 2–6 options)
                <textarea
                  value={optionsText}
                  onChange={(event) => setOptionsText(event.target.value)}
                  rows={4}
                  placeholder={"Option A\nOption B\nOption C\nOption D"}
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
              <label className="space-y-1.5 text-sm font-semibold text-gray-200">
                Correct option number
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={correctOption}
                  onChange={(event) => setCorrectOption(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
              <button
                type="button"
                onClick={launchQuiz}
                disabled={quizBusy || !token}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 font-black text-gray-950 disabled:opacity-50"
              >
                <FiSend /> {quizBusy ? "Processing..." : "Launch Live Quiz"}
              </button>
            </div>
          )}

          {!quiz ? (
            <p className="mt-5 rounded-xl bg-black/20 p-4 text-sm text-gray-400">
              No live quiz is running right now.
            </p>
          ) : (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-white">{quiz.question}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  quiz.status === "active"
                    ? "bg-red-500/15 text-red-300"
                    : "bg-green-500/15 text-green-300"
                }`}>
                  {quiz.status === "active" ? "LIVE" : "RESULTS"}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {(quiz.options || []).map((option, index) => {
                  const wasChosen = Number(selectedOption) === index;
                  const isCorrect = quiz.status === "closed" &&
                    Number(quiz.correctOptionIndex) === index;

                  return (
                    <label
                      key={`${index}-${option}`}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                        isCorrect
                          ? "border-green-400/50 bg-green-400/10 text-green-200"
                          : wasChosen
                            ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-white"
                            : "border-white/10 text-gray-200"
                      } ${
                        !isInstructor && quiz.status === "active" && !quiz.hasAnswered
                          ? "cursor-pointer hover:bg-white/5"
                          : ""
                      }`}
                    >
                      {!isInstructor && quiz.status === "active" && !quiz.hasAnswered && (
                        <input
                          type="radio"
                          name="live-quiz-answer"
                          value={index}
                          checked={wasChosen}
                          onChange={() => setSelectedOption(String(index))}
                        />
                      )}
                      <span className="flex-1">{option}</span>
                      {isCorrect && <FiCheckCircle className="text-green-300" />}
                      {Array.isArray(quiz.counts) && (
                        <span className="text-xs text-gray-400">
                          {quiz.counts[index]} answer(s)
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {!isInstructor && quiz.status === "active" && (
                <button
                  type="button"
                  onClick={submitAnswer}
                  disabled={quizBusy || quiz.hasAnswered || selectedOption === ""}
                  className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-3 font-black text-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {quiz.hasAnswered ? "Answer Submitted" : "Submit Answer"}
                </button>
              )}

              {quiz.status === "closed" && (
                <p className="mt-4 text-sm text-gray-300">
                  Correct option: {quiz.options?.[quiz.correctOptionIndex]} ·
                  {" "}{quiz.totalResponses || 0} responses
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default LiveClassroom;
