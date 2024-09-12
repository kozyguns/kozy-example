import * as React from "react";
import Link from "next/link";

const FeatureSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {children}
  </section>
);

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-5 space-y-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export default function Features() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AHR Features</h1>

      <p className="mb-8">
        AHR (Advanced HR and Staff Management System) offers a wide range of
        features designed to streamline HR processes and enhance staff
        management for small to medium-sized businesses. Here&apos;s a detailed
        overview of our platform&apos;s capabilities:
      </p>

      <FeatureSection title="1. Employee Management">
        <h3 className="text-xl font-semibold mb-2">Onboarding</h3>
        <FeatureList
          items={[
            "Digital employee forms and document collection",
            "Automated welcome emails and orientation schedules",
            "Task assignment for new hires and their managers",
          ]}
        />

        <h3 className="text-xl font-semibold mb-2 mt-4">Profile Management</h3>
        <FeatureList
          items={[
            "Centralized employee database",
            "Custom fields for company-specific information",
            "Document storage (e.g., contracts, certifications)",
          ]}
        />

        <h3 className="text-xl font-semibold mb-2 mt-4">Offboarding</h3>
        <FeatureList
          items={[
            "Exit interview scheduling",
            "Asset recovery tracking",
            "Access revocation automation",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="2. Time and Attendance">
        <FeatureList
          items={[
            "Clock in/out functionality (web and mobile)",
            "Geolocation tracking for remote work",
            "Overtime calculation and management",
            "Shift scheduling and swapping",
            "Time-off requests and approvals",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="3. Leave Management">
        <FeatureList
          items={[
            "Various leave type configurations (e.g., vacation, sick, personal)",
            "Leave balance tracking and accrual",
            "Calendar integration for team visibility",
            "Approval workflows",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="4. Performance Management">
        <FeatureList
          items={[
            "Goal setting and tracking",
            "Regular check-ins and 1-on-1 meeting tools",
            "360-degree feedback",
            "Performance review cycles",
            "Custom evaluation templates",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="5. Payroll Integration">
        <FeatureList
          items={[
            "Seamless integration with popular payroll systems",
            "Automatic time data synchronization",
            "Bonus and commission tracking",
            "Tax document generation (e.g., W-2, 1099)",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="6. Training and Development">
        <FeatureList
          items={[
            "Learning management system (LMS) integration",
            "Skill gap analysis",
            "Training course catalog and enrollment",
            "Certification tracking",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="7. Compliance Management">
        <FeatureList
          items={[
            "Labor law compliance monitoring",
            "Required document tracking (e.g., I-9, W-4)",
            "EEOC reporting tools",
            "OSHA log maintenance",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="8. Reporting and Analytics">
        <FeatureList
          items={[
            "Customizable dashboards",
            "Standard HR metrics and KPIs",
            "Custom report builder",
            "Data visualization tools",
            "Export capabilities (CSV, PDF, Excel)",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="9. Communication Tools">
        <FeatureList
          items={[
            "Company-wide announcements",
            "Team messaging and collaboration",
            "Employee directory",
            "Internal job board",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="10. Benefits Administration">
        <FeatureList
          items={[
            "Open enrollment management",
            "Benefits package customization",
            "Employee self-service portal",
            "Integration with benefits providers",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="11. Recruitment and Applicant Tracking">
        <FeatureList
          items={[
            "Job posting creation and distribution",
            "Applicant tracking system (ATS)",
            "Interview scheduling",
            "Candidate evaluation and feedback collection",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="12. Employee Self-Service">
        <FeatureList
          items={[
            "Personal information updates",
            "Payslip access",
            "Time-off requests",
            "Benefits enrollment",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="13. Mobile App">
        <FeatureList
          items={[
            "iOS and Android compatibility",
            "On-the-go access to key features",
            "Push notifications for important updates",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="14. Security and Permissions">
        <FeatureList
          items={[
            "Role-based access control",
            "Two-factor authentication",
            "Data encryption",
            "GDPR and data privacy compliance",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="15. Integrations">
        <FeatureList
          items={[
            "API for custom integrations",
            "Pre-built connectors for popular business tools (e.g., Slack, Google Workspace, Microsoft 365)",
          ]}
        />
      </FeatureSection>

      <FeatureSection title="16. Customization">
        <FeatureList
          items={[
            "Configurable workflows",
            "Custom fields and forms",
            "Branding options",
          ]}
        />
      </FeatureSection>

      <p className="mt-8">
        For more information on how to use these features, please refer to our{" "}
        <Link href="/#" className="text-blue-600 hover:underline">
          documentation
        </Link>
        . If you have any questions or need assistance, don&apos;t hesitate to
        contact our{" "}
        <Link href="/#" className="text-blue-600 hover:underline">
          support team
        </Link>
        .
      </p>
    </div>
  );
}
