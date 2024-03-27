export function optimizeMeetingRooms(numOfRooms, meetings) {
  console.log("DATA: ", meetings);

  if (meetings.length === 0 || numOfRooms === 0) {
    return [];
  }

  meetings.sort((a, b) => a[1] - b[1]);

  let curEnd = 0;
  let rooms = Array.from({ length: numOfRooms }, () => []);
  meetings.sort((a, b) => a[0] - b[0]);

  for (const meeting of meetings) {
    console.log("meeting:", meeting);
    console.dir(rooms, { depth: null, colors: true });
    let assigned = false;
    for (const room of rooms) {
      console.log("room", room);
      if (room.length === 0 || meeting[0] >= room[room.length - 1][1]) {
        room.push(meeting);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      console.log(`No room available for [${meeting[0]}, ${meeting[1]}]`);
    }
  }
  console.log("THOSE ARE THE ROOMS:", rooms);
  return rooms;
}
