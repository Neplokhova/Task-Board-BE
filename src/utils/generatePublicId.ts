import { createHash, randomUUID } from 'node:crypto';

export const generatePublicId = (): string => {
  const uuid = randomUUID();

  return createHash('sha256').update(uuid).digest('hex');
};
