import useFetch from "../hooks/useFetch";
import CourseList from "../components/CourseList";

const API = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
    const { data: courses, isPending, error } = useFetch(`${API}/courses`);

    if (isPending) return <p className="p-3">Loading courses...</p>;
    if (error) return <p className="p-3 text-danger">Error: {error}</p>;

    return (
        <div className="container py-3">
            <h1 className="mb-3">Aurora CS Course Scheduler</h1>
            <CourseList courses={courses} />
        </div>
    );
}

export default HomePage;