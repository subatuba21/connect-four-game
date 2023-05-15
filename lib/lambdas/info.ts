import { join } from "path";

const lambdas = {
    game: {
        post: {
            path: join(__dirname, "game", "post.ts"),
            name: "post_game"
        }
    }
}

export default lambdas;