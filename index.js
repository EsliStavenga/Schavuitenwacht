const fs = require("fs");
const request = require("request");
const config = JSON.parse(fs.readFileSync("./config/config.json"));
const bannedMessages = config.bannedWords || [];
const Discord = require('discord.js');
const client = new Discord.Client();
const visionUrl = "https://vision.googleapis.com/v1/images:annotate";
const replies = config.replies || {general: []};
const bannedUsers = (config.bannedUsers || []).map(x => x.toString());

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// youtubeVideoContainsWeebShit("Guys check out it this awesome vid :joy: :joy: :joy:!!! https://www.youtube.com/watch?v=WIKqgE4BwAY").then((Res) => {
//     console.log(Res);
// });


client.on('message', fixWeeb);

client.on('messageUpdate', (old, _new) => {
    fixWeeb(_new);
});

function fixWeeb(msg) {
    if(msg.author.bot) {
        return;
    }

    isWeeb(msg).then(res => {
        if(res.result) {
            console.log(`Deleting message, content ${msg.content}`);
            let wordList = replies['general'];

            //banned word specific replies
            if(replies[res.word]) {
                wordList = replies[res.word];
            }

            msg.reply(wordList[Math.floor(Math.random()*wordList.length)]);
            msg.delete({
                reason: "Ew japan shit"
            })
        }
    })


}

client.login(config.token);

/**
 *
 * @param {{content: string}} msg
 * @param {boolean} resolveYT Whether to resolve youtube vids or not
 * @return {Promise<{result: boolean, word: string}>}
 */
function isWeeb(msg, resolveYT = true) {

    return new Promise(resolve => {
        const containsAsianCharacter = msgIsAsian(msg.content);
		    const containsBannedWord = msgHasBannedWord(msg.content);
		
        if(containsAsianCharacter !== undefined ||
          containsBannedWord !== undefined ||
          bannedUsers.indexOf(msg.author.id) >= 0
        ) {
            resolve({
                result: true,
                word: containsAsianCharacter || containsBannedWord
            });
        } else if(resolveYT && isYoutubeVideo(msg.content)) {
            youtubeVideoContainsWeebShit(msg.content).then(res => {
                resolve(res);
            });
        } else {
            resolve({
                result: false
            });
        }
    })
}

function msgHasBannedWord(str) {
	for(const s of str.toLowerCase().split(' ')) {		
		if(bannedMessages.indexOf(s) >= 0) {
			return s;
		}
	}
	
	return undefined;
}

function youtubeVideoContainsWeebShit(str) {

    return new Promise((resolve, reject) => {

        let myr = matchYoutubeRegex(str) || { index: 0 };
        //first check normal url
        let id = str.substr(myr.index).split('v=')[1];
        //then youtu.be
        if(id === undefined) {
            let myslr = matchYoutubeShortLinkRegex(str) || { index: 0 };
            id = str.substr(myslr.index).split('/')[1];
        }

        if(id === undefined || id === '') {
            resolve({result: false});
        }

        //only get stuff to ampersand
        const ampersandPosition = id.indexOf('&');
        if(ampersandPosition !== -1) {
            id = id.substring(0, ampersandPosition);
        }

        const invalidCharacter = id.search(/[^A-Za-z0-9\-_]/);
        if(invalidCharacter >= 0) {
            id = id.substring(0, invalidCharacter);
        }

        if(id === '') {
            resolve({result: false});
        }

        new Promise((resolve, reject) => {
            request(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject();
                }
            })
        }).then((json) => {
            // if(msgIsAsian(json.title)) {
            //     return true;
            // } else if(imageIsAsian(json.thumbnail)) {
            //
            // }

            resolve(isWeeb({
                content: json.title
            }, false));

        }).catch((err) => {
            resolve({result: false});
        });

    })

}

//todo implement this
function imageIsAsian(imageUrl) {
    request({
        url: visionUrl,
        method: 'POST',
        json: true,
        body: `{
            "requests": [{
                "image": {
                    source: {
                        imageUri: ${imageUrl}
                    }
                },
                "features": [{
                    type: "LABEL_DETECTION",
                    "maxResults": 5   
                }]
            }]
        }`
    }, (err, res, body) => {
        console.log(body);
    });
}

function isYoutubeVideo(str) {
    let matchesYoutube = matchYoutubeRegex(str) !== null;
    let matchesYoutubeShortLink = matchYoutubeShortLinkRegex(str) !== null;

    return matchesYoutube || matchesYoutubeShortLink;
}

function matchYoutubeRegex(str) {
    return str.match(/(youtube\.com\/watch\?*)/)
}

function matchYoutubeShortLinkRegex(str) {
    return str.match(/(youtu\.be\/*)/);
}

function msgIsAsian(str) {
    if(str.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/) !== null) {
        return str;
    }

    return undefined;
}
