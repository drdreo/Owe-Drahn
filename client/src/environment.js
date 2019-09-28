export const prod = process.env.NODE_ENV === "production";
export const debug = !prod;

console.log(process.env.NODE_ENV);

if (prod) {
    console.log = function () {
    };
}
