import React, { useState, useEffect, useCallback } from "react";
import { request } from "@strapi/helper-plugin";

export default function useImport(prefix) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReport(true);

    const id = setInterval(getReport, 5000);

    return () => clearInterval(id);
  }, []);

  async function getReport(firstTime = false) {
    try {
      if (firstTime) {
        setLoading(true);
      }
      const report = await request(`/dapi-importer/${prefix}/report`, {
        method: `GET`,
      });
      setReport(report);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    if (firstTime) {
      setLoading(false);
    }
  }

  const startImport = useCallback(async (model) => {
    try {
      setError(null);
      setLoading(true);
      const report = await request(`/dapi-importer/${prefix}/start`, {
        method: `POST`,
        body: { model },
      });
      setReport(report);
      setTimeout(getReport, 1000);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    setLoading(false);
  });

  const stopImport = useCallback(async () => {
    try {
      setLoading(true);
      const report = await request(`/dapi-importer/${prefix}/stop`, {
        method: `POST`,
      });
      setReport(report);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    setLoading(false);
  });

  const resetImport = useCallback(async () => {
    try {
      setLoading(true);
      const report = await request(`/dapi-importer/${prefix}/reset`, {
        method: `POST`,
      });
      setReport(report);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    setLoading(false);
  });

  const clearError = useCallback(() => {
    setError(null);
  });

  return {
    report,
    error,
    loading,
    startImport,
    stopImport,
    resetImport,
    clearError,
  };
}
