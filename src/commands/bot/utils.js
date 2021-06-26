const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const logger = require('../../utils/logger');

async function githubIssue(args) {
    const title = `${args.type} by ${args.username} at ${args.guildname}`;
    const body = `Type: ${args.type} \nUser: ${args.username} \nGuild: ${args.guildname} \nTime: ${args.time} \nExplanation: ${args.content}`;
    const labels = [];
    if (args.type === 'Issue') {
        labels.push('issue', 'user-issue', 'from-discord');
    }
    else {
        labels.push('suggestion', 'user-suggestion', 'from-discord');
    }

    const token = jwt.sign(
        {
            iat: parseInt((Date.now() - 60000) / 1000, 10),
            exp: parseInt((Date.now() + 600000) / 1000, 10),
            iss: process.env.GITHUB_APP_ID
        },
        process.env.GITHUB_KEY.replace(/\\n/g, '\n'),
        {
            algorithm: 'RS256'
        }
    );

    const botToken = await axios({
        method: 'post',
        url: `https://api.github.com/app/installations/${process.env.GITHUB_INSTALL_ID}/access_tokens`,
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/vnd.github.v3+json'
        }
    })
        .catch((error) => logger.error(`Github bot token error: ${error.message}`));

    if (botToken.status === 201) {
        const response = await axios({
            method: 'post',
            url: `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/issues`,
            headers: {
                Authorization: `Bearer ${botToken.data.token}`,
                accept: 'application/vnd.github.v3+json'
            },
            data: {
                title,
                body,
                labels
            }
        })
            .catch((error) => logger.error(`Github issue error: ${error.message}`));

        if (response.status === 201) {
            return response.data.html_url;
        }
    }
    return null;
}


module.exports = {
    githubIssue
};
