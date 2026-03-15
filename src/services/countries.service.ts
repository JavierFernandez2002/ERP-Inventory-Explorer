import { CountryInfo } from "../types/product";
import { redisClient } from "../config/redis";

const CACHE_EXPIRATION = 3600; // Cache for 1 hour

export async function getCountryInfo(countryCode: string): Promise<CountryInfo> {
    const cacheKey = `country:${countryCode}`;

    // Check if the country info is in the cache
    try {
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log(`Cache hit for country code: ${countryCode}`);
            return JSON.parse(cachedData) as CountryInfo;
        }

        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!response.ok) {
            throw new Error(`Error fetching country data: ${response.statusText}`);
        }

        const data = await response.json();
        const country = data[0];

        const result: CountryInfo = {
            name: country.name.common,
            region: country.region,
            flag: country.flags?.png || ""
        };

        await redisClient.set(cacheKey, JSON.stringify(result),{
            EX: CACHE_EXPIRATION
        });

        return result;
    } catch (error) {
        return {
            name: "Unknown",
            region: "Unknown",
            flag: ""
        };
    }
}