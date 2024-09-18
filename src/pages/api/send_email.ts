import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { corsHeaders } from '@/utils/cors';
import TimeOffApproved from './../../../emails/TimeOffApproved';
import TimeOffDenied from './../../../emails/TimeOffDenied';
import CalledOut from './../../../emails/CalledOut';
import LeftEarly from './../../../emails/LeftEarly';
import CustomStatus from './../../../emails/CustomStatus';
import GunsmithInspection from '../../../emails/GunsmithInspection';
import OrderCustomerContacted from '../../../emails/OrderCustomerContacted';
import SupportRequestStatusUpdate from '../../../emails/SupportRequestStatusUpdate';
import SupportRequestConfirmation from '../../../emails/SupportRequestConfirmation';
import NewSupportRequestNotification from '../../../emails/NewSupportRequestNotification';
import SuggestionReply from '../../../emails/SuggestionReply';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'CORS preflight request success' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'POST') {
    const { email, subject, templateName, templateData } = req.body;

    if (!email || !subject || !templateName) {
      res.status(400).json({ error: 'Missing required fields', details: req.body });
      return;
    }

    try {
      let emailTemplate;
      let fromEmail;

      switch (templateName) {
        case 'TimeOffApproved':
          emailTemplate = TimeOffApproved(templateData);
          fromEmail = `AHR <scheduling@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'TimeOffDenied':
          emailTemplate = TimeOffDenied(templateData);
          fromEmail = `AHR <scheduling@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'CalledOut':
          emailTemplate = CalledOut(templateData);
          fromEmail = `AHR <scheduling@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'LeftEarly':
          emailTemplate = LeftEarly(templateData);
          fromEmail = `AHR <scheduling@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'CustomStatus':
          emailTemplate = CustomStatus(templateData);
          fromEmail = `AHR <scheduling@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'GunsmithInspection':
          emailTemplate = GunsmithInspection(templateData);
          fromEmail = `AHR <request@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'OrderCustomerContacted':
          emailTemplate = OrderCustomerContacted(templateData);
          fromEmail = `AHR <orders@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'SupportRequestStatusUpdate':
          emailTemplate = SupportRequestStatusUpdate(templateData);
          fromEmail = `AHR Support <support@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'SupportRequestConfirmation':
          emailTemplate = SupportRequestConfirmation(templateData);
          fromEmail = `AHR Support <support@${process.env.RESEND_DOMAIN}>`;
          break;
        case 'NewSupportRequestNotification':
          emailTemplate = NewSupportRequestNotification(templateData);
          fromEmail = `AHR Support <support@${process.env.RESEND_DOMAIN}>`;
          break;
        case "SuggestionReply":
          emailTemplate = SuggestionReply({
            employeeName: templateData.employeeName,
            originalSuggestion: templateData.originalSuggestion,
            replyText: templateData.replyText,
            repliedBy: templateData.repliedBy,
          });
          fromEmail = `AHR Suggestions <suggestions@${process.env.RESEND_DOMAIN}>`;
          break;
        default:
          throw new Error('Invalid template name');
      }

      const resendRes = await resend.emails.send({
        from: fromEmail,
        to: Array.isArray(email) ? email : [email],
        subject: subject,
        react: emailTemplate,
      });

      if (resendRes.error) {
        throw new Error(resendRes.error.message);
      }

      res.status(200).json({ message: 'Email sent successfully', data: resendRes });
    } catch (error: any) {
      console.error('Error sending email:', error);
      if (error.message === 'Invalid template name') {
        res.status(400).json({ error: 'Bad Request', details: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}