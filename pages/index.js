import { getCohortDays } from "@/services/cohortDayService";
import { useState } from "react";
import styled from "styled-components";

export default function HomePage() {
  const [cohortDays, setCohortDays] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const startDay = data.startday.split("-").map((date) => parseInt(date));
    const startDate = new Date(
      Date.UTC(startDay[0], startDay[1] - 1, startDay[2])
    );

    setCohortDays(await getCohortDays(startDate, data.federalState));
  }

  return (
    <Wrapper>
      <h1>Cohort days prototype</h1>
      <Form onSubmit={onSubmit}>
        <label>
          Startdatum:
          <input
            type="date"
            id="startday"
            name="startday"
            min="2023-01-01"
            max="2040-12-31"
            required
          />
        </label>
        <label>
          Bundesland:
          <select name="federalState" id="federalState">
            <option value="BW">Baden-Württemberg</option>
            <option value="BY">Bayern</option>
            <option value="BE">Berlin</option>
            <option value="BB">Brandenburg</option>
            <option value="HB">Bremen</option>
            <option value="HH">Hamburg</option>
            <option value="HE">Hessen</option>
            <option value="MV">Mecklenburg-Vorpommern</option>
            <option value="NI">Niedersachsen</option>
            <option value="NW">Nordrhein-Westfalen</option>
            <option value="RP">Rheinland-Pfalz</option>
            <option value="SL">Saarland</option>
            <option value="SN">Sachsen</option>
            <option value="ST">Sachsen-Anhalt</option>
            <option value="SH">Schleswig Holstein</option>
            <option value="TH">Thüringen</option>
            <option value="NATIONAL">National</option>
          </select>
        </label>
        <button type="submit">get Days</button>
      </Form>
      <section>
        <h2>Cohort days:</h2>
        <ul>
          {cohortDays.map((day) => (
            <li key={day.getTime()}>{day.toISOString().split("T")[0]}</li>
          ))}
        </ul>
      </section>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: center;
`;
