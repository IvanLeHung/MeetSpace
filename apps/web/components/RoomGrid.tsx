type Room = {
  id: string;
  name: string;
  location: string;
  floor: string;
  capacity: number;
  amenities: string[];
};

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  const getIcon = (amenity: string) => {
    if (amenity.includes('chiếu')) return '📽️';
    if (amenity.includes('Màn')) return '📺';
    if (amenity.includes('Whiteboard')) return '📝';
    if (amenity.includes('Video')) return '📹';
    if (amenity.includes('Loa')) return '🔊';
    return '✔️';
  };

  return (
    <div className="roomGrid">
      {rooms.map((room) => (
        <div className="roomCard" key={room.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="sectionTitle">
              <strong style={{ fontSize: 16 }}>{room.name}</strong>
              <span className="pill ok" style={{ fontSize: 10 }}>Đang trống</span>
            </div>
            <div className="sub" style={{ fontSize: 12 }}>
              {room.location} • Tầng {room.floor} • Sức chứa {room.capacity}
            </div>
          </div>
          <div className="meta" style={{ gap: 6 }}>
            {room.amenities.map((item) => (
              <span key={item} className="tag" title={item} style={{ padding: '4px 8px' }}>
                {getIcon(item)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
