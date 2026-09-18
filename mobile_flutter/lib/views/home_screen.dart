import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/product_model.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("YAWSCENT"),
        actions: [
          IconButton(
            icon: const Icon(Icons.stars, color: YawscentTheme.champagneGold),
            onPressed: () {
              Navigator.pushNamed(context, '/loyalty');
            },
          ),
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined),
            onPressed: () {
              Navigator.pushNamed(context, '/cart');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: const LinearGradient(
                  colors: [YawscentTheme.surfaceDark, YawscentTheme.surfaceElevated],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border.all(color: YawscentTheme.champagneGold.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: YawscentTheme.champagneGold.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      "INDONESIAN HAUTE PARFUMERIE",
                      style: TextStyle(
                        color: YawscentTheme.champagneGold,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "Temukan Karakter Aroma Otentikmu",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: YawscentTheme.textLight,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Formula tahan hingga 12 jam dengan konsentrasi Extrait & EDP premium.",
                    style: TextStyle(fontSize: 13, color: YawscentTheme.textMuted),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/scent-finder');
                    },
                    icon: const Icon(Icons.auto_awesome),
                    label: const Text("IKUTI SCENT FINDER"),
                  ),
                ],
              ),
            ),

            // Section Header
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                "Koleksi Parfum Unggulan",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
            ),

            // Product Cards List
            _buildProductCard(
              context,
              name: "YAWSCENT Noir",
              tagline: "The Enigmatic Midnight Mystery",
              concentration: "Extrait De Parfum (12 Jam)",
              price: "Rp 299.000",
              character: "Smoky, Haitian Vetiver & Agarwood",
            ),
            _buildProductCard(
              context,
              name: "YAWSCENT Santara",
              tagline: "Sun-drenched Mediterranean Citrus",
              concentration: "Eau De Parfum (8 Jam)",
              price: "Rp 279.000",
              character: "Sparkling Bergamot, Kaffir Lime & Jasmine",
            ),
            _buildProductCard(
              context,
              name: "YAWSCENT Discovery Collection",
              tagline: "5 Signature Scents in 5ml Sampler Vials",
              concentration: "Discovery Box Set (5 x 5ml)",
              price: "Rp 149.000",
              character: "All 5 authentic creations + cashback voucher",
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildProductCard(
    BuildContext context, {
    required String name,
    required String tagline,
    required String concentration,
    required String price,
    required String character,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: YawscentTheme.surfaceDark,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: YawscentTheme.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.local_florist, color: YawscentTheme.champagneGold, size: 36),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 4),
                Text(
                  concentration,
                  style: const TextStyle(color: YawscentTheme.champagneGold, fontSize: 12),
                ),
                const SizedBox(height: 4),
                Text(
                  character,
                  style: const TextStyle(color: YawscentTheme.textMuted, fontSize: 11),
                ),
                const SizedBox(height: 8),
                Text(
                  price,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    color: YawscentTheme.textLight,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
