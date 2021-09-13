require("dotenv").config()
const { Client, Intents, MessageEmbed } = require('discord.js');
const request = require("request-promise");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on("ready", () => {
    console.log('Crypto Pirce Checker Started!'); 
    client.user.setActivity('Looking at the Crypto Market 🔍');
})




const fetchCrypto = async (crypto, currency) => {
    const options = {
        headers: {
            "Content-Type":"application/json",
            'authorization': `Apikey ${process.env.API_KEY} `
        },
        json:true,
        url: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${currency}`
    }

    const response = await request(options);
    return response.RAW[crypto][currency]
}





client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "crypto" && args[0] && args[1]) {
        const data = await fetchCrypto(args[0].toUpperCase(), args[1].toUpperCase());
        message.channel.send({embeds: [{
            color: 0x4dcc82,
            title: 'Crypto Currency Results 🔍',
            thumbnail: {
                url: `https://www.cryptocompare.com${data.IMAGEURL.toString()}`
            },
            fields: [
                { name: 'Current Price', value: data.PRICE.toString(), inline: true },
                { name: 'Market Cap', value: data.MKTCAP.toString(), inline: true },
                { name: 'Supply', value: data.SUPPLY.toString(), inline: true },
                { name: '24 Hour Volume', value: data.TOTALVOLUME24H.toFixed(2).toString(), inline: true },
                { name: '24 Hour Change', value: data.CHANGE24HOUR.toFixed(2).toString(), inline: true },
                { name: '24 Hour Change %', value: `%${data.CHANGEPCT24HOUR.toFixed(2).toString()}`, inline: true },
                { name: 'Hour Low', value: data.LOWHOUR.toString(), inline: true },
                { name: 'Hour High', value: data.HIGHHOUR.toString(), inline: true },
                { name: 'Daily Low', value: data.LOWDAY.toString(), inline: true },
                { name: 'Daily High', value: data.HIGHDAY.toString(), inline: true },
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: `Crypto Price Checker | ${message.guild.name}`
            }
            }]});
    } else {
        message.channel.send({embed: {
            color: 0x4dcc82,
            description: 'Opps, looks like you did something wrong!',
            fields: [
              { name: 'Example', value: '$crypto BTC USD' }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: `Crypto Price Checker | ${message.guild.name}`
            }
        }});
    }

})


client.login(process.env.DISCORD_TOKEN);