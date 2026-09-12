"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="fatal-fallback">
        <main>
          <p>Hayati.</p>
          <h1>The moon went quiet for a moment.</h1>
          <button type="button" onClick={reset}>Return to us</button>
        </main>
      </body>
    </html>
  );
}
