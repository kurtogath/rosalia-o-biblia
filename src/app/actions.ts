'use server';
// app/actions.ts
// Server Actions - Se ejecutan en el servidor, la API key nunca se expone

import { CheckResponse, Quote } from "@/types";

// Helper para hacer llamadas internas con la API key
async function fetchWithAuth(endpoint: string, options?: RequestInit) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      'x-api-key': process.env.API_SECRET_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Server Action para obtener quotes
export async function getQuotes(limit: number): Promise<Quote[]> {
  try {
    const data = await fetchWithAuth(`/api/quote?limit=${limit}`, {
      cache: 'no-store',
    });
    return data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('No se pudo obtener las frases');
  }
}

// Server Action para verificar respuesta
export async function checkQuoteAnswer(
  id: number,
  guess: 'rosalia' | 'biblia'
): Promise<CheckResponse> {
  try {
    const data = await fetchWithAuth('/api/check', {
      method: 'POST',
      body: JSON.stringify({ id, guess }),
    });
    return data;
  } catch (error) {
    console.error('Error checking answer:', error);
    throw new Error('Error al verificar la respuesta');
  }
}