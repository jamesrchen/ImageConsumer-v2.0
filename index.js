require('dotenv').config();
const url = require('url');
const { createCanvas, loadImage } = require('canvas')
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

//CONFIGURATION
//////////////////////////////////////////////////////////////
// Drawing - safe for work drawings (including anime)
// Hentai - hentai and pornographic drawings
// Neutral - safe for work neutral images
// Porn - pornographic images, sexual acts
// Sexy - sexually explicit images, not pornography
const allowed = ['Neutral'];
//The default doesn't have Drawings because I hate art.
//////////////////////////////////////////////////////////////


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if(msg.attachments.array().length != 0){
        for (let i = 0; i < msg.attachments.array().length; i++) {
            let res = await fetch(msg.attachments.array()[i].url);
            let file = './images_temp/'+String(uid(10))+"."+msg.attachments.array()[i].url.split(".")[msg.attachments.array()[i].url.split(".").length-1];
            let dest = fs.createWriteStream(file);
            let stream = res.body.pipe(dest);
            stream.on('finish', ()=>{
                const canvas = createCanvas(299,299);
                const ctx = canvas.getContext('2d');
                loadImage(file).then(async (image) => {
                    ctx.drawImage(image, 50, 0, 70, 70);
                    const predictions = await model.classify(canvas, 1);
                    console.log(predictions)
                    if(!allowed.includes(predictions[0].className)){
                        msg.reply("This photo is restricted - "+predictions[0].className);
                        msg.delete();
                    }else{
                        msg.reply("Photo is clean - "+predictions[0].className);
                    }

                });
            })
        }
    }
});

client.login(process.env.token);
app.listen(3000, async function(){
    console.log("Loading model")
    model = await nsfwjs.load("http://localhost:3000/model/", {size: 299});
    console.log(model)
});