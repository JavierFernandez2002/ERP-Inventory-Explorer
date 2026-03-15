import { CountryInfo } from "../types/product";

export async function getCountryInfo(countryCode: string): Promise<CountryInfo> {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!response.ok) {
            throw new Error(`Error fetching country data: ${response.statusText}`);
        }
        const data = await response.json();
        const country = data[0];

        return {
            name: country.name.common,
            region: country.region,
            flag: country.flags?.png || ""
        };
    } catch (error) {
        return {
            name: "Unknown",
            region: "Unknown",
            flag: ""
        };
    }
}