
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c4603a683263447f81de0c301bbbb825',
  appName: 'zaqaz',
  webDir: 'dist',
  server: {
    url: 'https://c4603a68-3263-447f-81de-0c301bbbb825.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      keystorePassword: 'password',
      keyPassword: 'password',
    }
  }
};

export default config;
