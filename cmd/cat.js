const snek = module.require("snekfetch");
const api = "http://aws.random.cat/meow";

module.exports.run = async (client, message, args) => {

    // using try/catch because why not
    try {

        let msg =await message.channel.send("Generating...");

        let file = (await snek.get(api)).body.file;
        if (!file) return message.channel.send("Something bad happened! Try again.");

        await message.channel.send({files: [
            {
                attachment: file,
                name: file.split("/").pop()
            }
        ]});

        msg.delete();

    } catch (err) {

        message.channel.send("Oh no! An error occured: ```javascript\n" + err + "```");
        console.error(err.stack);
        
    }
}

module.exports.help = {
    name: "cat"
}