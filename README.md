# HomePal

A smart home management app built with React Native, Expo, and React Navigation.

## Features

- **Modern UI**: Clean and intuitive interface with iOS-style design
- **Navigation**: Tab-based navigation with stack navigation for detailed views
- **Room Management**: View and manage different rooms in your home
- **Device Control**: Monitor and control smart home devices
- **Profile Management**: User profile with statistics and settings
- **Settings**: Comprehensive settings with toggles and preferences

## Screens

- **Home**: Main dashboard showing rooms and quick access
- **Profile**: User profile with statistics and account management
- **Settings**: App settings, privacy controls, and preferences
- **Details**: Detailed view for individual rooms with device management

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library for React Native
- **Expo Vector Icons**: Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd HomePal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on your preferred platform:

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Project Structure

```
HomePal/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Main navigation configuration
│   └── screens/
│       ├── HomeScreen.tsx      # Home dashboard
│       ├── ProfileScreen.tsx   # User profile
│       ├── SettingsScreen.tsx  # App settings
│       └── DetailsScreen.tsx   # Room details
├── assets/                     # Images and icons
├── App.tsx                     # Main app component
├── app.json                    # Expo configuration
└── package.json               # Dependencies and scripts
```

## Navigation Structure

- **Tab Navigator**: Bottom tab navigation with Home, Profile, and Settings
- **Stack Navigator**: Stack navigation for detailed views and modals
- **Type Safety**: Full TypeScript support for navigation parameters

## Development

The app uses modern React Native patterns with:

- Functional components with hooks
- TypeScript for type safety
- React Navigation for navigation
- Expo for development and deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
