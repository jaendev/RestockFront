import { Filter, Search } from "lucide-react-native";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

interface BrowserProps {
  searchTerm: string;
  placeholder: string;
  onSearchChange: (term: string) => void;
}

export function Browser({
  searchTerm,
  onSearchChange,
  placeholder,
}: BrowserProps) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Search size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={searchTerm}
          onChangeText={onSearchChange}
        />
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Filter size={18} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
