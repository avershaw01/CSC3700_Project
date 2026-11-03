import CourseCard from "./CourseCard";

function CourseList({ courses, allCourses, completed, onToggle }) {
    return (
        <div className="row g-3">
            {courses.map((course) => (
                <div className="col-md-6" key={course.id}>
                    <CourseCard
                        course={course}
                        allCourses={allCourses}
                        completed={completed}
                        onToggle={onToggle}
                    />
                </div>
            ))}
        </div>
    );
}

export default CourseList;