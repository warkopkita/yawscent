import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'views/home_screen.dart';

void main() {
  runApp(const YawscentApp());
}

class YawscentApp extends StatelessWidget {
  const YawscentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'yawscent indonesia',
      debugShowCheckedModeBanner: false,
      theme: YawscentTheme.darkTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/scent-finder': (context) => const SimpleScaffoldView(
          title: 'Scent Finder Quiz',
          bodyText: 'Kuis interaktif pencocokan aroma Yawscent. Temukan aroma jodohmu dengan algoritma scoring akurat anti blind-buy.',
          icon: Icons.auto_awesome,
        ),
        '/loyalty': (context) => const SimpleScaffoldView(
          title: 'VIP Loyalty Club',
          bodyText: 'Digital wallet poin belanja Yawscent. Dapatkan cashback poin setiap pembelian dan tukarkan dengan botol parfum gratis.',
          icon: Icons.stars,
        ),
        '/cart': (context) => const SimpleScaffoldView(
          title: 'Keranjang Belanja',
          bodyText: 'Keranjang belanja & checkout omnichannel. Mendukung pengiriman Biteship dan pembayaran Midtrans QRIS.',
          icon: Icons.shopping_bag_outlined,
        ),
      },
    );
  }
}

class SimpleScaffoldView extends StatelessWidget {
  final String title;
  final String bodyText;
  final IconData icon;

  const SimpleScaffoldView({
    super.key,
    required this.title,
    required this.bodyText,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 64, color: YawscentTheme.champagneGold),
              const SizedBox(height: 20),
              Text(
                title,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Text(
                bodyText,
                textAlign: TextAlign.center,
                style: const TextStyle(color: YawscentTheme.textMuted, fontSize: 14),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('KEMBALI KE BERANDA'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
