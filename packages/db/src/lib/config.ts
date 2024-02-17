if (!process.env['DATABASE_URL']) {
    throw new Error('DATABASE_URL must be set');
  }
  
export const dbString = process.env['DATABASE_URL'];

