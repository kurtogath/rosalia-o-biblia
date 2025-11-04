import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

type Body = { id: number; guess: 'rosalia' | 'biblia' };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body?.id || !['rosalia', 'biblia'].includes(body.guess)) {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 });
  }

  const { rows } = await pool.query(
    `SELECT id, rosalia, origen FROM public.frases WHERE id = $1`,
    [body.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Frase no encontrada' }, { status: 404 });
  }

  const isRosalia: boolean = rows[0].rosalia;
  const correct = (body.guess === 'rosalia') === isRosalia;

  return NextResponse.json({
    correct,
    correctSource: isRosalia ? 'rosalia' : 'biblia',
    origen: rows[0].origen ?? null,
  });
}
