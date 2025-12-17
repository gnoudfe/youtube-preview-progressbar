import { useEffect, useState } from "react";

export type StoryboardLevel = {
  id: string;
  grid: number;
  tile: { width: number; height: number };
  sprites: {
    urlTemplate: string;
  };
};

export function useStoryboard() {
  const [data, setData] = useState<{
    duration: number;
    thumbnailInterval: number;
    levels: StoryboardLevel[];
  } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/metadata");
      const json = await response.json();
      setData(json);
    };
    fetchData();
  }, []);

  return data;
}
