function CourseCard({ course, allCourses, completed, onToggle }) {
    const isCompleted = completed.includes(Number(course.id));
    const prereqText =
        !course.prerequisites || course.prerequisites.length === 0
            ? "None"
            : course.prerequisites
            .map((id) => {
                const match = allCourses?.find(
                    (c) => Number(c.id) === Number(id)
                );
                return match?.number;
            })
            .filter(Boolean)
            .join(", ") || "None";
    const badgeClass = {
        Completed: "text-bg-success",
        Available: "text-bg-primary",
        Locked: "text-bg-secondary",
    }[course.status];

    return (
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">
                        {course.number}: {course.title}
                    </h5>

                    <span className={`badge ${badgeClass}`}>{course.status}</span>
                </div>

                <h6 className="card-subtitle mb-2 text-muted">
                    {course.credits} credits
                </h6>

                <p className="card-text">{course.description}</p>
                <p className="card-text">
                    <strong>Prerequisites:</strong> {prereqText}
                </p>

                <div className='form-check'>
                    <input
                        className='form-check-input'
                        type="checkbox"
                        id={`completed-${course.id}`}
                        checked={isCompleted}
                        disabled={!isCompleted && !course.isAvailable}
                        onChange={() => onToggle(course.id)}
                    />
                    <label className='form-check-label' htmlFor={`completed-${course.id}`}>Completed</label>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;