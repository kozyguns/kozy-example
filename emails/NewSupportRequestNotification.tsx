
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";
  
  interface NewSupportRequestNotificationProps {
    details: string;
    clientName: string;
    category: string;
    inquiryType: string;
  }
  
  export const NewSupportRequestNotification = ({
    details,
    clientName,
    category,
    inquiryType,
  }: NewSupportRequestNotificationProps) => (
    <Html>
      <Head />
      <Preview>New support request submitted</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Support Request</Heading>
          <Text style={text}>
            A new support request has been submitted:
          </Text>
          <Text style={text}>
            Client Name: {clientName}<br />
            Category: {category}<br />
            Inquiry Type: {inquiryType}<br />
            Details: {details}
          </Text>
          <Text style={text}>
            Please review and assign this request as soon as possible.
          </Text>
          <Button
          href="https://kozy-example.vercel.app/team/support/inquiries/review"
          style={button}
        >
          Go to Gunsmithing Dashboard
        </Button>
        </Container>
      </Body>
    </Html>
  );
  
  export default NewSupportRequestNotification;
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "17px 0 0",
    margin: "0",
  };
  
  const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "26px",
    margin: "16px 0",
  };

  const button = {
    backgroundColor: "#5469d4",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "200px",
    padding: "14px 7px",
  };