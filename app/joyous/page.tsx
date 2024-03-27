"use client";
import { useState } from "react";
import Layout from "../(Layouts)/page";
import MeetingRoom from "../components/MeetingRoom";
import Button from "../components/Button";
import { optimizeMeetingRooms } from "../lib/util";

export default function Joyous() {
  const [numOfRooms, setNumOfRooms] = useState(1);
  const [intervals, setIntervals] = useState([]);
  const [errorRoomVal, setErrorRoomVal] = useState(false);

  const [validJson, setValidJson] = useState(true);

  const [data, setData] = useState([]);

  const handleRoomChange = (e) => {
    const val = e.target.value;
    setErrorRoomVal(false);

    if (isNaN(val)) {
      return;
    }
    if (val > 100) {
      setErrorRoomVal(true);
      return;
    }
    setNumOfRooms(val);
  };

  const calculateIntervals = () => {
    // input example to the intervals field:  [[0, 30],[4, 20],[5, 10],[15, 20],[5, 10], [15, 45]]
    try {
      const intervalsArray = JSON.parse(intervals);
      setValidJson(true);
      const result = optimizeMeetingRooms(numOfRooms, intervalsArray);
      setData(result);
    } catch (e) {
      setValidJson(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <label className="font-bold">Enter number of rooms</label>
        <div className="flex flex-col">
          <input
            className="mt-1 ml-0 w-24 border border-1 border-gray-400"
            value={numOfRooms}
            type="number"
            onChange={handleRoomChange}
          ></input>{" "}
          {errorRoomVal && <div className="text-red-600">Max value is 100</div>}
        </div>
        <div className="mt-2 font-bold">Enter intervals</div>
        <div>
          Recommended input for intervals is: [[0, 30],[4, 20],[5, 10],[15,
          20],[5, 10]]
        </div>
        <div className="flex flex-col">
          <input
            className="mt-1 w-36 border border-1 border-gray-400"
            value={intervals}
            onChange={(e) => setIntervals(e.target.value)}
          ></input>{" "}
          {!validJson && (
            <div className="text-red-600">
              Data invalid, please provide correct json array
            </div>
          )}
        </div>
        <Button
          className="w-16 md:w-1/12 mt-4 rounded bg-violet-800"
          onClick={calculateIntervals}
          variant="solid"
          color="purple"
        >
          Calculate
        </Button>
        {data?.map((intervals, idx) => (
          <MeetingRoom
            key={idx}
            roomNum={idx + 1}
            meetingsIntervals={intervals}
          />
        ))}
      </div>
    </Layout>
  );
}
