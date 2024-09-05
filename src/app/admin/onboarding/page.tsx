import OnboardingWizard from "./OnboradingWizard";

export default function Page() {
  return (
    <div className="container mx-auto py-10 flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-bold mb-6 my-10 text-center">
        Let Us Get To Know You
      </h1>
      <OnboardingWizard />
    </div>
  );
}