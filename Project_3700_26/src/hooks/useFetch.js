import { useState, useEffect } from "react";

// Custom hook: fetches JSON from a URL when the component mounts.
// Returns: { data, isPending, error }
function useFetch(url) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Lets us cancel the request if the component unmounts mid-fetch
        const controller = new AbortController();

        fetch(url, { signal: controller.signal })
            .then((res) => {
                // fetch only rejects on network failure, so check HTTP status too
                if (!res.ok) {
                    throw new Error(`Could not fetch data (status ${res.status})`);
                }
                return res.json();
            })
            .then((json) => {
                setData(json);
                setIsPending(false);
            })
            .catch((err) => {
                // Ignore the error caused by our own cancel
                if (err.name === "AbortError") return;
                setError(err.message);
                setIsPending(false);
            });

        // Cleanup runs on unmount
        return () => controller.abort();
    }, [url]);

    return { data, isPending, error };
}

export default useFetch;