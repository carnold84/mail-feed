/* global gapi */
import { extractContent, extractField } from '@/utils/email';

export const loadLabels = async () => {
  const response = await gapi.client.gmail.users.labels.list({
    userId: 'me',
  });

  return response.result.labels.filter(({ name }) => {
    return name.includes('newsly_');
  });
};

export const loadLabel = async (labelId) => {
  const response = await gapi.client.gmail.users.labels.get({
    id: labelId,
    userId: 'me',
  });

  return response.result;
};

export const loadLabelMessages = async (labelId) => {
  const messages = await gapi.client.gmail.users.messages.list({
    labelIds: [labelId],
    userId: 'me',
  });

  const messageResponse = await Promise.all(
    messages.result.messages.map(({ id }) => {
      return gapi.client.gmail.users.messages.get({
        id,
        userId: 'me',
      });
    })
  );

  return messageResponse.map(({ result }) => {
    return {
      id: result.id,
      content: extractContent(result),
      date: extractField(result, 'Date'),
      from: extractField(result, 'From').replace(/<.*?>\s?/g, ''),
      subject: extractField(result, 'Subject'),
    };
  });
};

export const loadLabelMessage = async (messageId) => {
  const message = await gapi.client.gmail.users.messages.get({
    id: messageId,
    userId: 'me',
  });

  return {
    id: message?.result.id,
    content: extractContent(message?.result),
    date: extractField(message?.result, 'Date'),
    from: extractField(message?.result, 'From').replace(/<.*?>\s?/g, ''),
    subject: extractField(message?.result, 'Subject'),
  };
};

export const signIn = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  const ai = gapi.auth2.getAuthInstance();
  ai.signOut();
};

export const getSignInStatus = () => {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export const initClient = (onSignIn) => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: process.env.VUE_APP_API_KEY,
          clientId: process.env.VUE_APP_CLIENT_ID,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
          ],
          scope: 'https://www.googleapis.com/auth/gmail.readonly',
        })
        .then(
          () => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(onSignIn);

            onSignIn(gapi.auth2.getAuthInstance().isSignedIn.get());

            resolve();
          },
          (error) => {
            reject(error);
            console.error('Init failed', error);
          }
        );
    });
  });
};