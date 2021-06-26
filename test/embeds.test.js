/* eslint-disable */
require('dotenv').config({ path: 'test.env' });

const run = require('../src/app');
const embeds = require('../src/utils/embeds');

describe('Embeds Test', () => {

    let client;

    beforeAll(done => {
        client = run(__dirname + '/../');
        client.user = {
            avatarURL: function () {
                return 'https://cdn.discordapp.com/embed/avatars/0.png';
            }
        };
        expect(client).toBeDefined();
        done();
    });

    afterAll(done => {
        client.destroy();
        done();
    });


    describe('Help Test', () => {
        const message = {
            client: client,
            guild: {
                name: 'Test',
                ownerID: 1
            },
            channel: {
                type: 'text'
            },
            author: {
                id: 1
            }
        };


        test('no args', async () => {
            message.client = client;
            const result = embeds.help(message, []);
            expect(result).toBeDefined();
            expect(result.title).toEqual('Help');
        });

        test('category arg', async () => {
            message.client = client;
            const result = embeds.help(message, ['info']);
            expect(result).toBeDefined();
            expect(result.title).toEqual('Info Commands');
        });

        test('command arg', async () => {
            message.client = client;
            const result = embeds.help(message, ['play']);
            expect(result).toBeDefined();
            expect(result.title).toEqual('play');
        });
    });

    describe('ServerInfo Test', () => {
        const message = {
            client: client,
            guild: {
                name: 'Test',
                description: 'Test Guild Description',
                owner: 'Owner',
                members: {
                    cache: []
                },
                region: 'region',
                createdAt: new Date(),
                iconURL: function () {
                    return 'https://cdn.discordapp.com/embed/avatars/0.png';
                }
            }
        };
        const dbResult = {
            connections: [{
                name: 'conn name',
                url: 'conn url'
            }]
        };

        test('null result', async () => {
            message.client = client;
            const result = embeds.serverInfo(message, null);
            expect(result).toBeDefined();
            expect(result.title).toEqual('Test');
        });


        test('defined result', async () => {
            message.client = client;
            const result = embeds.serverInfo(message, dbResult);
            expect(result).toBeDefined();
            expect(result.title).toEqual('Test');
            expect(result.fields.filter(field => field.name === 'Connections')).toBeDefined();
        });

    });
});
