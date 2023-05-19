import * as z from "zod";
import * as uuid from "uuid";

const playerPrefix = "PLAYER#";
export const playerIdSchema = z
  .string()
  .startsWith(playerPrefix)
  .refine(
    (str: string) => {
      return uuid.validate(str.substring(playerPrefix.length));
    },
    {
      message: "PlayerID does not end with valid UUID",
    }
  );

export const computerPlayerSchema = z.enum(["MINIMAX", "ALPHABETA"]);

const gameIDPrefix = "GAME#";
export const gameIdSchema = z
  .string()
  .startsWith(gameIDPrefix)
  .refine((str: string) => {
    return uuid.validate(str.substring(gameIDPrefix.length));
  });

export const actionSchema = z
  .object({
    type: z.enum(["ABORT", "MOVE"]),
    data: z
      .object({
        column: z.number().gte(0).lte(6),
      })
      .optional(),
  })
  .refine(
    (arg) => {
      if (arg.type == "MOVE" && !arg.data) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Move information not provided.",
    }
  );
