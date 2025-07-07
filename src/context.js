import { createContext, useContext, useEffect, useState } from "react";

const ContextAppContext = createContext();
export const useAppContext = () => useContext(ContextAppContext);

export const ContextAppProvider = ({ children }) => {
  const [customization, setCustomization] = useState(null);
  const [multiTenancyLoading, setMultiTenancyLoading] = useState(true);
  const [error, setError] = useState(null);
  const tenancy = process.env.tanancy;
  const siteId = process.env.tanancy_site;

  const fetchJSON = async (url, options = {}, defaultError = "Request failed", retries = 1) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMessage = defaultError;
          try {
            const errData = await res.json();
            errorMessage = errData.message || `HTTP ${res.status}: ${res.statusText}`;
          } catch {
            errorMessage = `HTTP ${res.status}: ${res.statusText || defaultError}`;
          }
          if (i < retries && (res.status === 503 || !res.status)) {
            console.warn(`Retrying... (${retries - i} attempts left)`);
            await new Promise((res) => setTimeout(res, 1000));
            continue;
          }
          throw new Error(errorMessage);
        }
        return await res.json();
      } catch (err) {
        console.error("Fetch error:", err.message);
        if (i === retries) {
          setError(err.message);
          return null;
        }
      }
    }
  };

  const fetchThemeColors = async () => {
    const result = await fetchJSON(
      `${tenancy}/api/theme/info/${siteId}`,
      {},
      "Failed to fetch theme colors",
      2
    );

    if (result?.appearance) {
      setCustomization((prev) => ({ ...prev, colors: result.appearance }));
    } else if (result === null) {
      setError("Failed to fetch theme colors: No data returned");
    }

    // ✅ Set loading to false after the request is done
    setMultiTenancyLoading(false);
  };

  useEffect(() => {
    if (!tenancy || !siteId) {
      setError("Missing configuration: tenancy or siteId not defined");
      setMultiTenancyLoading(false);
      return;
    }
    fetchThemeColors();
  }, []);

  return (
    <ContextAppContext.Provider
      value={{
        customization,
        setCustomization,
        multiTenancyLoading,
        setMultiTenancyLoading,
        error,
        setError,
      }}
    >
      {children}
    </ContextAppContext.Provider>
  );
};
