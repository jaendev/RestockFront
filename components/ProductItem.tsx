import { InventoryAlert } from "@/types/inventory";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/context/ThemeContext";

interface ProductItemProps {
  alert: InventoryAlert
}

export default function ProductItem({ alert }: ProductItemProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  // Format time display better
  const getTimeDisplay = () => {
    if (alert.timeAgo) {
      return alert.timeAgo;
    } else if (alert.hoursOld < 24) {
      return `Hace ${alert.hoursOld}h`;
    } else {
      return `Hace ${alert.daysOld} día${alert.daysOld !== 1 ? 's' : ''}`;
    }
  };

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityDot, { backgroundColor: alert.categoryColor }]} />
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle} numberOfLines={2}>
          {alert.message}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.productName}>{alert.productName}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.activityTime}>{getTimeDisplay()}</Text>
        </View>
      </View>
    </View>
  )
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) => StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
    marginTop: 5,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  separator: {
    fontSize: 12,
    color: colors.border,
    marginHorizontal: 6,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
})