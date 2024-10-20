const API_URL = "https://graphql.datocms.com/";
const AUTH_TOKEN = "ed480834da27025dfe3a7a41933e19"; // Store securely

export const fetchFromDatoCMS = async (query: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();

    if (!response.ok || !data) {
      throw new Error("Failed to fetch data from DatoCMS");
    }

    return data;
  } catch (error) {
    console.error(`[DatoCMS API] Error: ${(error as Error).message}`);
    throw error;
  }
};
