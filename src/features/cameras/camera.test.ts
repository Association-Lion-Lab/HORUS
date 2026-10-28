import { describe, expect, it } from "vitest";
import { parseCameraDraft } from "./camera";

describe("parseCameraDraft", () => {
  it("accepts a local RTSP camera without embedded credentials", () => {
    expect(
      parseCameraDraft({ name: "Entrée", streamUrl: "rtsp://192.168.1.40/live" }),
    ).toEqual({ name: "Entrée", streamUrl: "rtsp://192.168.1.40/live" });
  });

  it("rejects non-RTSP protocols", () => {
    expect(() =>
      parseCameraDraft({ name: "Entrée", streamUrl: "https://example.test/live" }),
    ).toThrow("Le flux doit utiliser RTSP");
  });

  it("rejects credentials embedded in the URL", () => {
    expect(() =>
      parseCameraDraft({ name: "Entrée", streamUrl: "rtsp://admin:secret@192.168.1.40/live" }),
    ).toThrow("identifiants séparément");
  });
});
