import CounterButton from "@/components/counterButton";

export default function Home() {
  return (
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Tere</h1>
          <p className="text-lg text-gray-300 mb-6">
            askldjlkasdjksja dlasjd salkdj aslkdj asdljsa
          </p>
          <CounterButton label="Add 1" count={8} />
        </div>
  );
}