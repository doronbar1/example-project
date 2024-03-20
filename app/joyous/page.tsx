"use client";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function formatDate(date) {
  const nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) + nth(date.getDate())
  );
}

function generateDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dates = ["Today", "Tomorrow"];

  for (let i = 2; i < 9; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(formatDate(nextDate));
  }

  return dates;
}

export default function Joyous() {
  const [dates, setDates] = useState(generateDates());
  const [availableTimes, setAvailableTimes] = useState([]);
  const isMounted = useRef(true);

  function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + ":" + minutes;
    return { time, ampm };
  }

  function generateTimeSlots(data) {
    const pstSlots = [];

    const now = new Date();
    data.forEach((user) => {
      const timeZone = user.availability.timeZone;
      user.availability.dateRanges.forEach((range) => {
        let start = new Date(range.start);
        const end = new Date(range.end);

        while (start < end) {
          const endSlot = new Date(start.getTime() + 15 * 60000); // 15 minutes later
          // Check if the time slot overlaps with any busy times
          if (
            !user.availability.busy.some((busyTime) => {
              const busyStart = new Date(busyTime.start);
              const busyEnd = new Date(busyTime.end);
              return start < busyEnd && endSlot > busyStart;
            })
          ) {
            // remove datetime in the past, or if time is already in available to one of the team members
            if (new Date(start) > now || pstSlots.includes(start)) {
              pstSlots.push(formatAMPM(start));
            }
          }
          start = endSlot;
        }
      });
    });

    console.log(pstSlots);
    return pstSlots;
  }

  const loadBookings = async (startDate, endDate) => {
    const url = `http://localhost:3002/teams/1/availability?dateFrom=${startDate}&dateTo=${endDate}&apiKey=cal_c6109631b53ce98dbf9e37fd4e30318a`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Fetching bookings failed");
    }
    const data = await res.json();

    const pstSlots = generateTimeSlots(data);
    setAvailableTimes(pstSlots);
  };

  useEffect(() => {
    if (isMounted.current) {
      // init load
      loadNextAppointmentTime(0);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadNextAppointmentTime = async (idx) => {
    const today = new Date();
    const dayToUse = new Date();
    const oneDayForward = new Date();

    dayToUse.setDate(today.getDate() + idx);
    oneDayForward.setDate(today.getDate() + idx + 1);

    const dateSelected = dayToUse.toISOString().substring(0, 10);
    const oneDayForwardSelected = oneDayForward.toISOString().substring(0, 10);

    loadBookings(dateSelected, oneDayForwardSelected);
  };

  return (
    <>
      <h1>Joyous calendar</h1>
      <div className="mt-4"></div>
      <div className="p-8 flex flex-row"></div>
      <h1>Availabilities</h1>
      <hr />
      <div className="flex flex-row">
        <table>
          <thead>
            <tr>
              <th>SELECT A DAY</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((item, idx) => (
              <tr key={idx}>
                <td
                  className="cursor-pointer h-2"
                  onClick={() => loadNextAppointmentTime(idx)}
                >
                  {item}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col ml-4">
          <div className="font-bold">TIME</div>
          <div className="h-64 flex flex-col bg-gray-200 w-20 px-1 overflow-y-auto">
            {availableTimes.map((item, index) => (
              <div key={index} className="flex items-baseline ">
                <span className="mr-1 w-9">{item.time}</span>
                <span className=" ml-2 text-left text-sm">
                  {item.ampm.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
