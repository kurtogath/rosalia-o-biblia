/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db.ts
import { Pool, PoolConfig } from 'pg';

// Validación de variable de entorno
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

// Extender el tipo global para TypeScript
declare global {
  var pgPool: Pool | undefined;
}

// Configuración del pool
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // ssl: { rejectUnauthorized: false } // Descomenta si tu proveedor lo requiere
};

// Singleton pattern
export const pool = global.pgPool ?? new Pool(poolConfig);

// En desarrollo, guardamos la instancia en global para reutilizarla
if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

// Manejo de errores del pool
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

// Función helper para queries tipadas
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows;
}

// Función helper para transacciones
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}