function AboutPage() {
    const date = "November 16th, 2026"
    return (
        <main className="container py-4">
            <h1>About</h1>
            <p><strong>Authors:</strong> Gavin K. & Andre V.</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Version:</strong> 2.0.0</p>
        </main>
    );
}

export default AboutPage;