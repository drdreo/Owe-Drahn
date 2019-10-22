module.exports = {
    transform: {"^.+\\.ts?$": "ts-jest"},
    testEnvironment: "node",
    testRegex: "/game/.*\\.(spec)?\\.(ts)$",
    moduleFileExtensions: ["ts", "js", "json", "node"]
};
