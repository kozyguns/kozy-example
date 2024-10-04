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

interface SupportRequestStatusUpdateProps {
  id: string;
  name: string;
  newStatus: string;
  updatedBy: string;
  category: string;
  inquiryType: string;
}

export const SupportRequestStatusUpdate = ({
  id,
  name,
  newStatus,
  updatedBy,
  category,
  inquiryType,
}: SupportRequestStatusUpdateProps) => (
  <Html>
    <Head />
    <Preview>Support Request Status Updated for {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Support Request Status Updated</Heading>
        <Text style={text}>Hello, {name}!</Text>
        <Text style={text}>
          The status for your support request has been updated.
        </Text>
        <Text style={text}>
          Category: {category}
          <br />
          New Status: {newStatus}
        </Text>
        <Hr style={hr} />
        <Text style={text}>
          You can view all support requests and their statuses below:
        </Text>
        {/* <Button
          href="https://kozy-example.vercel.app/team/support/inquiries/review"
          style={button}
        >
          View Support Requests
        </Button> */}
      </Container>
    </Body>
  </Html>
);

export default SupportRequestStatusUpdate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
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

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "32px",
  paddingBottom: "32px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};
