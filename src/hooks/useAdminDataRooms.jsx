import { useState, useEffect, useCallback } from "react";
import { getProtected } from "../../api/get";

export function useAdminDataRooms(token) {
  const [isLoading, setIsLoading] = useState(true);
  const [roomsAvailable, setRoomsroomsAvailable] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [updateRooms, setUpdateRooms] = useState(false);

  const getRoomsAvailable = useCallback(async () => {
    setIsLoading(true);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formatDate = (date) => date.toISOString().split("T")[0];
    const checkIn = formatDate(today);
    const checkOut = formatDate(tomorrow);

    try {
      const response = await getProtected({
        endpoint: `/search-rooms?check_in=${checkIn}&check_out=${checkOut}&guests=2`,
        token: token,
      });
      const roomsData = response?.data?.rooms || [];
      setRoomsroomsAvailable(roomsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const getRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProtected({
        endpoint: `/rooms`,
        token: token,
      });
      const roomsData = response?.data?.data || [];
      setRooms(roomsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  useEffect(() => {
    getRoomsAvailable();
    getRooms();
    setUpdateRooms(false);
  }, [updateRooms]);

  const totalDisponibilidad = roomsAvailable.reduce(
    (acc, room) => acc + (room.available_stock || 0),
    0
  );

  return {
    rooms: {
      data: rooms,
      isLoading: isLoading,
      setUpdateRooms,
      totalDisponibilidad: totalDisponibilidad,
    },
  };
}
