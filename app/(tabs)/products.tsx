import { Browser } from "@/components/Browser";
import { useProducts } from "@/hooks/useProducts";
import { useProductSearch } from "@/hooks/useProductSearch";
import { router } from "expo-router";
import { Package, Plus } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductsScreen() {
  const { products } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts } = useProductSearch(
    products || [],
  );

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Browser
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={"Buscar productos..."}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productsContainer}>
          {filteredProducts?.map((product) => (
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
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
    backgroundColor: "#DBEAFE",
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
    color: "#111827",
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: "#6B7280",
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
    color: "#6B7280",
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  minStockContainer: {
    alignItems: "center",
  },
  minStockLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  minStockValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
  },
});
