import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface SupportRequestConfirmationProps {
    name: string;
    category: string;
    inquiryType: string;
    details: string;
  }
  
  export const SupportRequestConfirmation = ({
    name,
    category,
    inquiryType,
    details,
  }: SupportRequestConfirmationProps) => (
    <Html>
      <Head />
      <Preview>Your support request has been received</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Support Request Confirmation</Heading>
          <Text style={text}>
            Dear {name},
          </Text>
          <Text style={text}>
            We have received your support request. Here are the details:
          </Text>
          <Text style={text}>
            Category: {category}<br />
            Inquiry Type: {inquiryType}<br />
            Details: {details}
          </Text>
          <Text style={text}>
            We will review your request and get back to you as soon as possible.
          </Text>
          <Text style={text}>
            Thank you for your patience.
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  export default SupportRequestConfirmation;
  
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