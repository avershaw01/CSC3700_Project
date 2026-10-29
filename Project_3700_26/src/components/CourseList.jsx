import CourseCard from "./CourseCard";

function CourseList({ courses }) {
    return (
        <div className="row g-3">
            {courses.map((course) => (
                <div className="col-md-6" key={course.id}>
                    <CourseCard course={course} allCourses={courses} />
                </div>
            ))}
        </div>
    );
}

export default CourseList;