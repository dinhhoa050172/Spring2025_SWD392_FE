import { addDays, addWeeks, format, getYear, startOfWeek, subWeeks } from "date-fns";
import { MdNavigateNext } from "react-icons/md";

const AppointmentTable = ({ appointments, currentWeek, setCurrentWeek, setSelectedAppointment }) => {
  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 11 }, (_, i) => 7 + i);

  const appointmentMap = new Map();
  appointments.forEach((appointment) => {
    const key = `${appointment.scheduledDate}-${appointment.timeFrom}`;
    if (appointmentMap.has(key)) {
      appointmentMap.get(key).push(appointment);
    } else {
      appointmentMap.set(key, [appointment]);
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded flex"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <MdNavigateNext size={25} className="transform rotate-180" /> Tuần trước
        </button>
        <h2 className="text-lg font-bold">
          {`Năm ${getYear(currentWeek)} - Tuần ${format(currentWeek, "ww")}`}
        </h2>
        <button
          className="px-3 py-1 bg-gray-200 rounded flex"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          Tuần sau <MdNavigateNext size={25} />
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-white p-2">Giờ</th>
            {weekDays.map((day, index) => (
              <th key={index} className="border p-2 text-center border-white">
                {format(day, "E")} <br /> {format(day, "dd/MM")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="border p-2 text-center font-bold">{`${hour}:00`}</td>
              {weekDays.map((day, index) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const timeKey = `${dateKey}-${hour.toString().padStart(2, "0")}:00:00`;
                const appointmentsForSlot = appointmentMap.get(timeKey) || [];

                return (
                  <td key={index} className="border p-2 text-center">
                    {appointmentsForSlot.length > 0
                      ? appointmentsForSlot.map((appointment, idx) => (
                          <button
                            key={idx}
                            className="text-white bg-yellow-300 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-yellow-500 dark:hover:bg-yellow-500 focus:outline-none dark:focus:ring-yellow-600 mb-2 block"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            {appointment.childName}
                          </button>
                        ))
                      : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;