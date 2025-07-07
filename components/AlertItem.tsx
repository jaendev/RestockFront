import { useProducts } from "@/hooks/useProducts";
import { InventoryAlert } from "@/types/inventory";
import { AlertTriangle, Package } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AlertItemProps {
  alert: InventoryAlert
}

export default function AlertItem({ alert }: AlertItemProps) {
  const { product, loading } = useProducts(alert.productId);

  // Validate data
  if (!alert || !alert.productName || !alert.id) {
    return null;
  }

  // Only render if is low stock
  if (alert.alertTypeName !== "Stock Bajo") {
    return null;
  }

  // Show loading state if product is being fetched
  if (loading) {
    return (
      <View style={styles.alertItem}>
        <AlertTriangle size={16} color="#F59E0B" />
        <Text style={styles.alertText}>
          {alert.productName} - Cargando...
        </Text>
      </View>
    );
  }

  // Get stock status and message
  const getStockMessage = () => {
    if (!product) {
      return "Producto no encontrado";
    }

    const currentStock = product.currentStock;
    const minimumStock = product.minimumStock;

    if (currentStock === 0) {
      return 'Sin stock';
    } else if (currentStock <= minimumStock / 2) {
      return `Stock crítico: ${currentStock} ${product.unitSymbol}`;
    } else if (currentStock <= minimumStock) {
      return `Stock bajo: ${currentStock} ${product.unitSymbol}`;
    } else {
      return `${currentStock} ${product.unitSymbol} disponibles`;
    }
  };

  // Get appropriate icon and color based on stock level
  const getAlertStyle = () => {
    if (!product) {
      return { color: '#6B7280', icon: Package };
    }

    const currentStock = product.currentStock;
    const minimumStock = product.minimumStock;

    if (currentStock === 0) {
      return { color: '#EF4444', icon: AlertTriangle }; // Red for out of stock
    } else if (currentStock <= minimumStock / 2) {
      return { color: '#DC2626', icon: AlertTriangle }; // Dark red for critical
    } else {
      return { color: '#F59E0B', icon: AlertTriangle }; // Orange for low stock
    }
  };

  const alertStyle = getAlertStyle();
  const IconComponent = alertStyle.icon;

  return (
    <View style={styles.alertItem}>
      <IconComponent size={16} color={alertStyle.color} />
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{alert.productName}</Text>
        <Text style={styles.alertText}>
          {getStockMessage()}
        </Text>
      </View>
      {/* Mostrar tiempo transcurrido */}
      <Text style={styles.timeAgo}>{alert.timeAgo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeAgo: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});