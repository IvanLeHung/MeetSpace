type Room = {
  id: string;
  name: string;
  location: string;
  floor: string;
  capacity: number;
  amenities: string[];
};

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  return (
    <div className="roomGrid">
      {rooms.map((room) => (
        <div className="roomCard" key={room.id}>
          <div className="sectionTitle">
            <strong>{room.name}</strong>
            <span className="pill ok">Đang trống</span>
          </div>
          <div className="sub">
            {room.location} • Tầng {room.floor}
          </div>
          <div className="meta">
            <span className="tag">{room.capacity} người</span>
            {room.amenities.slice(0, 3).map((item) => (
              <span key={item} className="tag">{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
