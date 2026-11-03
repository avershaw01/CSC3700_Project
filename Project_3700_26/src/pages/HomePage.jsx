import useFetch from "../hooks/useFetch";
import { useEffect, useMemo, useState } from "react";
import CourseList from "../components/CourseList";

const API = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "aurora-course-scheduler-completed";

function HomePage() {
    const { data: courses, isPending, error } = useFetch(`${API}/courses`);
    const [completed, setCompleted] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setCompleted(parsed);
            }
        } catch { //Do nothing but don't crash
        }
    }, []);

    function handleToggle(courseId) {
        const course = courses.find((item) => item.id === courseId);
        if (!course) return;

        setCompleted((current) => {
            const isAlreadyCompleted = current.includes(courseId);

            if (isAlreadyCompleted) {
                const toRemove = new Set([courseId]);
                let changed = true;

                while (changed) {
                    changed = false;

                    for (const item of courses) {
                        const dependsOnRemovedCourse = item.prerequisites.some((id) =>
                            toRemove.has(id),
                        );
                        if (dependsOnRemovedCourse && !toRemove.has(item.id)) {
                            toRemove.add(item.id);
                            changed = true;
                        }
                    }
                }
                return current.filter((id) => !toRemove.has(id));
            }
            const prerequisitesMet = course.prerequisites.every((id) =>
                current.includes(id),
            );
            if (!prerequisitesMet) return current;

            return [...current, courseId];
        });
    }

    function handleSave() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    }

    const coursesWithStatus = useMemo(() => {
        if (!courses) return [];

        return courses.map((course) => {
            const isCompleted = completed.includes(course.id);
            const isAvailable = course.prerequisites.every((id) =>
                completed.includes(id),
            );

            return {
                ...course,
                isCompleted,
                isAvailable,
                status: isCompleted ? "Completed" : isAvailable ? "Available" : "Locked",
            };
        });
    }, [courses, completed]);

    const visibleCourses = coursesWithStatus.filter((course) => {
        if (filter === "completed") return course.isCompleted;
        if (filter === "remaining") return !course.isCompleted;
        return true;
    });

    const completedCount = coursesWithStatus.filter(
        (course) => course.isCompleted,
    ).length;
    const availableCount = coursesWithStatus.filter(
        (course) => !course.isCompleted && course.isAvailable,
    ).length;
    const lockedCount = coursesWithStatus.filter(
        (course) => !course.isCompleted && !course.isAvailable,
    ).length;

    if (isPending) return <p className="p-3">Loading courses...</p>;
    if (error) return <p className="p-3 text-danger">Error: {error}</p>;

    return (
        <main className="container py-3">
            <h1 className="mb-3">Aurora CS Course Scheduler</h1>

            <section className="mb-3" aria-label="Course progress">
                <strong>
                    {completedCount} of {courses.length} courses completed
                </strong>
                <span className="ms-3">Available: {availableCount}</span>
                <span className="ms-3">Locked: {lockedCount}</span>
            </section>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <label htmlFor="course-filter" className="form-label mb-0">
                    Show
                </label>
                <select
                    id="course-filter"
                    className="form-select w-auto"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                >
                    <option value="all">All Courses</option>
                    <option value="completed">Completed Only</option>
                    <option value="remaining">Remaining</option>
                </select>

                <button className="btn btn-primary" onClick={handleSave}>
                    Save progress
                </button>
            </div>

            <CourseList
                courses={visibleCourses}
                allCourses={courses}
                completed={completed}
                onToggle={handleToggle}
            />
        </main>
    );
}

export default HomePage;