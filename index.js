require('dotenv').config();
const url = require('url');
const {
    createCanvas,
    loadImage
} = require('canvas')
const fetch = require('node-fetch');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const uid = require("uid");
const nsfwjs = require('nsfwjs');
const path = require('path');
var model = null;
const express = require("express");
const app = express();
app.use(express.static('./public'));

const PREFIX = process.env.prefix;
const TOKEN = process.env.token;

client.commands = new Discord.Collection();

// Read ./cmd/
fs.readdir("./cmd/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("ERROR: No commands to load!");
        return;
    }

    console.log(`Loading ${jsfiles.length} command(s)...`)

    jsfiles.forEach((f, i) => {
        let props = require(`./cmd/${f}`);
        console.log(`${i + 1}: ${f} loaded!`)
        client.commands.set(props.help.name, props);
    });
})

//                      CONFIGURATION
//////////////////////////////////////////////////////////////
// Drawing - safe for work drawings (including anime)       //
// Hentai - hentai and pornographic drawings                //
// Neutral - safe for work neutral images                   //
// Porn - pornographic images, sexual acts                  //
// Sexy - sexually explicit images, not pornography         //
const allowed = ['Neutral'];                                //
//The default doesn't have Drawings because I hate art.     //
//////////////////////////////////////////////////////////////


client.on('ready', async () => {
    console.log(`\nReady to roll!`)
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Serving in ${client.guilds.size} server(s) for ${client.users.size} user(s)!`);
    console.log(`Invite link: ${await client.generateInvite(["ADMINISTRATOR"])}`)
});

client.on('message', async msg => {

    let messageArray = msg.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let cmd = client.commands.get(command.slice(PREFIX.length))
    if (cmd) cmd.run(client, msg, args);
    
    // IMAGE RECOGNITION //
    if (msg.attachments.array().length != 0) {
        for (let i = 0; i < msg.attachments.array().length; i++) {
            let res = await fetch(msg.attachments.array()[i].url);
            let file = './images_temp/' + String(uid(10)) + "." + msg.attachments.array()[i].url.split(".")[msg.attachments.array()[i].url.split(".").length - 1];
            let dest = fs.createWriteStream(file);
            let stream = res.body.pipe(dest);
            stream.on('finish', () => {
                const canvas = createCanvas(299, 299);
                const ctx = canvas.getContext('2d');
                loadImage(file).then(async (image) => {
                    ctx.drawImage(image, 50, 0, 70, 70);
                    const predictions = await model.classify(canvas, 1);
                    console.log(predictions)
                    if (!allowed.includes(predictions[0].className)) {
                        msg.reply("This photo is restricted - " + predictions[0].className);
                        msg.delete();
                    } else {
                        msg.reply("Photo is clean - " + predictions[0].className);
                    }

                });
            })
        }
    }

});

client.login(TOKEN);

app.listen(3000, async function () {
    console.log("Loading model...")
    model = await nsfwjs.load("http://localhost:3000/model/", {
        size: 299
    });
    console.log(model)
});