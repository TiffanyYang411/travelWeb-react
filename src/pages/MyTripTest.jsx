// ✅ 僅供開發測試用：拖曳功能開發驗證用，不要加入正式 router。
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTrips = [
  { tripId: 101, title: '挪威峽灣' },
  { tripId: 102, title: '冰島火山' },
  { tripId: 103, title: '芬蘭極光' },
];

export default function MyTripTest() {
  const [trips, setTrips] = useState(initialTrips);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...trips];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTrips(reordered);
  };

  return (
    <div style={{ padding: '40px', background: '#0e2735', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff' }}>🧪 拖曳測試區</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="testList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: '#DCE8ED',
                padding: 20,
                borderRadius: 12,
                width: '400px',
              }}
            >
              {trips.map((trip, index) => (
                <Draggable
                  key={trip.tripId.toString()}
                  draggableId={trip.tripId.toString()}
                  index={index}
                >
                  {(provided, snapshot) => {
                    const style = {
                      userSelect: 'none',
                      padding: 16,
                      margin: '0 0 8px 0',
                      background: snapshot.isDragging ? '#fffae6' : '#fff',
                      border: '1px solid #ccc',
                      borderRadius: 8,
                      ...provided.draggableProps.style, // ✅ 一定放在最後
                    };

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={style}
                      >
                        {trip.title}
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
