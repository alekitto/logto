import type { EmailContent } from '@aws-sdk/client-sesv2';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { replaceSendMessageHandlebars, type SendMessagePayload } from '@logto/connector-kit';

import type { AwsSesConfig, Template } from './types.js';

export const makeClient = (
  accessKeyId?: string,
  secretAccessKey?: string,
  region?: string
): SESv2Client => {
  const credentials: AwsCredentialIdentity | undefined =
    accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined;

  return new SESv2Client({ credentials, region });
};

export const makeEmailContent = (template: Template, payload: SendMessagePayload): EmailContent => {
  return {
    Simple: {
      Subject: { Data: replaceSendMessageHandlebars(template.subject, payload), Charset: 'utf8' },
      Body: {
        Html: {
          Data: replaceSendMessageHandlebars(template.content, payload),
        },
      },
    },
  };
};

export const makeCommand = (
  config: AwsSesConfig,
  emailContent: EmailContent,
  to: string
): SendEmailCommand => {
  return new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Content: emailContent,
    FromEmailAddress: config.emailAddress,
    FromEmailAddressIdentityArn: config.emailAddressIdentityArn,
    FeedbackForwardingEmailAddress: config.feedbackForwardingEmailAddress,
    FeedbackForwardingEmailAddressIdentityArn: config.feedbackForwardingEmailAddressIdentityArn,
    ConfigurationSetName: config.configurationSetName,
  });
};
