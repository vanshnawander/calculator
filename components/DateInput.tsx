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

  // Handle date input changes with better cursor management
  const handleDateInput = (text: string) => {
    // If user is clearing the input
    if (text === '') {
      onChangeText('');
      return;
    }

    // Remove all non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Build the formatted date string based on input length
    let formattedDate = '';
    
    if (numbers.length > 0) {
      // Add day part (first 2 digits)
      formattedDate = numbers.substring(0, 2);
      
      if (numbers.length > 2) {
        // Add month part after first /
        formattedDate = `${formattedDate}/${numbers.substring(2, 4)}`;
        
        if (numbers.length > 4) {
          // Add year part after second /
          formattedDate = `${formattedDate}/${numbers.substring(4, 8)}`;
        }
      }
    }
    
    // Update the input text
    onChangeText(formattedDate);
    
    // If we have a complete date, validate it
    if (formattedDate.length === 10) {
      const [day, month, year] = formattedDate.split('/').map(Number);
      
      // Basic date validation
      const isValidDate = (d: number, m: number, y: number) => {
        if (m < 1 || m > 12) return false;
        if (d < 1 || d > 31) return false;
        if (y < 1900 || y > 2100) return false;
        
        // Check for months with 30 days
        if ([4, 6, 9, 11].includes(m) && d > 30) return false;
        
        // Check for February
        if (m === 2) {
          const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
          if (isLeapYear) return d <= 29;
          return d <= 28;
        }
        
        return true;
      };
      
      if (isValidDate(day, month, year)) {
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

  // Handle key press to make backspace work better
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      // If backspace is pressed on a separator, remove the separator and the previous character
      const cursorPosition = e.target.selectionStart;
      if (value && cursorPosition && [3, 6].includes(cursorPosition)) {
        const newValue = value.substring(0, cursorPosition - 2) + value.substring(cursorPosition + 1);
        onChangeText(newValue);
        // Prevent default to avoid double backspace
        e.preventDefault();
      }
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
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
          maxLength={10}
        />
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
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