import { LucideIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface QuickStatProps {
  cantItem: number;
  color: string;
  label: string;
  icon: LucideIcon;
  backgroundColor?: string;
}

export default function QuickStat({ cantItem, color, label, icon: Icon, backgroundColor = '#DBEAFE' }: QuickStatProps) {

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: backgroundColor }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.statNumber}>{cantItem}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
})