// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Uncomment and edit to make your own intent handler
  // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // below to get this function to be run when a Dialogflow intent is matched
  function hoursOfOperation(agent) {
    agent.add(`The hours of operation is as follows:`);
    agent.add(new Card({
        title: `Hours of Operation`,
        //imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
        text: `Monday: 9AM - 9PM
        Tuesday: 9AM - 9PM
        Wednesday: 9AM - 9PM
        Thursday: 9AM - 9PM
        Friday: 9AM - 10PM
        Saturday: 9AM - 10PM
        Sunday: 11AM - 9PM`,
        //buttonText: 'This is a button',
        //buttonUrl: 'https://assistant.google.com/'
      })
    );
    //agent.add(new Suggestion(`Quick Reply`));
    //agent.add(new Suggestion(`Suggestion`));
    //agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  }

  function reservation(agent){
    let reservationDate = agent.parameters['date'].original;
    let reservationTime = agent.parameters['time'].original;
    let reservationNum = agent.parameters['number'];
    //console.log(reservationNum);
    agent.add('Perfect! a table for ' + reservationNum + ' guests for ' + reservationDate + ' at ' + reservationTime + ' has been reserved. See you soon!');
  }

  function location(agent){
    agent.add(new Card({
      title: 'Address:',
      text: `123 Main Street
      Json, CO 00000`
    }));
  }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('HoursOfOperationsIntent', hoursOfOperation);
  intentMap.set('ReservationsIntent', reservation);
  intentMap.set('LocationIntent', location);
  agent.handleRequest(intentMap);
});
