export const prod = process.env.NODE_ENV === "production";
export const debug = !prod;

if (prod) {
    console.log = function () {
    };
}
