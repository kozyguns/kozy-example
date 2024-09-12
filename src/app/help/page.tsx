import * as React from "react";
import Link from "next/link";

const HelpSection = ({
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

const HelpItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mb-4">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AHR Help Center</h1>

      <p className="mb-8">
        Welcome to the AHR Help Center. Here you&apos;ll find guidance on how to
        use the various features of our Advanced HR and Staff Management System.
      </p>

      <HelpSection title="Getting Started">
        <HelpItem
          title="Setting Up Your Account"
          description="Log in with your provided credentials. Admins should set up the company profile and invite team members."
        />
        <HelpItem
          title="Navigating the Dashboard"
          description="Your dashboard provides an overview of key metrics and quick access to main features. Customize it using the 'Edit Dashboard' button."
        />
      </HelpSection>

      <HelpSection title="Employee Management">
        <HelpItem
          title="Adding a New Employee"
          description="Go to 'Employees' > 'Add New'. Fill out the required fields and upload necessary documents to initiate the onboarding process."
        />
        <HelpItem
          title="Managing Employee Profiles"
          description="Access and update individual profiles via the 'Employees' section. View documents and track employee progress here."
        />
        <HelpItem
          title="Offboarding Process"
          description="Initiate offboarding from an employee's profile. Follow the guided steps to complete all necessary tasks."
        />
      </HelpSection>

      <HelpSection title="Time and Attendance">
        <HelpItem
          title="Clock In/Out"
          description="Employees can clock in/out via the web interface or mobile app. Managers can view and edit time entries in 'Time & Attendance'."
        />
        <HelpItem
          title="Managing Shifts"
          description="Create and edit shifts in the 'Scheduling' tab. Employees can request shift swaps for manager approval."
        />
        <HelpItem
          title="Overtime Management"
          description="Set overtime rules in 'Settings' > 'Time & Attendance'. The system will automatically calculate overtime based on these rules."
        />
      </HelpSection>

      <HelpSection title="Leave Management">
        <HelpItem
          title="Requesting Time Off"
          description="Employees can request time off via 'My Time Off' > 'New Request'. Managers will be notified to approve or deny requests."
        />
        <HelpItem
          title="Viewing Team Calendar"
          description="Access the team calendar via 'Leave' > 'Team Calendar' to view all approved time off and plan accordingly."
        />
        <HelpItem
          title="Setting Leave Policies"
          description="Admins can configure leave types and accrual rules in 'Settings' > 'Leave Management'."
        />
      </HelpSection>

      <HelpSection title="Performance Management">
        <HelpItem
          title="Setting Goals"
          description="Set and track goals for team members or individuals in 'Performance' > 'Goals'."
        />
        <HelpItem
          title="Conducting Reviews"
          description="Initiate and manage performance reviews from 'Performance' > 'Reviews'. Choose review types and follow the guided process."
        />
        <HelpItem
          title="360-Degree Feedback"
          description="Set up and collect 360-degree feedback in 'Performance' > '360 Feedback'."
        />
      </HelpSection>

      <HelpSection title="Payroll and Benefits">
        <HelpItem
          title="Accessing Payslips"
          description="Employees can view and download payslips from 'My Profile' > 'Payroll'."
        />
        <HelpItem
          title="Managing Benefits"
          description="Admins can configure benefit packages in 'Benefits' > 'Packages'. Employees manage enrollments during open periods."
        />
        <HelpItem
          title="Payroll Processing"
          description="Process payroll by going to 'Payroll' > 'Run Payroll'. Review and approve before finalizing."
        />
      </HelpSection>

      <HelpSection title="Reporting and Analytics">
        <HelpItem
          title="Generating Reports"
          description="Use the report builder in 'Reports' > 'Custom Reports' to create tailored reports on various HR metrics."
        />
        <HelpItem
          title="Analyzing Dashboards"
          description="View and customize data visualizations in 'Analytics' > 'Dashboards' to focus on key metrics for your role."
        />
        <HelpItem
          title="Exporting Data"
          description="Export reports and data in various formats (CSV, PDF, Excel) for further analysis or record-keeping."
        />
      </HelpSection>

      <HelpSection title="Training and Development">
        <HelpItem
          title="Course Management"
          description="Create and manage training courses in 'Training' > 'Courses'. Assign courses to individuals or teams."
        />
        <HelpItem
          title="Skill Tracking"
          description="Track employee skills and certifications in 'Training' > 'Skills Matrix'."
        />
        <HelpItem
          title="Learning Plans"
          description="Create personalized learning plans for employees in 'Training' > 'Learning Plans'."
        />
      </HelpSection>

      <HelpSection title="Recruitment">
        <HelpItem
          title="Job Postings"
          description="Create and manage job postings in 'Recruitment' > 'Job Postings'. Publish to internal and external job boards."
        />
        <HelpItem
          title="Applicant Tracking"
          description="Track and manage applicants through the hiring process in 'Recruitment' > 'Applicants'."
        />
        <HelpItem
          title="Interview Scheduling"
          description="Schedule and manage interviews in 'Recruitment' > 'Interviews'. Sync with team calendars."
        />
      </HelpSection>

      <HelpSection title="Communication Tools">
        <HelpItem
          title="Company Announcements"
          description="Post company-wide announcements in 'Communication' > 'Announcements'."
        />
        <HelpItem
          title="Team Messaging"
          description="Use the built-in messaging system for team communication in 'Communication' > 'Messages'."
        />
        <HelpItem
          title="Employee Directory"
          description="Access the company-wide employee directory in 'Communication' > 'Directory'."
        />
      </HelpSection>

      <HelpSection title="Compliance Management">
        <HelpItem
          title="Document Tracking"
          description="Track required documents and their expiration dates in 'Compliance' > 'Documents'."
        />
        <HelpItem
          title="Compliance Reporting"
          description="Generate compliance reports for EEOC, OSHA, and other regulations in 'Compliance' > 'Reports'."
        />
        <HelpItem
          title="Policy Management"
          description="Manage and distribute company policies in 'Compliance' > 'Policies'."
        />
      </HelpSection>

      <HelpSection title="Mobile App">
        <HelpItem
          title="Downloading the App"
          description="Download the AHR mobile app from the App Store (iOS) or Google Play Store (Android). Log in with your existing credentials."
        />
        <HelpItem
          title="Using Mobile Features"
          description="Access key features like time tracking, leave requests, and notifications on-the-go through the mobile app."
        />
      </HelpSection>

      <HelpSection title="System Administration">
        <HelpItem
          title="User Management"
          description="Manage user accounts and permissions in 'Admin' > 'Users'."
        />
        <HelpItem
          title="System Configuration"
          description="Configure system-wide settings in 'Admin' > 'Settings'."
        />
        <HelpItem
          title="Data Import/Export"
          description="Import or export bulk data in 'Admin' > 'Data Management'."
        />
      </HelpSection>

      <p className="mt-8">
        For more detailed information, please refer to our comprehensive{" "}
        <Link href="/docs" className="text-blue-600 hover:underline">
          documentation
        </Link>
        . If you need further assistance, don&apos;t hesitate to contact our
        support team at{" "}
        <a
          href="mailto:info@abelHRservices.com"
          className="text-blue-600 hover:underline"
        >
          info@abelHRservices.com
        </a>
        .
      </p>
    </div>
  );
}
