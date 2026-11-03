function AboutPage() {
    const date = "November 2nd, 2026"
    return (
        <main className="container py-4">
            <h1>About</h1>
            <p><strong>Author:</strong> Gavin K. & Andre V.</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Version:</strong> 1.0.0</p>
        </main>
    );
}

export default AboutPage;