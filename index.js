const path = require("path")
const fs = require("fs")
const { token } = require('./config.json')
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');

	const baseFile = "command-base.js"
	const commandBase = require(`./commands/${baseFile}`)

	// Load commands
	const readcommands = (dir) => {
		const  files = fs.readdirSync(path.join(__dirname, dir))
		for(const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if(stat.isDirectory()) {
				readcommands(path.join(dir, file))
			}
			else if(file !== baseFile) {
				const option = require(path.join(__dirname, dir, file))
				commandBase(client, option)
			}
		}
	}

	readcommands("commands")
});

client.login(token);