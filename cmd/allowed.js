const fs = require("fs");

module.exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("MANAGE_SERVER")) return message.reply("You have insufficent permissions!");
    if (!args[0]) return message.reply("Please provide a preference.");

    let preferences = JSON.parse(fs.readFileSync("./preferences.json", "utf8"));

    preferences[message.guild.id] = {
        preferences: args[0]
    };
};

fs.writeFile("./preferences.json", JSON.stringify(preferences), (err) => {
    if (err) console.log(err.stack);
});

message.channel.reply(`Preference saved for this guild: **${args[0]}**`)

module.exports.help = {
    name: "allowed"
}