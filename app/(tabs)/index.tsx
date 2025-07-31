import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Stack } from "expo-router";
import FormInput from "@/components/FormInput";
import DateInput from "@/components/DateInput";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ResultSummary from "@/components/ResultSummary";
import PrintButton from "@/components/PrintButton";
import ShareButton from "@/components/ShareButton";
import PrintableResults from "@/components/PrintableResults";
import { formatDate, parseDate, formatDateInput, isValidDateFormat } from "@/utils/dateUtils";
import { calculateInterest } from "@/utils/calculationUtils";
import { printResults } from "@/utils/printUtils";
import { generatePDF } from "@/utils/pdfUtils";
import Colors from "@/constants/colors";
import SimplePicker from "@/components/SimplePicker";

export default function CalculatorScreen() {
  const [formData, setFormData] = useState({
    principal: "",
    interestRate: "1.25",
    startDate: "",
    endDate: "",
    interestPeriod: "monthly",
    compoundingPeriod: "12",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Set today's date as the end date by default
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      endDate: formatDate(today)
    }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.principal) {
      newErrors.principal = "Principal amount is required";
    } else if (isNaN(parseFloat(formData.principal)) || parseFloat(formData.principal) <= 0) {
      newErrors.principal = "Enter a valid amount";
    }
    
    if (!formData.interestRate) {
      newErrors.interestRate = "Interest rate is required";
    } else if (isNaN(parseFloat(formData.interestRate)) || parseFloat(formData.interestRate) <= 0) {
      newErrors.interestRate = "Enter a valid rate";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (!isValidDateFormat(formData.startDate)) {
      newErrors.startDate = "Invalid date format (DD/MM/YYYY)";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (!isValidDateFormat(formData.endDate)) {
      newErrors.endDate = "Invalid date format (DD/MM/YYYY)";
    }
    
    if (isValidDateFormat(formData.startDate) && isValidDateFormat(formData.endDate)) {
      const startDate = parseDate(formData.startDate);
      const endDate = parseDate(formData.endDate);
      
      if (startDate >= endDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    
    if (!formData.compoundingPeriod) {
      newErrors.compoundingPeriod = "Compounding period is required";
    } else if (
      isNaN(parseInt(formData.compoundingPeriod)) || 
      parseInt(formData.compoundingPeriod) <= 0
    ) {
      newErrors.compoundingPeriod = "Enter a valid period";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate a brief calculation time for better UX
    setTimeout(() => {
      const result = calculateInterest(
        formData.principal,
        formData.interestRate,
        formData.startDate,
        formData.endDate,
        formData.interestPeriod as "yearly" | "monthly",
        formData.compoundingPeriod
      );
      
      if (result) {
        setResults(result);
      } else {
        setErrors({ form: "Calculation failed. Please check your inputs." });
      }
      
      setIsCalculating(false);
    }, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateChange = (field: string, value: string) => {
    const formattedDate = formatDateInput(value);
    handleInputChange(field, formattedDate);
  };

  const handleDateSelect = (field: string, date: Date) => {
    handleInputChange(field, formatDate(date));
  };

  const resetCalculator = () => {
    setFormData({
      principal: "",
      interestRate: "1.25",
      startDate: "",
      endDate: formatDate(new Date()),
      interestPeriod: "monthly",
      compoundingPeriod: "12",
    });
    setResults(null);
    setErrors({});
  };

  const handlePrint = () => {
    printResults();
  };

  const handleGeneratePDF = async (): Promise<string> => {
    if (!results) return '';
    
    try {
      // Create a properly structured object with the correct property names
      const pdfData = {
        principal: results.principal,
        yearlyRate: results.yearlyRate,
        compoundingPeriod: results.compoundingPeriod,
        totalInterest: results.interest,  // Changed to match the property name in ResultData
        totalAmount: results.total,       // Changed to match the property name in ResultData
        periods: results.periods
      };
      
      // Log the data being sent to the PDF generator for debugging
      console.log('Sending to PDF generator:', {
        principal: pdfData.principal,
        yearlyRate: pdfData.yearlyRate,
        totalInterest: pdfData.totalInterest,
        totalAmount: pdfData.totalAmount,
        periodsCount: pdfData.periods.length
      });
      
      const pdfPath = await generatePDF(pdfData);
      return pdfPath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return '';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: "Marwari Interest Calculator",
          headerTitleStyle: {
            fontWeight: "600",
            color: Colors.text,
          },
        }}
      />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!results ? (
            <View style={styles.formContainer}>
              <Card>
                <Text style={styles.sectionTitle}>Principal & Interest</Text>
                <FormInput
                  label="Principal Amount"
                  value={formData.principal}
                  onChangeText={(value) => handleInputChange("principal", value)}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  error={errors.principal}
                />
                
                <View style={styles.row}>
                  <FormInput
                    label="Interest Rate (%)"
                    value={formData.interestRate}
                    onChangeText={(value) => handleInputChange("interestRate", value)}
                    keyboardType="numeric"
                    placeholder="Enter rate"
                    style={styles.halfInput}
                    error={errors.interestRate}
                  />
                  
                  <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Rate Period</Text>
                    <SimplePicker
                      selectedValue={formData.interestPeriod}
                      onValueChange={(value) => handleInputChange("interestPeriod", value)}
                      items={[
                        { label: "Monthly", value: "monthly" },
                        { label: "Yearly", value: "yearly" }
                      ]}
                    />
                  </View>
                </View>
                
                <FormInput
                  label="Compounding Period (months)"
                  value={formData.compoundingPeriod}
                  onChangeText={(value) => handleInputChange("compoundingPeriod", value)}
                  keyboardType="numeric"
                  placeholder="Enter months"
                  error={errors.compoundingPeriod}
                />
              </Card>
              
              <Card>
                <Text style={styles.sectionTitle}>Date Range</Text>
                <View style={styles.dateInputs}>
                  <DateInput
                    label="Start Date"
                    value={formData.startDate}
                    onChangeText={(value) => handleDateChange("startDate", value)}
                    onDateSelect={(date) => handleDateSelect("startDate", date)}
                    style={styles.dateInput}
                    error={errors.startDate}
                  />
                  
                  <DateInput
                    label="End Date"
                    value={formData.endDate}
                    onChangeText={(value) => handleDateChange("endDate", value)}
                    onDateSelect={(date) => handleDateSelect("endDate", date)}
                    style={styles.dateInput}
                    error={errors.endDate}
                  />
                </View>
              </Card>
              
              {errors.form && (
                <Text style={styles.formError}>{errors.form}</Text>
              )}
              
              <Button
                title="Calculate Interest"
                onPress={handleCalculate}
                loading={isCalculating}
                style={styles.calculateButton}
              />
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              <ResultSummary
                principal={results.principal}
                yearlyRate={results.yearlyRate}
                compoundingPeriod={results.compoundingPeriod}
                totalInterest={results.interest}
                totalAmount={results.total}
                periods={results.periods}
              />
              
              <View style={styles.buttonContainer}>
                <Button
                  title="← New Calculation"
                  onPress={resetCalculator}
                  style={styles.backButton}
                  variant="outline"
                />
                
                <View style={styles.exportButtonsContainer}>
                  <PrintButton onPress={handlePrint} />
                  <ShareButton results={results} />
                </View>
              </View>
              
              {/* Hidden component that becomes visible only when printing */}
              {Platform.OS === 'web' && (
                <View id="printable-content" style={{ display: 'none' }}>
                  <PrintableResults
                    principal={results.principal}
                    yearlyRate={results.yearlyRate}
                    compoundingPeriod={results.compoundingPeriod}
                    totalInterest={results.interest}
                    totalAmount={results.total}
                    periods={results.periods}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  resultsContainer: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.text,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
    height: 50,
    justifyContent: "center",
  },
  dateInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  formError: {
    color: Colors.error,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  calculateButton: {
    marginTop: 24,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 16,
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 16,
    marginBottom: 8,
  },
  exportButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
    flexWrap: "wrap",
  },
});