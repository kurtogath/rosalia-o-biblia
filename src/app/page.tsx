"use client";

import { checkQuoteAnswer, getQuotes } from "@/app/actions";
import StartModal from "@/components/StartModal";
import WelcomeScreen from "@/components/WelcomeScreen";
import * as analytics from "@/lib/analytics";
import {
  downloadImage,
  generateStoryImage,
  shareToInstagramStories,
} from "@/lib/storyGenerator";
import { GuessType, Quote } from "@/types";
import { BarChart3, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [generatingImage, setGeneratingImage] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Track game duration cuando el juego termina
  useEffect(() => {
    if (
      currentQuote === null &&
      correctAnswers + wrongAnswers > 0 &&
      gameStartTime
    ) {
      const durationInSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
      analytics.trackGameDuration(durationInSeconds);
    }
  }, [currentQuote, correctAnswers, wrongAnswers, gameStartTime]);

  const fetchQuotes = async (count: number) => {
    setLoading(true);
    setMessage(null);
    setOrigen(null);
    setLastCheck(null);
    try {
      const data = await getQuotes(count);

      if (!data?.length) throw new Error("No se pudo obtener frases");

      setQuotes(data);
      setCurrentQuote(data[0]);
      setCurrentQuoteIndex(0);
      setWrongAnswers(0);
      setCorrectAnswers(0);
      setGameStarted(true);
      setGameStartTime(Date.now());

      // Track game started
      analytics.trackGameStarted(count);
    } catch (err) {
      setMessage("Error cargando frases");
      analytics.trackError(
        "fetch_quotes",
        err instanceof Error ? err.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (count: number) => {
    setQuoteCount(count);
    fetchQuotes(count);
  };

  const handleModalOpen = () => {
    setShowModal(true);
    analytics.trackModalOpened();
  };

  const checkAnswer = async (guess: GuessType) => {
    if (!currentQuote || hasChecked) return;

    setLoading(true);
    setMessage(null);
    setOrigen(null);

    try {
      const data = await checkQuoteAnswer(currentQuote.id, guess);

      setMessage(data.correctSource === "rosalia" ? "Rosalía" : "la Biblia");
      setOrigen(data.origen);
      setLastCheck(data.correct);
      setHasChecked(true);

      // Track question answered
      analytics.trackQuestionAnswered(
        data.correct,
        currentQuoteIndex + 1,
        guess,
        data.correctSource
      );

      if (data.correct) {
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setWrongAnswers((prev) => prev + 1);
      }

      // Si es la última pregunta, track game completed
      if (currentQuoteIndex === quotes.length - 1) {
        const finalCorrectAnswers = data.correct
          ? correctAnswers + 1
          : correctAnswers;
        const percentage = Math.round((finalCorrectAnswers / quoteCount) * 100);
        setTimeout(() => {
          analytics.trackGameCompleted(
            finalCorrectAnswers,
            quoteCount,
            percentage
          );
        }, 500);
      }
    } catch (err: any) {
      setMessage(err.message || "Error al comprobar");
      analytics.trackError("check_answer", err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const nextQuote = () => {
    if (!hasChecked) return;

    const nextIndex = currentQuoteIndex + 1;

    if (nextIndex < quotes.length) {
      setCurrentQuote(quotes[nextIndex]);
      setCurrentQuoteIndex(nextIndex);
      setHasChecked(false);
      setLastCheck(null);
      setMessage(null);
      setOrigen(null);
    } else {
      setMessage("¡Has completado todas las frases!");
      setCurrentQuote(null);
    }
  };

  const resetGame = () => {
    // Track reset
    analytics.trackGameReset(currentQuoteIndex + 1, quoteCount);

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
    setGameStartTime(null);
  };

  const shareOnTwitter = () => {
    const percentage = Math.round((correctAnswers / quoteCount) * 100);

    // Track share
    analytics.trackShareResult("twitter", correctAnswers, quoteCount);

    // Mensaje dinámico según puntuación
    let message = "";
    let emoji = "";

    if (percentage === 100) {
      message = "¡Perfecto! Acerté todas las frases";
      emoji = "🎉";
    } else if (percentage >= 80) {
      message = "¡Casi perfecto! Soy un experto";
      emoji = "🔥";
    } else if (percentage >= 60) {
      message = "¡Buen resultado! Me defiendo bien";
      emoji = "👍";
    } else if (percentage >= 40) {
      message = "No está mal, pero puedo mejorar";
      emoji = "💪";
    } else {
      message = "Esto es más difícil de lo que pensaba";
      emoji = "😅";
    }

    const tweetText = `${emoji} ${message}

¿Letra de Rosalía o versículo de la Biblia?

Mi puntuación: ${correctAnswers}/${quoteCount} (${percentage}%) 🎯

¿Puedes superarme? 👇

https://rosalia.unkedition.com/

#rosalia #lux #motomami #unk
`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;

    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const shareOnInstagram = async () => {
    setGeneratingImage(true);

    try {
      // Track share attempt
      analytics.trackShareResult("instagram", correctAnswers, quoteCount);

      // Generar la imagen
      const imageBlob = await generateStoryImage(
        correctAnswers,
        quoteCount,
        "/sabanas.png"
      );

      // Detectar si es móvil
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // En móvil: intentar abrir Instagram
        shareToInstagramStories(imageBlob);
      } else {
        // En desktop: descargar imagen
        downloadImage(
          imageBlob,
          `rosalia-biblia-${correctAnswers}-${quoteCount}.png`
        );
        alert(
          "¡Imagen descargada! Súbela a tu Instagram Story desde tu móvil 📱"
        );
      }
    } catch (error) {
      console.error("Error generating story image:", error);
      analytics.trackError(
        "generate_story",
        error instanceof Error ? error.message : "Unknown error"
      );
      alert("Error al generar la imagen. Inténtalo de nuevo.");
    } finally {
      setGeneratingImage(false);
    }
  };

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

  const renderShareButtons = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
        <button
          onClick={shareOnTwitter}
          className="btn-share-twitter rounded-lg px-6 py-3 cursor-pointer font-semibold flex items-center gap-2 transition-all hover:scale-105"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Compartir en Twitter
        </button>

        <button
          onClick={shareOnInstagram}
          disabled={generatingImage}
          className="btn-share-instagram rounded-lg px-6 py-3 cursor-pointer font-semibold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
        >
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            {generatingImage ? "Generando..." : "Compartir en Stories"}
          </>
        </button>

        <button
          onClick={resetGame}
          className="btn-next rounded-lg border border-gray-300 px-6 py-3 cursor-pointer font-semibold transition-all hover:scale-105"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  };

  const renderGameZone = () => {
    return (
      <div className="game-zone p-4">
        {loading && !currentQuote && (
          <p className="text-gray-500">Cargando...</p>
        )}

        {currentQuote && (
          <>
            <blockquote className="mb-6 text-2xl italic quote-zone font-bold">
              " {currentQuote.frase} "
            </blockquote>

            <div className="mb-4 text-sm text-gray-500">
              Frase {currentQuoteIndex + 1} de {quotes.length}
            </div>
          </>
        )}

        {!currentQuote &&
          correctAnswers + wrongAnswers > 0 &&
          renderShareButtons()}

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

            <div className="mt-6 text-lg font-medium flex flex-wrap items-center justify-center gap-2 check-zone">
              {message && (
                <>
                  {/* Estado de la respuesta */}
                  <span
                    className={lastCheck ? "text-green-400" : "text-red-600"}
                  >
                    {lastCheck ? "¡Correcto!" : "Incorrecto"}
                  </span>

                  {/* Separador */}
                  <span>-</span>

                  {/* Emoji según respuesta correcta */}
                  <span className="text-2xl">
                    {message === "Rosalía" ? "💃" : "📖"}
                  </span>

                  {/* Origen (canción/versículo) */}
                  {origen && <span className="text-gray-500">{origen}</span>}
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
            <Image
              className="logo-web"
              src="/icon.webp"
              alt="unk icon"
              width={100}
              height={100}
            />
          </span>
        </Link>
      </nav>
    );
  };

  // Set WelcomeScreen
  if (!gameStarted) {
    return (
      <main className="welcome-screen flex items-center justify-center p-4">
        <WelcomeScreen onStartClick={handleModalOpen} />
        <StartModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onStart={handleStartGame}
        />
      </main>
    );
  }

  return (
    <main className="rosalia-main flex items-center justify-center p-4">
      {renderNavbar()}
      {renderScore()}
      {renderGameZone()}
    </main>
  );
}
