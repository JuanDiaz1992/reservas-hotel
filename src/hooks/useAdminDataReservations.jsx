import { useState, useEffect, useCallback } from "react";
import { getProtected } from "../../api/get";

export function useAdminDataReservations(token, activeTab) {
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [updateReservations, setUpdateReservations] = useState(false);
  const [totalReservations, setTotalReservations] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [checkInToday, setTodayCheckIns] = useState();
  const [onSearch, setOnSearch] = useState(false);
  const [reservationFilter, setReservationFilter] = useState("inbox");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSearch, setLastSearch] = useState("");

  const getReservations = useCallback(async (
    filterType = reservationFilter,
    page = 1,
    forInterval = false
  ) => {
    if (!forInterval) {
      setLoadingReservations(true);
    }

    try {
      const response = await getProtected({
        endpoint: `/reservations?filter=${filterType}&page=${page}`,
        token: token,
      });

      if (response.status === 200) {
        const reservationsArray = response.data.data || [];
        setReservations(reservationsArray);
        setTotalPages(response.data.last_page || 1);
        setCurrentPage(response.data.current_page || 1);
        setTotalReservations(response.data.total || 0);

        if (filterType === "inbox") {
          setPendingCount(response.data.total || 0);
        }
      }
    } catch (error) {
      console.error("Error al procesar reservas:", error);
    } finally {
      if (!forInterval) {
        setLoadingReservations(false);
      }
    }
  }, [token, reservationFilter]);

  const setSearchTerm = async (value) => {
    setLastSearch(value);
    if (!value) {
      setOnSearch(false);
      setReservationFilter("inbox");
      return;
    }
    setOnSearch(true);
    setReservationFilter("search");
    setLoadingReservations(true);
    try {
      const response = await getProtected({
        endpoint: `/reservations/search?q=${value}`,
        token: token,
      });

      if (response.status === 200) {
        setReservations(response.data.data);
        setTotalPages(1);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    const refreshData = () => {
      if (onSearch && lastSearch) {
        setSearchTerm(lastSearch);
      } else {
        getReservations(reservationFilter, currentPage);
      }
    };

    refreshData();

    if (updateReservations) {
      setUpdateReservations(false);
    }

    let interval;
    if (activeTab === "bookings") {
      interval = setInterval(() => {
        if (!loadingReservations) {
          if (onSearch && lastSearch) {
            setSearchTerm(lastSearch);
          } else {
            getReservations(reservationFilter, currentPage, true);
          }
        }
      }, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    activeTab,
    updateReservations,
    onSearch,
    reservationFilter,
    currentPage,
    lastSearch,
  ]);

  return {
    reservationsData: {
      reservations,
      loadingReservations,
      setUpdateReservations,
      setSearchTerm,
      currentPage,
      totalPages,
      setCurrentPage,
      pendingCount,
      totalReservations,
      reservationFilter,
      setReservationFilter,
      setOnSearch,
      getReservations,
      onSearch,
    },
  };
}
