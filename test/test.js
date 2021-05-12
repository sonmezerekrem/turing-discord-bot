require('dotenv').config({ path: 'test.env' });
const logger = require('../utils/logger');
const path = require('path');

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const run = require('../app');
const help = require('../commands/info/help');

const dirname = path.dirname(__dirname);

describe('All Tests', function() {
    const client = run(dirname);
    let guild;
    let channel;
    let message;

    before(async function() {
        logger.info('Before Tests');
        await client.login(process.env.token);
        guild = client.guilds.cache.get(process.env.guild);
        do {
            console.log("loop");
            if (guild != null) {
                console.log("break");
                channel = guild.channels.cache.get(process.env.channel);
                break;
            }
        } while (channel == null);
        message = await channel.messages.fetch(process.env.message);
    });

    after(function() {
        logger.info('After Tests');
        if (channel == null){
            client.destroy();
            return;
        }
        channel.messages.fetch({
            limit: 100
        }).then(async (messages) => {
            const botMessages = [];
            messages.filter(m => m.author.id === process.env.bot).forEach(msg => botMessages.push(msg));
            await channel.bulkDelete(botMessages);
            client.destroy();
        });
    });


    describe('Help Command Test', function() {
        it('Should return list of commands embed', async function() {
            message.content = '+help';
            const result = await help.execute(message, []);
            const embed = result.embeds[0];
            assert.equal(embed.title, 'Help');
            assert.equal(embed.description, 'Here\'s a list of all commands:');
        });
        it('Should return play command information', async function() {
            message.content = '+help';
            const result = await help.execute(message, ['play']);
            const embed = result.embeds[0];
            assert.equal(embed.title, 'play');
            assert.equal(embed.description, 'Plays a music with given queries or Youtube URL');
        });

    });


});