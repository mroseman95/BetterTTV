const $ = require('jquery');
const watcher = require('../../watcher');
const twitch = require('../../utils/twitch');
const debug = require('../../utils/debug');

const CHAT_ROOM_SELECTOR = '.chat-list';
const USERNAME_SELECTORS = '.chat-line__message span.chat-author__display-name, .chat-line__message div[data-a-target="chat-message-mention"]';

let clicks = 0;
function handleMentionClick(e) {
    clicks++;
    setTimeout(() => {
        if (clicks === 1) {
            // TODO this user doesn't seem to work some of the time
            const user = e.target.innerText.replace('@', '');
            debug.log(`single slick on mention to ${user}`);
            const messages = Array.from($('.chat-line__message'))
                .reverse()
                .filter(el => {
                    const messageObj = twitch.getChatMessageObject(el);
                    if (!messageObj || !messageObj.user) return false;
                    return messageObj.user.userLogin === user;
                })
                .map(m => m.outerHTML);

            debug.log(messages);
        }
        clicks = 0;
    }, 250);
}

class ChatMentionsModule {
    constructor() {
        watcher.on('load.chat', () => this.load());
    }

    load() {
        debug.log('test');
        $(CHAT_ROOM_SELECTOR).on('click.mention', USERNAME_SELECTORS, handleMentionClick);
    }
}

module.exports = new ChatMentionsModule();
