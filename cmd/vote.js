module.exports.run = async (client, message, args) => {

    // using try/catch because why not
    try { 

        // Declare the constant variables.
        const agree = "✅";
        const disagree = "❎";
        const arguments = message.content.split(' ');
        // Multiply the time with 1000 because the message sender will enter SECONDS not MILISECONDS.
        const voteTime = parseInt(arguments[1], 10) * 1000;
        const voteArg = arguments.slice(2).join(' ');

        // If the time is a string, stop.
        if (isNaN(voteTime)) return message.channel.send("Invalid time specified!");

        // Send the vote message.
        let msg = await message.channel.send(`Vote for: **${voteArg}**`);
        await msg.react(agree);
        await msg.react(disagree);

        // Await the reactions.
        const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {
            time: voteTime
        });

        // If there are no reactions, stop.
        if (reactions.get(agree) === undefined && reactions.get(disagree) === undefined) return message.reply("No votes recorded!");

        // the lines below looks like i used some duct tape to assemble the broken pieces, i'll get back to it when i find a better solution.
        // for some reason when users don't vote for "agree", it throws an error. but when people don't vote for "disagree", it works!
        let agreeCount;
        if (reactions.get(agree) === undefined) {
            agreeCount = 0;
        } else {
            agreeCount = reactions.get(agree).count - 1
        }

        // Send the vote results.
        message.reply(`Voting for **"${voteArg}**" has been completed! \n**__Results:__**\n\n${agree} : ${agreeCount}\n${disagree} : ${reactions.get(disagree).count - 1}`);
        msg.delete();
    } catch (err) {
        message.channel.send("Oh no! An error occured: ```javascript\n" + err + "```");
        console.error(err.stack);
    }
}

module.exports.help = {
    name: "vote"
}