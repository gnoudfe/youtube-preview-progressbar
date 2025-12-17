// src/platform/MetadataStore.ts

type Level = {
  id: "L1" | "L2" | "L3";
  grid: number;
  tile: { width: number; height: number };
  sprites: {
    urlTemplate: string; // sprite_{index}.jpg
    count: number;
  };
};

type Metadata = {
  duration: number;
  thumbnailInterval: number;
  levels: Level[];
};

class MetadataStore {
  private metadata: Metadata | null = null;

  async load(videoId: string) {
    // mock backend response
    this.metadata = {
      duration: 300,
      thumbnailInterval: 1,
      levels: [
        {
          id: "L1",
          grid: 10,
          tile: { width: 40, height: 24 },
          sprites: {
            urlTemplate: "/sprites/L1/L1_M00{index}.jpg",
            count: 10,
          },
        },
        {
          id: "L2",
          grid: 5,
          tile: { width: 80, height: 45 },
          sprites: {
            urlTemplate: "/sprites/L2/L2_M00{index}.jpg",
            count: 6,
          },
        },
        {
          id: "L3",
          grid: 3,
          tile: { width: 160, height: 90 },
          sprites: {
            urlTemplate: "/sprites/L3/L3_M00{index}.jpg",
            count: 4,
          },
        },
      ],
    };
  }

  get() {
    if (!this.metadata) {
      throw new Error("Metadata not loaded");
    }
    return this.metadata;
  }
}

export const metadataStore = new MetadataStore();
