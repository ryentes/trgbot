const { Message } = require("discord.js");

module.exports = {
    commands: ["add", "addition"],
    expectedArgs: "<num1> <num2>",
    permissionError: "You need Administrator permissions to run this command",
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        // some code here
        console.log(`the answer is +${arguments[0]}+${arguments[1]}`)
    },
    permissions: [],
    requiredRoles: ['TRG Member']
}