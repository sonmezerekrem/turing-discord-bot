/*eslint-disable*/
const logger = require('../utils/logger');
const embed = require('../utils/embeds');
const api = require('../utils/api');


module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel) {
        if (newChannel.type !== 'dm') {
            logger.info(`Channel is updated at guild: ${newChannel.guild.name} channel:${newChannel.id}`);

            const changedProperty = {
                changed: false,
                id: '',
                field: '',
                message: ''
            };

            if (oldChannel.type !== 'dm' && newChannel.type !== 'dm') {
                if (oldChannel.name !== newChannel.name) {
                    changedProperty.changed = true;
                    changedProperty.field = 'Name';
                    changedProperty.message = `Channel name changed from _${oldChannel.name}_  to _${newChannel.name}_`;
                }
                else if (oldChannel.hasOwnProperty('topic') && oldChannel.topic !== newChannel.topic) {
                    changedProperty.changed = true;
                    changedProperty.field = 'Topic';
                    changedProperty.message = `Channel topic changed from _${oldChannel.topic}_  to _${newChannel.topic}_`;
                }
                else if (oldChannel.hasOwnProperty('rateLimitPerUser') && oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                    changedProperty.changed = true;
                    changedProperty.field = 'Rate Limit';
                    changedProperty.message = `Channel rate limit changed from _${oldChannel.rateLimitPerUser}_  to _${newChannel.rateLimitPerUser}_`;
                }
                else if (oldChannel.hasOwnProperty('bitrate') && oldChannel.bitrate !== newChannel.bitrate) {
                    changedProperty.changed = true;
                    changedProperty.field = 'Bitrate';
                    changedProperty.message = `Channel bitrate changed from _${oldChannel.bitrate}_  to _${newChannel.bitrate}_`;
                }
                else if (oldChannel.parentID != newChannel.parentID) {
                    let oldParent;
                    let newParent;
                    if (newChannel.parentID != null) {
                        oldParent = newChannel.guild.channels.cache.get(newChannel.parentID);
                    }
                    if (newChannel.parentID != null) {
                        newParent = newChannel.guild.channels.cache.get(newChannel.parentID);
                    }
                    changedProperty.changed = true;
                    changedProperty.field = 'Parent';
                    changedProperty.message = `Channel parent changed from _${oldChannel.parentID ? oldParent.name : 'none'}_  to _${newParent ? newParent.name : 'none'}_`;
                }
                else if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
                    const newPerms = newChannel.permissionOverwrites;
                    const oldPerms = oldChannel.permissionOverwrites;
                    if (oldPerms.size > newPerms.size) {
                        for (let [key, value] of oldPerms.entries()) {
                            if (newPerms.has(key)) {
                                if (value.deny !== newPerms.get(key).deny || value.allow !== newPerms.get(key).allow) {
                                    changedProperty.changed = true;
                                    changedProperty.id = value.id;
                                    changedProperty.field = 'Permission Changes';
                                    changedProperty.message = `Permissions changed for ${value.type}`;
                                }
                            }
                            else {
                                changedProperty.changed = true;
                                changedProperty.id = value.id;
                                changedProperty.field = 'Permission Deletion';
                                changedProperty.message = `Permissions deleted for ${value.type}`;
                            }
                        }
                    }
                    else {
                        for (let [key, value] of newPerms.entries()) {
                            if (oldPerms.has(key)) {
                                if (value.deny !== newPerms.get(key).deny || value.allow !== newPerms.get(key).allow) {
                                    changedProperty.changed = true;
                                    changedProperty.id = value.id;
                                    changedProperty.field = 'Permission Changes';
                                    changedProperty.message = `Permissions changed for ${value.type}`;
                                }
                            }
                            else {
                                changedProperty.changed = true;
                                changedProperty.id = value.id;
                                changedProperty.field = 'Permission Addition';
                                changedProperty.message = `Permissions added for new ${value.type}`;
                            }
                        }
                    }
                }
            }

            if (changedProperty.changed) {
                const guildDb = await api.getGuild(oldChannel.guild.id);

                if (guildDb) {
                    if (guildDb.moderationMessages.enabled) {
                        const moderatorChannel = oldChannel.guild.channels.cache.get(guildDb.moderationMessages.channel);
                        if (moderatorChannel) {
                            moderatorChannel.send(embed.channelEvents('update', [newChannel, changedProperty]));
                        }
                    }
                }
            }
        }
    }
};
