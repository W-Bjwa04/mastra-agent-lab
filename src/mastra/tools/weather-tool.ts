import { z } from "zod"
import { createTool } from '@mastra/core/tools';



export const getWeatherDescription = (code: number): string => {
    switch (code) {
        case 0:
            return "Clear sky";
        case 1:
            return "Mainly clear";
        case 2:
            return "Partly cloudy";
        case 3:
            return "Overcast";
        case 45:
            return "Fog";
        case 48:
            return "Depositing rime fog";
        case 51:
            return "Light drizzle";
        case 53:
            return "Moderate drizzle";
        case 55:
            return "Dense drizzle";
        case 56:
            return "Light freezing drizzle";
        case 57:
            return "Dense freezing drizzle";
        case 61:
            return "Light rain";
        case 63:
            return "Moderate rain";
        case 65:
            return "Heavy rain";
        case 66:
            return "Light freezing rain";
        case 67:
            return "Heavy freezing rain";
        case 71:
            return "Light snow fall";
        case 73:
            return "Moderate snow fall";
        case 75:
            return "Heavy snow fall";
        case 77:
            return "Snow grains";
        case 80:
            return "Light rain showers";
        case 81:
            return "Moderate rain showers";
        case 82:
            return "Violent rain showers";
        case 85:
            return "Slight snow showers";
        case 86:
            return "Heavy snow showers";
        case 95:
            return "Thunderstorm";
        case 96:
            return "Thunderstorm with light hail";
        case 99:
            return "Thunderstorm with heavy hail";
        default:
            return "Unknown weather code";
    }
};


export const weatherTool = createTool({
    id: "weather-tool",
    description: "Get the current weather for a city including temprature, conditions, and rain probability.",
    inputSchema: z.object({
        city: z.string().describe("The city to get the weather for"),
    }),
    outputSchema: z.object({
        city: z.string(),
        temperature: z.number(),
        conditions: z.string(),
        error: z.string().optional()
    }),

    execute: async ({ city }) => {
        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            )
            if (!geoResponse.ok) {

                console.log("Failed to get geocoding data", city)
                return {
                    city: "Unknown",
                    temperature: 0,
                    conditions: "Unknown",
                    error: "Failed to get geocoding data"
                }
            }

            const geoData = await geoResponse.json();
            const { latitude, longitude } = geoData.results[0];

            if (!latitude || !longitude) {

                console.log("Failed to get geocoding data", latitude, longitude)
                return {
                    city: "Unknown",
                    temperature: 0,
                    conditions: "Unknown",
                    error: "Failed to get geocoding data"
                }
            }

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            )
            if (!weatherResponse.ok) {
                console.log("Failed to get weather response", weatherResponse)
                return {
                    city: "Unknown",
                    temperature: 0,
                    conditions: "Unknown",
                    error: "Failed to get weather data"
                }
            }

            const weatherData = await weatherResponse.json();
            const { temperature, weathercode } = weatherData.current_weather;

            if (temperature == undefined || weathercode == undefined) {
                console.log("Failed to get weather data", temperature, weathercode)
                return {
                    city: "Unknown",
                    temperature: 0,
                    conditions: "Unknown",
                    error: "Failed to get weather data"
                }
            }
            console.log("Weather data", weatherData)
            return {
                city,
                temperature,
                conditions: getWeatherDescription(weathercode),
                error: undefined
            }

        } catch (error) {
            return { city: "Unknown", temperature: 0, conditions: "Unknown", error: "Failed to fetch weather data" };

        }
    }
})