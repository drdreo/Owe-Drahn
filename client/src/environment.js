export const prod = process.env.NODE_ENV === "production";
export const debug = !prod;

export const FirebaseConfig = {
    
}
if (prod) {
    console.log = function () {
    };
}
