import { LucideIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/context/ThemeContext";

interface QuickStatProps {
  cantItem: number;
  color: string;
  label: string;
  icon: LucideIcon;
  backgroundColor?: string;
}

export default function QuickStat({ cantItem, color, label, icon: Icon, backgroundColor }: QuickStatProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: backgroundColor || colors.primaryLight }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.statNumber}>{cantItem}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) => StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})