import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Reads the parameter 'limit' (default set to 1)
  const limitParam = Number(searchParams.get('limit')) || 1;
  //Set max of 100 quotes
  const limit = Math.max(1, Math.min(limitParam, 100));

  const { rows } = await pool.query(
    `
    SELECT id, frase
    FROM public.frases
    ORDER BY random()
    LIMIT $1
    `,
    [limit]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: 'No hay frases disponibles' },
      { status: 404 }
    );
  }

  // Return all the quotes
  return NextResponse.json(rows);
}
