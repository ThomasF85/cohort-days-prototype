import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { getCohortDays } from "./cohortDayService";
import {
  apiResponse2023HE,
  apiResponse2024HE,
  testCases,
} from "./cohortDayService.testdata";
enableFetchMocks();

beforeEach(() => {
  fetchMock.mockResponse(async (req) => {
    switch (req.url) {
      case "https://feiertage-api.de/api/?jahr=2023&nur_land=HE":
        return JSON.stringify(apiResponse2023HE);
      case "https://feiertage-api.de/api/?jahr=2024&nur_land=HE":
        return JSON.stringify(apiResponse2024HE);
      default:
        throw new Error("Unexpected request");
    }
  });
});

test.each(testCases)(
  "returns correct cohort days",
  async (startDate, federalState, expected) => {
    const cohortDays = await getCohortDays(startDate, federalState);
    expect(cohortDays).toEqual(expected);
  }
);
