module.exports.run = async (client, message, args) => {
        const msg = await message.channel.send("Ping?");
        msg.edit(`:ping_pong: Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
}

module.exports.help = {
    name: "ping"
}