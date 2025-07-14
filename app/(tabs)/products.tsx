import { Browser } from "@/components/Browser";
import { useProducts } from "@/hooks/useProducts";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useThemeColors } from "@/context/ThemeContext";
import { router } from "expo-router";
import { Package, Plus } from "lucide-react-native";
import { DropdownFilter } from "@/components/DropdownFilter";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateProductDto } from "@/types/product";
import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "@/services/productService";

export default function ProductsScreen() {
  const colors = useThemeColors();
  const { products, refetch } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts } = useProductSearch(
    products || [],
  );

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateProduct = async (productData: CreateProductDto) => {
    try {
      await createProduct(productData);
      await refetch();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const getFilteredProducts = () => {
    let filtered = filteredProducts;

    switch (selectedFilter) {
      case "low_stock":
        return filtered.filter((product) => product.isLowStock);
      case "active":
        return filtered.filter((product) => product.isActive);
      case "inactive":
        return filtered.filter((product) => !product.isActive);
      case "out_of_stock":
        return filtered.filter((product) => product.isOutOfStock);
      default:
        return filtered;
    }
  };

  const finalProducts = getFilteredProducts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Bajo":
        return "#F59E0B";
      case "Sin Stock":
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Bajo":
        return "#FEF3C7";
      case "Sin Stock":
        return "#FEE2E2";
      default:
        return "#D1FAE5";
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ProductForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateProduct}
      />

      <Browser
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilter={showFilter}
        onShowFilterChange={setShowFilter}
        placeholder={"Buscar productos..."}
      />

      <DropdownFilter
        selectedValue={selectedFilter}
        onSelect={setSelectedFilter}
        placeholder="Filtros"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productsContainer}>
          {finalProducts?.map((product) => (
            <TouchableOpacity
              onPress={() => router.push(`/product/${product.id}`)}
              key={product.id}
              style={styles.productCard}
            >
              <View style={styles.productHeader}>
                <View style={styles.productIcon}>
                  <Package size={20} color="#2563EB" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>
                    {product.categoryName}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBgColor(product.stockStatus) },
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

              <View style={styles.productDetails}>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Cantidad</Text>
                  <Text style={styles.quantityValue}>
                    {product.currentStock}
                  </Text>
                </View>
                <View style={styles.minStockContainer}>
                  <Text style={styles.minStockLabel}>Min Stock</Text>
                  <Text style={styles.minStockValue}>
                    {product.minimumStock}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {(!finalProducts || finalProducts.length === 0) && (
            <View style={styles.emptyState}>
              <Package size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No hay productos</Text>
              <Text style={styles.emptyStateText}>
                No se encontraron productos que coincidan con los filtros
                aplicados
              </Text>
            </View>
          )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.borderLight,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productsContainer: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantityContainer: {
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  minStockContainer: {
    alignItems: "center",
  },
  minStockLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  minStockValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    gap: 12,
    alignItems: "center",
  },
  filterDropdown: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
});
