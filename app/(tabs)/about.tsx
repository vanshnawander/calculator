import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import Card from "@/components/Card";
import Colors from "@/constants/colors";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "About",
          headerTitleStyle: {
            fontWeight: "600",
            color: Colors.text,
          },
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={styles.title}>Marwari Interest Calculator</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is Marwari Interest?</Text>
            <Text style={styles.text}>
              The Marwari interest calculation system is a traditional method used by Marwari 
              business communities in India. It uses a 30-day month system (360 days per year) 
              for calculating interest, which differs from the standard 365-day year used in 
              modern banking.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.text}>
              • Each month is considered to have exactly 30 days
            </Text>
            <Text style={styles.text}>
              • The 31st day of a month is treated as the 1st day of the next month
            </Text>
            <Text style={styles.text}>
              • Interest is calculated based on a 360-day year
            </Text>
            <Text style={styles.text}>
              • Compounding can occur at regular intervals (typically monthly or quarterly)
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calculator Features</Text>
            <Text style={styles.text}>
              • Calculate interest using the traditional Marwari system
            </Text>
            <Text style={styles.text}>
              • Support for monthly or yearly interest rates
            </Text>
            <Text style={styles.text}>
              • Customizable compounding periods
            </Text>
            <Text style={styles.text}>
              • Detailed breakdown of each compounding period
            </Text>
            <Text style={styles.text}>
              • Accurate day counting using the 30-day month system
            </Text>
          </View>
        </Card>
        
        <Card>
          <Text style={styles.sectionTitle}>Example Calculation</Text>
          <Text style={styles.text}>
            If you lend ₹10,000 at a monthly interest rate of 1.25% (15% yearly) 
            with quarterly compounding for 1 year:
          </Text>
          
          <View style={styles.example}>
            <Text style={styles.exampleText}>Principal: ₹10,000</Text>
            <Text style={styles.exampleText}>Monthly Rate: 1.25%</Text>
            <Text style={styles.exampleText}>Yearly Rate: 15%</Text>
            <Text style={styles.exampleText}>Compounding: Every 3 months</Text>
            <Text style={styles.exampleText}>Duration: 12 months (360 days)</Text>
            <Text style={styles.exampleText}>Total Interest: ₹1,601.56</Text>
            <Text style={styles.exampleText}>Final Amount: ₹11,601.56</Text>
          </View>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This calculator is designed for educational purposes only.
          </Text>
          <Text style={styles.footerText}>
            Designed and developed by Krishna Malani
          </Text>
          <Text style={styles.footerText}>
            2025 Marwari Interest Calculator
          </Text>
        </View>
      </ScrollView>
    </View>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  example: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  exampleText: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 6,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },
});