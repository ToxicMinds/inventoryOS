import csv
import random
from datetime import datetime
import uuid

# Items matching Bella Cucina ingredients
ITEMS = [
    {"recipe_id": "rec:spaghetti-carbonara", "name": "Spaghetti Carbonara", "price": 18.50},
    {"recipe_id": "rec:margherita-pizza", "name": "Margherita Pizza", "price": 16.00},
    {"recipe_id": "rec:tiramisu", "name": "Classic Tiramisu", "price": 9.00},
    {"recipe_id": "rec:house-wine-glass", "name": "House Red Wine", "price": 11.00}
]

def generate_csv(filename="sample_pos_sales.csv"):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Standard POS Export format
        writer.writerow(["Transaction ID", "Timestamp", "Location ID", "Recipe ID", "Item Name", "Quantity Sold", "Total Value"])
        
        for _ in range(10): # Emulate 10 random sales
            item = random.choice(ITEMS)
            qty = random.randint(1, 4)
            tx_id = f"POS-{str(uuid.uuid4())[:8].upper()}"
            writer.writerow([
                tx_id,
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "downtown",
                item["recipe_id"],
                item["name"],
                qty,
                round(item["price"] * qty, 2)
            ])
            
if __name__ == "__main__":
    generate_csv()
    print("Successfully generated sample_pos_sales.csv with 10 POS transactions for import testing.")
