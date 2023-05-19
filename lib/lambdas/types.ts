import * as z from 'zod';
import * as uuid from 'uuid';

const playerPrefix = 'PLAYER#';
export const playerIdSchema = z.string().startsWith(playerPrefix).refine((str: string) => {
    return uuid.validate(str.substring(playerPrefix.length));
}, {
    message: 'PlayerID does not end with valid UUID'
});

export const computerPlayerSchema = z.enum(['MINIMAX', 'ALPHABETA']);

const gameIDPrefix = 'GAME#';
export const gameIdSchema = z.string().startsWith(gameIDPrefix).refine((str: string) => {
    return uuid.validate(str.substring(gameIDPrefix.length));
});