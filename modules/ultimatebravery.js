const bot = require('../app');
const _ = require('lodash');
const util = require('../util');

let BRAVE_COUNTER;
module.exports = bot => {

  bot.on('message', function(user, userID, channelID, message, event) {
    if (message = 'I AM BRAVE') {
      bot.sendMessage({
        to: channelID,
        message: makeBraveSolo(userID)
      })
    }

    if (message == 'WE ARE BRAVE') {
      //give instructions
      bot.sendMessage({
        to: channelID,
        message: `Enter enemy hero's name or first if you are first pick.`
      })
      makeTeamBrave();
    }
  })


  function makeBraveSolo(userID) {
    let results = {}

    results.hero = heros[_.random(0, heros.length - 1)];
    results.lane = lanes[_.random(0, 3)];
    results.laneTime = _.random(1, 7);
    results.talents = [1, 2, 3, 4].map(i => talents[_.random(0, 1)]).join(' ');
    results.ability = skills[_.random(0, 2)];
    results.boots = boots[_.random(0, 5)];
    results.build = [1, 2, 3, 4, 5].map(i => items[_.random(1, items.length - 1)]).join("** -> **")

    return `
  PROVE IT <@!${userID}>.
  Your Hero WILL be **${results.hero}**
  Your Lane WILL be **${results.lane}**
  Your WILL be in your lane for at least **${results.laneTime}** minutes
  Your Talents WILL be ${results.talents}
  Your WILL max ${results.ability} first
  Your boots WILL be **${results.boots}**
  Your build WILL be  **${results.build}**
  `
  }

  function makeBrave(heroes, items, lanes, members) {
    let results = {}

    results.hero = heroes.get();
    results.lane = lanes.pop();
    results.laneTime = _.random(1, 7);
    results.talents = [1, 2, 3, 4].map(i => talents[_.random(0, 1)]).join(' ');
    results.ability = skills[_.random(0, 2)];
    results.boots = boots[_.random(0, 5)];
    results.build = [1, 2, 3, 4, 5].map(i => items.get().join("** -> **"))

    return `
  PROVE IT <@!${members.pop()}>.
  Your Hero WILL be **${results.hero}**
  Your Lane WILL be **${results.lane}**
  Your WILL be in your lane for at least **${results.laneTime}** minutes
  Your Talents WILL be ${results.talents}
  Your WILL max ${results.ability} first
  Your boots WILL be **${results.boots}**
  Your build WILL be  **${results.build}**
  `
  }

  function makeTeamBrave(userID, event) {
    //find team members
    let channelID = bot.getVoiceChannel(event);
    let members = _.keys(bot.channels[channelID].members).filter((key) => key !== bot.id)
    BRAVE_COUNTER = members.size;

    //initialize lists
    let heroList = new util.noRepeatList(heroes, heroes)
    let itemList = new util.noRepeatList(items, auras)
    let lanes = getLanes();

    bot.on('message', _.partialRight(readHero, heroList, itemList, lanes, members));


  }

  function readHero(user, userID, channelID, message, event, heroes, items, lanes, members) {
    if (heroList.list.includes(message)) {
      //make Brave
      heroes.pick(message)
    } else if (message == 'first') {
      //make Brave
    } else {
      //error message
      bot.sendMessage({
        to: channelID,
        message: 'Invalid Hero'
      })
      return;
    }

    bot.sendMessage({
      to: channelID,
      message: makeBrave(heroes, items, lanes, members)
    })
    BRAVE_COUNTER--;
    //remove when done
    if (BRAVE_COUNTER <= 0) {
      bot.removeListener('message', readHero)
    }
  }


  function getLanes() {
    let lanesList = ['Top', 'Mid', 'Bottom']
    laneList.push(lanes[_.random(0, 3)])
    laneList.push(lanes[_.random(0, 3)])

    let shuffledLanes = []
    for (var i = 0; i < 5; i++) {
      shuffledLanes.push(lanesList[_.random(0, lanesList.length)])
      delete lanesList[i]
    }

    return shuffledLanes;
  }

}


const boots = require('../dataSets/boots');
const items = require('../dataSets/items');
const heroes = require('../dataSets/heroes');
const auras = require('../dataSets/noRepeatItems');

const talents = [":arrow_left:", ":arrow_right:"]

const skills = [
  ":regional_indicator_q: ",
  ":regional_indicator_w: ",
  ":regional_indicator_e: "
]

const lanes = [
  "Top",
  "Roaming/Jungle",
  "Mid",
  "Bottom",
]
