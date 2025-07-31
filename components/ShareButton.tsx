import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  View,
  Share
} from "react-native";
import { Share2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ShareButtonProps {
  onPress: () => Promise<string>;
}

export default function ShareButton({ onPress }: ShareButtonProps) {
  // Only show share button on mobile
  if (Platform.OS === 'web') {
    return null;
  }

  const handleShare = async () => {
    try {
      // Get the PDF file path from the onPress callback
      const filePath = await onPress();
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Check if sharing is available
        const isSharingAvailable = await Sharing.isAvailableAsync();
        
        if (isSharingAvailable) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Interest Calculation',
            UTI: 'com.adobe.pdf' // iOS only
          });
        } else {
          // Fallback for when sharing is not available
          alert('Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('Failed to share results. Please try again.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleShare}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <Share2 size={20} color={Colors.buttonText} />
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