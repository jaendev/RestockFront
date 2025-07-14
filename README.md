# 📦 RestockApp - Inventory Management System

A modern, full-stack inventory management application built with React Native (Expo) and .NET Core API. RestockApp provides comprehensive inventory tracking, low stock alerts, and category management with a beautiful dark/light mode interface.

## ✨ Features

### 🎯 **Core Functionality**

- **Inventory Management** - Complete CRUD operations for products
- **Category Organization** - Create, edit, and organize product categories
- **Stock Tracking** - Real-time stock levels with automatic alerts
- **Low Stock Alerts** - Automated notifications when inventory runs low
- **Search & Filtering** - Advanced product search and category filtering
- **Multi-Unit Support** - Various unit types (kg, lbs, pieces, etc.)

### 🎨 **User Experience**

- **Dark/Light Mode** - Fully implemented theme switching with persistence
- **Responsive Design** - Optimized for mobile and tablet devices
- **Intuitive Navigation** - Tab-based navigation with detailed views
- **Real-time Updates** - Instant data synchronization
- **Form Validation** - Comprehensive input validation and error handling

### 📊 **Analytics & Reports**

- **Dashboard Overview** - Key metrics and statistics
- **Category Analytics** - Product distribution and value calculations
- **Stock Status Reports** - Current inventory levels and alerts
- **Activity Timeline** - Recent inventory changes and updates

## 🛠️ Tech Stack

### **Frontend (Mobile App)**

- **React Native** with Expo (SDK 53)
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation
- **Lucide React Native** - Beautiful icons
- **AsyncStorage** - Local data persistence
- **Custom Theme System** - Dark/light mode with persistence

### **Backend (API)**

- **.NET 8** - Modern C# backend
- **ASP.NET Core** - RESTful API framework
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Robust database system
- **Docker** - Containerized development environment

## 🚀 Quick Start

### **Prerequisites**

- Node.js (v18 or higher)
- .NET 8 SDK
- Docker & Docker Compose
- Expo CLI (`npm install -g @expo/cli`)

### **1. Clone Repository**

```bash
git clone <repository-url>
cd Restock
```

### **2. Setup Backend**

```bash
# Navigate to API directory
cd RestockAPI

# Start PostgreSQL with Docker
docker-compose up -d

# Restore dependencies
dotnet restore

# Run database migrations
dotnet ef database update

# Start the API server
dotnet run
```

API will be available at `http://localhost:5000`

### **3. Setup Frontend**

```bash
# Navigate to app directory
cd RestockApp

# Install dependencies
npm install

# Start the development server
npm start
```

### **4. Run the App**

- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal
- **Physical Device**: Scan QR code with Expo Go app

## 📁 Project Structure

```
Restock/
├── RestockApp/                 # React Native Frontend
│   ├── app/                   # Expo Router pages
│   │   ├── (tabs)/           # Tab navigation screens
│   │   ├── category/         # Category detail pages
│   │   └── product/          # Product detail pages
│   ├── components/           # Reusable UI components
│   ├── context/             # React context (Theme)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API integration
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
│
└── RestockAPI/               # .NET Core Backend
    ├── Controllers/          # API endpoints
    ├── Models/              # Data models
    ├── DTOs/                # Data transfer objects
    ├── Services/            # Business logic
    ├── Data/                # Database context
    └── Migrations/          # Database migrations
```

## 🎨 Theme System

RestockApp features a comprehensive theme system with full dark mode support:

### **Color Palette**

- **Light Mode**: Clean whites and grays with blue accents
- **Dark Mode**: Deep blacks and grays with bright blue accents
- **Automatic Persistence**: User preferences saved locally

### **Themed Components**

- ✅ All screens and components adapt to theme
- ✅ Navigation and status bar automatically adjust
- ✅ Form components with proper contrast
- ✅ Icons and illustrations theme-aware

## 📱 App Screens

### **Main Navigation**

1. **🏠 Home** - Dashboard with key metrics and recent activity
2. **📦 Products** - Product inventory management
3. **📁 Categories** - Category organization and management
4. **⚙️ Settings** - App preferences and theme toggle

### **Detail Views**

- **Product Details** - Individual product management with stock controls
- **Category Details** - Category overview with product listings
- **Edit Forms** - Modal forms for creating/editing items

## 🔌 API Endpoints

### **Products**

```http
GET    /api/product/getProducts
GET    /api/product/getProductById/{id}
GET    /api/product/getCantProducts
GET    /api/product/getCantLowStockProducts
POST   /api/product/createProduct
PATCH  /api/product/updateProduct/{id}
PATCH  /api/product/updateStock/{id}
PATCH  /api/product/toggleProductActive/{id}
```

### **Categories**

```http
GET    /api/category/getCategories
GET    /api/category/getCategoryById/{id}
GET    /api/category/getCantCategories
POST   /api/category/createCategory
PATCH  /api/category/updateCategory/{id}
DELETE /api/category/deleteCategory/{id}
```

### **Alerts & Analytics**

```http
GET    /api/alert/getInventoryAlerts
GET    /api/unit/getUnitTypes
```

## 🧪 Development

### **Frontend Development**

```bash
cd RestockApp

# Type checking
npm run lint

# Start development server
npm start

# Build for production
npm run build
```

### **Backend Development**

```bash
cd RestockAPI

# Add new migration
dotnet ef migrations add <MigrationName>

# Update database
dotnet ef database update

# Run tests
dotnet test
```

## 🌟 Key Features Implemented

### **✅ Complete CRUD Operations**

- Products: Create, Read, Update, stock management
- Categories: Full lifecycle management with color coding
- Real-time data synchronization between frontend and backend

### **✅ Advanced UI/UX**

- Dark/light mode with system preference detection
- Smooth animations and transitions
- Responsive design for various screen sizes
- Intuitive navigation patterns

### **✅ Data Management**

- PostgreSQL database with Entity Framework
- RESTful API with proper error handling
- Form validation and user feedback
- Search and filtering capabilities

### **✅ Business Logic**

- Automatic low stock detection
- Category-based organization
- Multi-unit inventory tracking
- Activity timeline and alerts

## 🔧 Configuration

### **Environment Variables**

Create `.env` file in RestockApp directory:

```env
API_BASE_URL=http://localhost:5000/api
API_TIMEOUT=15000
APP_VERSION=1.0.0
ENABLE_DEBUG=true
```

### **Database Configuration**

Update `appsettings.json` in RestockAPI:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=restock_db;Username=root;Password=root"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Maintain consistent code formatting
- Add appropriate tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the excellent React Native framework
- **Microsoft** - For .NET Core and Entity Framework
- **Lucide** - For beautiful icons
- **Community** - For inspiration and feedback

---

**Built with ❤️ for efficient inventory management**

For questions or support, please open an issue in the repository.
