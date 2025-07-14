import { ProductForm } from "@/components/ProductForm";
import { useProducts } from "@/hooks/useProducts";
import { updateProduct, updateStock } from "@/services/productService";
import { UpdateProductDto } from "@/types/product";
import { useThemeColors } from "@/context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Minus,
  Package,
  Plus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id);

  const { product, refetch } = useProducts(productId);

  const [showEditForm, setShowEditForm] = useState(false);
  const [quantity, setQuantity] = useState(product?.currentStock || 0);

  useEffect(() => {
    if (product) {
      setQuantity(product.currentStock);
    }
  }, [product]);

  const turnProucts = () => {
    router.push("/products");
  };

  const updateStockProduct = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    try {
      setQuantity(newQuantity);
      await updateStock(productId, newQuantity);
      await refetch();
    } catch (error) {
      console.error("Error updating stock:", error);
      setQuantity(product?.currentStock || 0);
      Alert.alert("Error", "No se pudo actualizar el stock");
    }
  };

  const handleUpdateProduct = async (
    productId: number,
    productData: UpdateProductDto,
  ) => {
    try {
      await updateProduct(productId, productData);
      await refetch();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  if (!product) {
    const styles = createStyles(colors);
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

  const styles = createStyles(colors);

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
        <Text style={styles.headerTitle}>Detalle del Producto</Text>
        <Text>
          <TouchableOpacity
            onPress={() => turnProucts()}
            style={styles.backButton}
          >
            <Package size={24} color={colors.text} />
          </TouchableOpacity>
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={styles.productCard}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            <View style={styles.productIcon}>
              <Package size={40} color={colors.primary} />
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
                  onPress={() => updateStockProduct(quantity - 1)}
                >
                  <Minus size={20} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stockButton}
                  onPress={() => updateStockProduct(quantity + 1)}
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => updateStockProduct(quantity)}
            >
              <Text style={styles.primaryButtonText}>Actualizar Stock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowEditForm(true)}
            >
              <Text style={styles.secondaryButtonText}>Editar Producto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ProductForm
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        editProduct={product}
        onUpdate={handleUpdateProduct}
        onSubmit={() => Promise.resolve()}
      />
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
    productCard: {
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
    productHeader: {
      alignItems: "center",
      marginBottom: 24,
    },
    productIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    productName: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    productDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    stockSection: {
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
      color: colors.textSecondary,
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
      backgroundColor: colors.borderLight,
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
      color: colors.textSecondary,
    },
    lowStockBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.warningLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    lowStockText: {
      fontSize: 12,
      color: colors.warning,
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
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
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
