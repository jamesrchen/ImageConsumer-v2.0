const Discord = module.require("discord.js");
const urban = module.require("urban");

module.exports.run = async (client, message, args) => {

    // using try/catch because why not
    try {
        urban.random().first(json => {

            let embed = new Discord.RichEmbed()
                .setColor("#1D2439")
                .setTitle(json.word)
                .setURL(json.permalink)
                .setDescription(json.definition)
                // .addField("Example", json.example, false)
                .addField("👍", json.thumbs_up, true)
                .addField("👎", json.thumbs_down, true)
                .setFooter(`Written by ${json.author} | Written on ${json.written_on}`);

            message.channel.send(embed);
        })
    } catch (err) {

        message.channel.send("Oh no! An error occured: ```javascript\n" + err + "```");
        console.error(err.stack);

    }
}

module.exports.help = {
    name: "randomurban"
}