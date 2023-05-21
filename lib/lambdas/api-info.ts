import { join } from "path";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LamdaInfo } from "../utils/types";

const lambdas : LamdaInfo = {
    game: {
        post: {
            path: join(__dirname, "api", "game", "post.ts"),
            name: "post_game",
            environment: (tableName) => {
                return {
                    tableName,
                }
            }
        },
        get: {
            path: join(__dirname, "api", "game", "get.ts"),
            name: "get_game",
            environment: (tableName) => {
                return {
                    tableName,
                }
            }
        },
        put: {
            path: join(__dirname, "api", "game", "put.ts"),
            name: "put_game",
            environment: (tableName) => {
                return {
                    tableName,
                }
            }
        }
    }
}

export default lambdas;