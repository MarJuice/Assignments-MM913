import { ANSI } from './ansi.mjs';

function print(text, color = ANSI.COLOR.WHITE) {
    console.log(color, text, ANSI.RESET)
}

export { print }