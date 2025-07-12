import { useProducts } from "@/hooks/useProducts";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Minus,
  Package,
  Plus,
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id);

  const { product } = useProducts(productId);

  const [quantity, setQuantity] = useState(product?.currentStock || 0);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const turnProucts = () => {
    router.push("/products");
  };

  const updateStock = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      // TODO: Api calls
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
        <Text style={styles.headerTitle}>Detalle del Producto</Text>
        <Text>
          <TouchableOpacity
            onPress={() => turnProucts()}
            style={styles.backButton}
          >
            <Package size={24} color="#111827" />
          </TouchableOpacity>
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={styles.productCard}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            <View style={styles.productIcon}>
              <Package size={40} color="#2563EB" />
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>

          {/* Stock Management */}
          <View style={styles.stockSection}>
            <Text style={styles.sectionTitle}>Gestión de Stock</Text>

            <View style={styles.stockRow}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockLabel}>Stock Actual</Text>
                <Text
                  style={[
                    styles.stockValue,
                    {
                      color: product.isLowStock ? "#F59E0B" : "#10B981",
                    },
                  ]}
                >
                  {quantity} {product.unitSymbol}
                </Text>
              </View>

              <View style={styles.stockControls}>
                <TouchableOpacity
                  style={styles.stockButton}
                  onPress={() => updateStock(quantity - 1)}
                >
                  <Minus size={20} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stockButton}
                  onPress={() => updateStock(quantity + 1)}
                >
                  <Plus size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.minStockRow}>
              <Text style={styles.minStockLabel}>
                Stock Mínimo: {product.minimumStock}
              </Text>
              {product.isLowStock && (
                <View style={styles.lowStockBadge}>
                  <AlertTriangle size={16} color="#F59E0B" />
                  <Text style={styles.lowStockText}>Stock Bajo</Text>
                </View>
              )}
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información del Producto</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Precio</Text>
              <Text style={styles.infoValue}>{product.price}€</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cantidad Actual</Text>
              <Text style={styles.infoValue}>
                {product.currentStock} {product.unitName}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoría</Text>
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: product.categoryColor + "20",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/category/${product.categoryId}`)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: product.categoryColor,
                      },
                    ]}
                  >
                    {product.categoryName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor Total</Text>
              <Text style={styles.infoValue}>
                {(product.currentStock * product.price).toFixed(2)}€
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor</Text>
              <Text style={styles.infoValue}>
                {(quantity * product.price).toFixed(2)}€
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text
                style={[
                  styles.statusText,
                  {
                    color: product.isLowStock ? "#F59E0B" : "#10B981",
                  },
                ]}
              >
                {product.stockStatus}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Actualizar Stock</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Editar Producto</Text>
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
  productCard: {
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
  productHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  productIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  stockSection: {
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
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stockInfo: {
    flex: 1,
  },
  stockLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  stockControls: {
    flexDirection: "row",
    gap: 8,
  },
  stockButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  minStockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  minStockLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  lowStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  lowStockText: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "500",
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#374151",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
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
