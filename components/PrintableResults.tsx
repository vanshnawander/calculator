import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/colors";

interface Period {
  startDate: string;
  endDate: string;
  days: number;
  months: number;
  remainingDays: number;
  interest: string;
  balance: string;
  principalForPeriod: string;
}

interface PrintableResultsProps {
  principal: string;
  yearlyRate: string;
  compoundingPeriod: number;
  totalInterest: string;
  totalAmount: string;
  periods: Period[];
}

export default function PrintableResults({
  principal,
  yearlyRate,
  compoundingPeriod,
  totalInterest,
  totalAmount,
  periods,
}: PrintableResultsProps) {
  // Only render on web platform
  if (Platform.OS !== 'web') {
    return null;
  }

  const totalDays = periods.reduce((total, period) => total + period.days, 0);
  const totalMonths = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;

  return (
    <View style={styles.printContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Marwari Interest Calculation</Text>
        <Text style={styles.subtitle}>Calculation Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Principal Amount</Text>
            <Text style={styles.summaryValue}>{principal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Yearly Interest Rate</Text>
            <Text style={styles.summaryValue}>{yearlyRate}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Compounding Period</Text>
            <Text style={styles.summaryValue}>{compoundingPeriod} months</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Duration</Text>
            <Text style={styles.summaryValue}>{totalMonths} months, {remainingDays} days</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Interest</Text>
            <Text style={[styles.summaryValue, styles.highlightText]}>{totalInterest}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Final Amount</Text>
            <Text style={[styles.summaryValue, styles.highlightText]}>{totalAmount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compounding Periods</Text>
        <View style={styles.periodsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Period</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Date Range</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Days</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Duration</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Principal</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Interest</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Balance</Text>
          </View>
          
          {periods.map((period, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Period {index + 1}</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>{period.startDate} - {period.endDate}</Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{period.days}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{period.months}m, {period.remainingDays}d</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>{period.principalForPeriod}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{period.interest}</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>{period.balance}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This calculation follows the Marwari interest system using a 30-day month (360-day year).
        </Text>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Marwari Interest Calculator
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  printContainer: {
    display: "none", // Hidden by default, only visible when printing
    padding: 40,
    maxWidth: "100%",
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 30,
    borderBottom: "1px solid #E5E7F2",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 15,
    borderBottom: "1px solid #E5E7F2",
    paddingBottom: 8,
  },
  summaryTable: {
    borderWidth: 1,
    borderColor: "#E5E7F2",
    borderRadius: 8,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7F2",
  },
  summaryLabel: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F9FAFF",
    fontWeight: "500",
    color: Colors.text,
  },
  summaryValue: {
    flex: 1,
    padding: 10,
    textAlign: "right",
    color: Colors.text,
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  periodsTable: {
    borderWidth: 1,
    borderColor: "#E5E7F2",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7F2",
  },
  tableHeaderCell: {
    padding: 10,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7F2",
  },
  tableCell: {
    padding: 10,
    textAlign: "center",
    color: Colors.text,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#E5E7F2",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 5,
  },
});