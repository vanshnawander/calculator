import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Card from "./Card";
import Colors from "@/constants/colors";

interface Period {
  startDate: string;
  endDate: string;
  days: number;
  months: number;
  remainingDays: number;
  interest: string;
  balance: string;
  principalForPeriod: string; // Added to show the amount on which interest is calculated
}

interface ResultSummaryProps {
  principal: string;
  yearlyRate: string;
  compoundingPeriod: number;
  totalInterest: string;
  totalAmount: string;
  periods: Period[];
}

export default function ResultSummary({
  principal,
  yearlyRate,
  compoundingPeriod,
  totalInterest,
  totalAmount,
  periods,
}: ResultSummaryProps) {
  const totalDays = periods.reduce((total, period) => total + period.days, 0);
  const totalMonths = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Summary</Text>
      <Card>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Principal</Text>
          <Text style={styles.summaryValue}>{principal}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Yearly Rate</Text>
          <Text style={styles.summaryValue}>{yearlyRate}%</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Compounding</Text>
          <Text style={styles.summaryValue}>{compoundingPeriod} months</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>{totalMonths} months, {remainingDays} days</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Interest</Text>
          <Text style={[styles.summaryValue, styles.interestValue]}>{totalInterest}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Final Amount</Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>{totalAmount}</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Compounding Periods</Text>
      {periods.map((period, index) => (
        <Card key={index} style={styles.periodCard}>
          <View style={styles.periodHeader}>
            <Text style={styles.periodTitle}>Period {index + 1}</Text>
            <Text style={styles.periodDates}>
              {period.startDate} - {period.endDate}
            </Text>
          </View>
          
          <View style={styles.periodDetails}>
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>Days</Text>
              <Text style={styles.periodValue}>{period.days}</Text>
            </View>
            
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>Duration</Text>
              <Text style={styles.periodValue}>
                {period.months} months, {period.remainingDays} days
              </Text>
            </View>
            
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>Principal Amount</Text>
              <Text style={[styles.periodValue, styles.principalValue]}>
                {period.principalForPeriod}
              </Text>
            </View>
            
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>Interest</Text>
              <Text style={[styles.periodValue, styles.interestValue]}>
                {period.interest}
              </Text>
            </View>
            
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>Balance</Text>
              <Text style={[styles.periodValue, styles.totalValue]}>
                {period.balance}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 16,
    color: Colors.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  interestValue: {
    color: Colors.success,
  },
  principalValue: {
    color: Colors.text,
    fontWeight: "600",
  },
  totalValue: {
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  periodCard: {
    marginBottom: 12,
  },
  periodHeader: {
    marginBottom: 12,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  periodDates: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  periodDetails: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
  },
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  periodLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  periodValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
});