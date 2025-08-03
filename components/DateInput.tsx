import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarIcon } from "./SimpleIcons";
import Colors from "@/constants/colors";

interface DateInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onDateSelect: (date: Date) => void;
  placeholder?: string;
  style?: object;
  error?: string;
}

export default function DateInput({
  label,
  value,
  onChangeText,
  onDateSelect,
  placeholder = "DD/MM/YYYY",
  style,
  error,
}: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Handle date input changes with automatic formatting
  const handleDateInput = (text: string) => {
    // Remove non-numeric characters except /
    let cleaned = text.replace(/[^0-9/]/g, '');
    
    // Auto-format as user types
    if (cleaned.length >= 2 && cleaned.charAt(2) !== '/') {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length >= 5 && cleaned.charAt(5) !== '/') {
      cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5);
    }
    
    // Limit to DD/MM/YYYY format
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
    
    onChangeText(cleaned);
    
    // If complete date, validate and call onDateSelect
    if (cleaned.length === 10) {
      const [day, month, year] = cleaned.split('/').map(Number);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
        const date = new Date(year, month - 1, day);
        onDateSelect(date);
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear().toString();
      const formattedDate = `${day}/${month}/${year}`;
      onChangeText(formattedDate);
      onDateSelect(selectedDate);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : null,
          ]}
          value={value}
          onChangeText={handleDateInput}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => setShowPicker(true)}
        >
          <CalendarIcon size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value.split('/').reverse().join('-')) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    paddingRight: 40, // Make room for the calendar icon
  },
  inputError: {
    borderColor: Colors.error,
  },
  iconContainer: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});