// I thought this command can be useful in the future.
module.exports.run = async (client, message, args) => {
    // AWAIT MESSAGES FROM THE AUTHOR //
    await message.channel.send("Awaiting...");
    const msgs = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
        time: 5000
    });
    message.channel.send(`Await completed! ${msgs.map(msg => msg.content).join(", ")}`);
}

module.exports.help = {
    name: "await-message"
}