import FlightInsuranceForm from "@/components/FlightInsuranceForm";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
        <FlightInsuranceForm />
      </main>
    </div>
  );
}
