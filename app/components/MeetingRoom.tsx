import IntervalBox from "./IntervalBox";

export default function MeetingRoom({ roomNum, meetingsIntervals }) {
  return (
    <>
      <div className="mt-3">
        <div className="font-bold text-lg">Room Number: {roomNum}</div>
        <div className="mt-0 flex flex-row">
          {meetingsIntervals.map((interval, idx) => (
            <IntervalBox key={idx} interval={interval} />
          ))}
        </div>
      </div>
    </>
  );
}
