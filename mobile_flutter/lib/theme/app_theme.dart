import 'package:flutter/material.dart';

class YawscentTheme {
  static const Color obsidianBlack = Color(0xFF0D0E11);
  static const Color surfaceDark = Color(0xFF16181D);
  static const Color surfaceElevated = Color(0xFF20232A);
  static const Color champagneGold = Color(0xFFD4AF37);
  static const Color lightGold = Color(0xFFE8CA65);
  static const Color textLight = Color(0xFFF7F5F0);
  static const Color textMuted = Color(0xFF9E9FA4);
  static const Color accentRose = Color(0xFFE07A5F);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: obsidianBlack,
      primaryColor: champagneGold,
      colorScheme: const ColorScheme.dark(
        primary: champagneGold,
        secondary: lightGold,
        surface: surfaceDark,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: obsidianBlack,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: textLight,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          letterSpacing: 2.0,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: champagneGold,
          foregroundColor: obsidianBlack,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.0),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        ),
      ),
    );
  }
}
