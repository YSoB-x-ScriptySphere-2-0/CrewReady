import React from "react";
import { Audio, Series, staticFile, interpolate } from "remotion";
import { Starfield } from "./components/Starfield";

import { Scene1A_Hook } from "./scenes/Scene1A_Hook";
import { Scene1B_Solution } from "./scenes/Scene1B_Solution";
import { Scene1C_Team } from "./scenes/Scene1C_Team";
import { Scene1D_Passion } from "./scenes/Scene1D_Passion";
import { Scene2A_Crisis } from "./scenes/Scene2A_Crisis";
import { Scene2B_Gap } from "./scenes/Scene2B_Gap";
import { Scene2C_DataPoint } from "./scenes/Scene2C_DataPoint";
import { Scene2D_WhoItAffects } from "./scenes/Scene2D_WhoItAffects";
import { Scene3A_BigIdea } from "./scenes/Scene3A_BigIdea";
import { Scene3B_Levels } from "./scenes/Scene3B_Levels";
import { Scene3C_NasaData } from "./scenes/Scene3C_NasaData";
import { Scene3D_Prototype } from "./scenes/Scene3D_Prototype";
import { Scene4A_Impact } from "./scenes/Scene4A_Impact";
import { Scene4B_Teamwork } from "./scenes/Scene4B_Teamwork";
import { Scene4C_Future } from "./scenes/Scene4C_Future";
import { Scene4D_TheAsk } from "./scenes/Scene4D_TheAsk";
import { Scene4E_Close } from "./scenes/Scene4E_Close";

export const TOTAL_FRAMES = 7110; // 237 seconds @ 30fps

export const MyComposition: React.FC = () => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Background Starfield across all scenes */}
      <Starfield density={80} />

      {/* Cinematic Royalty-Free Background Music with gentle fade-in and fade-out */}
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 60, 6950, 7110], [0, 0.12, 0.12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* 17 Scenes Sequenced Accurately via Series */}
      <Series>
        {/* SECTION 1: WHO (0:00 - 0:45 · 1350 frames) */}
        <Series.Sequence durationInFrames={240}>
          <Scene1A_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={300}>
          <Scene1B_Solution />
        </Series.Sequence>

        <Series.Sequence durationInFrames={510}>
          <Scene1C_Team />
        </Series.Sequence>

        <Series.Sequence durationInFrames={300}>
          <Scene1D_Passion />
        </Series.Sequence>

        {/* SECTION 2: WHY (0:45 - 1:45 · 1800 frames) */}
        <Series.Sequence durationInFrames={450}>
          <Scene2A_Crisis />
        </Series.Sequence>

        <Series.Sequence durationInFrames={450}>
          <Scene2B_Gap />
        </Series.Sequence>

        <Series.Sequence durationInFrames={450}>
          <Scene2C_DataPoint />
        </Series.Sequence>

        <Series.Sequence durationInFrames={450}>
          <Scene2D_WhoItAffects />
        </Series.Sequence>

        {/* SECTION 3: WHAT (1:45 - 2:45 · 1800 frames) */}
        <Series.Sequence durationInFrames={390}>
          <Scene3A_BigIdea />
        </Series.Sequence>

        <Series.Sequence durationInFrames={420}>
          <Scene3B_Levels />
        </Series.Sequence>

        <Series.Sequence durationInFrames={480}>
          <Scene3C_NasaData />
        </Series.Sequence>

        <Series.Sequence durationInFrames={510}>
          <Scene3D_Prototype />
        </Series.Sequence>

        {/* SECTION 4: SO WHAT NEXT (2:45 - 3:57 · 2160 frames) */}
        <Series.Sequence durationInFrames={390}>
          <Scene4A_Impact />
        </Series.Sequence>

        <Series.Sequence durationInFrames={480}>
          <Scene4B_Teamwork />
        </Series.Sequence>

        <Series.Sequence durationInFrames={480}>
          <Scene4C_Future />
        </Series.Sequence>

        <Series.Sequence durationInFrames={360}>
          <Scene4D_TheAsk />
        </Series.Sequence>

        <Series.Sequence durationInFrames={450}>
          <Scene4E_Close />
        </Series.Sequence>
      </Series>
    </div>
  );
};
