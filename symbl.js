
const accessToken = '395f32734d3171747631626b34525763544d796562673433394b35554c7a5751527959455a364c43487854753659663667494866534942476c51633779663768';
// Refer to the Authentication section for how to generate the accessToken: https://docs.symbl.ai/docs/developer-tools/authentication
const uniqueMeetingId = btoa("nishchay.space@gmail.com"); // btoa will take a string and generate a unique ID
const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
const ws = new WebSocket(symblEndpoint);

ws.onmessage = (event) => {
  // You can find the conversationId in event.message.data.conversationId;
  const data = JSON.parse(event.data);
  if (data.type === 'message' && data.message.hasOwnProperty('data')) {
    console.log('conversationId', data.message.data.conversationId);
  }
  // Detect Insights
  if (data.type === 'insight_response') {
    for (let insight of data.insights) {
      console.log('insight:', insight.payload.content)
    }
  }
  // Detect Topics
  if (data.type === 'topic_response') {
    for (let topic of data.topics) {
      console.log('topic:', topic.phrases)
    }
  }
  // Detect Speech To Text
  if (data.type === 'message_response') {
    for (let message of data.messages) {
      console.log('message:', message.payload.content)
    }
  }
  console.log('data', event);
};

// Fired when the WebSocket closes unexpectedly due to an error or lost connetion
ws.onerror  = (err) => {
  console.error(err);
};

// Fired when the WebSocket connection has been closed
ws.onclose = (event) => {
  console.info('Connection to websocket closed');
};

// Fired when the connection succeeds.
ws.onopen = (event) => {
  ws.send(JSON.stringify({
    type: 'start_request',
    meetingTitle: 'Websockets How-to', // Conversation name
    insightTypes: ['question', 'action_item', 'follow_up'], // Will enable insight generation
    config: {
      confidenceThreshold: 0.5,
      languageCode: 'en-US',
      speechRecognition: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
      }
    },
    speaker: {
      userId: 'nishchay.space@gmail.com',
      name: 'Nishchay Sinha',
    }
  }));
};

