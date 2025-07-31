import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform, Pressable } from "react-native";
import { Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  
  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
  };

  // Convert DD/MM/YYYY to a Date object
  const getDateFromString = (dateString: string) => {
    if (!dateString || !dateString.includes("/")) return new Date();
    
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
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
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Pressable 
          style={styles.calendarButton}
          onPress={() => setShowPicker(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Calendar size={20} color={Colors.primary} />
        </Pressable>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {showPicker && (
        <DateTimePicker
          value={getDateFromString(value)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
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
  calendarButton: {
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