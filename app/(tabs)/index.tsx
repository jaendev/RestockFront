import AlertItem from "@/components/AlertItem";
import ProductItem from "@/components/ProductItem";
import QuickStat from "@/components/QuickStat";
import ShowFullInfo from "@/components/ShowFullInfo";
import { ViewSelector } from "@/constants/ViewSelector";
import { useAlert } from "@/hooks/useAlert";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useThemeColors } from "@/context/ThemeContext";
import { AlertTriangle, Package, TrendingUp } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const colors = useThemeColors();
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

  const styles = createStyles(colors);

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
            color={colors.primary}
            label="Productos totales"
            icon={Package}
            backgroundColor={colors.primaryLight}
          />

          {/* Low stock */}
          <QuickStat
            cantItem={cantLowStockProducts?.totalProducts || 0}
            color={colors.warning}
            label="Bajo stock"
            icon={AlertTriangle}
            backgroundColor={colors.warningLight}
          />

          {/* Low Categories */}
          <QuickStat
            cantItem={cantCategories?.totalCategories || 0}
            color={colors.success}
            label="Categorias"
            icon={TrendingUp}
            backgroundColor={colors.successLight}
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

// Dynamic styles based on theme colors
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
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
    color: colors.text,
    marginBottom: 16,
  },
  activityContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  alertsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
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
    color: colors.primary,
  },

  // Button for opening modal
  openButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  openButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },

  // Large modal
  largeModal: {
    width: "95%",
    maxHeight: "80%",
  },

  // Enhanced header
  enhancedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Enhanced close button
  enhancedCloseButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },

  // Modal body
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  modalText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Modal footer
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  enhancedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },

  closeModalButton: {
    backgroundColor: colors.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  closeModalButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },

  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
