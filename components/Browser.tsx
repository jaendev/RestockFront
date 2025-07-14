import { Search } from "lucide-react-native";
import { TextInput, View, StyleSheet } from "react-native";
import { useThemeColors } from "@/context/ThemeContext";

interface BrowserProps {
  searchTerm: string;
  placeholder: string;
  showFilter: boolean;
  onSearchChange: (term: string) => void;
  onShowFilterChange: (show: boolean) => void;
}

export function Browser({
  searchTerm,
  onSearchChange,
  showFilter,
  placeholder,
  onShowFilterChange,
}: BrowserProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Search size={18} color={colors.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={searchTerm}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) => StyleSheet.create({
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
});
