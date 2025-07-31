import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  View
} from "react-native";
import { PrinterIcon } from "./SimpleIcons";
import Colors from "@/constants/colors";

interface PrintButtonProps {
  onPress: () => void;
}

export default function PrintButton({ onPress }: PrintButtonProps) {
  // Only show print button on web
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <Text style={{ fontSize: 20, color: "white" }}>🖨️</Text>
        <Text style={styles.text}>Print Results</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
});