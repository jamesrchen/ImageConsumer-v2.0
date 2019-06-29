module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You have insufficent permissions to mute a member!");

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!toMute) return message.channel.send("No user specified!");

    if (toMute.id === message.author.id) return message.channel.send("You can't mute yourself!")
    if (toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't mute a member who has a higher role than you!");

    let role = message.guild.roles.find(r => r.name === "Muted");
    if (!role) {
        try {
            role = await message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            });
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            })
        } catch (e) {
            console.log(e.stack)
        }
    }

    if (toMute.roles.has(role.id)) return message.channel.send("This user is already muted!")

    await toMute.addRole(role);
    message.channel.send(`${toMute} has been muted.`)

    return;
}

module.exports.help = {
    name: "mute"
}