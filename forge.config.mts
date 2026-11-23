import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import PublisherGithub from "@electron-forge/publisher-github";
import AutoUnpackNativesPlugin from "@electron-forge/plugin-auto-unpack-natives";

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: "**/node_modules/node-tectonic*/**",
    },
    ignore: [/node_modules\/(?!(node-tectonic-(linux|windows|darwin)-x64|node-tectonic-(linux|darwin)-arm64|node-tectonic|bindings|file-uri-to-path)\/)/],
    icon: "./assets/icon",
    executableName: "mentor-allocator"
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, [
      "darwin",
      "linux",
      "win32"
    ]),
    new MakerRpm({
      options: {icon: "./assets/icon.png"}
    }),
    new MakerDeb({
      options: {icon: "./assets/icon.png"}
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          entry: 'src/backend.ts',
          config: 'vite.backend.config.mts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.mts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: "Finnick4",
        name: "mentor-allocator"
      },
      draft: true,
    })
  ]
};

export default config;
