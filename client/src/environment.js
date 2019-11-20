export const prod = process.env.NODE_ENV === "production";
export const debug = !prod;

if (prod) {
    console.log("%cOwe Drahn", "font-size:40px; color:#7289da;");

    const consoleAnimation = [
        "background-image: url(\"http://bestanimations.com/Games/Dice/rolling-dice-gif-7.gif\")",
        "background-size: cover",
        "padding: 30px 50px",
        "line-height: 50px"
    ].join(";");
    console.log("%c ", consoleAnimation);
    const consoleInformation = [
        "color: #7289da"
    ].join(";");
    console.log("%cIf you want to contribute check out the repo https://github.com/drdreo/Owe-Drahn ", consoleInformation);


    // console.log = function () {
    // };
} else {
    console.log(process.env);

}
