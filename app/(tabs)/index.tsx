import AlertItem from "@/components/AlertItem";
import ProductItem from "@/components/ProductItem";
import QuickStat from "@/components/QuickStat";
import ShowFullInfo from "@/components/ShowFullInfo";
import { ViewSelector } from "@/constants/ViewSelector";
import { useAlert } from "@/hooks/useAlert";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { AlertTriangle, Package, TrendingUp } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const {
    cantProducts,
    cantLowStockProducts,
    refetch: refetchProducts,
  } = useProducts();
  const { cantCategories, refetch: refetchCategories } = useCategories();
  const [showLowStockAlert, setShowLowStockAler] = useState<boolean>(false);
  const [showRecentActivity, setShowRecentActivity] = useState<boolean>(false);
  const { alerts } = useAlert();
  const { ProductType, AlertType } = ViewSelector;

  const showAllRecentActivity = () => {
    setShowRecentActivity(!showRecentActivity);
  };

  const showAllLowStockAlerts = () => {
    setShowLowStockAler(!showLowStockAlert);
  };

  useEffect(() => {
    refetchProducts();
    refetchCategories();
  }, [refetchProducts, refetchCategories]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventario de inicio</Text>
      </View>

      <ScrollView style={styles.content} showsHorizontalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {/* Total items */}
          <QuickStat
            cantItem={cantProducts?.totalProducts || 0}
            color="#2563EB"
            label="Productos totales"
            icon={Package}
            backgroundColor="#DBEAFE"
          />

          {/* Low stock */}
          <QuickStat
            cantItem={cantLowStockProducts?.totalProducts || 0}
            color="#F59E0B"
            label="Bajo stock"
            icon={AlertTriangle}
            backgroundColor="#FEF3C7"
          />

          {/* Low Categories */}
          <QuickStat
            cantItem={cantCategories?.totalCategories || 0}
            color="#10B981"
            label="Categorias"
            icon={TrendingUp}
            backgroundColor="#D1FAE5"
          />
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          <View style={styles.activityContainer}>
            {/* TODO: Make a function to show the time the alert has been created */}
            {alerts?.slice(0, 5).map((alert) => (
              <ProductItem key={alert.id} alert={alert} />
            ))}
            <ShowFullInfo
              label="Ver más"
              showFullInfoVoid={showAllRecentActivity}
              showFullInfo={showRecentActivity}
              title={"Toda la Actividad Reciente"}
              type={ProductType}
            />
          </View>
        </View>

        {/* Low Stock Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas de bajo stock</Text>
          <View style={styles.alertsContainer}>
            {alerts
              ?.filter((alert) => alert.alertTypeName === "Stock Bajo")
              .slice(0, 5)
              .map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            <ShowFullInfo
              label="Ver más"
              showFullInfoVoid={showAllLowStockAlerts}
              showFullInfo={showLowStockAlert}
              title={"Todas las Alertas de Bajo Stock"}
              type={AlertType}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  activityContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  alertsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  viewMoreBtn: {
    alignItems: "center",
  },
  viewMoreText: {
    color: "#2563EB",
  },

  // Botón para abrir modal
  openButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  openButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal overlay (fondo)

  // Contenido del modal

  largeModal: {
    width: "95%",
    maxHeight: "80%",
  },

  // Cabecera del modal

  enhancedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Botones de cierre

  enhancedCloseButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },

  // Cuerpo del modal
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  modalText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },

  // Footer del modal
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  enhancedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },

  closeModalButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  closeModalButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});
