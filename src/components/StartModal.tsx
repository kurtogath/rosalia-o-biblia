"use client";

import * as analytics from "@/lib/analytics";
import { X } from "lucide-react";
import { useState } from "react";

interface StartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (count: number) => void;
}

export default function StartModal({
  isOpen,
  onClose,
  onStart,
}: StartModalProps) {
  const [selectedCount, setSelectedCount] = useState<number>(10);

  if (!isOpen) return null;

  const handleStart = () => {
    if (selectedCount >= 5 && selectedCount <= 15) {
      onStart(selectedCount);
      onClose();
    }
  };

  const handleSliderChange = (newValue: number) => {
    setSelectedCount(newValue);
    // Track cuando el usuario cambia el slider
    analytics.trackQuestionCountChanged(newValue);
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          ¿Cuántas frases quieres jugar?
        </h2>

        <p className="text-gray-600 mb-6 text-sm">
          Elige entre 5 y 10 frases para poner a prueba tu conocimiento
        </p>

        <div className="mb-6">
          <input
            type="range"
            min="5"
            max="10"
            value={selectedCount}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>5</span>
            <span className="text-2xl font-bold text-purple-600">
              {selectedCount}
            </span>
            <span>10</span>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full btn-start py-3 px-6 rounded-xl font-semibold text-white transition-all hover:scale-105"
        >
          ¡Comenzar!
        </button>
      </div>
    </div>
  );
}
