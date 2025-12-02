import { addDays } from "date-fns";

const simulate = async () => {
  const response = await fetch("http://127.0.0.1:7711/appointments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appointment: {
        all_days: false,
        start_time: new Date().toISOString(),
        end_time: addDays(new Date(), 5).toISOString(),
        repetition: 4,
        repetition_unit: "HOURS",
        amount: 30,
        dosage_unit: "mg",
        color: "green",
        user_id: "611f3d4e-2524-46d6-aa41-710b2357dff8",
        medicine_id: "196a3f18-d03f-40a8-9b5a-ff78ff2afeab",
      },
    }),
  });

  if (response.status == 201) {
    console.log("Agendamento criado!");
  }

  const body = await response.json();
  console.log(body);
};

simulate();
