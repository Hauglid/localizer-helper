import data from "@/app/data/mock-data.json";

export default function HomePage() {
  const keys = Object.keys(data);
  const nestedKeys = Object.keys(data.BuyInsurance);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="w-full p-10">
        <pre className="">
          {keys.map((key) => (
            <div key={key}>{key}</div>
          ))}
          <br />
          {nestedKeys.map((key) => (
            <div key={key}>{key}</div>
          ))}
        </pre>
      </div>
    </main>
  );
}
