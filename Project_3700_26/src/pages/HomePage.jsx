import useFetch from "../hooks/useFetch";
import { useEffect, useMemo, useState } from "react";
import CourseList from "../components/CourseList";
import ProgressSummary from "../components/ProgressSummary";

const API = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
    const { data: courses, isPending, error } = useFetch(`${API}/api/courses`);
    const { data: savedCompletions, isPending: completionsPending, error: completionsError } = useFetch(`${API}/api/completions`);
    const [completed, setCompleted] = useState([]);
    const [filter, setFilter] = useState("all");
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        if (Array.isArray(savedCompletions)) {
            setCompleted(savedCompletions.map(Number));
        }
    }, [savedCompletions]);

    function handleToggle(courseId) {
        const id = Number(courseId);
        const course = courses.find((item) => Number(item.id) === id);
        if (!course) return;

        setCompleted((current) => {
            const isAlreadyCompleted = current.includes(id);

            if (isAlreadyCompleted) {
                const toRemove = new Set([id]);
                let changed = true;

                while (changed) {
                    changed = false;
                    for (const item of courses) {
                        const dependsOnRemoved = (item.prerequisites || []).some(
                            (prereqId) => toRemove.has(Number(prereqId)),
                        );
                        if (dependsOnRemoved && !toRemove.has(Number(item.id))) {
                            toRemove.add(Number(item.id));
                            changed = true;
                        }
                    }
                }
                return current.filter((completedId) => !toRemove.has(Number(completedId)));
            }
            const prerequisitesMet = (course.prerequisites || []).every((prereqId) =>
                current.includes(Number(prereqId)),
            );
            if (!prerequisitesMet) return current;

            return [...current, id];
        });
    }
    async function handleSave() {
        setSaveMessage("");

        try {
            const response = await fetch(`${API}/api/completions`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(completed),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not save progress.");
            }

            setSaveMessage("Progress saved.");
        } catch (err) {
            setSaveMessage(`Error: ${err.message}`);
        }
    }



    const coursesWithStatus = useMemo(() => {
        if (!courses) return [];

        return courses.map((course) => {
            const id = Number(course.id);
            const isCompleted = completed.includes(id);
            const isAvailable = (course.prerequisites || []).every((prereqId) =>
                completed.includes(Number(prereqId)),
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

    if (isPending || completionsPending) {
        return <p className="p-3">Loading courses and progress...</p>;
    }
    if (error || completionsError) {
        return <p className="p-3 text-danger">Error: {error || completionsError}</p>;
    }
    return (
        <main className="container py-3">
            <h1 className="mb-3">Aurora CS Course Scheduler</h1>

            <ProgressSummary
                completedCount={completedCount}
                availableCount={availableCount}
                lockedCount={lockedCount}
                total={courses.length}
            />

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
                {saveMessage && <span role="status">{saveMessage}</span>}
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