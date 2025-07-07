import { InventoryAlert } from "@/types/inventory";
import { StyleSheet, Text, View } from "react-native";

interface ProductItemProps {
  alert: InventoryAlert
}

export default function ProductItem({ alert }: ProductItemProps) {

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

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
    marginTop: 5,
    shadowColor: '#000',
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
    color: '#111827',
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
    color: '#374151',
  },
  separator: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 6,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
})