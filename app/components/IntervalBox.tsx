export default function IntervalBox({ interval }) {
  return (
    <>
      <div className="bg-violet-300  pl-3 w-20 h-10 p-2 border border-1 space-y-3 rounded text-center">
        {interval[0]} - {interval[1]}
      </div>
    </>
  );
}
