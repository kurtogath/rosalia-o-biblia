"use client";

import { useEffect, useState } from "react";

type Quote = { id: number; frase: string };

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Cargar una frase al inicio
  const fetchQuote = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/quote?limit=1", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.length) throw new Error("No se pudo obtener frase");
      setQuote(data[0]);
    } catch (err) {
      setMessage("Error cargando frase 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const checkAnswer = async (guess: "rosalia" | "biblia") => {
    if (!quote) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: quote.id, guess }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error en la comprobación");
      setMessage(
        data.correct
          ? `✅ ¡Correcto! Era ${
              data.correctSource === "rosalia" ? "Rosalía" : "la Biblia"
            }`
          : `❌ Fallaste. Era ${
              data.correctSource === "rosalia" ? "Rosalía" : "la Biblia"
            }`
      );
    } catch (err: any) {
      setMessage(err.message || "Error al comprobar");
    } finally {
      setLoading(false);
    }
  };

  const nextQuote = async () => {
    await fetchQuote();
  };

  return (
    <main className="rosalia-main flex min-h-screen items-center justify-center p-4">
      <div className="bg-effect" />
      <div className="score-display">
        <div className="score-item">
          <span>✅ Correct</span>
          <span className="score-value" id="correctScore">
            0
          </span>
        </div>
        <div className="score-item">
          <span>✅ Correct</span>
          <span className="score-value" id="correctScore">
            0
          </span>
        </div>
        <div className="score-item">
          <span>✅ Correct</span>
          <span className="score-value" id="correctScore">
            0
          </span>
        </div>
      </div>
      <div className="game-zone p-8">
        <h1 className="mb-4 text-2xl font-bold">¿Rosalía o la Biblia?</h1>

        {loading && <p className="text-gray-500">Cargando...</p>}

        {quote && !loading && (
          <blockquote className="mb-6 text-lg italic text-gray-800">
            “{quote.frase}”
          </blockquote>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => checkAnswer("rosalia")}
            disabled={loading || !quote}
            className="rounded-xl bg-pink-600 px-5 py-3 text-white font-semibold hover:bg-pink-700 transition"
          >
            Rosalía
          </button>
          <button
            onClick={() => checkAnswer("biblia")}
            disabled={loading || !quote}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Biblia
          </button>
        </div>

        {message && (
          <div className="mt-6 text-lg font-medium text-gray-700">
            {message}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={nextQuote}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Siguiente frase
          </button>
        </div>
      </div>
    </main>
  );
}
