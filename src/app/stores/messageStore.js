'use strict';

import chatActions from '../actions/chatActions';

var chats = [
    {
        id: 1,
        user: {
            profilePicture: 'https://avatars0.githubusercontent.com/u/7922109?v=3&s=460',
            id: 2,
            name: 'Ryan Clark',
            status: 'online'
        },
        lastAccess: {
            recipient: 1424469794050,
            currentUser: 1424469794080
        },
        messages: [
            {
                contents: 'Hey!',
                from: 2,
                timestamp: 1424469793023
            },
            {
                contents: 'Hey, what\'s up?',
                from: 1,
                timestamp: 1424469794000
            }
        ]
    },
    {
        id: 2,
        user: {
            read: true,
            profilePicture: 'https://avatars3.githubusercontent.com/u/2955483?v=3&s=460',
            name: 'Jilles Soeters',
            id: 3,
            status: 'online'
        },
        lastAccess: {
            recipient: 1424352522000,
            currentUser: 1424352522080
        },
        messages: [
            {
                contents: 'Want a game of ping pong?',
                from: 3,
                timestamp: 1424352522000
            }
        ]
    },
    {
        id: 3,
        user: {
            name: 'Todd Motto',
            id: 4,
            profilePicture: 'https://avatars1.githubusercontent.com/u/1655968?v=3&s=460',
            status: 'online'
        },
        lastAccess: {
            recipient: 1424423579000,
            currentUser: 1424423574000
        },
        messages: [
            {
                contents: 'Please follow me on twitter I\'ll pay you',
                timestamp: 1424423579000,
                from: 4
            }
        ]
    }
];

var openChatID = parseInt(chats[0].id, 10);

class MessageStore {
    constructor() {
        riot.observable(this);
        for (var key in chatActions) {
            let action = chatActions[key];
            this.on(action, this.actionHandler[action])
        }
    }


    getOpenChatID() {
        return openChatID;
    }

    getChatById(id) {
        for (let i = 0; i < chats.length; i++) {
            if (chats[i].id === id) {
                return chats[i];
            }
        }
    }

    getAllChats() {
        return chats;
    }

}

MessageStore.prototype.actionHandler = {
    updateOpenChatID: function (id) {
        openChatID = id;
        chats.forEach((chat) => {
            if (chat.id === id) {
                chat.lastAccess.currentUser = +new Date();
            }
        });

        this.trigger('updated');
    },
    sendMessage: function (message) {
        chats.forEach((chat) => {
            if (chat.id === openChatID) {
                chat.messages.push(message);
                this.trigger('updated');
            }
        });
    }
};

var messageStore = new MessageStore();

module.exports = messageStore;
