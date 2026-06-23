import os
import json
import re
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent"
)

# ── Product catalogue (mirrors products.js) ──────────────────────────────────
PRODUCTS = [
    {"name": "Bose Speaker", "price": 3999, "brand": "Bose", "category": "Audio", "color": "black"},
    {"name": "Alienware Gaming Laptop", "price": 150990, "brand": "Alienware", "category": "Laptop", "color": "black"},
    {"name": "Meta Quest VR Headset", "price": 12999, "brand": "Meta", "category": "Camera & VR", "color": "white"},
    {"name": "Skullcandy Wireless Earbuds", "price": 1299, "brand": "Skullcandy", "category": "Audio", "color": "black"},
    {"name": "HW8 Ultra Max Series 8 Smartwatch", "price": 3999, "brand": "HW8", "category": "Wearable", "color": "orange"},
    {"name": "iPhone 16 Pro in Rose Gold Titanium", "price": 99999, "brand": "Apple", "category": "Mobile", "color": "rose gold"},
    {"name": "TWS Wireless Earbud", "price": 999, "brand": "Generic", "category": "Audio", "color": "white"},
    {"name": "Nintendo Switch", "price": 25999, "brand": "Nintendo", "category": "Gaming", "color": "red"},
    {"name": "3 In 1 Portable Evaporative Air Cooler", "price": 24999, "brand": "Generic", "category": "Appliances", "color": "white"},
    {"name": "BLACK+DECKER 0.7 cu ft 700W Microwave Oven", "price": 9999, "brand": "Black+Decker", "category": "Appliances", "color": "black"},
    {"name": "DJI Inspire 2", "price": 50000, "brand": "DJI", "category": "Others", "color": "white"},
    {"name": "Premium Vector Air Conditioner", "price": 20500, "brand": "Generic", "category": "Appliances", "color": "white"},
    {"name": "Anker Power Bank 622 Magnetic Battery", "price": 2500, "brand": "Anker", "category": "Accessories", "color": "green"},
    {"name": "Sony 5.2-Channel 4K Bluetooth Theater System", "price": 39999, "brand": "Sony", "category": "Audio", "color": "black"},
    {"name": "Samsung Galaxy S24 Ultra", "price": 99999, "brand": "Samsung", "category": "Mobile", "color": "black"},
    {"name": "TEMEIKE 4-IN-1 Portable Air Conditioner", "price": 29999, "brand": "Temeike", "category": "Appliances", "color": "white"},
    {"name": "Sony Pro Cinema Line ILME-FX6 Digital Camcorder", "price": 499999, "brand": "Sony", "category": "Camera & VR", "color": "black"},
    {"name": "HP Pavilion", "price": 69999, "brand": "HP", "category": "Laptop", "color": "silver"},
    {"name": "Transparent Touch Low Latency TWS Wireless Earbud", "price": 500, "brand": "Generic", "category": "Audio", "color": "transparent"},
    {"name": "Samsung Neo QLED TV (98-inch)", "price": 400000, "brand": "Samsung", "category": "TV & Display", "color": "black"},
    {"name": "PlayStation 5", "price": 39999, "brand": "Sony", "category": "Gaming", "color": "white"},
    {"name": "LG 55-inch LED TV", "price": 59999, "brand": "LG", "category": "TV & Display", "color": "black"},
    {"name": "Amazfit GTS 2e Smart Watch", "price": 9999, "brand": "Amazfit", "category": "Wearable", "color": "pink"},
    {"name": "100MP Hasselblad H6D-100c", "price": 25999, "brand": "Hasselblad", "category": "Others", "color": "silver"},
    {"name": "Dangbei Neo Smart Projector", "price": 21999, "brand": "Dangbei", "category": "TV & Display", "color": "white"},
    {"name": "Aoub Keyboard Case for iPad 10th Gen", "price": 7499, "brand": "Aoub", "category": "Tablet", "color": "pink"},
    {"name": "Canon Pixma MG4250", "price": 9999, "brand": "Canon", "category": "Others", "color": "black"},
    {"name": "Acoustic Audio AA5102", "price": 5999, "brand": "Acoustic Audio", "category": "Audio", "color": "black"},
    {"name": "Apple AirPods Max Wireless Over-Ear Headphones", "price": 39900, "brand": "Apple", "category": "Audio", "color": "purple"},
    {"name": "Samsung Galaxy Z Flip6", "price": 42999, "brand": "Samsung", "category": "Mobile", "color": "silver"},
    {"name": "Apple Vision Pro headset", "price": 32500, "brand": "Apple", "category": "Camera & VR", "color": "silver"},
    {"name": "APS4 Dual sense Edge controller", "price": 14999, "brand": "Sony", "category": "Gaming", "color": "white"},
    {"name": "Samsung series 8 Fridge", "price": 31700, "brand": "Samsung", "category": "Appliances", "color": "silver"},
    {"name": "Samsung Galaxy Watch 4", "price": 9999, "brand": "Samsung", "category": "Wearable", "color": "black"},
    {"name": "Dell XPS 13 Plus(9320)", "price": 53350, "brand": "Dell", "category": "Laptop", "color": "silver"},
    {"name": "NZXT-H9 Elite ATX Mid Tower Case", "price": 18000, "brand": "NZXT", "category": "Accessories", "color": "black"},
    {"name": "Samsung 44-Decibel Top Control Dishwasher", "price": 35000, "brand": "Samsung", "category": "Appliances", "color": "silver"},
    {"name": "Samsung Galaxy TabA9+ 64GB Tablet", "price": 9999, "brand": "Samsung", "category": "Tablet", "color": "silver"},
    {"name": "Nothing Phone 2 5G", "price": 19999, "brand": "Nothing", "category": "Mobile", "color": "white"},
    {"name": "Xbox Series S Konsole", "price": 24999, "brand": "Microsoft", "category": "Gaming", "color": "white"},
    {"name": "Rod NT1 Kit Condenser Microphone", "price": 14999, "brand": "Rode", "category": "Audio", "color": "silver"},
]

PRODUCT_CATALOGUE_TEXT = "\n".join(
    f"- {p['name']} | Brand: {p['brand']} | Category: {p['category']} | Price: ₹{p['price']:,} | Color: {p['color']}"
    for p in PRODUCTS
)

CATEGORIES = sorted(set(p["category"] for p in PRODUCTS))
BRANDS = sorted(set(p["brand"] for p in PRODUCTS))

SYSTEM_CONTEXT = f"""You are Furby, the friendly AI shopping assistant for REFURBITY, an online store for refurbished electronics.

You have access to the complete product catalogue below. When a user asks about products filtered by budget, color, brand, or category, you MUST search through this list and recommend specific matching products. Always include the product name and price.

PRODUCT CATALOGUE:
{PRODUCT_CATALOGUE_TEXT}

AVAILABLE CATEGORIES: {', '.join(CATEGORIES)}
AVAILABLE BRANDS: {', '.join(BRANDS)}

INSTRUCTIONS:
- For budget queries (e.g. "under ₹10000", "between ₹5000 and ₹20000"), filter products by price and list matching ones.
- For brand queries (e.g. "Samsung products", "Apple items"), list products from that brand.
- For color queries (e.g. "white phones", "black laptops"), filter by color and category.
- For category queries (e.g. "laptops", "gaming", "audio"), list products in that category.
- For combined filters (e.g. "Samsung phones under ₹50000"), apply all filters together.
- Always format recommendations as a numbered list with name and price.
- Keep replies concise and friendly. This is a portfolio demo site; explain that if asked about real orders.
- Prices are in Indian Rupees (₹).
"""


def filter_products(message: str) -> list:
    """Local product filtering as fallback or enhancement."""
    msg = message.lower()
    results = list(PRODUCTS)

    # Budget filters
    budget_match = re.search(r'under\s*[₹rs\s]*(\d[\d,]*)', msg)
    budget_above = re.search(r'above\s*[₹rs\s]*(\d[\d,]*)', msg)
    range_match = re.search(r'between\s*[₹rs\s]*(\d[\d,]*)\s*(?:and|to|-)\s*[₹rs\s]*(\d[\d,]*)', msg)

    if range_match:
        lo = int(range_match.group(1).replace(',', ''))
        hi = int(range_match.group(2).replace(',', ''))
        results = [p for p in results if lo <= p['price'] <= hi]
    elif budget_match:
        limit = int(budget_match.group(1).replace(',', ''))
        results = [p for p in results if p['price'] <= limit]
    elif budget_above:
        limit = int(budget_above.group(1).replace(',', ''))
        results = [p for p in results if p['price'] >= limit]

    # Brand filter
    for brand in BRANDS:
        if brand.lower() in msg:
            results = [p for p in results if p['brand'].lower() == brand.lower()]
            break

    # Category filter
    for cat in CATEGORIES:
        if cat.lower() in msg or cat.lower().rstrip('s') in msg:
            results = [p for p in results if p['category'].lower() == cat.lower()]
            break

    # Color filter
    colors = ['white', 'black', 'silver', 'pink', 'purple', 'orange', 'red', 'green', 'rose gold', 'transparent']
    for color in colors:
        if color in msg:
            results = [p for p in results if color in p['color'].lower()]
            break

    return results[:10]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/<page>")
def render_page(page):
    try:
        return render_template(page)
    except Exception:
        return "Page not found", 404


@app.route("/chat", methods=["POST"])
def chat():
    user_input = (request.json or {}).get("message", "").strip()

    if not user_input:
        return jsonify({"response": "Type a message and I'll help you out!"})

    # Try local filtering first for speed
    filtered = filter_products(user_input)
    local_hint = ""
    if filtered and any(kw in user_input.lower() for kw in
                        ['under', 'above', 'between', 'budget', 'cheap', 'brand',
                         'color', 'colour', 'category', 'laptop', 'phone', 'mobile',
                         'audio', 'gaming', 'watch', 'tablet', 'tv', 'appliance']):
        local_hint = (
            f"\n\n[System: Local filter found {len(filtered)} matching products: "
            + "; ".join(f"{p['name']} ₹{p['price']:,}" for p in filtered[:5])
            + (f"... and {len(filtered)-5} more" if len(filtered) > 5 else "")
            + ". Prioritise these in your answer.]"
        )

    if not GEMINI_API_KEY:
        # Offline demo: return local filter results
        if filtered:
            lines = [f"{i+1}. {p['name']} — ₹{p['price']:,} ({p['brand']}, {p['category']})"
                     for i, p in enumerate(filtered)]
            return jsonify({"response": "Here are some matching products:\n" + "\n".join(lines)})
        return jsonify({
            "response": "Demo mode: AI backend not connected. Add GEMINI_API_KEY to enable smart replies."
        })

    try:
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{SYSTEM_CONTEXT}{local_hint}\n\nUser: {user_input}"}
                    ]
                }
            ]
        }
        resp = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        reply = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "Sorry, I couldn't generate a reply just now.")
        )
        return jsonify({"response": reply})
    except requests.exceptions.RequestException as e:
        # Fallback to local results on API error
        if filtered:
            lines = [f"{i+1}. {p['name']} — ₹{p['price']:,} ({p['brand']})"
                     for i, p in enumerate(filtered)]
            return jsonify({"response": "Here are some matching products:\n" + "\n".join(lines)})
        return jsonify({"response": f"AI service error: {e}"}), 502


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
