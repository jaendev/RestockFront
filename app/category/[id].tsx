import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  FolderOpen,
  Package,
  TrendingUp,
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [showInactiveProducts, setShowInactiveProducts] = useState(false);

  const { categories } = useCategories();
  const { products } = useProducts();

  const categoryId = parseInt(id);
  const category = categories?.find((c) => c.id === categoryId);
  const categoryProducts = products?.filter((p) => p.categoryId === categoryId);

  const turnCategories = () => {
    router.push("/categories");
  };

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Categoría no encontrada</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeProducts = categoryProducts?.filter((p) => p.isActive) || [];
  const inactiveProducts = categoryProducts?.filter((p) => !p.isActive) || [];
  const lowStockProducts = activeProducts.filter((p) => p.isLowStock);
  const outOfStockProducts = activeProducts.filter((p) => p.isOutOfStock);

  const displayProducts = showInactiveProducts
    ? categoryProducts
    : activeProducts;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stock bajo":
        return "#F59E0B";
      case "Sin stock":
        return "#EF4444";
      case "Stock crítico":
        return "#DC2626";
      default:
        return "#10B981";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Stock bajo":
        return "#FEF3C7";
      case "Sin stock":
        return "#FEE2E2";
      case "Stock crítico":
        return "#FEE2E2";
      default:
        return "#D1FAE5";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Categoría</Text>
        <Text>
          <TouchableOpacity
            onPress={() => turnCategories()}
            style={styles.backButton}
          >
            <FolderOpen size={24} color="#111827" />
          </TouchableOpacity>
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Card */}
        <View style={styles.categoryCard}>
          {/* Category Header */}
          <View style={styles.categoryHeader}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: `${category.color}20` },
              ]}
            >
              <FolderOpen size={40} color={category.color} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription}>
              {category.description}
            </Text>
          </View>

          {/* Statistics Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Package size={20} color="#2563EB" />
                </View>
                <Text style={styles.statNumber}>{category.totalProducts}</Text>
                <Text style={styles.statLabel}>Total Productos</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#FEF3C7" },
                  ]}
                >
                  <AlertTriangle size={20} color="#F59E0B" />
                </View>
                <Text style={styles.statNumber}>{lowStockProducts.length}</Text>
                <Text style={styles.statLabel}>Bajo Stock</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#D1FAE5" },
                  ]}
                >
                  <TrendingUp size={20} color="#10B981" />
                </View>
                <Text style={styles.statNumber}>
                  €{category.totalCategoryValue?.toFixed(2) || "0.00"}
                </Text>
                <Text style={styles.statLabel}>Valor Total</Text>
              </View>
            </View>

            <View style={styles.detailedStats}>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Productos Activos</Text>
                <Text style={styles.statRowValue}>
                  {category.activeProducts}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Productos Inactivos</Text>
                <Text style={styles.statRowValue}>
                  {category.inactiveProducts}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Sin Stock</Text>
                <Text style={[styles.statRowValue, { color: "#EF4444" }]}>
                  {outOfStockProducts.length}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Creada hace</Text>
                <Text style={styles.statRowValue}>{category.daysOld} días</Text>
              </View>
            </View>
          </View>

          {/* Products Section */}
          <View style={styles.productsSection}>
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>
                Productos ({displayProducts?.length || 0})
              </Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowInactiveProducts(!showInactiveProducts)}
              >
                {showInactiveProducts ? (
                  <EyeOff size={18} color="#6B7280" />
                ) : (
                  <Eye size={18} color="#6B7280" />
                )}
                <Text style={styles.toggleButtonText}>
                  {showInactiveProducts ? "Ocultar inactivos" : "Mostrar todos"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productsContainer}>
              {displayProducts?.length === 0 ? (
                <View style={styles.emptyState}>
                  <Package size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>
                    No hay productos en esta categoría
                  </Text>
                </View>
              ) : (
                displayProducts?.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={[
                      styles.productCard,
                      !product.isActive && styles.inactiveProductCard,
                    ]}
                    onPress={() => router.push(`/product/${product.id}`)}
                  >
                    <View style={styles.productHeader}>
                      <View style={styles.productIcon}>
                        <Package size={16} color="#2563EB" />
                      </View>
                      <View style={styles.productInfo}>
                        <Text
                          style={[
                            styles.productName,
                            !product.isActive && styles.inactiveText,
                          ]}
                        >
                          {product.name}
                        </Text>
                        <Text style={styles.productPrice}>
                          €{product.price}
                        </Text>
                      </View>
                      <View style={styles.productStatus}>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusBgColor(
                                product.stockStatus,
                              ),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              { color: getStatusColor(product.stockStatus) },
                            ]}
                          >
                            {product.stockStatus}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.productDetails}>
                      <View style={styles.productDetailItem}>
                        <Text style={styles.productDetailLabel}>Stock</Text>
                        <Text
                          style={[
                            styles.productDetailValue,
                            {
                              color: product.isLowStock ? "#F59E0B" : "#111827",
                            },
                          ]}
                        >
                          {product.currentStock} {product.unitSymbol}
                        </Text>
                      </View>
                      <View style={styles.productDetailItem}>
                        <Text style={styles.productDetailLabel}>Min</Text>
                        <Text style={styles.productDetailValue}>
                          {product.minimumStock}
                        </Text>
                      </View>
                      <View style={styles.productDetailItem}>
                        <Text style={styles.productDetailLabel}>Valor</Text>
                        <Text style={styles.productDetailValue}>
                          €{product.totalValue?.toFixed(2) || "0.00"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Editar Categoría</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Agregar Producto</Text>
            </TouchableOpacity>
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
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  statsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
  detailedStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statRowLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  productsSection: {
    marginBottom: 24,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  productsContainer: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
  productCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inactiveProductCard: {
    opacity: 0.6,
    backgroundColor: "#F3F4F6",
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  inactiveText: {
    color: "#9CA3AF",
  },
  productPrice: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  productStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  productDetailItem: {
    alignItems: "center",
  },
  productDetailLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  productDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  actionSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#DC2626",
    marginBottom: 16,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
