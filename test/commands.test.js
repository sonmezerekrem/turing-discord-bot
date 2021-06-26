/* eslint-disable */
require('dotenv').config({ path: 'test.env' });

const run = require('../src/app');

describe('Commands Test', () => {

    let client;

    beforeAll(done => {
        client = run(__dirname + '/../');
        expect(client).toBeDefined();
        done();
    });

    afterAll(done => {
        client.destroy();
        done();
    });


    describe('Fun Commands Test', () => {
        const message = {
            author: {
                id: 1
            },
            reply: function (content) {
                return content;
            },
            channel: {
                send: function (content) {
                    return Promise.resolve(content);
                }
            }
        };

        test('random.js', async () => {
            const command = client.commands.get('random');
            const result = await command.execute(message);
            expect(result).toMatch(/Your magical number is \d[0-9]?[0-9]?/);
        });

        test('wallpaper.js', async () => {
            const command = client.commands.get('wallpaper');
            const result = await command.execute(message);
            expect(result).toBe('Here is your daily image link by Unsplash: https://source.unsplash.com/daily');
        });
    });


    describe('Tool Commands Test', () => {
        const message = {
            author: {
                id: 1
            },
            guild: {
                id: 1
            },
            reply: function (content) {
                return content;
            },
            channel: {
                send: function (content) {
                    return content;
                }
            },
            delete: function () {
            },
            content: '+code code testing'
        };

        test('calculator.js', async () => {
            const command = client.commands.get('calculator');
            const args = ['3', '+', '5'];
            const result = await command.execute(message, args);
            expect(result).toBe('**Expression:** _3 + 5_\n**Result:** _8_');
        });

        test('calculator.js', async () => {
            const command = client.commands.get('calculator');
            const args = ['qwerty'];
            const result = await command.execute(message, args);
            expect(result).toBe('Wrong expression! Detailed documentation: https://mathjs.org/index.html');
        });


        test('clock.js', async () => {
            const spy = jest.spyOn(message.channel, 'send');
            const command = client.commands.get('clock');
            const args = ['london'];
            await command.execute(message, args);
            expect(spy).toBeCalled();
        });

        test('clock.js', async () => {
            const spy = jest.spyOn(message.channel, 'send');
            const command = client.commands.get('clock');
            const args = ['qwerty'];
            await command.execute(message, args);
            expect(spy).toBeCalled();
            expect(spy)
                .toBeCalledWith('I couldn\'t find any match for your search. All cities list: https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a');
        });

        test('code.js', async () => {
            const sendSpy = jest.spyOn(message.channel, 'send');
            const deleteSpy = jest.spyOn(message, 'delete');
            const command = client.commands.get('code');
            await command.execute(message);
            expect(sendSpy).toBeCalled();
            expect(deleteSpy).toBeCalled();
            expect(sendSpy).toBeCalledWith('By [object Object]\n>>> code testing');
        });
    });
});
