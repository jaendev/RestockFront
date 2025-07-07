export default {
  expo: {
    name: "RestockApp",
    slug: "RestockApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "restockapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    // Envoirments availables int he app
    extra: {
      // API configuration
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000/api",
      apiTimeout: parseInt(process.env.API_TIMEOUT) || 10000,

      // App configuration
      environment: process.env.NODE_ENV || "development",
      version: process.env.APP_VERSION || "1.0.0",
      enableDebug: process.env.ENABLE_DEBUG === "true" || process.env.NODE_ENV === "development",

      // Different environments
      ...(process.env.NODE_ENV === "production" && {
        apiBaseUrl: process.env.PROD_API_BASE_URL || "https://api.restockapp.com",
        enableDebug: false,
      }),

      ...(process.env.NODE_ENV === "development" && {
        apiBaseUrl: process.env.DEV_API_BASE_URL || "http://localhost:3000/api",
        enableDebug: true,
      }),
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.RestockApp"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
