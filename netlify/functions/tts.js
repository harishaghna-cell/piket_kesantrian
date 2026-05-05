exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { text, voice_id } = JSON.parse(event.body);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
    method: 'POST',
    headers: {
      'xi-api-key': '732f651bedc812496b9ba82d999eac46e59b0103d9a52571713f9941a41431f2',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2'
    })
  });

  if (!response.ok) {
    return { statusCode: response.status, body: 'ElevenLabs error' };
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': '*'
    },
    body: base64,
    isBase64Encoded: true
  };
};