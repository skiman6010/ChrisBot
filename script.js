'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');



module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('So you want to learn about Chris? Just say HELLO to get started.')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }



            /* getReply should allow for some variety in responses for received text messages that
            do not have an entry in the scripts.json file. */
                        function getReply() {
                            var messages = [ "Sorry. I'm not configured with a response to your message. Text HELP OUT to see a few examples.",
                                             "Hey, I didn't understand that. I suggest sending HELP OUT",
                                             "Text me ABOUT to learn about the ChrisBot project.",
                                             "The program responds to HELP OUT only. You have to send a command that I understand. :)",
                                             "The ChrisBot is not a human. It is just a series of files on a computer. Text ABOUT to learn more.",
                                             "Seriously, you are wayyyyy smarter than ChrisBot. It just knows simple commands. Message HELP OUT for some help!",
                                             "Yo. I do not know what you are talking about. Send me a HELLO",
                                             "There is a ton of information in ChrisBot. You have to use HELP OUT to find it.",
                                             "That's interesting. Hhhmmm... I never thought of that. Maybe try HELP OUT",
                                             "Can you say that again?",
                                             "Yeah... that happens from time to time. Try HELP OUT or ABOUT.",
                                             "That is a ton of words you just wrote there... I really don't know. Try MORE",
                                             "Right now, punctuation throws me off. Send text without it. Try HELP OUT",
                                            ];

                            var arrayIndex = Math.floor( Math.random() * messages.length );


                            return messages[arrayIndex];

                        }

                        function processMessage(isSilent) {
                            if (isSilent) {
                                return Promise.resolve("speak");
                            }

            /* remove the text in between the () after bot.say and place the function getReply() */

                            if (!_.has(scriptRules, upperText)) {
                                return bot.say( getReply() ).then( () => 'speak');
                            }

                            var response = scriptRules[upperText];
                            var lines = response.split('\n');

                            var p = Promise.resolve();
                            _.each(lines, function(line) {
                                line = line.trim();
                                p = p.then(function() {
                                    console.log(line);
                                    return bot.say(line);
                                });
                            })

                            return p.then(() => 'speak');
                        }

                        return updateSilent()
                            .then(getSilent)
                            .then(processMessage);
                    }
                }
            });
