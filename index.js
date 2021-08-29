const fs = require("fs");
const request = require("request");
const config = JSON.parse(fs.readFileSync("./config/config.json"));
const bannedMessages = config.bannedWords || [];
const Discord = require('discord.js');
const client = new Discord.Client();
const visionUrl = "https://vision.googleapis.com/v1/images:annotate";
const replies = config.replies || [];
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
/*    if(msg.author.bot) {
        return;
    }
*/

    isWeeb(msg).then(res => {
        if(res) {
            console.log(`Deleting message, content ${msg.content}`);
            msg.reply(replies[Math.floor(Math.random()*replies.length)]);
            msg.delete({
                reason: "Ew japan shit"
            })
        }
    })


}

client.login(config.token);


function isWeeb(msg) {

    return new Promise(resolve => {
        const containsAsianCharacter = msgIsAsian(msg.content);
		const containsBannedWord = msgHasBannedWord(msg.content);
		
        if(containsAsianCharacter || containsBannedWord || bannedUsers.indexOf(msg.author.id)) >= 0) {
            resolve(true);
        } else if(isYoutubeVideo(msg.content)) {
            youtubeVideoContainsWeebShit(msg.content).then(res => {
                resolve(res);
            });
        } else {
            resolve(false);
        }
    });
}

function msgHasBannedWord(str) {
	for(const s of str.toLowerCase().split(' ')) {		
		if(bannedMessages.indexOf(s) >= 0) {
			return true;
		}
	}
	
	return false;
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
            resolve(false);
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
            resolve(false);
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

            resolve(msgIsAsian(json.title));

        }).catch((err) => {
            resolve(false);
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
    return str.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/) !== null
}
