"use client";

import StartModal from "@/components/StartModal";
import WelcomeScreen from "@/components/WelcomeScreen";
import { CheckResponse, GuessType, Quote } from "@/types";
import { BarChart3, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [origen, setOrigen] = useState<string | null>(null);
  const [quoteCount, setQuoteCount] = useState<number>(10);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);

  const fetchQuotes = async (count: number) => {
    setLoading(true);
    setMessage(null);
    setOrigen(null);
    setLastCheck(null);
    try {
      const res = await fetch(`/api/quote?limit=${count}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data?.length)
        throw new Error("No se pudo obtener frases");

      setQuotes(data);
      setCurrentQuote(data[0]);
      setCurrentQuoteIndex(0);
      setWrongAnswers(0);
      setCorrectAnswers(0);
      setGameStarted(true);
    } catch (err) {
      setMessage("Error cargando frases");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (count: number) => {
    setQuoteCount(count);
    fetchQuotes(count);
  };

  const checkAnswer = async (guess: GuessType) => {
    if (!currentQuote || hasChecked) return;

    setLoading(true);
    setMessage(null);
    setOrigen(null);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentQuote.id, guess }),
      });
      const data: CheckResponse = await res.json();

      if (!res.ok) throw new Error(data?.error || "Error en la comprobación");

      setMessage(data.correctSource === "rosalia" ? "Rosalía" : "la Biblia");
      setOrigen(data.origen);
      setLastCheck(data.correct);
      setHasChecked(true);

      // Set the counters
      if (data.correct) {
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setWrongAnswers((prev) => prev + 1);
      }
    } catch (err: any) {
      setMessage(err.message || "Error al comprobar");
    } finally {
      setLoading(false);
    }
  };

  const nextQuote = () => {
    if (!hasChecked) return; // Only works if it's checked

    const nextIndex = currentQuoteIndex + 1;

    if (nextIndex < quotes.length) {
      setCurrentQuote(quotes[nextIndex]);
      setCurrentQuoteIndex(nextIndex);
      setHasChecked(false);
      setLastCheck(null);
      setMessage(null);
      setOrigen(null);
    } else {
      // Game end
      setMessage("¡Has completado todas las frases!");
      setCurrentQuote(null);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuote(null);
    setCurrentQuoteIndex(0);
    setQuotes([]);
    setHasChecked(false);
    setLastCheck(null);
    setMessage(null);
    setOrigen(null);
    setCorrectAnswers(0);
    setWrongAnswers(0);
  };

  // Renders
  const renderScore = () => {
    const totalAnswered = correctAnswers + wrongAnswers;

    return (
      <div className="score-display">
        <div className="score-item">
          <div className="flex items-center">
            <CheckCircle className="icon-correct mr-1.5" size={20} />
            <span>Aciertos</span>
          </div>
          <span className="score-value">{correctAnswers}</span>
        </div>
        <div className="score-item">
          <div className="flex items-center">
            <XCircle className="icon-error mr-1.5" size={20} />
            <span>Fallos</span>
          </div>
          <span className="score-value">{wrongAnswers}</span>
        </div>
        <div className="score-item">
          <div className="flex items-center">
            <BarChart3 className="icon-total mr-1.5" size={20} />
            <span>Total</span>
          </div>
          <span className="score-value">
            {totalAnswered} / {quoteCount}
          </span>
        </div>
      </div>
    );
  };

  const renderGameZone = () => {
    return (
      <div className="game-zone p-8">
        {!(!currentQuote && correctAnswers + wrongAnswers > 0) && (
          <h1 className="mb-4 text-2xl">Esta frase es de.....</h1>
        )}

        {loading && !currentQuote && (
          <p className="text-gray-500">Cargando...</p>
        )}

        {currentQuote && (
          <>
            <blockquote className="mb-6 text-2xl italic quote-zone font-bold">
              "{currentQuote.frase}"
            </blockquote>

            <div className="mb-4 text-sm text-gray-500">
              Frase {currentQuoteIndex + 1} de {quotes.length}
            </div>
          </>
        )}

        {!currentQuote && correctAnswers + wrongAnswers > 0 && (
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold mb-2">¡Juego terminado!</h2>
            <p className="text-lg mb-4">
              Puntuación final: {correctAnswers} / {quoteCount}
            </p>
            <p className="text-gray-600 mb-6">
              {correctAnswers === quoteCount
                ? "¡Perfecto! Eres un experto 🎉"
                : correctAnswers >= quoteCount * 0.7
                ? "¡Muy bien! Gran puntuación 👏"
                : correctAnswers >= quoteCount * 0.5
                ? "No está mal, ¡sigue practicando! 💪"
                : "¡Inténtalo de nuevo! 🎯"}
            </p>
            <button
              onClick={resetGame}
              className="mt-4 btn-next rounded-lg border border-gray-300 px-4 py-2 cursor-pointer"
            >
              Jugar de nuevo
            </button>
          </div>
        )}

        {currentQuote && (
          <>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => checkAnswer("rosalia")}
                disabled={loading || !currentQuote || hasChecked}
                className="btn-rosalia rounded-xl px-5 py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rosalía
              </button>
              <button
                onClick={() => checkAnswer("biblia")}
                disabled={loading || !currentQuote || hasChecked}
                className="btn-biblia rounded-xl px-5 py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Biblia
              </button>
            </div>

            <div className="mt-6 text-lg font-medium flex items-center justify-center check-zone">
              {message && (
                <>
                  {lastCheck ? (
                    <CheckCircle className="icon-correct mr-1.5" size={20} />
                  ) : (
                    <XCircle className="icon-error mr-1.5" size={20} />
                  )}
                  {lastCheck ? "¡Correcto!" : "Incorrecto"} - Era de {message}
                  {origen && ` (${origen})`}
                </>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={nextQuote}
                disabled={loading || !hasChecked}
                className="btn-next rounded-lg border border-gray-300 px-4 py-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuoteIndex < quotes.length - 1
                  ? "Siguiente frase"
                  : "Ver resultado final"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderNavbar = () => {
    return (
      <nav className="navbar">
        <Link href="/">
          <span onClick={() => setGameStarted(false)} className="logo pl-5">
            Rosalía o la Biblia
          </span>
        </Link>
        <Link href="https://unkedition.com" target="blank">
          <span>
            <Image src="/icon.webp" alt="unk icon" width={100} height={100} />
          </span>
        </Link>
      </nav>
    );
  };

  // Set WelcomeScreen
  if (!gameStarted) {
    return (
      <>
        <WelcomeScreen onStartClick={() => setShowModal(true)} />
        <StartModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onStart={handleStartGame}
        />
      </>
    );
  }

  return (
    <main className="rosalia-main flex min-h-screen items-center justify-center p-4">
      {renderNavbar()}
      {renderScore()}
      {renderGameZone()}
    </main>
  );
}
