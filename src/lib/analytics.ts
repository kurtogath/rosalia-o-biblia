// Utilidades para Google Analytics 4

declare global {
    interface Window {
      gtag?: (
        command: string,
        targetId: string,
        config?: Record<string, unknown>
      ) => void;
    }
  }
  
  // Evento: Inicio de juego
  export const trackGameStarted = (questionCount: number) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "game_started", {
        event_category: "Game",
        event_label: "Questions Selected",
        value: questionCount,
        question_count: questionCount,
      });
    }
  };
  
  // Evento: Respuesta dada
  export const trackQuestionAnswered = (
    isCorrect: boolean,
    questionNumber: number,
    guess: "rosalia" | "biblia",
    correctAnswer: "rosalia" | "biblia"
  ) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "question_answered", {
        event_category: "Game",
        event_label: isCorrect ? "Correct" : "Incorrect",
        question_number: questionNumber,
        user_guess: guess,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
      });
    }
  };
  
  // Evento: Juego completado
  export const trackGameCompleted = (
    correctAnswers: number,
    totalQuestions: number,
    percentage: number
  ) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "game_completed", {
        event_category: "Game",
        event_label: "Game Finished",
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        percentage: percentage,
        value: percentage,
      });
    }
  };
  
  // Evento: Compartir en redes sociales
  export const trackShareResult = (
    platform: "twitter" | "instagram",
    correctAnswers: number,
    totalQuestions: number
  ) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "share", {
        event_category: "Social",
        event_label: platform,
        method: platform,
        content_type: "game_result",
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
      });
    }
  };
  
  // Evento: Apertura del modal
  export const trackModalOpened = () => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "modal_opened", {
        event_category: "Engagement",
        event_label: "Start Modal",
      });
    }
  };
  
  // Evento: Cambio de cantidad de preguntas
  export const trackQuestionCountChanged = (count: number) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "question_count_changed", {
        event_category: "Engagement",
        event_label: "Slider Interaction",
        value: count,
      });
    }
  };
  
  // Evento: Reset del juego
  export const trackGameReset = (
    fromQuestion: number,
    totalQuestions: number
  ) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "game_reset", {
        event_category: "Game",
        event_label: "Play Again",
        from_question: fromQuestion,
        total_questions: totalQuestions,
      });
    }
  };
  
  // Evento: Error en la carga
  export const trackError = (errorType: string, errorMessage: string) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "error", {
        event_category: "Error",
        event_label: errorType,
        error_message: errorMessage,
      });
    }
  };
  
  // Evento: Tiempo de juego
  export const trackGameDuration = (durationInSeconds: number) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "game_duration", {
        event_category: "Game",
        event_label: "Time Played",
        value: durationInSeconds,
        duration_seconds: durationInSeconds,
      });
    }
  };
  
  // Evento: Vista de página personalizada
  export const trackPageView = (url: string, title: string) => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: title,
      });
    }
  };