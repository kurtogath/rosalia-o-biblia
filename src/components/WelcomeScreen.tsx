"use client";

import { Book, Music } from "lucide-react";
import Image from "next/image";

interface WelcomeScreenProps {
  onStartClick: () => void;
}

export default function WelcomeScreen({ onStartClick }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen min-h-screen flex items-center justify-center p-4">
      <div className="welcome-content max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center gap-8 items-center">
          <Music size={60} className="text-pink-500 animate-bounce" />
          <div className="relative">
            <Image
              src="/icon.webp"
              alt="VS"
              width={80}
              height={80}
              className="opacity-80"
            />
          </div>
          <Book size={60} className="text-amber-600 animate-bounce" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 welcome-title">
          Rosalía o la Biblia
        </h1>

        <p className="text-lg md:text-xl mb-4 max-w-xl mx-auto">
          ¿Podrás distinguir entre las letras de Rosalía y los versículos
          bíblicos?
        </p>

        <p className="text-md mb-8 max-w-lg mx-auto">
          Pondremos a prueba tu conocimiento con frases que podrían pertenecer
          tanto a las canciones de la artista española como a las sagradas
          escrituras. ¿Estás listo para el desafío?
        </p>

        <button
          onClick={onStartClick}
          className="btn-start-game py-4 px-8 rounded-xl font-bold text-lg transition-all hover:scale-110 shadow-lg"
        >
          ¡Jugar Ahora!
        </button>
      </div>
    </div>
  );
}
