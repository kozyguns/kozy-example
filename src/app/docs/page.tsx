import * as React from "react";
import Link from "next/link";

const DocSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    {children}
  </section>
);

const DocSubSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-2xl font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AHR System Documentation</h1>

      <p className="mb-8">
        Welcome to the comprehensive documentation for the Advanced HR and Staff
        Management System (AHR). This guide provides detailed information on all
        features and functionalities of the system.
      </p>

      <DocSection title="1. Getting Started">
        <DocSubSection title="1.1 System Requirements">
          <p>
            AHR is a web-based application accessible via modern web browsers
            (Chrome, Firefox, Safari, Edge). For optimal performance, ensure
            your browser is up to date.
          </p>
        </DocSubSection>
        <DocSubSection title="1.2 Account Setup">
          <p>To set up your account:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Navigate to the AHR login page.</li>
            <li>
              Click on &quot;First Time User&quot; or &quot;Activate
              Account&quot;.
            </li>
            <li>
              Enter your email address and the temporary password provided by
              your administrator.
            </li>
            <li>
              Follow the prompts to create a new password and set up two-factor
              authentication (if required).
            </li>
          </ol>
        </DocSubSection>
        <DocSubSection title="1.3 Dashboard Overview">
          <p>
            The dashboard is your central hub for accessing all AHR features.
            Key elements include:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Quick access menu for frequently used features</li>
            <li>Notifications center</li>
            <li>Key performance indicators (KPIs) relevant to your role</li>
            <li>Recent activity feed</li>
          </ul>
        </DocSubSection>
      </DocSection>

      <DocSection title="2. Employee Management">
        <DocSubSection title="2.1 Adding New Employees">
          <p>To add a new employee:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Navigate to &quot;Employees&quot; &gt; &quot;Add New&quot;.</li>
            <li>Fill out the required fields in the New Employee form.</li>
            <li>Upload necessary documents (e.g., ID, contracts).</li>
            <li>Assign the employee to a department and manager.</li>
            <li>Set up access permissions and login credentials.</li>
            <li>Click &quot;Save&quot; to create the employee profile.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="2.2 Employee Profiles">
          <p>
            Employee profiles contain all relevant information about an
            individual. Key sections include:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Personal Information</li>
            <li>Employment Details</li>
            <li>Compensation and Benefits</li>
            <li>Performance History</li>
            <li>Training and Development</li>
            <li>Documents</li>
          </ul>
        </DocSubSection>
        <DocSubSection title="2.3 Offboarding Process">
          <p>To initiate the offboarding process:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Navigate to the employee&apos;s profile.</li>
            <li>Click on &quot;Initiate Offboarding&quot;.</li>
            <li>Select the employee&apos;s last working day.</li>
            <li>Choose the reason for termination.</li>
            <li>
              Follow the guided checklist to ensure all offboarding tasks are
              completed.
            </li>
          </ol>
        </DocSubSection>
      </DocSection>

      <DocSection title="3. Time and Attendance">
        <DocSubSection title="3.1 Clock In/Out">
          <p>Employees can clock in and out using the following methods:</p>
          <ul className="list-disc list-inside ml-4">
            <li>
              Web interface: Click the &quot;Clock In/Out&quot; button on the
              dashboard.
            </li>
            <li>
              Mobile app: Use the prominent clock in/out feature on the
              app&apos;s home screen.
            </li>
            <li>Kiosk mode: Available on designated office devices.</li>
          </ul>
        </DocSubSection>
        <DocSubSection title="3.2 Managing Shifts">
          <p>To manage shifts:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Time &amp; Attendance&quot; &gt; &quot;Shift
              Management&quot;.
            </li>
            <li>Create shift templates for different roles or departments.</li>
            <li>Assign shifts to employees or allow self-scheduling.</li>
            <li>Set up rules for shift swaps and overtime.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="3.3 Overtime Calculation">
          <p>
            Overtime is automatically calculated based on predefined rules. To
            configure overtime rules:
          </p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Settings&quot; &gt; &quot;Time &amp; Attendance&quot;
              &gt; &quot;Overtime Rules&quot;.
            </li>
            <li>
              Define thresholds for daily, weekly, or pay-period overtime.
            </li>
            <li>
              Set different rates for various types of overtime (e.g.,
              time-and-a-half, double time).
            </li>
            <li>
              Specify any exemptions or special rules for certain employee
              groups.
            </li>
          </ol>
        </DocSubSection>
      </DocSection>

      <DocSection title="4. Leave Management">
        <DocSubSection title="4.1 Requesting Time Off">
          <p>Employees can request time off as follows:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;My Time Off&quot; &gt; &quot;New Request&quot;.
            </li>
            <li>
              Select the leave type (e.g., vacation, sick leave, personal day).
            </li>
            <li>Choose the start and end dates for the leave.</li>
            <li>Add any necessary comments or attachments.</li>
            <li>Submit the request for manager approval.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="4.2 Approving Leave Requests">
          <p>Managers can approve or deny leave requests:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Access the &quot;Leave Requests&quot; section from the dashboard
              or menu.
            </li>
            <li>
              Review pending requests, including leave type, dates, and any
              comments.
            </li>
            <li>Check team calendar to ensure adequate coverage.</li>
            <li>
              Approve, deny, or request more information from the employee.
            </li>
            <li>Add comments to explain the decision if necessary.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="4.3 Leave Policies">
          <p>To set up or modify leave policies:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Settings&quot; &gt; &quot;Leave Management&quot; &gt;
              &quot;Leave Policies&quot;.
            </li>
            <li>
              Define different leave types (e.g., vacation, sick leave, parental
              leave).
            </li>
            <li>Set accrual rules for each leave type.</li>
            <li>Specify any carryover limits or expiration rules.</li>
            <li>Configure approval workflows for each leave type.</li>
          </ol>
        </DocSubSection>
      </DocSection>

      <DocSection title="5. Performance Management">
        <DocSubSection title="5.1 Setting and Tracking Goals">
          <p>To set and track goals:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Navigate to &quot;Performance&quot; &gt; &quot;Goals&quot;.</li>
            <li>
              Click &quot;Add New Goal&quot; and fill in the goal details.
            </li>
            <li>Set measurable targets and deadlines.</li>
            <li>Assign the goal to an employee or team.</li>
            <li>Regularly update progress and add comments.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="5.2 Conducting Performance Reviews">
          <p>To initiate and complete a performance review:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Performance&quot; &gt; &quot;Reviews&quot; &gt;
              &quot;Start New Review&quot;.
            </li>
            <li>Select the review type and template.</li>
            <li>Choose the employees to be reviewed.</li>
            <li>Set the review period and deadline.</li>
            <li>Complete the review form, providing ratings and comments.</li>
            <li>Schedule and conduct a review meeting with the employee.</li>
            <li>Finalize the review and set follow-up actions.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="5.3 360-Degree Feedback">
          <p>To set up a 360-degree feedback process:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Performance&quot; &gt; &quot;360 Feedback&quot;.
            </li>
            <li>Create a new feedback cycle and select participants.</li>
            <li>Choose or customize the feedback questionnaire.</li>
            <li>Set the feedback period and reminders.</li>
            <li>Review and analyze the collected feedback.</li>
            <li>
              Share results with the employee and create development plans.
            </li>
          </ol>
        </DocSubSection>
      </DocSection>

      <DocSection title="6. Payroll and Benefits">
        <DocSubSection title="6.1 Payroll Processing">
          <p>To process payroll:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Go to &quot;Payroll&quot; &gt; &quot;Run Payroll&quot;.</li>
            <li>Select the pay period and employees to include.</li>
            <li>
              Review time and attendance data, ensuring all entries are correct.
            </li>
            <li>Add any additional earnings or deductions.</li>
            <li>Preview the payroll summary and individual pay stubs.</li>
            <li>Approve and process the payroll.</li>
            <li>Generate and distribute pay stubs to employees.</li>
          </ol>
          <p className="mt-2">
            <strong>Note:</strong> Ensure all time entries and leave requests
            are approved before processing payroll to avoid discrepancies.
          </p>
        </DocSubSection>
        <DocSubSection title="6.2 Managing Benefits">
          <p>To set up and manage employee benefits:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Benefits&quot; &gt; &quot;Benefit Plans&quot;.
            </li>
            <li>
              Click &quot;Add New Plan&quot; to create a new benefit offering.
            </li>
            <li>Define eligibility criteria, coverage details, and costs.</li>
            <li>Set up the enrollment period and rules.</li>
            <li>
              Assign plans to employee groups or make them available
              company-wide.
            </li>
          </ol>
          <p className="mt-2">
            Employees can enroll in benefits through their self-service portal
            during open enrollment periods or when they experience qualifying
            life events.
          </p>
        </DocSubSection>
        <DocSubSection title="6.3 Compensation Management">
          <p>To manage employee compensation:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Access &quot;Compensation&quot; &gt; &quot;Salary
              Structures&quot;.
            </li>
            <li>Set up pay grades and salary ranges.</li>
            <li>Assign employees to appropriate pay grades.</li>
            <li>
              Use the &quot;Compensation Planning&quot; tool for salary reviews
              and adjustments.
            </li>
            <li>
              Track and manage bonuses, commissions, and other variable pay.
            </li>
          </ol>
          <img
            src="/images/compensation-structure.png"
            alt="Compensation Structure Example"
            className="mt-4 mb-4"
          />
          <p className="mt-2">
            <strong>Best Practice:</strong> Regularly review and update salary
            structures to remain competitive in the job market.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="7. Reporting and Analytics">
        <DocSubSection title="7.1 Standard Reports">
          <p>AHR offers a variety of pre-built reports. To access them:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Reports&quot; &gt; &quot;Standard Reports&quot;.
            </li>
            <li>
              Choose a report category (e.g., Headcount, Turnover,
              Compensation).
            </li>
            <li>Select the specific report you need.</li>
            <li>Set parameters such as date range or department.</li>
            <li>Generate the report and export if needed.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="7.2 Custom Report Builder">
          <p>To create custom reports:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Reports&quot; &gt; &quot;Custom Reports&quot;
              &gt; &quot;New Report&quot;.
            </li>
            <li>Select the data sources you want to include.</li>
            <li>Choose the fields to display in your report.</li>
            <li>Set up any filters or calculations needed.</li>
            <li>Preview the report and adjust as necessary.</li>
            <li>Save the report for future use.</li>
          </ol>
          <p className="mt-2">
            <strong>Tip:</strong> Use the &quot;Schedule&quot; feature to
            automatically generate and send reports on a regular basis.
          </p>
        </DocSubSection>
        <DocSubSection title="7.3 Analytics Dashboards">
          <p>To use the analytics dashboards:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Access &quot;Analytics&quot; &gt; &quot;Dashboards&quot;.</li>
            <li>Choose from pre-built dashboards or create a custom one.</li>
            <li>Add widgets for different metrics and KPIs.</li>
            <li>Customize the layout and visualization types.</li>
            <li>Set up filters to focus on specific data sets.</li>
            <li>Use the interactive features to drill down into data.</li>
          </ol>
          <img
            src="/images/analytics-dashboard.png"
            alt="Analytics Dashboard Example"
            className="mt-4 mb-4"
          />
        </DocSubSection>
      </DocSection>

      <DocSection title="8. Training and Development">
        <DocSubSection title="8.1 Creating Training Programs">
          <p>To set up a new training program:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Training&quot; &gt; &quot;Programs&quot; &gt;
              &quot;New Program&quot;.
            </li>
            <li>Define the program details (name, description, objectives).</li>
            <li>Add courses or modules to the program.</li>
            <li>Set up prerequisites and completion criteria.</li>
            <li>Assign trainers or instructors.</li>
            <li>
              Determine the target audience (specific roles, departments, or all
              employees).
            </li>
          </ol>
        </DocSubSection>
        <DocSubSection title="8.2 Employee Skill Tracking">
          <p>To track employee skills and certifications:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Training&quot; &gt; &quot;Skills Matrix&quot;.
            </li>
            <li>
              Add or import a list of skills relevant to your organization.
            </li>
            <li>
              Assign skill levels to employees manually or through assessments.
            </li>
            <li>
              Set up automatic updates based on completed training or
              certifications.
            </li>
            <li>
              Use the matrix to identify skill gaps and inform training
              decisions.
            </li>
          </ol>
          <p className="mt-2">
            <strong>Best Practice:</strong> Regularly update the skills matrix
            and use it in conjunction with performance reviews and career
            development planning.
          </p>
        </DocSubSection>
        <DocSubSection title="8.3 Learning Management System (LMS)">
          <p>The integrated LMS allows you to:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Create and manage e-learning courses</li>
            <li>Track course completion and scores</li>
            <li>Offer self-paced learning options</li>
            <li>Manage classroom-based training sessions</li>
            <li>Generate training compliance reports</li>
          </ul>
          <p className="mt-2">
            To access the LMS, go to &quot;Training&quot; &gt; &quot;Learning
            Management&quot;. From here, you can create courses, enroll
            employees, and monitor progress.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="9. Recruitment">
        <DocSubSection title="9.1 Creating Job Postings">
          <p>To create a new job posting:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Recruitment&quot; &gt; &quot;Job Postings&quot;
              &gt; &quot;New Posting&quot;.
            </li>
            <li>
              Fill in the job details (title, description, requirements, etc.).
            </li>
            <li>Select the department and hiring manager.</li>
            <li>Set the application deadline and number of openings.</li>
            <li>
              Choose the external job boards to publish to (if applicable).
            </li>
            <li>Add screening questions or required documents.</li>
            <li>Preview and publish the job posting.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="9.2 Applicant Tracking">
          <p>
            The Applicant Tracking System (ATS) helps manage candidates
            throughout the hiring process:
          </p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Access &quot;Recruitment&quot; &gt; &quot;Applicants&quot; to view
              all candidates.
            </li>
            <li>
              Use filters to sort applicants by job, status, or other criteria.
            </li>
            <li>Review applications and resumes directly in the system.</li>
            <li>
              Move candidates through stages (e.g., Applied, Screened,
              Interviewed, Offered).
            </li>
            <li>
              Schedule interviews and send communications through the ATS.
            </li>
            <li>
              Collect feedback from interviewers and make hiring decisions.
            </li>
          </ol>
          <p className="mt-2">
            <strong>Tip:</strong> Use the bulk actions feature to efficiently
            manage large numbers of applicants.
          </p>
        </DocSubSection>
        <DocSubSection title="9.3 Onboarding Workflow">
          <p>Once a candidate is hired, initiate the onboarding process:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to the hired candidate&apos;s profile and click &quot;Start
              Onboarding&quot;.
            </li>
            <li>Select the appropriate onboarding template for the role.</li>
            <li>
              Customize the onboarding tasks and assign responsible parties.
            </li>
            <li>Set due dates for each onboarding task.</li>
            <li>
              The system will guide the new hire and relevant team members
              through the onboarding process.
            </li>
            <li>Track progress and ensure all tasks are completed.</li>
          </ol>
          <img
            src="/images/onboarding-workflow.png"
            alt="Onboarding Workflow Example"
            className="mt-4 mb-4"
          />
        </DocSubSection>
      </DocSection>

      <DocSection title="10. Communication Tools">
        <DocSubSection title="10.1 Company Announcements">
          <p>To create and manage company-wide announcements:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Communication&quot; &gt; &quot;Announcements&quot;
              &gt; &quot;New Announcement&quot;.
            </li>
            <li>
              Compose your message, adding any necessary attachments or links.
            </li>
            <li>
              Select the target audience (all employees, specific departments,
              etc.).
            </li>
            <li>
              Choose the announcement type (e.g., General, Important, Urgent).
            </li>
            <li>
              Set the publication date and expiration date (if applicable).
            </li>
            <li>Optionally, enable comments or acknowledgment requirements.</li>
            <li>Preview and publish the announcement.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="10.2 Internal Messaging System">
          <p>
            The internal messaging system facilitates communication between
            employees:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>
              Access messages via &quot;Communication&quot; &gt;
              &quot;Messages&quot;.
            </li>
            <li>Start new conversations with individuals or groups.</li>
            <li>
              Create topic-based channels for team or project discussions.
            </li>
            <li>Share files and links within messages.</li>
            <li>Use @mentions to notify specific users.</li>
            <li>Set up notifications for new messages or mentions.</li>
          </ul>
          <p className="mt-2">
            <strong>Best Practice:</strong> Encourage employees to use
            appropriate channels for different types of communication to reduce
            email overload.
          </p>
        </DocSubSection>
        <DocSubSection title="10.3 Employee Directory">
          <p>
            The Employee Directory provides a centralized location for employee
            information:
          </p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Communication&quot; &gt; &quot;Employee
              Directory&quot;.
            </li>
            <li>Use the search function to find specific employees.</li>
            <li>Filter by department, location, or other criteria.</li>
            <li>
              View basic information, contact details, and reporting structure.
            </li>
            <li>
              Access quick actions like sending a message or scheduling a
              meeting.
            </li>
          </ol>
          <p className="mt-2">
            Employees can update their own directory information through their
            profile settings, subject to admin approval if required.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="11. Compliance Management">
        <DocSubSection title="11.1 Document Management">
          <p>To manage compliance-related documents:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Go to &quot;Compliance&quot; &gt; &quot;Document Management&quot;.
            </li>
            <li>
              Upload or create new compliance documents (policies, procedures,
              etc.).
            </li>
            <li>Set document categories and tags for easy organization.</li>
            <li>
              Assign read or acknowledge requirements to relevant employees.
            </li>
            <li>Set up automatic reminders for document reviews or updates.</li>
            <li>Track employee acknowledgments and version history.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="11.2 Compliance Reporting">
          <p>Generate compliance reports as follows:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Compliance&quot; &gt; &quot;Reports&quot;.
            </li>
            <li>
              Select the type of compliance report (e.g., EEOC, OSHA, training
              compliance).
            </li>
            <li>
              Choose the reporting period and any other relevant parameters.
            </li>
            <li>Generate the report and review for accuracy.</li>
            <li>
              Export the report in the required format for submission or
              record-keeping.
            </li>
          </ol>
          <p className="mt-2">
            <strong>Important:</strong> Regularly review compliance requirements
            and update report templates as needed to ensure ongoing compliance.
          </p>
        </DocSubSection>
        <DocSubSection title="11.3 Audit Trails">
          <p>AHR maintains audit trails for critical actions:</p>
          <ul className="list-disc list-inside ml-4">
            <li>
              Access audit logs via &quot;Compliance&quot; &gt; &quot;Audit
              Trails&quot;.
            </li>
            <li>
              View logs of all system actions, including user activities and
              data changes.
            </li>
            <li>
              Filter logs by date range, user, action type, or affected data.
            </li>
            <li>Export audit trails for external audits or investigations.</li>
          </ul>
          <p className="mt-2">
            <strong>Note:</strong> Audit trails are automatically maintained and
            cannot be edited or deleted to ensure data integrity.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="12. Mobile App">
        <DocSubSection title="12.1 Installing and Setting Up">
          <p>To get started with the AHR mobile app:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Download the app from the App Store (iOS) or Google Play Store
              (Android).
            </li>
            <li>Open the app and enter your AHR account credentials.</li>
            <li>
              If required, set up biometric authentication for quick access.
            </li>
            <li>Configure notification preferences in the app settings.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="12.2 Key Mobile Features">
          <p>The mobile app provides access to essential AHR functions:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Clock in/out and view time records</li>
            <li>Submit and approve leave requests</li>
            <li>Access the employee directory</li>
            <li>View payslips and benefits information</li>
            <li>Receive and respond to company announcements</li>
            <li>Complete assigned training modules</li>
          </ul>
        </DocSubSection>
        <DocSubSection title="12.3 Offline Functionality">
          <p>Some features are available offline:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Clock in/out (syncs when connection is restored)</li>
            <li>View cached company policies and documents</li>
            <li>Access previously downloaded payslips</li>
          </ul>
          <p className="mt-2">
            <strong>Tip:</strong> Ensure employees regularly sync the app when
            online to access the most up-to-date information.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="13. System Administration">
        <DocSubSection title="13.1 User Management">
          <p>To manage user accounts and permissions:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Go to &quot;Admin&quot; &gt; &quot;User Management&quot;.</li>
            <li>Create new user accounts or modify existing ones.</li>
            <li>Assign roles and permissions based on job functions.</li>
            <li>Set up Single Sign-On (SSO) if applicable.</li>
            <li>
              Manage password policies and multi-factor authentication settings.
            </li>
          </ol>
        </DocSubSection>
        <DocSubSection title="13.2 System Configuration">
          <p>Configure system-wide settings:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>
              Navigate to &quot;Admin&quot; &gt; &quot;System Settings&quot;.
            </li>
            <li>Set up company information, locations, and departments.</li>
            <li>
              Configure global policies (e.g., password requirements, session
              timeouts).
            </li>
            <li>Customize fields and forms for various modules.</li>
            <li>Set up integration with other business systems.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="13.3 Data Management">
          <p>For data import, export, and maintenance:</p>
          <ul className="list-disc list-inside ml-4">
            <li>
              Use &quot;Admin&quot; &gt; &quot;Data Management&quot; for bulk
              data operations.
            </li>
            <li>
              Schedule regular data backups and define retention policies.
            </li>
            <li>Perform data cleanup and archiving as needed.</li>
            <li>Monitor system logs for any data-related issues.</li>
          </ul>
          <p className="mt-2">
            <strong>Important:</strong> Always ensure you have proper data
            backup before performing any bulk data operations.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="14. API and Integrations">
        <DocSubSection title="14.1 API Documentation">
          <p>
            Access our API documentation at{" "}
            <a
              href="https://api.ahr-system.com/docs"
              className="text-blue-600 hover:underline"
            >
              https://api.ahr-system.com/docs
            </a>
            . Key points:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Use OAuth 2.0 for authentication</li>
            <li>API rate limits and usage guidelines</li>
            <li>Endpoint descriptions and example requests/responses</li>
          </ul>
        </DocSubSection>
        <DocSubSection title="14.2 Pre-built Integrations">
          <p>AHR offers integrations with popular business tools:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Slack for notifications and approvals</li>
            <li>Google Workspace for calendar and document sync</li>
            <li>Microsoft 365 for email and calendar integration</li>
            <li>Zoom for scheduling video interviews</li>
            <li>QuickBooks and Xero for payroll sync</li>
          </ul>
          <p className="mt-2">
            To set up integrations, go to &quot;Admin&quot; &gt;
            &quot;Integrations&quot; and follow the setup wizard for each tool.
          </p>
        </DocSubSection>
      </DocSection>

      <DocSection title="15. Security and Data Privacy">
        <DocSubSection title="15.1 Data Encryption">
          <p>AHR employs robust encryption measures:</p>
          <ul className="list-disc list-inside ml-4">
            <li>All data is encrypted at rest using AES-256 encryption.</li>
            <li>Data in transit is protected using TLS 1.2 or higher.</li>
            <li>
              Encryption keys are managed using a secure key management system.
            </li>
          </ul>
        </DocSubSection>
        <DocSubSection title="15.2 Access Controls">
          <p>Implement strong access controls:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Use role-based access control (RBAC) to limit data access.</li>
            <li>
              Enforce strong password policies and regular password changes.
            </li>
            <li>
              Implement multi-factor authentication for all user accounts.
            </li>
            <li>Regularly audit user access and permissions.</li>
          </ol>
        </DocSubSection>
        <DocSubSection title="15.3 GDPR Compliance">
          <p>AHR supports GDPR compliance efforts:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Data subject access request (DSAR) handling tools</li>
            <li>Consent management features</li>
            <li>Data retention and deletion policies</li>
            <li>Privacy impact assessment templates</li>
          </ul>
          <p className="mt-2">
            For detailed information on our GDPR features, refer to the GDPR
            Compliance Guide in the &quot;Admin&quot; &gt;
            &quot;Compliance&quot; section.
          </p>
        </DocSubSection>
      </DocSection>

      <p className="mt-8">
        This documentation provides a comprehensive overview of the AHR system.
        For more specific questions or issues, please contact our support team
        at{" "}
        <a
          href="mailto:info@abelHRservices.com"
          className="text-blue-600 hover:underline"
        >
          info@abelHRservices.com
        </a>
        .
      </p>

      <p className="mt-4">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
}
