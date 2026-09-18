class FragranceNotes {
  final List<String> top;
  final List<String> heart;
  final List<String> base;

  FragranceNotes({required this.top, required this.heart, required this.base});

  factory FragranceNotes.fromJson(Map<String, dynamic> json) {
    return FragranceNotes(
      top: List<String>.from(json['top'] ?? []),
      heart: List<String>.from(json['heart'] ?? []),
      base: List<String>.from(json['base'] ?? []),
    );
  }
}

class ProductVariant {
  final String id;
  final int sizeMl;
  final String sku;
  final double price;
  final double? discountPrice;
  final int stockOnline;

  ProductVariant({
    required this.id,
    required this.sizeMl,
    required this.sku,
    required this.price,
    this.discountPrice,
    required this.stockOnline,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['id'],
      sizeMl: json['sizeMl'],
      sku: json['sku'],
      price: (json['price'] as num).toDouble(),
      discountPrice: json['discountPrice'] != null ? (json['discountPrice'] as num).toDouble() : null,
      stockOnline: json['stockOnline'] ?? 0,
    );
  }
}

class Product {
  final String id;
  final String slug;
  final String name;
  final String tagline;
  final String description;
  final String gender;
  final String concentration;
  final int longevityHours;
  final String sillageRating;
  final String character;
  final double rating;
  final int reviewCount;
  final String imageUrl;
  final FragranceNotes notes;
  final List<ProductVariant> variants;

  Product({
    required this.id,
    required this.slug,
    required this.name,
    required this.tagline,
    required this.description,
    required this.gender,
    required this.concentration,
    required this.longevityHours,
    required this.sillageRating,
    required this.character,
    required this.rating,
    required this.reviewCount,
    required this.imageUrl,
    required this.notes,
    required this.variants,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      slug: json['slug'],
      name: json['name'],
      tagline: json['tagline'],
      description: json['description'],
      gender: json['gender'],
      concentration: json['concentration'],
      longevityHours: json['longevityHours'],
      sillageRating: json['sillageRating'],
      character: json['character'],
      rating: (json['rating'] as num).toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
      imageUrl: json['imageUrl'],
      notes: FragranceNotes.fromJson(json['notes'] ?? {}),
      variants: (json['variants'] as List? ?? [])
          .map((v) => ProductVariant.fromJson(v))
          .toList(),
    );
  }
}
