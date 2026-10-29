function CourseCard({ course, allCourses }) {
    // Convert prerequisite ids to course numbers, e.g. [1] -> "CSC1700"
    const prereqText =
        course.prerequisites.length === 0
            ? "None"
            : course.prerequisites
                .map((id) => allCourses.find((c) => c.id === id)?.number)
                .join(", ");

    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title">
                    {course.number}: {course.title}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                    {course.credits} credits
                </h6>
                <p className="card-text">{course.description}</p>
                <p className="card-text">
                    <strong>Prerequisites:</strong> {prereqText}
                </p>
            </div>
        </div>
    );
}

export default CourseCard;