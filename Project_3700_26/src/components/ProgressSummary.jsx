function ProgressSummary({ completedCount, availableCount, lockedCount, total }) {
    return (
        <section className="mb-3" aria-label="Course progress">
            <strong>
                {completedCount} of {total} courses completed
            </strong>
            <span className="ms-3">Available: {availableCount}</span>
            <span className="ms-3">Locked: {lockedCount}</span>
        </section>
    );
}

export default ProgressSummary;