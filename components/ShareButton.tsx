import React, { useState } from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  View,
  Share,
  Modal,
  Alert
} from "react-native";
import Colors from "@/constants/colors";
import { generatePDF } from "@/utils/pdfUtils";

interface ShareButtonProps {
  results: any;
}

export default function ShareButton({ results }: ShareButtonProps) {
  // Only show share button on mobile
  if (Platform.OS === 'web') {
    return null;
  }

  const [modalVisible, setModalVisible] = useState(false);

  const handleShareText = async () => {
    try {
      if (!results) return;
      
      // Calculate total months and days from all periods
      let totalMonths = 0;
      let totalDays = 0;
      
      results.periods.forEach((period: any) => {
        totalMonths += period.months || 0;
        totalDays += period.remainingDays || 0;
      });
      
      // Convert excess days to months (30 days = 1 month)
      const additionalMonths = Math.floor(totalDays / 30);
      totalMonths += additionalMonths;
      totalDays = totalDays % 30;
      
      // Create a detailed share text with all calculation information
      let shareText = `MARWARI INTEREST CALCULATOR\n\n`;
      shareText += `SUMMARY:\n`;
      shareText += `Principal Amount: ₹${results.principal}\n`;
      shareText += `Interest Rate: ${results.yearlyRate}%\n`;
      shareText += `Compounding Period: ${results.compoundingPeriod} months\n`;
      shareText += `Total Duration: ${totalMonths} months ${totalDays > 0 ? `and ${totalDays} days` : ''}\n`;
      shareText += `Total Interest: ₹${results.interest}\n`;
      shareText += `Total Amount: ₹${results.total}\n\n`;
      
      // Add period details
      shareText += `DETAILED CALCULATION:\n`;
      results.periods.forEach((period: any, index: any) => {
        shareText += `Period ${index + 1}: ${period.startDate} to ${period.endDate}\n`;
        shareText += `  Duration: ${period.months || 0}m ${period.remainingDays || 0}d\n`;
        shareText += `  Principal: ₹${period.principalForPeriod}\n`;
        shareText += `  Interest: ₹${period.interest}\n`;
        shareText += `  Balance: ₹${period.balance}\n\n`;
      });
      
      // Add attribution
      shareText += `\nDesigned and developed by Krishna Malani\n`;
      shareText += `Contact: Krishnamalani166@gmail.com\n`;
      shareText += `© 2025 Marwari Interest Calculator`;
      
      // Share options
      await Share.share({
        message: shareText,
        title: 'Marwari Interest Calculator Results'
      });
    } catch (error) {
      console.error('Error sharing text:', error);
      Alert.alert('Error', 'Failed to share text results');
    }
  };

  const handleSharePDF = async () => {
    try {
      if (!results) return;
      
      // Create a properly structured object with the correct property names
      const pdfData = {
        principal: results.principal,
        yearlyRate: results.yearlyRate,
        compoundingPeriod: results.compoundingPeriod,
        totalInterest: results.interest,
        totalAmount: results.total,
        periods: results.periods.map((period: any, index: number) => ({
          period: index + 1,
          startDate: period.startDate,
          endDate: period.endDate,
          days: period.days,
          months: period.months,
          remainingDays: period.remainingDays,
          principal: period.principalForPeriod,
          interest: period.interest,
          total: period.balance
        }))
      };
      
      // Generate and share PDF
      await generatePDF(pdfData);
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Failed to generate or share PDF');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Text style={{ fontSize: 20, color: "white" }}>📤</Text>
          <Text style={styles.text}>Share Results</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Results As</Text>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.textButton]}
              onPress={() => {
                setModalVisible(false);
                handleShareText();
              }}
            >
              <Text style={styles.modalButtonText}>Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.pdfButton]}
              onPress={() => {
                setModalVisible(false);
                handleSharePDF();
              }}
            >
              <Text style={styles.modalButtonText}>PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.text,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  textButton: {
    backgroundColor: Colors.secondary,
  },
  pdfButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: "#9CA3AF",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});