/* global gapi */
import { extractContent, extractField } from '@/utils/email';

const capitalizeFirstLetter = ([first, ...rest]) => {
  return `${first.toUpperCase()}${rest.join('')}`;
};

const formatLabel = (label) => {
  label = label.replace('newsly_', '');
  return capitalizeFirstLetter(label);
};

const formatMessage = ({ result }) => {
  if (!result) {
    return;
  }

  return {
    id: result.id,
    isRead: result.labelIds.indexOf('UNREAD') === -1,
    content: extractContent(result),
    date: extractField(result, 'Date'),
    from: extractField(result, 'From').replace(/<.*?>\s?/g, ''),
    subject: extractField(result, 'Subject'),
  };
};

export const loadLabels = async () => {
  const response = await gapi.client.gmail.users.labels.list({
    userId: 'me',
  });

  const filteredLabels = response.result.labels.filter(({ name }) => {
    return name.includes('newsly_');
  });

  const labelsResponse = await Promise.all(
    filteredLabels.map(({ id }) => {
      return loadLabel(id);
    })
  );

  return labelsResponse;
};

export const loadLabel = async (labelId) => {
  const response = await gapi.client.gmail.users.labels.get({
    id: labelId,
    userId: 'me',
  });

  return {
    ...response.result,
    name: formatLabel(response.result.name),
  };
};

export const loadLabelMessages = async ({
  labelId,
  maxResults,
  pageToken,
  showRead,
}) => {
  const messages = await gapi.client.gmail.users.messages.list({
    labelIds: [labelId],
    maxResults,
    pageToken,
    q: showRead === false ? 'is:unread' : null,
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

  return {
    items: messageResponse.map((message) => {
      return formatMessage(message);
    }),
    nextPageToken: messages.result.nextPageToken,
    resultSizeEstimate: messages.result.resultSizeEstimate,
  };
};

export const loadLabelMessage = async (messageId) => {
  const message = await gapi.client.gmail.users.messages.get({
    id: messageId,
    userId: 'me',
  });

  return formatMessage(message);
};

export const markMessageRead = async (messageId, isRead) => {
  let resource;

  if (isRead) {
    resource = { removeLabelIds: ['UNREAD'] };
  } else {
    resource = { addLabelIds: ['UNREAD'] };
  }

  await gapi.client.gmail.users.messages.modify({
    id: messageId,
    resource,
    userId: 'me',
  });

  return await loadLabelMessage(messageId);
};

export const signIn = async () => {
  return await gapi.auth2.getAuthInstance().signIn();
};

export const signOut = async () => {
  const ai = gapi.auth2.getAuthInstance();
  await ai.signOut();
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
          scope: 'https://www.googleapis.com/auth/gmail.modify',
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
