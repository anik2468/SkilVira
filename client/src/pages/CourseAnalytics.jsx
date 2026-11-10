import React, { useEffect, useState } from "react";
import api from "../services/api.js";

const dateLabel = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};
const statusClass = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "live" || value === "active" || value === "completed") return "bg-emerald-50 text-emerald-700";
  if (value === "scheduled" || value === "pending") return "bg-amber-50 text-amber-700";
  if (value === "ended" || value === "cancelled" || value === "canceled") return "bg-slate-100 text-slate-600";
  return "bg-gray-100 text-gray-600";
};
const Stat = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value ?? 0}</p>
    {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
  </div>
);

export default function CourseAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openCourse, setOpenCourse] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/course-analytics");
        const body = response?.data;
        if (body?.success === false) throw new Error(body.message || "Unable to load analytics.");
        if (alive) setData(body?.data || body || { courses: [], summary: {} });
      } catch (err) {
        if (alive) setError(err?.response?.data?.message || err?.message || "Unable to load course analytics.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const summary = data?.summary || {};
  const courses = (data?.courses || []).filter((course) =>
    `${course.title} ${course.category} ${course.ownerName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading course analytics…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">SkilVira learning</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Course Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">Enrollments, lesson progress, teaching ownership and live classes.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses or instructors…"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 sm:max-w-xs"
          />
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <Stat label="Courses" value={summary.courses} />
          <Stat label="Enrollments" value={summary.enrollments} />
          <Stat label="Active enrollments" value={summary.activeEnrollments} />
          <Stat label="Unique students" value={summary.uniqueStudents} />
          <Stat label="Published lessons" value={summary.publishedLessons} />
          <Stat label="Live now" value={summary.liveNow} hint={`${summary.liveClasses || 0} total live-class records`} />
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Courses and enrolled students</h2>
            <span className="text-sm text-gray-500">{courses.length} shown</span>
          </div>
          {!courses.length ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              {error ? "Analytics could not be loaded. Check the API response and try again." : "No matching courses found for this account yet."}
            </div>
          ) : courses.map((course) => {
            const expanded = openCourse === course.id;
            return (
              <article key={course.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <button type="button" onClick={() => setOpenCourse(expanded ? "" : course.id)} className="flex w-full flex-col gap-3 p-5 text-left sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{course.category || "Course"}{course.level ? ` · ${course.level}` : ""} · Owner: {course.ownerName || "Not assigned"}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">{course.enrolledCount} enrolled</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{course.activeCount} active</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">{course.lessonCount} lessons</span>
                    <span className="px-1 text-gray-400">{expanded ? "−" : "+"}</span>
                  </div>
                </button>
                {expanded ? (
                  <div className="space-y-6 border-t border-gray-100 p-5">
                    <div>
                      <h4 className="mb-3 font-semibold text-gray-800">Student progress</h4>
                      {!course.students?.length ? <p className="text-sm text-gray-500">No enrollments are recorded for this course.</p> : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                          <table className="min-w-[760px] w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Lesson progress</th><th className="px-4 py-3">Assessments</th><th className="px-4 py-3">Avg. score</th><th className="px-4 py-3">Enrolled on</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                              {course.students.map((student) => <tr key={student.id}>
                                <td className="px-4 py-3"><p className="font-medium text-gray-900">{student.name}</p><p className="text-xs text-gray-500">{student.email}</p></td>
                                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(student.status)}`}>{student.status}</span></td>
                                <td className="px-4 py-3"><div className="min-w-36"><div className="mb-1 flex justify-between text-xs text-gray-500"><span>{student.completedLessons}/{student.totalLessons} lessons</span><span>{student.progressPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${student.progressPercent}%` }} /></div></div></td>
                                <td className="px-4 py-3">{student.assessmentAttempts}</td><td className="px-4 py-3">{student.averageScore == null ? "—" : `${student.averageScore}%`}</td><td className="px-4 py-3 whitespace-nowrap">{dateLabel(student.enrollmentDate)}</td>
                              </tr>)}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <div className="grid gap-5 lg:grid-cols-2">
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-800">Lessons and instructors</h4>
                        {!course.lessons?.length ? <p className="text-sm text-gray-500">No lessons found.</p> : <div className="space-y-2">{course.lessons.map((lesson) => <div key={lesson.id} className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 p-3"><div><p className="text-sm font-medium text-gray-800">{lesson.order != null ? `${lesson.order}. ` : ""}{lesson.title}</p><p className="mt-1 text-xs text-gray-500">Instructor: {lesson.createdBy}{lesson.createdByEmail ? ` · ${lesson.createdByEmail}` : ""}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-xs ${lesson.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>{lesson.published ? "Published" : "Draft"}</span></div>)}</div>}
                      </div>
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-800">Live classes</h4>
                        {!course.liveClasses?.length ? <p className="text-sm text-gray-500">No live classes recorded.</p> : <div className="space-y-2">{course.liveClasses.map((liveClass) => <div key={liveClass.id} className="rounded-xl bg-gray-50 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-sm font-medium text-gray-800">{liveClass.title}</p><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(liveClass.status)}`}>{liveClass.status}</span></div><p className="mt-1 text-xs text-gray-500">Host: {liveClass.host}{liveClass.hostEmail ? ` · ${liveClass.hostEmail}` : ""}</p><p className="mt-1 text-xs text-gray-500">Scheduled: {dateLabel(liveClass.scheduledAt)}{liveClass.startedAt ? ` · Started: ${dateLabel(liveClass.startedAt)}` : ""}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Attendance: {liveClass.attendanceCount || 0} student(s) attended
                    </p>
                    {course.students?.length ? (
                      <div className="mt-2 max-h-40 space-y-1 overflow-y-auto border-t border-gray-200 pt-2">
                        {course.students.map((student) => {
                          const attendee = (liveClass.attendance || []).find(
                            (entry) => entry.id === student.studentId
                          );
                          const attended = Boolean(attendee && attendee.sessions > 0);
                          const state = attendee?.currentlyPresent
                            ? "In live class"
                            : attended
                              ? "Attended"
                              : "Absent";
                          const minutes = attendee
                            ? Math.round(attendee.durationSeconds / 60)
                            : 0;
                          return (
                            <p
                              key={student.studentId || student.id}
                              className="text-xs text-gray-600"
                            >
                              {student.name}: {state}{attended ? ` · ${minutes} min` : ""}
                            </p>
                          );
                        })}
                      </div>
                    ) : null}</div>)}</div>}
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
