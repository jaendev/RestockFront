import { ProductForm } from "@/components/ProductForm";
import { CategoryForm } from "@/components/CategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { createProduct } from "@/services/productService";
import { updateCategory } from "@/services/categoryService";
import { CreateProductDto } from "@/types/product";
import { UpdateCategoryDto } from "@/types/category";
import { useThemeColors } from "@/context/ThemeContext";
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
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [showInactiveProducts, setShowInactiveProducts] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const { categories, refetch: refetchCategories } = useCategories();
  const { products, refetch: refetchProducts } = useProducts();

  const categoryId = parseInt(id);
  const category = categories?.find((c) => c.id === categoryId);
  const categoryProducts = products?.filter((p) => p.categoryId === categoryId);

  const turnCategories = () => {
    router.push("/categories");
  };

  const handleCreateProduct = async (productData: CreateProductDto) => {
    try {
      await createProduct(productData);
      await refetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const handleUpdateCategory = async (
    categoryId: number,
    categoryData: UpdateCategoryDto,
  ) => {
    try {
      await updateCategory(categoryId, categoryData);
      await refetchCategories();
      // since we're getting it from the categories list
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  if (!category) {
    const styles = createStyles(colors);
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
  const lowStockProducts = activeProducts.filter((p) => p.isLowStock);
  const outOfStockProducts = activeProducts.filter((p) => p.isOutOfStock);

  const displayProducts = showInactiveProducts
    ? categoryProducts
    : activeProducts;

  const styles = createStyles(colors);

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
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Categoría</Text>
        <Text>
          <TouchableOpacity
            onPress={() => turnCategories()}
            style={styles.backButton}
          >
            <FolderOpen size={24} color={colors.text} />
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowEditForm(true)}
            >
              <Text style={styles.primaryButtonText}>Editar Categoría</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowCreateForm(true)}
            >
              <Text style={styles.secondaryButtonText}>Agregar Producto</Text>
            </TouchableOpacity>

            <ProductForm
              visible={showCreateForm}
              onClose={() => setShowCreateForm(false)}
              onSubmit={handleCreateProduct}
              currentCategoryId={categoryId}
            />

            <CategoryForm
              visible={showEditForm}
              onClose={() => setShowEditForm(false)}
              editCategory={category}
              onUpdate={handleUpdateCategory}
              onSubmit={() => Promise.resolve()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) =>
  StyleSheet.create({
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
    backButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.borderLight,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    editButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.borderLight,
    },
    content: {
      flex: 1,
    },
    categoryCard: {
      backgroundColor: colors.surface,
      margin: 16,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.shadow,
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
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    categoryDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    statsSection: {
      marginBottom: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
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
      backgroundColor: colors.borderLight,
      borderRadius: 12,
      marginHorizontal: 4,
    },
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
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
      color: colors.textSecondary,
    },
    statRowValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
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
      backgroundColor: colors.borderLight,
      borderRadius: 8,
    },
    toggleButtonText: {
      fontSize: 12,
      color: colors.textSecondary,
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
      color: colors.textMuted,
      marginTop: 12,
    },
    productCard: {
      backgroundColor: colors.borderLight,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inactiveProductCard: {
      opacity: 0.6,
      backgroundColor: colors.borderLight,
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
      backgroundColor: colors.primaryLight,
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
      color: colors.text,
      marginBottom: 2,
    },
    inactiveText: {
      color: colors.textMuted,
    },
    productPrice: {
      fontSize: 12,
      color: colors.textSecondary,
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
      color: colors.textMuted,
      marginBottom: 4,
    },
    productDetailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    actionSection: {
      gap: 12,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    primaryButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: colors.textSecondary,
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
      color: colors.error,
      marginBottom: 16,
      textAlign: "center",
    },
    errorButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    errorButtonText: {
      color: colors.surface,
      fontWeight: "600",
    },
  });
