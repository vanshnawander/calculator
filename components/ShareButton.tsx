import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  View,
  Share
} from "react-native";
import { ShareIcon } from "./SimpleIcons";
import Colors from "@/constants/colors";

interface ShareButtonProps {
  results: any;
}

export default function ShareButton({ results }: ShareButtonProps) {
  // Only show share button on mobile
  if (Platform.OS === 'web') {
    return null;
  }

  const handleShare = async () => {
    try {
      if (!results) return;
      
      const shareText = `Interest Calculator Results\n\nPrincipal: ₹${results.principal}\nInterest Rate: ${results.yearlyRate}%\nTotal Interest: ₹${results.interest}\nTotal Amount: ₹${results.total}\n\nCalculated on: ${new Date().toLocaleDateString()}\n\nDesigned and developed by Krishna Malani © 2025`;
      
      await Share.share({
        message: shareText,
        title: 'Interest Calculator Results'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleShare}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <Text style={{ fontSize: 20, color: "white" }}>📤</Text>
        <Text style={styles.text}>Share Results</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
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